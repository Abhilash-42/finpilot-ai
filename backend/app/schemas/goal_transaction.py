from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.core.enums import GoalTransactionType


class GoalTransactionCreate(BaseModel):
    account_id: UUID
    amount: Decimal = Field(gt=0)
    note: str | None = None


class GoalTransactionResponse(BaseModel):
    id: UUID
    goal_id: UUID
    account_id: UUID
    transaction_type: GoalTransactionType
    amount: Decimal
    note: str | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)