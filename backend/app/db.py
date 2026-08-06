import sqlite3
from app.config import settings

def get_db_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(settings.DB_PATH, timeout=30.0)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Users table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        username TEXT PRIMARY KEY,
        email TEXT UNIQUE,
        full_name TEXT,
        role TEXT,
        hashed_password TEXT,
        auth_provider TEXT DEFAULT 'local',
        created_at TEXT
    );
    """)
    
    # Documents table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        filename TEXT,
        original_filename TEXT,
        file_type TEXT,
        upload_date TEXT,
        uploader TEXT,
        access_roles TEXT,
        status TEXT,
        file_size_bytes INTEGER,
        num_pages INTEGER DEFAULT 0,
        num_chunks INTEGER DEFAULT 0,
        error_message TEXT DEFAULT NULL
    );
    """)
    
    # Query metrics table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS query_metrics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        query TEXT,
        answer TEXT,
        model_name TEXT,
        response_time_ms REAL,
        prompt_tokens INTEGER,
        completion_tokens INTEGER,
        total_tokens INTEGER,
        status TEXT,
        sources_count INTEGER,
        timestamp TEXT,
        user_username TEXT
    );
    """)
    
    # Chat conversations table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS chat_conversations (
        id TEXT PRIMARY KEY,
        user_username TEXT,
        title TEXT,
        created_at TEXT,
        updated_at TEXT
    );
    """)
    
    # Chat messages table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS chat_messages (
        id TEXT PRIMARY KEY,
        conversation_id TEXT,
        role TEXT,
        content TEXT,
        sources_json TEXT,
        metrics_json TEXT,
        timestamp TEXT,
        FOREIGN KEY (conversation_id) REFERENCES chat_conversations(id) ON DELETE CASCADE
    );
    """)
    
    conn.commit()
    conn.close()
