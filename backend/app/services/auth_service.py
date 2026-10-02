from sqlalchemy.orm import Session

from app.core.roles import ROLE_USER
from app.core.security import get_password_hash, verify_password
from app.models.user import User
from app.schemas.user import UserCreate


def create_user(db: Session, user_in: UserCreate) -> User:
    existing = db.query(User).filter(User.email == user_in.email).first()

    if existing:
        raise ValueError("Email already registered")

    user = User(
        name=user_in.name,
        email=str(user_in.email),
        hashed_password=get_password_hash(user_in.password),

        # Default values for every new user
        role=ROLE_USER,
        is_active=True,
        is_superuser=False,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def authenticate_user(db: Session, email: str, password: str) -> User | None:
    user = db.query(User).filter(User.email == email).first()

    if not user:
        return None

    if not verify_password(password, user.hashed_password):
        return None

    return user