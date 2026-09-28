from sqlalchemy.orm import Session

from app.services.validation import ValidationService


class TransferService:
    def __init__(self, db: Session):
        self.db = db

    def validate_accounts(
        self,
        user_id,
        from_account_id,
        to_account_id,
    ):
        from_account = ValidationService.get_account(
            self.db,
            from_account_id,
            user_id,
        )

        to_account = ValidationService.get_account(
            self.db,
            to_account_id,
            user_id,
        )

        return from_account, to_account