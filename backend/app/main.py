from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database.init_db import init_db
from app.routers import organization
from app.routers import (
    admin,
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176", "http://localhost:5177"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
app.include_router(admin.router)
app.include_router(organization.router)

@app.on_event("startup")
def startup_event() -> None:
    init_db()


@app.get("/")
def read_root() -> dict[str, str]:
    return {"message": "FocusGuard AI backend is running"}

