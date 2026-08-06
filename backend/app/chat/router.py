from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.auth.dependencies import get_current_user
from app.auth.models import User
from app.chat.models import Conversation, ConversationWithMessages, ChatMessage, CreateConversationRequest, AddMessageRequest
from app.chat.service import list_conversations, create_conversation, get_conversation_with_messages, add_message, delete_conversation

router = APIRouter()

def check_not_guest(user: User):
    is_guest = getattr(user, "is_guest", False) or (user.role.value if hasattr(user.role, "value") else user.role) == "guest"
    if is_guest:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Guest users cannot store persistent chat histories."
        )

@router.get("/conversations", response_model=List[Conversation])
async def get_conversations(current_user: User = Depends(get_current_user)):
    if getattr(current_user, "is_guest", False) or (current_user.role.value if hasattr(current_user.role, "value") else current_user.role) == "guest":
        return []
    return list_conversations(current_user.username)

@router.post("/conversations", response_model=Conversation)
async def new_conversation(payload: CreateConversationRequest, current_user: User = Depends(get_current_user)):
    check_not_guest(current_user)
    return create_conversation(current_user.username, payload.title)

@router.get("/conversations/{conv_id}", response_model=ConversationWithMessages)
async def get_conversation(conv_id: str, current_user: User = Depends(get_current_user)):
    check_not_guest(current_user)
    res = get_conversation_with_messages(current_user.username, conv_id)
    if not res:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return res

@router.post("/conversations/{conv_id}/messages", response_model=ChatMessage)
async def save_message(conv_id: str, payload: AddMessageRequest, current_user: User = Depends(get_current_user)):
    check_not_guest(current_user)
    msg = add_message(current_user.username, conv_id, payload.role, payload.content, payload.sources, payload.metrics)
    if not msg:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return msg

@router.delete("/conversations/{conv_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_conversation(conv_id: str, current_user: User = Depends(get_current_user)):
    check_not_guest(current_user)
    success = delete_conversation(current_user.username, conv_id)
    if not success:
        raise HTTPException(status_code=404, detail="Conversation not found")
