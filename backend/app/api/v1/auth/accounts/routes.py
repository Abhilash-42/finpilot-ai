from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.account import (
    AccountCreate,
    AccountUpdate,
    AccountResponse,
)
from app.services.account import AccountService

router = APIRouter(
    prefix="/accounts",
    tags=["Accounts"],
)


@router.post(
    "",
    response_model=AccountResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_account(
    account: AccountCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = AccountService(db)

    return service.create_account(
        current_user.id,
        account,
    )


@router.get(
    "",
    response_model=list[AccountResponse],
)
def get_accounts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = AccountService(db)

    return service.get_accounts(
        current_user.id,
    )


@router.get(
    "/{account_id}",
    response_model=AccountResponse,
)
def get_account(
    account_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = AccountService(db)

    return service.get_account(
        account_id,
        current_user.id,
    )


@router.put(
    "/{account_id}",
    response_model=AccountResponse,
)
def update_account(
    account_id: UUID,
    account: AccountUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = AccountService(db)

    return service.update_account(
        account_id,
        current_user.id,
        account,
    )


@router.delete(
    "/{account_id}",
)
def delete_account(
    account_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = AccountService(db)

    return service.delete_account(
        account_id,
        current_user.id,
    )