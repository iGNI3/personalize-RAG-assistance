import sqlite3
import os
from app.config import settings

# ──────────────────────────────────────────────────────────────────────────────
# Database abstraction: PostgreSQL (Render) or SQLite (local dev)
# ──────────────────────────────────────────────────────────────────────────────

USE_POSTGRES = bool(settings.DATABASE_URL)

if USE_POSTGRES:
    import psycopg2
    import psycopg2.extras

def get_db_connection():
    """Return a DB connection — PostgreSQL when DATABASE_URL is set, else SQLite."""
    if USE_POSTGRES:
        conn = psycopg2.connect(settings.DATABASE_URL, cursor_factory=psycopg2.extras.RealDictCursor)
        return conn
    else:
        conn = sqlite3.connect(settings.DB_PATH, timeout=30.0)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA foreign_keys = ON;")
        return conn


def _execute(cursor, sql: str, params=None):
    """Execute SQL with dialect-aware placeholder conversion."""
    if USE_POSTGRES:
        # Convert SQLite ? placeholders to PostgreSQL %s
        sql = sql.replace("?", "%s")
    if params is None:
        cursor.execute(sql)
    else:
        cursor.execute(sql, params)


def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    if USE_POSTGRES:
        # ── PostgreSQL DDL ───────────────────────────────────────────────────
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
            file_size_bytes BIGINT,
            num_pages INTEGER DEFAULT 0,
            num_chunks INTEGER DEFAULT 0,
            error_message TEXT DEFAULT NULL,
            file_content BYTEA DEFAULT NULL
        );
        """)

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS query_metrics (
            id SERIAL PRIMARY KEY,
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

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS chat_conversations (
            id TEXT PRIMARY KEY,
            user_username TEXT,
            title TEXT,
            created_at TEXT,
            updated_at TEXT
        );
        """)

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS chat_messages (
            id TEXT PRIMARY KEY,
            conversation_id TEXT REFERENCES chat_conversations(id) ON DELETE CASCADE,
            role TEXT,
            content TEXT,
            sources_json TEXT,
            metrics_json TEXT,
            timestamp TEXT
        );
        """)

    else:
        # ── SQLite DDL ───────────────────────────────────────────────────────
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
            error_message TEXT DEFAULT NULL,
            file_content BLOB DEFAULT NULL
        );
        """)

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

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS chat_conversations (
            id TEXT PRIMARY KEY,
            user_username TEXT,
            title TEXT,
            created_at TEXT,
            updated_at TEXT
        );
        """)

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
