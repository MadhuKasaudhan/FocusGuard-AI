from sqlalchemy import Boolean, Column, Integer, String
from sqlalchemy.orm import relationship

from app.database.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_superuser = Column(Boolean, default=False, nullable=False)
    
    chat_messages = relationship("ChatMessage", back_populates="user", cascade="all, delete-orphan")
    behavioral_insights = relationship("BehavioralInsight", back_populates="user", cascade="all, delete-orphan")
    profile = relationship("Profile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    goals = relationship("Goal", back_populates="user", cascade="all, delete-orphan")
    activity_logs = relationship("ActivityLog", back_populates="user", cascade="all, delete-orphan")
    focus_sessions = relationship("FocusSession", back_populates="user", cascade="all, delete-orphan")
    notification_logs = relationship("NotificationLog", back_populates="user", cascade="all, delete-orphan")
    application_usages = relationship("ApplicationUsage", back_populates="user", cascade="all, delete-orphan")
    screen_time_events = relationship("ScreenTimeEvent", back_populates="user", cascade="all, delete-orphan")
    task_switch_events = relationship("TaskSwitchEvent", back_populates="user", cascade="all, delete-orphan")
