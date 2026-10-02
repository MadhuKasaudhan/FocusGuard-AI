from datetime import datetime

from pydantic import BaseModel


class ChatMessageCreate(BaseModel):
    message: str
    session_id: str | None = None


class ChatMessageRead(BaseModel):
    id: int
    session_id: str
    role: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True


class ChatReplyResponse(BaseModel):
    session_id: str
    reply: str


class ChatSessionSummary(BaseModel):
    session_id: str
    message_count: int
    last_message_at: datetime
    preview: str
