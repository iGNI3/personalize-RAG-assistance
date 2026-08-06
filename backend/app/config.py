from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    GEMINI_API_KEY: str = ""
    DATABASE_URL: Optional[str] = None          # PostgreSQL URL from Render
    DB_PATH: str = "./rag_app.db"               # Fallback SQLite (local dev)
    CHROMA_PERSIST_DIR: str = "./chroma_data"
    CHUNK_SIZE: int = 500
    CHUNK_OVERLAP: int = 50
    TOP_K: int = 5
    JWT_SECRET: str = "rag-assistant-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRY_MINUTES: int = 480
    UPLOAD_DIR: str = "./uploads"
    MODEL_NAME: str = "gemini-2.5-flash"
    EMBEDDING_MODEL: str = "models/gemini-embedding-2"

    class Config:
        env_file = ".env"

settings = Settings()
