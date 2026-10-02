from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.base import Base


class ScreenTimeEvent(Base):
    __tablename__ = "screen_time_events"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    duration_seconds = Column(Integer, default=0)
    captured_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    window_title = Column(String(255), nullable=True)

    user = relationship("User", back_populates="screen_time_events")
