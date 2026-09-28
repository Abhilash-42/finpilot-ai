from decimal import Decimal
from uuid import UUID

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.enums import TransactionType
from app.models.budget import Budget
from app.models.transaction import Transaction
from app.schemas.budget import BudgetCreate, BudgetUpdate


class BudgetRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        user_id: UUID,
        budget_data: BudgetCreate,
    ) -> Budget:
        budget = Budget(
            user_id=user_id,
            **budget_data.model_dump(),
        )

        self.db.add(budget)
        self.db.flush()
        self.db.refresh(budget)

        return budget

    def get_all(
        self,
        user_id: UUID,
    ) -> list[Budget]:
        return (
            self.db.query(Budget)
            .filter(Budget.user_id == user_id)
            .order_by(Budget.year.desc(), Budget.month.desc())
            .all()
        )

    def get_by_id(
        self,
        budget_id: UUID,
        user_id: UUID,
    ) -> Budget | None:
        return (
            self.db.query(Budget)
            .filter(
                Budget.id == budget_id,
                Budget.user_id == user_id,
            )
            .first()
        )

    def get_by_category_month(
        self,
        user_id: UUID,
        category_id: UUID,
        month: int,
        year: int,
    ) -> Budget | None:
        return (
            self.db.query(Budget)
            .filter(
                Budget.user_id == user_id,
                Budget.category_id == category_id,
                Budget.month == month,
                Budget.year == year,
            )
            .first()
        )

    def update(
        self,
        budget: Budget,
        budget_data: BudgetUpdate,
    ) -> Budget:
        update_data = budget_data.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(budget, key, value)

        self.db.flush()
        self.db.refresh(budget)

        return budget

    def delete(
        self,
        budget: Budget,
    ) -> None:
        self.db.delete(budget)
        self.db.flush()

    def get_budget_status(
        self,
        user_id: UUID,
    ):
        budgets = (
            self.db.query(Budget)
            .filter(Budget.user_id == user_id)
            .all()
        )

        result = []

        for budget in budgets:

            spent = (
                self.db.query(
                    func.coalesce(
                        func.sum(Transaction.amount),
                        0,
                    )
                )
                .filter(
                    Transaction.user_id == user_id,
                    Transaction.category_id == budget.category_id,
                    Transaction.transaction_type == TransactionType.EXPENSE,
                    func.extract(
                        "month",
                        Transaction.transaction_date,
                    ) == budget.month,
                    func.extract(
                        "year",
                        Transaction.transaction_date,
                    ) == budget.year,
                )
                .scalar()
            )

            spent = Decimal(spent)

            remaining = Decimal(budget.amount) - spent

            percentage = (
                float(spent / Decimal(budget.amount) * 100)
                if budget.amount > 0
                else 0
            )

            result.append(
                {
                    "category": budget.category.name,
                    "budget": Decimal(budget.amount),
                    "spent": spent,
                    "remaining": remaining,
                    "percentage": round(percentage, 2),
                }
            )

        return result

    def get_budget_alerts(
        self,
        user_id: UUID,
     ):
        alerts = []

        budgets = self.get_budget_status(user_id)

        for budget in budgets:

            percentage = budget["percentage"]

            if percentage >= 100:
                alerts.append(
                {
                    **budget,
                    "level": "danger",
                    "message": (
                        f'{budget["category"]} budget exceeded by '
                        f'₹{abs(budget["remaining"]):.2f}.'
                    ),
                }
            )

            elif percentage >= 80:
                alerts.append(
                {
                    **budget,
                    "level": "warning",
                    "message": (
                        f'{budget["category"]} budget has reached '
                        f'{percentage:.0f}%.'
                    ),
                }
            )

        return alerts