from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repositories.account_repository import AccountRepository
from app.schemas.account import AccountCreate, AccountUpdate


class AccountService:
    def __init__(self, db: Session):
        self.db = db
        self.repository = AccountRepository(db)

    def create_account(
        self,
        user_id: UUID,
        account_data: AccountCreate,
    ):
        try:
            account = self.repository.create(
                user_id,
                account_data,
            )

            self.db.commit()
            self.db.refresh(account)

            return account

        except Exception:
            self.db.rollback()
            raise

    def get_accounts(
        self,
        user_id: UUID,
    ):
        return self.repository.get_all(user_id)

    def get_account(
        self,
        account_id: UUID,
        user_id: UUID,
    ):
        account = self.repository.get_by_id(
            account_id,
            user_id,
        )

        if not account:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Account not found.",
            )

        return account

    def update_account(
        self,
        account_id: UUID,
        user_id: UUID,
        account_data: AccountUpdate,
    ):
        account = self.get_account(
            account_id,
            user_id,
        )

        try:
            account = self.repository.update(
                account,
                account_data,
            )

            self.db.commit()
            self.db.refresh(account)

            return account

        except Exception:
            self.db.rollback()
            raise

    def delete_account(
        self,
        account_id: UUID,
        user_id: UUID,
    ):
        account = self.get_account(
            account_id,
            user_id,
        )

        try:
            self.repository.delete(account)
            self.db.commit()

            return {
                "message": "Account deleted successfully."
            }

        except Exception:
            self.db.rollback()
            raise