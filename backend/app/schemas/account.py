from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, Field


class AccountCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    account_type: str
    balance: Decimal = Decimal("0.00")
    currency: str = "INR"


class AccountUpdate(BaseModel):
    name: str | None = None
    account_type: str | None = None
    balance: Decimal | None = None
    currency: str | None = None


class AccountResponse(BaseModel):
    id: UUID
    name: str
    account_type: str
    balance: Decimal
    currency: str

    model_config = {
        "from_attributes": True
    }