from decimal import Decimal
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.enums import GoalTransactionType
from app.repositories.account_repository import AccountRepository
from app.repositories.goal_repository import GoalRepository
from app.repositories.goal_transaction_repository import GoalTransactionRepository
from app.repositories.transaction_repository import TransactionRepository
from app.schemas.goal import GoalCreate, GoalUpdate


class GoalService:
    def __init__(self, db: Session):
        self.db = db
        self.repository = GoalRepository(db)
        self.account_repository = AccountRepository(db)
        self.goal_transaction_repository = GoalTransactionRepository(db)
        self.transaction_repository = TransactionRepository(db)

    def create_goal(
        self,
        user_id: UUID,
        goal_data: GoalCreate,
    ):
        try:
            goal = self.repository.create(
                user_id,
                goal_data,
            )

            self.db.commit()
            self.db.refresh(goal)

            return goal

        except Exception:
            self.db.rollback()
            raise

    def get_goals(
        self,
        user_id: UUID,
    ):
        return self.repository.get_all(user_id)

    def get_goal(
        self,
        goal_id: UUID,
        user_id: UUID,
    ):
        goal = self.repository.get_by_id(
            goal_id,
            user_id,
        )

        if not goal:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Goal not found",
            )

        return goal

    def update_goal(
        self,
        goal_id: UUID,
        user_id: UUID,
        goal_data: GoalUpdate,
    ):
        goal = self.get_goal(
            goal_id,
            user_id,
        )

        try:
            goal = self.repository.update(
                goal,
                goal_data,
            )

            self.db.commit()
            self.db.refresh(goal)

            return goal

        except Exception:
            self.db.rollback()
            raise

    def delete_goal(
        self,
        goal_id: UUID,
        user_id: UUID,
    ):
        goal = self.get_goal(
            goal_id,
            user_id,
        )

        try:
            self.repository.delete(goal)
            self.db.commit()

        except Exception:
            self.db.rollback()
            raise

    def get_goal_progress(
        self,
        user_id: UUID,
    ):
        goals = self.repository.get_all(user_id)

        result = []

        for goal in goals:
            target = Decimal(goal.target_amount)
            saved = Decimal(goal.saved_amount)

            remaining = target - saved

            progress = (
                float((saved / target) * 100)
                if target > 0
                else 0
            )

            result.append(
                {
                    "id": goal.id,
                    "name": goal.name,
                    "target_amount": target,
                    "saved_amount": saved,
                    "remaining_amount": remaining,
                    "progress_percentage": round(progress, 2),
                    "target_date": goal.target_date,
                }
            )

        return result

    def deposit(
        self,
        goal_id: UUID,
        user_id: UUID,
        data,
    ):
        goal = self.get_goal(
            goal_id,
            user_id,
        )

        if goal.saved_amount + data.amount > goal.target_amount:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Deposit exceeds target amount.",
            )

        try:
            self.goal_transaction_repository.create(
                goal_id=goal.id,
                account_id=data.account_id,
                transaction_type=GoalTransactionType.DEPOSIT,
                amount=data.amount,
                note=data.note,
            )

            goal = self.repository.deposit(
                goal,
                data.amount,
            )

            self.db.commit()
            self.db.refresh(goal)

            return goal

        except Exception:
            self.db.rollback()
            raise

    def withdraw(
        self,
        goal_id: UUID,
        user_id: UUID,
        data,
    ):
        goal = self.get_goal(
            goal_id,
            user_id,
        )

        if goal.saved_amount - data.amount < 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Insufficient saved amount.",
            )

        try:
            self.goal_transaction_repository.create(
                goal_id=goal.id,
                account_id=data.account_id,
                transaction_type=GoalTransactionType.WITHDRAW,
                amount=data.amount,
                note=data.note,
            )

            goal = self.repository.withdraw(
                goal,
                data.amount,
            )

            self.db.commit()
            self.db.refresh(goal)

            return goal

        except Exception:
            self.db.rollback()
            raise

    def get_goal_transactions(
        self,
        goal_id: UUID,
        user_id: UUID,
    ):
        goal = self.get_goal(
            goal_id,
            user_id,
        )

        return self.goal_transaction_repository.get_goal_transactions(
            goal.id
        )