from typing import Any

from sqlalchemy.orm import Session

from app.models.chat_message import ChatMessage


def create_message(db: Session, *, user_id: int, session_id: str, role: str, content: str) -> ChatMessage:
    message = ChatMessage(user_id=user_id, session_id=session_id, role=role, content=content)
    db.add(message)
    db.commit()
    db.refresh(message)
    return message


def list_messages(db: Session, user_id: int, session_id: str, limit: int = 50) -> list[ChatMessage]:
    rows = (
        db.query(ChatMessage)
        .filter(ChatMessage.user_id == user_id, ChatMessage.session_id == session_id)
        .order_by(ChatMessage.created_at.desc())
        .limit(limit)
        .all()
    )
    return list(reversed(rows))


def list_sessions(db: Session, user_id: int) -> list[dict[str, Any]]:
    messages = (
        db.query(ChatMessage)
        .filter(ChatMessage.user_id == user_id)
        .order_by(ChatMessage.created_at.asc())
        .all()
    )
    sessions: dict[str, dict[str, Any]] = {}
    for m in messages:
        if m.session_id not in sessions:
            sessions[m.session_id] = {
                "session_id": m.session_id,
                "message_count": 0,
                "last_message_at": m.created_at,
                "preview": m.content,
            }
        sessions[m.session_id]["message_count"] += 1
        sessions[m.session_id]["last_message_at"] = m.created_at
    return sorted(sessions.values(), key=lambda s: s["last_message_at"], reverse=True)


def delete_session(db: Session, user_id: int, session_id: str) -> bool:
    messages = (
        db.query(ChatMessage)
        .filter(ChatMessage.user_id == user_id, ChatMessage.session_id == session_id)
        .all()
    )
    if not messages:
        return False
    for m in messages:
        db.delete(m)
    db.commit()
    return True
