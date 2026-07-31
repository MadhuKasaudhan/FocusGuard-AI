from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.base import Base


class BehavioralInsight(Base):
    """Stores computed output from the Behavioral Analytics Engine so that
    analysis history can be retrieved without recomputation.

    insight_type is one of:
        attention_pattern | focus_session | productivity_trend | distraction_frequency
    """

    __tablename__ = "behavioral_insights"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    insight_type = Column(String(50), nullable=False, index=True)

    period_start = Column(DateTime(timezone=True), nullable=False)
    period_end = Column(DateTime(timezone=True), nullable=False)

    score = Column(Float, nullable=True)
    pattern_label = Column(String(50), nullable=True)
    summary = Column(Text, nullable=True)
    metrics = Column(JSONB, nullable=False, default=dict)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="behavioral_insights")
