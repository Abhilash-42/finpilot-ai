from sqlalchemy.orm import Session

from app.repositories.transaction_repository import TransactionRepository
from app.services.account_balance import AccountBalanceService
from app.services.validation import ValidationService


class TransactionManager:
    def __init__(self, db: Session):
        self.db = db
        self.transaction_repository = TransactionRepository(db)

    def create_transaction(
        self,
        user_id,
        transaction_data,
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

        transaction = self.transaction_repository.create(
            user_id,
            transaction_data,
        )

        AccountBalanceService.apply_transaction(
            account,
            transaction,
        )

        return transaction

    def commit(self):
        self.db.commit()

    def rollback(self):
        self.db.rollback()