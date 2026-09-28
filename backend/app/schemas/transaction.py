from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, Field

from app.core.enums import TransactionType


class TransactionCreate(BaseModel):
    account_id: UUID
    category_id: UUID | None = None
    amount: Decimal = Field(..., gt=0)
    transaction_type: TransactionType
    description: str | None = None
    transaction_date: datetime


class TransactionUpdate(BaseModel):
    account_id: UUID | None = None
    category_id: UUID | None = None
    amount: Decimal | None = Field(None, gt=0)
    transaction_type: TransactionType | None = None
    description: str | None = None
    transaction_date: datetime | None = None


class TransactionResponse(BaseModel):
    id: UUID
    account_id: UUID
    category_id: UUID | None
    amount: Decimal
    transaction_type: TransactionType
    description: str | None
    transaction_date: datetime

    model_config = {
        "from_attributes": True
    }