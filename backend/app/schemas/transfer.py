from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class TransferCreate(BaseModel):
    from_account_id: UUID
    to_account_id: UUID | None = None
    goal_id: UUID | None = None
    amount: Decimal = Field(gt=0)
    description: str | None = None


class TransferResponse(BaseModel):
    success: bool
    message: str

    model_config = ConfigDict(from_attributes=True)