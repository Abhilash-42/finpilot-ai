from uuid import UUID

from sqlalchemy.orm import Session

from app.models.account import Account
from app.schemas.account import AccountCreate, AccountUpdate


class AccountRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        user_id: UUID,
        account_data: AccountCreate,
    ) -> Account:
        account = Account(
            user_id=user_id,
            **account_data.model_dump()
        )

        self.db.add(account)
        self.db.flush()
        self.db.refresh(account)

        return account

    def get_all(
        self,
        user_id: UUID,
    ):
        return (
            self.db.query(Account)
            .filter(Account.user_id == user_id)
            .all()
        )

    def get_by_id(
        self,
        account_id: UUID,
        user_id: UUID,
    ):
        return (
            self.db.query(Account)
            .filter(
                Account.id == account_id,
                Account.user_id == user_id,
            )
            .first()
        )

    def update(
        self,
        account: Account,
        account_data: AccountUpdate,
    ):
        update_data = account_data.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(account, key, value)

        self.db.flush()
        self.db.refresh(account)

        return account

    def update_balance(
        self,
        account: Account,
        amount,
    ):
        account.balance = amount

        self.db.flush()
        self.db.refresh(account)

        return account

    def delete(
        self,
        account: Account,
    ):
        self.db.delete(account)
        self.db.flush()