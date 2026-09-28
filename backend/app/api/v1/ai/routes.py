from decimal import Decimal
from datetime import datetime

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.database import get_db
from app.api.dependencies.auth import get_current_user

from app.models.user import User
from app.models.transaction import Transaction
from app.models.category import Category
from app.core.enums import TransactionType


router = APIRouter(prefix="/ai", tags=["AI Assistant"])


class AIChatRequest(BaseModel):
    message: str


class AIChatResponse(BaseModel):
    message: str


@router.post("/chat", response_model=AIChatResponse)
def chat(
    request: AIChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user_id = current_user.id

    # Get total income
    total_income = (
        db.query(func.coalesce(func.sum(Transaction.amount), 0))
        .filter(
            Transaction.user_id == user_id,
            Transaction.transaction_type == TransactionType.INCOME,
        )
        .scalar()
    )

    # Get total expenses
    total_expense = (
        db.query(func.coalesce(func.sum(Transaction.amount), 0))
        .filter(
            Transaction.user_id == user_id,
            Transaction.transaction_type == TransactionType.EXPENSE,
        )
        .scalar()
    )

    total_income = Decimal(total_income or 0)
    total_expense = Decimal(total_expense or 0)

    net_savings = total_income - total_expense

    message = request.message.lower().strip()

    # -----------------------------------------
    # Basic financial questions
    # -----------------------------------------

    if "income" in message:
        response = (
            f"Your total income is ₹{total_income:,.2f}."
        )

    elif "expense" in message or "spend" in message:
        response = (
            f"Your total expenses are ₹{total_expense:,.2f}."
        )

    elif "saving" in message:
        response = (
            f"Your net savings are ₹{net_savings:,.2f}."
        )

    elif "summary" in message or "financial" in message:
        response = (
            f"Here is your financial summary:\n\n"
            f"Income: ₹{total_income:,.2f}\n"
            f"Expenses: ₹{total_expense:,.2f}\n"
            f"Net Savings: ₹{net_savings:,.2f}"
        )

    else:
        response = (
            "I can currently help you with basic financial questions "
            "about your income, expenses, savings, and financial summary."
        )

    return AIChatResponse(message=response)