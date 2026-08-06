from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
import os
from contextlib import asynccontextmanager

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

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLite DB and default users
    init_db()
    seed_default_users()
    
    # Initialize upload directory
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    
    # Initialize genai and Chroma
    init_embedding_model(settings.GEMINI_API_KEY)
    init_llm(settings.GEMINI_API_KEY)
    app.state.chroma_manager = ChromaManager(settings.CHROMA_PERSIST_DIR)
    
    yield
    
    # Cleanup on shutdown if needed
    pass

app = FastAPI(title="Document-Based RAG Assistant", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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

@app.get("/", include_in_schema=False)
async def root():
    return RedirectResponse(url="/docs")
