from datetime import datetime, timezone
from decimal import Decimal
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_user
from app.core.database import get_db
from app.models.category import Category
from app.models.transaction import Transaction
from app.models.user import User
from app.services.budget import BudgetService

router = APIRouter(
    prefix="/reports",
    tags=["Reports"],
)


# ---------------------------------------------------------
# SUMMARY
# ---------------------------------------------------------
@router.get("/summary")
def get_report_summary(
    month: int | None = Query(
        default=None,
        ge=1,
        le=12,
    ),
    year: int | None = Query(
        default=None,
        ge=2024,
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Transaction).filter(
        Transaction.user_id == current_user.id
    )

    if month is not None and year is not None:
        query = query.filter(
            func.extract(
                "month",
                Transaction.transaction_date,
            )
            == month,
            func.extract(
                "year",
                Transaction.transaction_date,
            )
            == year,
        )

    transactions = query.all()

    total_income = Decimal("0")
    total_expense = Decimal("0")

    for transaction in transactions:
        amount = Decimal(str(transaction.amount))

        if transaction.transaction_type.value == "Income":
            total_income += amount

        elif transaction.transaction_type.value == "Expense":
            total_expense += amount

    net_savings = total_income - total_expense

    return {
        "total_income": total_income,
        "total_expense": total_expense,
        "net_savings": net_savings,
        "transaction_count": len(transactions),
    }


# ---------------------------------------------------------
# SPENDING BY CATEGORY
# ---------------------------------------------------------
@router.get("/spending-by-category")
def get_spending_by_category(
    month: int | None = Query(
        default=None,
        ge=1,
        le=12,
    ),
    year: int | None = Query(
        default=None,
        ge=2024,
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = (
        db.query(
            Category.id.label("category_id"),
            Category.name.label("category_name"),
            func.sum(Transaction.amount).label("total"),
        )
        .join(
            Transaction,
            Transaction.category_id == Category.id,
        )
        .filter(
            Transaction.user_id == current_user.id,
            Transaction.transaction_type == "Expense",
        )
        .group_by(
            Category.id,
            Category.name,
        )
        .order_by(
            func.sum(Transaction.amount).desc()
        )
    )

    if month is not None and year is not None:
        query = query.filter(
            func.extract(
                "month",
                Transaction.transaction_date,
            )
            == month,
            func.extract(
                "year",
                Transaction.transaction_date,
            )
            == year,
        )

    results = query.all()

    return [
        {
            "category_id": row.category_id,
            "category_name": row.category_name,
            "total": row.total,
        }
        for row in results
    ]


# ---------------------------------------------------------
# MONTHLY REPORT
# ---------------------------------------------------------
@router.get("/monthly")
def get_monthly_report(
    year: int = Query(
        ...,
        ge=2024,
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    rows = (
        db.query(
            func.extract(
                "month",
                Transaction.transaction_date,
            ).label("month"),
            Transaction.transaction_type.label(
                "transaction_type"
            ),
            func.sum(
                Transaction.amount
            ).label("total"),
        )
        .filter(
            Transaction.user_id == current_user.id,
            func.extract(
                "year",
                Transaction.transaction_date,
            )
            == year,
        )
        .group_by(
            func.extract(
                "month",
                Transaction.transaction_date,
            ),
            Transaction.transaction_type,
        )
        .order_by(
            func.extract(
                "month",
                Transaction.transaction_date,
            )
        )
        .all()
    )

    monthly = {}

    for row in rows:
        month = int(row.month)

        if month not in monthly:
            monthly[month] = {
                "month": month,
                "income": Decimal("0"),
                "expense": Decimal("0"),
            }

        amount = row.total

        if row.transaction_type.value == "Income":
            monthly[month]["income"] += amount

        elif row.transaction_type.value == "Expense":
            monthly[month]["expense"] += amount

    return list(monthly.values())


# ---------------------------------------------------------
# RECENT TRANSACTIONS
# ---------------------------------------------------------
@router.get("/recent-transactions")
def get_recent_transactions(
    limit: int = Query(
        default=10,
        ge=1,
        le=50,
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    transactions = (
        db.query(Transaction)
        .filter(
            Transaction.user_id == current_user.id
        )
        .order_by(
            Transaction.transaction_date.desc()
        )
        .limit(limit)
        .all()
    )

    return [
        {
            "id": transaction.id,
            "amount": transaction.amount,
            "transaction_type": (
                transaction.transaction_type.value
            ),
            "description": transaction.description,
            "transaction_date": (
                transaction.transaction_date
            ),
            "category_name": (
                transaction.category.name
                if transaction.category
                else None
            ),
        }
        for transaction in transactions
    ]

# ---------------------------------------------------------
# BUDGET VS ACTUAL
# ---------------------------------------------------------
@router.get("/budget-vs-actual")
def get_budget_vs_actual(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = BudgetService(db)

    return service.get_budget_status(current_user.id)