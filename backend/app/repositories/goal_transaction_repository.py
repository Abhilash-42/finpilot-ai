from uuid import UUID

from sqlalchemy.orm import Session

from app.models.goal_transaction import GoalTransaction


class GoalTransactionRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, **kwargs):
        transaction = GoalTransaction(**kwargs)

        self.db.add(transaction)
        self.db.flush()
        self.db.refresh(transaction)

        return transaction

    def get_goal_transactions(
        self,
        goal_id: UUID,
    ):
        return (
            self.db.query(GoalTransaction)
            .filter(
                GoalTransaction.goal_id == goal_id
            )
            .order_by(
                GoalTransaction.created_at.desc()
            )
            .all()
        )