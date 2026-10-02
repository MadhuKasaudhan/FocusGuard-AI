from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from app.database.base import Base

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, unique=True)
    company_email = Column(String(255), nullable=True)
    phone = Column(String(20), nullable=True)
    website = Column(String(255), nullable=True)
    address = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)

    users = relationship(
        "User",
        back_populates="organization",
        cascade="all, delete-orphan",
    )