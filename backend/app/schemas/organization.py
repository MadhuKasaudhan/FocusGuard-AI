from pydantic import BaseModel, EmailStr


class OrganizationBase(BaseModel):
    name: str
    company_email: EmailStr | None = None
    phone: str | None = None
    website: str | None = None
    address: str | None = None


class OrganizationCreate(OrganizationBase):
    pass


class OrganizationUpdate(BaseModel):
    name: str | None = None
    company_email: EmailStr | None = None
    phone: str | None = None
    website: str | None = None
    address: str | None = None
    is_active: bool | None = None


class OrganizationRead(OrganizationBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True