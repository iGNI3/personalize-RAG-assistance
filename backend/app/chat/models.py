from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class ChatMessage(BaseModel):
    id: str
    role: str
    content: str
    sources: Optional[List[Dict[str, Any]]] = None
    metrics: Optional[Dict[str, Any]] = None
    timestamp: str

class Conversation(BaseModel):
    id: str
    title: str
    timestamp: str
    messages_count: int = 0

class ConversationWithMessages(Conversation):
    messages: List[ChatMessage] = []

class CreateConversationRequest(BaseModel):
    title: str

class AddMessageRequest(BaseModel):
    role: str
    content: str
    sources: Optional[List[Dict[str, Any]]] = None
    metrics: Optional[Dict[str, Any]] = None
