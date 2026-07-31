from fastapi import FastAPI
from app.core.config import settings
from app.database.init_db import init_db
from app.routers import (
    ai_engine,
    analytics,
    auth,
    behavioral_analytics,
    chatbot,
    health,
    monitoring,
    notification_intelligence,
    recommendation_engine,
    resources,
)

app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    description="FocusGuard AI backend with JWT authentication and domain CRUD APIs",
)

app.include_router(health.router)
app.include_router(auth.router)
app.include_router(resources.router)
app.include_router(analytics.router)
app.include_router(behavioral_analytics.router)
app.include_router(ai_engine.router)
app.include_router(recommendation_engine.router)
app.include_router(notification_intelligence.router)
app.include_router(chatbot.router)
app.include_router(monitoring.router)


@app.on_event("startup")
def startup_event() -> None:
    init_db()


@app.get("/")
def read_root() -> dict[str, str]:
    return {"message": "FocusGuard AI backend is running"}
