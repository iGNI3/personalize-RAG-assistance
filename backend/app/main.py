from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
import os
from contextlib import asynccontextmanager
import asyncio
import logging

from app.config import settings
from app.db import init_db
from app.auth.service import seed_default_users
from app.auth.router import router as auth_router
from app.documents.router import router as documents_router
from app.rag.router import router as rag_router
from app.metrics.router import router as metrics_router
from app.chat.router import router as chat_router
from app.rag.embeddings import init_embedding_model
from app.rag.llm import init_llm
from app.rag.vectorstore import ChromaManager
from app.documents.service import process_document
from app.db import get_db_connection
from app.documents.models import DocumentStatus
from app.util import _q

@asynccontextmanager
async def lifespan(app: FastAPI):
    from app.db import get_db_connection, USE_POSTGRES

    # Initialize DB tables and default users
    init_db()
    seed_default_users()

    # Safe migration: add file_content column if it doesn't exist yet
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        if USE_POSTGRES:
            cur.execute("""
                ALTER TABLE documents ADD COLUMN IF NOT EXISTS file_content BYTEA DEFAULT NULL;
            """)
        else:
            # SQLite: check if column exists first
            cur.execute("PRAGMA table_info(documents)")
            cols = [r["name"] for r in cur.fetchall()]
            if "file_content" not in cols:
                cur.execute("ALTER TABLE documents ADD COLUMN file_content BLOB DEFAULT NULL")
        conn.commit()
        conn.close()
    except Exception as e:
        logging.warning(f"Migration warning (safe to ignore): {e}")

    # Initialize upload directory
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

    # Initialize genai and Chroma
    init_embedding_model(settings.GEMINI_API_KEY)
    init_llm(settings.GEMINI_API_KEY)
    app.state.chroma_manager = ChromaManager(settings.CHROMA_PERSIST_DIR)

    # Start a background task to re-embed documents missing from Chroma.
    async def reembed_missing_documents(app: FastAPI, concurrency: int = 4):
        # Run in a background thread pool to avoid blocking the event loop with DB work.
        await asyncio.sleep(2)  # small delay so other startup tasks settle
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute(_q("SELECT id FROM documents WHERE status = ?"), (DocumentStatus.ready.value,))
            rows = cursor.fetchall()
            conn.close()
            ready_ids = [r["id"] for r in rows]
        except Exception as e:
            logging.exception("Failed to list ready documents for re-embed: %s", e)
            return

        chroma = app.state.chroma_manager
        sem = asyncio.Semaphore(concurrency)

        async def worker(doc_id: str):
            async with sem:
                try:
                    # Cheap existence check
                    if chroma.has_document(doc_id):
                        logging.info("Document %s already present in Chroma, skipping re-embed", doc_id)
                        return
                    logging.info("Re-embedding missing document %s", doc_id)
                    # process_document is synchronous-ish; run in thread to avoid blocking
                    await asyncio.to_thread(process_document, doc_id, app.state)
                    logging.info("Re-embed finished for %s", doc_id)
                except Exception as ex:
                    logging.exception("Failed to re-embed %s: %s", doc_id, ex)

        # Launch workers but don't await them here — let them run in background
        for doc_id in ready_ids:
            asyncio.create_task(worker(doc_id))

    # Kick off the re-embed task but don't await it so startup isn't blocked.
    asyncio.create_task(reembed_missing_documents(app))

    yield

    # Cleanup on shutdown if needed
    pass

app = FastAPI(title="Document-Based RAG Assistant", lifespan=lifespan)

# CORS: read allowed origins from env to avoid wildcard + credentials rejection.
raw_allowed = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173")
ALLOWED_ORIGINS = [o.strip() for o in raw_allowed.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(documents_router, prefix="/api/documents", tags=["documents"])
app.include_router(rag_router, prefix="/api/query", tags=["query"])
app.include_router(metrics_router, prefix="/api/metrics", tags=["metrics"])
app.include_router(chat_router, prefix="/api/chat", tags=["chat"])

@app.get("/api/health", tags=["health"])
async def health_check():
    return {"status": "ok"}

@app.api_route("/", methods=["GET", "HEAD"], include_in_schema=False)
async def root():
    return RedirectResponse(url="/docs")
