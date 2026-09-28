from uuid import UUID
from datetime import datetime

from sqlalchemy.orm import Session

from app.models.transaction import Transaction
from app.schemas.transaction import TransactionCreate, TransactionUpdate


class TransactionRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, user_id: UUID, transaction_data: TransactionCreate) -> Transaction:
        transaction = Transaction(
            user_id=user_id,
            **transaction_data.model_dump()
        )

        self.db.add(transaction)
        self.db.flush()
        self.db.refresh(transaction)

        return transaction

    def get_all(self, user_id: UUID):
        return (
            self.db.query(Transaction)
            .filter(Transaction.user_id == user_id)
            .order_by(Transaction.transaction_date.desc())
            .all()
        )

    def get_by_id(self, transaction_id: UUID, user_id: UUID):
        return (
            self.db.query(Transaction)
            .filter(
                Transaction.id == transaction_id,
                Transaction.user_id == user_id,
            )
            .first()
        )

    def update(
        self,
        transaction: Transaction,
        transaction_data: TransactionUpdate,
    ):
        update_data = transaction_data.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(transaction, key, value)

        self.db.flush()
        self.db.refresh(transaction)

        return transaction

    def delete(self, transaction: Transaction):
        self.db.delete(transaction)
        self.db.flush()

    def get_by_account(self, account_id: UUID, user_id: UUID):
        return (
            self.db.query(Transaction)
            .filter(
                Transaction.account_id == account_id,
                Transaction.user_id == user_id,
            )
            .order_by(Transaction.transaction_date.desc())
            .all()
        )

    def get_by_category(self, category_id: UUID, user_id: UUID):
        return (
            self.db.query(Transaction)
            .filter(
                Transaction.category_id == category_id,
                Transaction.user_id == user_id,
            )
            .order_by(Transaction.transaction_date.desc())
            .all()
        )

    def get_by_date_range(
        self,
        user_id: UUID,
        start_date: datetime,
        end_date: datetime,
    ):
        return (
            self.db.query(Transaction)
            .filter(
                Transaction.user_id == user_id,
                Transaction.transaction_date >= start_date,
                Transaction.transaction_date <= end_date,
            )
            .order_by(Transaction.transaction_date.desc())
            .all()
        )