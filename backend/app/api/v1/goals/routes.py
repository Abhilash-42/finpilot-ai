from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.schemas.goal_transaction import GoalTransactionResponse
from app.api.dependencies.auth import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.goal import (
    GoalCreate,
    GoalProgress,
    GoalResponse,
    GoalUpdate,
    GoalTransaction,
)
from app.services.goal import GoalService

router = APIRouter(
    prefix="/goals",
    tags=["Goals"],
)


@router.post(
    "",
    response_model=GoalResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_goal(
    goal_data: GoalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return GoalService(db).create_goal(
        current_user.id,
        goal_data,
    )


@router.get(
    "",
    response_model=list[GoalResponse],
)
def get_goals(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return GoalService(db).get_goals(
        current_user.id,
    )


@router.get(
    "/progress",
    response_model=list[GoalProgress],
)
def goal_progress(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return GoalService(db).get_goal_progress(
        current_user.id,
    )


@router.get(
    "/{goal_id}",
    response_model=GoalResponse,
)
def get_goal(
    goal_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return GoalService(db).get_goal(
        goal_id,
        current_user.id,
    )


@router.put(
    "/{goal_id}",
    response_model=GoalResponse,
)
def update_goal(
    goal_id: UUID,
    goal_data: GoalUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return GoalService(db).update_goal(
        goal_id,
        current_user.id,
        goal_data,
    )


@router.delete(
    "/{goal_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_goal(
    goal_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    GoalService(db).delete_goal(
        goal_id,
        current_user.id,
    )

@router.post(
    "/{goal_id}/deposit",
    response_model=GoalResponse,
)
def deposit(
    goal_id: UUID,
    data: GoalTransaction,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return GoalService(db).deposit(
        goal_id,
        current_user.id,
        data,
    )

@router.post(
    "/{goal_id}/withdraw",
    response_model=GoalResponse,
)
def withdraw(
    goal_id: UUID,
    data: GoalTransaction,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return GoalService(db).withdraw(
        goal_id,
        current_user.id,
        data,
    )

@router.get(
    "/{goal_id}/transactions",
    response_model=list[GoalTransactionResponse],
)
def get_goal_transactions(
    goal_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = GoalService(db)

    return service.get_goal_transactions(
        goal_id,
        current_user.id,
    )