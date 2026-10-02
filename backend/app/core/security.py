from datetime import datetime, timedelta, timezone
from typing import Any

from jose import jwt
from passlib.context import CryptContext

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_token(subject: str | Any, token_type: str, expires_delta: timedelta | None = None) -> str:
    if expires_delta is None:
        expires_delta = timedelta(minutes=settings.access_token_expire_minutes)
        if token_type == "refresh":
            expires_delta = timedelta(minutes=settings.refresh_token_expire_minutes)

    to_encode = {"sub": str(subject), "token_type": token_type}
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)


def create_access_token(subject: str | Any, expires_delta: timedelta | None = None) -> str:
    return create_token(subject, "access", expires_delta)


def create_refresh_token(subject: str | Any, expires_delta: timedelta | None = None) -> str:
    return create_token(subject, "refresh", expires_delta)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def decode_token(token: str) -> dict[str, Any]:
    return jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
