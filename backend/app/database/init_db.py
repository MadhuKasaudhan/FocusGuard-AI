from app.database.base import Base
from app.database.session import engine
from app.models import (
    ActivityLog,
    ApplicationUsage,
    BehavioralInsight,
    ChatMessage,
    FocusSession,
    Goal,
    NotificationLog,
    Profile,
    ScreenTimeEvent,
    TaskSwitchEvent,
    User,
)  # noqa: F401


def init_db() -> None:
    Base.metadata.create_all(bind=engine)
