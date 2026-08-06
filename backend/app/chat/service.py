import json
import uuid
from datetime import datetime
from typing import List, Optional
from app.db import get_db_connection, USE_POSTGRES
from app.chat.models import Conversation, ChatMessage, ConversationWithMessages


def _q(sql: str) -> str:
    return sql.replace("?", "%s") if USE_POSTGRES else sql


def _row(row) -> dict | None:
    if row is None:
        return None
    return dict(row)


def list_conversations(username: str) -> List[Conversation]:
    conn = get_db_connection()
    cursor = conn.cursor()
    if USE_POSTGRES:
        cursor.execute(
            _q("""SELECT c.*, (SELECT COUNT(*) FROM chat_messages WHERE conversation_id = c.id) as count
                  FROM chat_conversations c WHERE user_username = ? ORDER BY updated_at DESC"""),
            (username,)
        )
    else:
        cursor.execute(
            "SELECT c.*, (SELECT COUNT(*) FROM chat_messages WHERE conversation_id = c.id) as count FROM chat_conversations c WHERE user_username = ? ORDER BY updated_at DESC",
            (username,)
        )
    rows = cursor.fetchall()
    conn.close()
    convs = []
    for r in rows:
        r = _row(r)
        convs.append(Conversation(
            id=r["id"],
            title=r["title"],
            timestamp=r["updated_at"],
            messages_count=r["count"]
        ))
    return convs


def create_conversation(username: str, title: str) -> Conversation:
    conv_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        _q("INSERT INTO chat_conversations (id, user_username, title, created_at, updated_at) VALUES (?, ?, ?, ?, ?)"),
        (conv_id, username, title, now, now)
    )
    conn.commit()
    conn.close()
    return Conversation(id=conv_id, title=title, timestamp=now, messages_count=0)


def get_conversation_with_messages(username: str, conv_id: str) -> Optional[ConversationWithMessages]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(_q("SELECT * FROM chat_conversations WHERE id = ? AND user_username = ?"), (conv_id, username))
    c_row = _row(cursor.fetchone())
    if not c_row:
        conn.close()
        return None

    cursor.execute(_q("SELECT * FROM chat_messages WHERE conversation_id = ? ORDER BY timestamp ASC"), (conv_id,))
    m_rows = cursor.fetchall()
    conn.close()

    messages = []
    for mr in m_rows:
        mr = _row(mr)
        sources = json.loads(mr["sources_json"]) if mr["sources_json"] else None
        metrics = json.loads(mr["metrics_json"]) if mr["metrics_json"] else None
        messages.append(ChatMessage(
            id=mr["id"],
            role=mr["role"],
            content=mr["content"],
            sources=sources,
            metrics=metrics,
            timestamp=mr["timestamp"]
        ))

    return ConversationWithMessages(
        id=c_row["id"],
        title=c_row["title"],
        timestamp=c_row["updated_at"],
        messages_count=len(messages),
        messages=messages
    )


def add_message(username: str, conv_id: str, role: str, content: str, sources: Optional[list] = None, metrics: Optional[dict] = None) -> Optional[ChatMessage]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(_q("SELECT id FROM chat_conversations WHERE id = ? AND user_username = ?"), (conv_id, username))
    if not _row(cursor.fetchone()):
        conn.close()
        return None

    msg_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()
    sources_json = json.dumps(sources) if sources else None
    metrics_json = json.dumps(metrics) if metrics else None

    cursor.execute(
        _q("INSERT INTO chat_messages (id, conversation_id, role, content, sources_json, metrics_json, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)"),
        (msg_id, conv_id, role, content, sources_json, metrics_json, now)
    )
    cursor.execute(_q("UPDATE chat_conversations SET updated_at = ? WHERE id = ?"), (now, conv_id))
    conn.commit()
    conn.close()

    return ChatMessage(id=msg_id, role=role, content=content, sources=sources, metrics=metrics, timestamp=now)


def delete_conversation(username: str, conv_id: str) -> bool:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(_q("SELECT id FROM chat_conversations WHERE id = ? AND user_username = ?"), (conv_id, username))
    if not _row(cursor.fetchone()):
        conn.close()
        return False
    cursor.execute(_q("DELETE FROM chat_conversations WHERE id = ?"), (conv_id,))
    conn.commit()
    conn.close()
    return True
