import uuid
import os
import asyncio
from datetime import datetime
from app.documents.models import DocumentMetadata, DocumentStatus
from app.documents.parser import extract_text
from app.documents.chunker import create_chunks_with_metadata
from app.config import settings
from app.rag.embeddings import get_embeddings_batch
from app.db import get_db_connection

def row_to_doc(row) -> DocumentMetadata:
    roles_str = row["access_roles"] or "all"
    access_roles = [r.strip() for r in roles_str.split(",") if r.strip()]
    return DocumentMetadata(
        id=row["id"],
        filename=row["filename"],
        original_filename=row["original_filename"],
        file_type=row["file_type"],
        upload_date=datetime.fromisoformat(row["upload_date"]) if isinstance(row["upload_date"], str) else row["upload_date"],
        uploader=row["uploader"] or "admin",
        access_roles=access_roles,
        status=DocumentStatus(row["status"]),
        num_chunks=row["num_chunks"] or 0,
        num_pages=row["num_pages"] or 0,
        file_size_bytes=row["file_size_bytes"] or 0,
        error_message=row["error_message"]
    )

def save_uploaded_file(saved_filename: str, original_filename: str, content_type: str, uploader: str, access_roles: list[str]) -> DocumentMetadata:
    doc_id = str(uuid.uuid4())
    file_path = os.path.join(settings.UPLOAD_DIR, saved_filename)
    file_size = os.path.getsize(file_path) if os.path.exists(file_path) else 0
    upload_date = datetime.utcnow().isoformat()
    roles_str = ",".join(access_roles)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """INSERT INTO documents 
        (id, filename, original_filename, file_type, upload_date, uploader, access_roles, status, file_size_bytes, num_pages, num_chunks, error_message)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (doc_id, saved_filename, original_filename, content_type, upload_date, uploader, roles_str, DocumentStatus.processing.value, file_size, 0, 0, None)
    )
    conn.commit()
    conn.close()
    
    return get_document(doc_id)

async def process_document(doc_id: str, app_state):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        metadata = get_document(doc_id)
        if not metadata:
            return
        file_path = os.path.join(settings.UPLOAD_DIR, metadata.filename)
        
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
            "UPDATE documents SET status = ?, num_pages = ?, num_chunks = ? WHERE id = ?",
            (DocumentStatus.ready.value, num_pages, num_chunks, doc_id)
        )
        conn.commit()
    except Exception as e:
        import logging
        logging.error(f"Failed to process document {doc_id}: {e}", exc_info=True)
        cursor.execute(
            "UPDATE documents SET status = ?, error_message = ? WHERE id = ?",
            (DocumentStatus.error.value, str(e), doc_id)
        )
        conn.commit()
    finally:
        conn.close()

def get_document(doc_id: str) -> DocumentMetadata:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM documents WHERE id = ?", (doc_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return row_to_doc(row)
    return None

def list_documents(user_role: str) -> list[DocumentMetadata]:
    role_val = user_role.value if hasattr(user_role, "value") else user_role
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM documents ORDER BY upload_date DESC")
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
        
    # Remove from Chroma
    chroma_manager = app_state.chroma_manager
    chroma_manager.delete_by_doc_id(doc_id)
    
    # Delete file
    file_path = os.path.join(settings.UPLOAD_DIR, doc.filename)
    if os.path.exists(file_path):
        try:
            os.remove(file_path)
        except Exception:
            pass
            
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM documents WHERE id = ?", (doc_id,))
    conn.commit()
    conn.close()
    return True
