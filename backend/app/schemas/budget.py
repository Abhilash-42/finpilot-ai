from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class BudgetBase(BaseModel):
    category_id: UUID
    amount: Decimal = Field(gt=0)
    month: int = Field(ge=1, le=12)
    year: int = Field(ge=2024)


class BudgetCreate(BudgetBase):
    pass


class BudgetUpdate(BaseModel):
    amount: Decimal | None = Field(default=None, gt=0)
    month: int | None = Field(default=None, ge=1, le=12)
    year: int | None = Field(default=None, ge=2024)


class BudgetResponse(BudgetBase):
    id: UUID
    user_id: UUID
    category_name: str

    model_config = ConfigDict(from_attributes=True)


class BudgetStatus(BaseModel):
    category: str
    budget: Decimal
    spent: Decimal
    remaining: Decimal
    percentage: float

    model_config = ConfigDict(from_attributes=True)


class BudgetAlert(BaseModel):
    category: str
    budget: Decimal
    spent: Decimal
    remaining: Decimal
    percentage: float
    level: str
    message: str

    model_config = ConfigDict(from_attributes=True)