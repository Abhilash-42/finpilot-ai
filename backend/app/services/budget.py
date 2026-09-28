from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.category import Category
from app.repositories.budget_repository import BudgetRepository
from app.schemas.budget import BudgetCreate, BudgetUpdate


class BudgetService:
    def __init__(self, db: Session):
        self.db = db
        self.repository = BudgetRepository(db)

    # -----------------------------
    # ADD CATEGORY NAME
    # -----------------------------
    def _add_category_name(self, budget):
        category = (
            self.db.query(Category)
            .filter(Category.id == budget.category_id)
            .first()
        )

        budget.category_name = (
            category.name if category else "Unknown"
        )

        return budget

    # -----------------------------
    # CREATE
    # -----------------------------
    def create_budget(
        self,
        user_id: UUID,
        budget_data: BudgetCreate,
    ):
        category = (
            self.db.query(Category)
            .filter(
                Category.id == budget_data.category_id,
                Category.user_id == user_id,
            )
            .first()
        )

        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found",
            )

        existing_budget = self.repository.get_by_category_month(
            user_id=user_id,
            category_id=budget_data.category_id,
            month=budget_data.month,
            year=budget_data.year,
        )

        if existing_budget:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Budget already exists for this category and month.",
            )

        try:
            budget = self.repository.create(
                user_id,
                budget_data,
            )

            self.db.commit()
            self.db.refresh(budget)

            return self._add_category_name(budget)

        except Exception:
            self.db.rollback()
            raise

    # -----------------------------
    # GET ALL
    # -----------------------------
    def get_budgets(
        self,
        user_id: UUID,
    ):
        budgets = self.repository.get_all(user_id)

        return [
            self._add_category_name(budget)
            for budget in budgets
        ]

    # -----------------------------
    # GET ONE
    # -----------------------------
    def get_budget(
        self,
        budget_id: UUID,
        user_id: UUID,
    ):
        budget = self.repository.get_by_id(
            budget_id,
            user_id,
        )

        if not budget:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Budget not found",
            )

        return self._add_category_name(budget)

    # -----------------------------
    # UPDATE
    # -----------------------------
    def update_budget(
        self,
        budget_id: UUID,
        user_id: UUID,
        budget_data: BudgetUpdate,
    ):
        budget = self.get_budget(
            budget_id,
            user_id,
        )

        try:
            updated_budget = self.repository.update(
                budget,
                budget_data,
            )

            self.db.commit()
            self.db.refresh(updated_budget)

            return self._add_category_name(updated_budget)

        except Exception:
            self.db.rollback()
            raise

    # -----------------------------
    # DELETE
    # -----------------------------
    def delete_budget(
        self,
        budget_id: UUID,
        user_id: UUID,
    ):
        budget = self.get_budget(
            budget_id,
            user_id,
        )

        try:
            self.repository.delete(budget)
            self.db.commit()

        except Exception:
            self.db.rollback()
            raise

    # -----------------------------
    # BUDGET STATUS
    # -----------------------------
    def get_budget_status(
        self,
        user_id,
    ):
        return self.repository.get_budget_status(user_id)

    # -----------------------------
    # BUDGET ALERTS
    # -----------------------------
    def get_budget_alerts(
        self,
        user_id: UUID,
    ):
        return self.repository.get_budget_alerts(user_id)