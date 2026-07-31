from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.base import Base


class TaskSwitchEvent(Base):
    __tablename__ = "task_switch_events"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    previous_task = Column(String(255), nullable=True)
    next_task = Column(String(255), nullable=True)
    switched_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="task_switch_events")
