from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_active_user, get_db
from app.crud import chat_message as chat_message_crud
from app.models.user import User
from app.schemas.chatbot import ChatMessageCreate, ChatMessageRead, ChatReplyResponse, ChatSessionSummary
from app.services.chatbot_service import ChatbotService

router = APIRouter(prefix="/chatbot", tags=["chatbot"])


@router.post("/message", response_model=ChatReplyResponse)
def send_message(
    payload: ChatMessageCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> dict:
    return ChatbotService.send_message(db, current_user.id, payload.message, payload.session_id)


@router.get("/sessions", response_model=list[ChatSessionSummary])
def list_sessions(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> list:
    return chat_message_crud.list_sessions(db, current_user.id)


@router.get("/sessions/{session_id}/messages", response_model=list[ChatMessageRead])
def get_session_messages(
    session_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> list:
    messages = chat_message_crud.list_messages(db, current_user.id, session_id, limit=200)
    if not messages:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    return messages


@router.delete("/sessions/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_session(
    session_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    deleted = chat_message_crud.delete_session(db, current_user.id, session_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
