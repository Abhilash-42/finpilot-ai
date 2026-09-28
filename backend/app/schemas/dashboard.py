from decimal import Decimal
from pydantic import BaseModel, ConfigDict
from datetime import datetime
from uuid import UUID

class DashboardSummary(BaseModel):
    total_balance: Decimal
    total_income: Decimal
    total_expense: Decimal
    net_savings: Decimal

    total_accounts: int
    total_transactions: int
    total_categories: int

    model_config = ConfigDict(from_attributes=True)

class MonthlyAnalytics(BaseModel):
    month: str
    income: Decimal
    expense: Decimal

    model_config = ConfigDict(from_attributes=True)

class CategoryAnalysis(BaseModel):
    category: str
    amount: Decimal

    model_config = ConfigDict(from_attributes=True)

class RecentTransaction(BaseModel):
    id: UUID
    description: str | None
    amount: Decimal
    transaction_type: str
    transaction_date: datetime
    account_name: str
    category_name: str | None

    model_config = ConfigDict(from_attributes=True)

class FinancialHealthResponse(BaseModel):
    score: int
    grade: str

    total_income: Decimal
    total_expense: Decimal
    total_savings: Decimal

    savings_rate: float
    expense_ratio: float

    summary: str

    model_config = ConfigDict(from_attributes=True)