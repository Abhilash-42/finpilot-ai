from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.account import Account
from app.models.category import Category
from app.models.goal import Goal


class ValidationService:
    @staticmethod
    def get_account(
        db: Session,
        account_id: UUID,
        user_id: UUID,
    ):
        account = (
            db.query(Account)
            .filter(
                Account.id == account_id,
                Account.user_id == user_id,
            )
            .first()
        )

        if not account:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Account not found",
            )

        return account

    @staticmethod
    def get_category(
        db: Session,
        category_id: UUID,
        user_id: UUID,
    ):
        category = (
            db.query(Category)
            .filter(
                Category.id == category_id,
                Category.user_id == user_id,
            )
            .first()
        )

        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found",
            )

        return category

    @staticmethod
    def get_goal(
        db: Session,
        goal_id: UUID,
        user_id: UUID,
    ):
        goal = (
            db.query(Goal)
            .filter(
                Goal.id == goal_id,
                Goal.user_id == user_id,
            )
            .first()
        )

        if not goal:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Goal not found",
            )

        return goal