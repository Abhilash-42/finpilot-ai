from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.services.validation import ValidationService
from app.repositories.transaction_repository import TransactionRepository
from app.schemas.transaction import (
    TransactionCreate,
    TransactionUpdate,
)
from app.services.account_balance import AccountBalanceService


class TransactionService:
    def __init__(self, db: Session):
        self.db = db
        self.repository = TransactionRepository(db)

    def create_transaction(
        self,
        user_id: UUID,
        transaction_data: TransactionCreate,
    ):
        account = ValidationService.get_account(
            self.db,
            transaction_data.account_id,
            user_id,
        )

        if transaction_data.category_id:
            ValidationService.get_category(
                self.db,
                transaction_data.category_id,
                user_id,
            )

        try:
            transaction = self.repository.create(
                user_id,
                transaction_data,
            )

            AccountBalanceService.apply_transaction(
                account,
                transaction,
            )

            self.db.commit()

            self.db.refresh(account)
            self.db.refresh(transaction)

            return transaction

        except Exception:
            self.db.rollback()
            raise

    def get_transactions(
        self,
        user_id: UUID,
    ):
        return self.repository.get_all(user_id)

    def get_transaction(
        self,
        transaction_id: UUID,
        user_id: UUID,
    ):
        transaction = self.repository.get_by_id(
            transaction_id,
            user_id,
        )

        if not transaction:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Transaction not found",
            )

        return transaction

    def update_transaction(
        self,
        transaction_id: UUID,
        user_id: UUID,
        transaction_data: TransactionUpdate,
    ):
        transaction = self.get_transaction(
            transaction_id,
            user_id,
        )

        account = transaction.account

        try:
            AccountBalanceService.update_transaction(
                account,
                transaction,
                transaction_data,
            )

            updated_transaction = self.repository.update(
                transaction,
                transaction_data,
            )

            self.db.commit()

            self.db.refresh(account)
            self.db.refresh(updated_transaction)

            return updated_transaction

        except Exception:
            self.db.rollback()
            raise

    def delete_transaction(
        self,
        transaction_id: UUID,
        user_id: UUID,
    ):
        transaction = self.get_transaction(
            transaction_id,
            user_id,
        )

        account = transaction.account

        try:
            AccountBalanceService.reverse_transaction(
                account,
                transaction,
            )

            self.repository.delete(transaction)

            self.db.commit()

        except Exception:
            self.db.rollback()
            raise