"""
AI Chatbot Service
====================
Answers questions grounded in the user's own focus/productivity data.
"""

import uuid
from datetime import date, timedelta
from typing import Any

from sqlalchemy.orm import Session

from app.crud import chat_message as chat_message_crud
from app.services.ai_insight_service import generate_chat_reply
from app.services.behavioral_analytics_service import (
    AttentionPatternAnalyzer,
    DistractionFrequencyAnalyzer,
    FocusSessionAnalyzer,
    ProductivityTrendAnalyzer,
)
from app.services.insight_generation_service import InsightGenerationService


class ChatbotService:
    CONTEXT_WINDOW_DAYS = 14
    HISTORY_LIMIT = 10

    @staticmethod
    def _build_data_context(db: Session, user_id: int) -> dict[str, Any]:
        end = date.today()
        start = end - timedelta(days=ChatbotService.CONTEXT_WINDOW_DAYS - 1)

        return {
            "period": f"{start.isoformat()} to {end.isoformat()}",
            "attention_pattern": AttentionPatternAnalyzer.analyze(db, user_id, start, end),
            "focus_sessions": FocusSessionAnalyzer.analyze(db, user_id, start, end),
            "productivity_trend": ProductivityTrendAnalyzer.analyze(db, user_id, start, end),
            "distraction_frequency": DistractionFrequencyAnalyzer.analyze(db, user_id, start, end),
            "daily_summary": InsightGenerationService.daily_performance_summary(db, user_id),
        }

    @staticmethod
    def send_message(
        db: Session, user_id: int, message: str, session_id: str | None = None
    ) -> dict[str, Any]:
        session_id = session_id or str(uuid.uuid4())

        chat_message_crud.create_message(db, user_id=user_id, session_id=session_id, role="user", content=message)

        history = chat_message_crud.list_messages(db, user_id, session_id, limit=ChatbotService.HISTORY_LIMIT)
        conversation = [{"role": m.role, "content": m.content} for m in history]

        data_context = ChatbotService._build_data_context(db, user_id)
        reply_text = generate_chat_reply(conversation, data_context)

        chat_message_crud.create_message(
            db, user_id=user_id, session_id=session_id, role="assistant", content=reply_text
        )

        return {
            "session_id": session_id,
            "reply": reply_text,
        }
