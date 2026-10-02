from sqlalchemy.orm import Session

from app.models.user import User

VALID_ROLES = ("user", "subadmin", "superadmin")


def list_users(db: Session, roles: list[str] | None = None) -> list[User]:
    query = db.query(User)
    if roles is not None:
        query = query.filter(User.role.in_(roles))
    return query.order_by(User.id).all()


def get_user(db: Session, user_id: int) -> User | None:
    return db.query(User).filter(User.id == user_id).first()


def update_role(db: Session, user: User, role: str) -> User:
    user.role = role
    user.is_superuser = role == "superadmin"
    db.commit()
    db.refresh(user)
    return user


def update_status(db: Session, user: User, is_active: bool) -> User:
    user.is_active = is_active
    db.commit()
    db.refresh(user)
    return user


def delete_user(db: Session, user: User) -> None:
    db.delete(user)
    db.commit()
