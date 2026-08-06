import uuid
import os
import tempfile
from datetime import datetime
from app.documents.models import DocumentMetadata, DocumentStatus
from app.documents.parser import extract_text
from app.documents.chunker import create_chunks_with_metadata
from app.config import settings
from app.rag.embeddings import get_embeddings_batch
from app.db import get_db_connection, USE_POSTGRES


def _q(sql: str) -> str:
    return sql.replace("?", "%s") if USE_POSTGRES else sql


def _row(row) -> dict | None:
    if row is None:
        return None
    return dict(row)


def row_to_doc(row) -> DocumentMetadata:
    r = _row(row)
    roles_str = r["access_roles"] or "all"
    access_roles = [x.strip() for x in roles_str.split(",") if x.strip()]
    return DocumentMetadata(
        id=r["id"],
        filename=r["filename"],
        original_filename=r["original_filename"],
        file_type=r["file_type"],
        upload_date=datetime.fromisoformat(r["upload_date"]) if isinstance(r["upload_date"], str) else r["upload_date"],
        uploader=r["uploader"] or "admin",
        access_roles=access_roles,
        status=DocumentStatus(r["status"]),
        num_chunks=r["num_chunks"] or 0,
        num_pages=r["num_pages"] or 0,
        file_size_bytes=r["file_size_bytes"] or 0,
        error_message=r["error_message"]
    )


def save_uploaded_file(saved_filename: str, original_filename: str, content_type: str,
                       uploader: str, access_roles: list[str], file_bytes: bytes) -> DocumentMetadata:
    """Save document metadata AND raw file bytes to the database (survives container restarts)."""
    doc_id = str(uuid.uuid4())
    file_size = len(file_bytes)
    upload_date = datetime.utcnow().isoformat()
    roles_str = ",".join(access_roles)

    # Normalise file_type from extension when MIME is generic
    ext = os.path.splitext(original_filename)[1].lower()
    if content_type in ("application/octet-stream", "application/x-pdf", "") or not content_type:
        if ext == ".pdf":
            content_type = "application/pdf"
        elif ext == ".docx":
            content_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        _q("""INSERT INTO documents
        (id, filename, original_filename, file_type, upload_date, uploader, access_roles, status, file_size_bytes, num_pages, num_chunks, error_message, file_content)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"""),
        (doc_id, saved_filename, original_filename, content_type, upload_date, uploader, roles_str,
         DocumentStatus.processing.value, file_size, 0, 0, None,
         file_bytes if USE_POSTGRES else file_bytes)
    )
    conn.commit()
    conn.close()
    return get_document(doc_id)


def _get_temp_file(doc_id: str, original_filename: str) -> str | None:
    """
    Return a path to a temp file containing the document's bytes.
    The caller is responsible for deleting the temp file when done.
    First checks the local upload dir, then falls back to the DB.
    """
    ext = os.path.splitext(original_filename)[1].lower()

    # Check on-disk first (local dev / freshly uploaded)
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(_q("SELECT filename, file_content FROM documents WHERE id = ?"), (doc_id,))
    row = _row(cursor.fetchone())
    conn.close()

    if not row:
        return None

    # Try disk path first
    disk_path = os.path.join(settings.UPLOAD_DIR, row["filename"])
    if os.path.exists(disk_path):
        return disk_path  # Return disk path (caller should NOT delete this one)

    # Fall back to DB bytes
    raw = row.get("file_content")
    if raw:
        # Write to a temp file so parsers can open it normally
        suffix = ext or ".bin"
        tmp = tempfile.NamedTemporaryFile(suffix=suffix, delete=False)
        if isinstance(raw, memoryview):
            raw = bytes(raw)
        tmp.write(raw)
        tmp.flush()
        tmp.close()
        return tmp.name  # Caller must delete this

    return None


async def process_document(doc_id: str, app_state):
    conn = get_db_connection()
    cursor = conn.cursor()
    tmp_path = None
    created_tmp = False
    try:
        metadata = get_document(doc_id)
        if not metadata:
            return

        file_path = _get_temp_file(doc_id, metadata.original_filename)
        if not file_path:
            raise Exception("File content not found in database or disk")

        # Track if we created a temp file (must clean up)
        disk_path = os.path.join(settings.UPLOAD_DIR, metadata.filename)
        if file_path != disk_path:
            created_tmp = True
            tmp_path = file_path

        # 1. Parse
        pages = extract_text(file_path, metadata.file_type)
        num_pages = len(pages)

        # 2. Chunk
        chunks = create_chunks_with_metadata(
            pages, settings.CHUNK_SIZE, settings.CHUNK_OVERLAP, doc_id, metadata.original_filename
        )
        num_chunks = len(chunks)

        if not chunks:
            raise Exception("No text found in document")

        # 3. Embed
        texts = [c["text"] for c in chunks]
        embeddings = get_embeddings_batch(texts)

        # 4. Store in Chroma
        chroma_manager = app_state.chroma_manager
        for chunk in chunks:
            chunk["access_roles"] = ",".join(metadata.access_roles)
        chroma_manager.add_documents(chunks, embeddings)

        cursor.execute(
            _q("UPDATE documents SET status = ?, num_pages = ?, num_chunks = ? WHERE id = ?"),
            (DocumentStatus.ready.value, num_pages, num_chunks, doc_id)
        )
        conn.commit()
    except Exception as e:
        import logging
        logging.error(f"Failed to process document {doc_id}: {e}", exc_info=True)
        cursor.execute(
            _q("UPDATE documents SET status = ?, error_message = ? WHERE id = ?"),
            (DocumentStatus.error.value, str(e), doc_id)
        )
        conn.commit()
    finally:
        conn.close()
        # Clean up temp file if we created one
        if created_tmp and tmp_path and os.path.exists(tmp_path):
            try:
                os.unlink(tmp_path)
            except Exception:
                pass


def get_document(doc_id: str) -> DocumentMetadata:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(_q("SELECT * FROM documents WHERE id = ?"), (doc_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return row_to_doc(row)
    return None


def list_documents(user_role: str) -> list[DocumentMetadata]:
    role_val = user_role.value if hasattr(user_role, "value") else user_role
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, filename, original_filename, file_type, upload_date, uploader, access_roles, status, file_size_bytes, num_pages, num_chunks, error_message FROM documents ORDER BY upload_date DESC")
    rows = cursor.fetchall()
    conn.close()

    allowed_docs = []
    for row in rows:
        doc = row_to_doc(row)
        if role_val == "admin" or role_val in doc.access_roles or "all" in doc.access_roles:
            allowed_docs.append(doc)
    return allowed_docs


def delete_document(doc_id: str, app_state) -> bool:
    doc = get_document(doc_id)
    if not doc:
        return False

    chroma_manager = app_state.chroma_manager
    chroma_manager.delete_by_doc_id(doc_id)

    # Delete disk file if it still exists
    file_path = os.path.join(settings.UPLOAD_DIR, doc.filename)
    if os.path.exists(file_path):
        try:
            os.remove(file_path)
        except Exception:
            pass

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(_q("DELETE FROM documents WHERE id = ?"), (doc_id,))
    conn.commit()
    conn.close()
    return True
