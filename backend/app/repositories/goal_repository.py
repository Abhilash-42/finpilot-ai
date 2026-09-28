from uuid import UUID

from sqlalchemy.orm import Session
from decimal import Decimal
from app.models.goal import Goal
from app.schemas.goal import GoalCreate, GoalUpdate


class GoalRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        user_id: UUID,
        goal_data: GoalCreate,
    ) -> Goal:
        goal = Goal(
            user_id=user_id,
            saved_amount=0,
            **goal_data.model_dump(),
        )

        self.db.add(goal)
        self.db.flush()
        self.db.refresh(goal)

        return goal

    def get_all(
        self,
        user_id: UUID,
    ) -> list[Goal]:
        return (
            self.db.query(Goal)
            .filter(Goal.user_id == user_id)
            .order_by(Goal.created_at.desc())
            .all()
        )

    def get_by_id(
        self,
        goal_id: UUID,
        user_id: UUID,
    ) -> Goal | None:
        return (
            self.db.query(Goal)
            .filter(
                Goal.id == goal_id,
                Goal.user_id == user_id,
            )
            .first()
        )

    def update(
        self,
        goal: Goal,
        goal_data: GoalUpdate,
    ) -> Goal:
        update_data = goal_data.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(goal, key, value)

        self.db.flush()
        self.db.refresh(goal)

        return goal

    def delete(
        self,
        goal: Goal,
    ) -> None:
        self.db.delete(goal)
        self.db.flush()

    def deposit(
     self,
     goal: Goal,
     amount: Decimal,
    ) -> Goal:
       goal.saved_amount += amount

       self.db.flush()
       self.db.refresh(goal)

       return goal


    def withdraw(
     self,
     goal: Goal,
     amount: Decimal,
    ) -> Goal:
       goal.saved_amount -= amount

       self.db.flush()
       self.db.refresh(goal)

       return goal