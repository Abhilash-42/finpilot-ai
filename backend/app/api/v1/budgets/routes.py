from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.budget import (
    BudgetCreate,
    BudgetResponse,
    BudgetUpdate,
    BudgetStatus,
    BudgetAlert,
)
from app.services.budget import BudgetService

router = APIRouter(
    prefix="/budgets",
    tags=["Budgets"],
)


@router.post(
    "",
    response_model=BudgetResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_budget(
    budget_data: BudgetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = BudgetService(db)

    return service.create_budget(
        current_user.id,
        budget_data,
    )


@router.get(
    "",
    response_model=list[BudgetResponse],
)
def get_budgets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = BudgetService(db)

    return service.get_budgets(current_user.id)


# ⭐ IMPORTANT: Keep this BEFORE "/{budget_id}"
@router.get(
    "/status",
    response_model=list[BudgetStatus],
)
def budget_status(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = BudgetService(db)

    return service.get_budget_status(
        current_user.id,
    )

@router.get(
    "/alerts",
    response_model=list[BudgetAlert],
)
def budget_alerts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = BudgetService(db)

    return service.get_budget_alerts(
        current_user.id,
    )


@router.get(
    "/{budget_id}",
    response_model=BudgetResponse,
)
def get_budget(
    budget_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = BudgetService(db)

    return service.get_budget(
        budget_id,
        current_user.id,
    )


@router.put(
    "/{budget_id}",
    response_model=BudgetResponse,
)
def update_budget(
    budget_id: UUID,
    budget_data: BudgetUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = BudgetService(db)

    return service.update_budget(
        budget_id,
        current_user.id,
        budget_data,
    )


@router.delete(
    "/{budget_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_budget(
    budget_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = BudgetService(db)

    service.delete_budget(
        budget_id,
        current_user.id,
    )