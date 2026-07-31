from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.base import Base


class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    action = Column(String(255), nullable=False)
    details = Column(Text)

    device = Column(String(100))
    browser = Column(String(100))
    ip_address = Column(String(50))
    status = Column(String(50))

    created_at = Column(DateTime(timezone=True),
                        server_default=func.now(),
                        nullable=False)

    user = relationship("User", back_populates="activity_logs")
    
    