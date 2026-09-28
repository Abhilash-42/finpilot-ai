from datetime import date
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class GoalBase(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    target_amount: Decimal = Field(gt=0)
    target_date: date | None = None


class GoalCreate(GoalBase):
    pass


class GoalUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=100)
    target_amount: Decimal | None = Field(default=None, gt=0)
    saved_amount: Decimal | None = Field(default=None, ge=0)
    target_date: date | None = None


class GoalResponse(BaseModel):
    id: UUID
    user_id: UUID
    name: str
    target_amount: Decimal
    saved_amount: Decimal
    target_date: date | None

    model_config = ConfigDict(from_attributes=True)


class GoalProgress(BaseModel):
    id: UUID
    name: str
    target_amount: Decimal
    saved_amount: Decimal
    remaining_amount: Decimal
    progress_percentage: float
    target_date: date | None

    model_config = ConfigDict(from_attributes=True)

class GoalTransaction(BaseModel):
    account_id: UUID
    amount: Decimal = Field(gt=0)
    note: str | None = None