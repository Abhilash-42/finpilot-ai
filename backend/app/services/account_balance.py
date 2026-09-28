from decimal import Decimal

from app.core.enums import TransactionType
from app.models.account import Account
from app.models.transaction import Transaction


class AccountBalanceService:

    @staticmethod
    def apply_transaction(
        account: Account,
        transaction: Transaction,
    ) -> None:
        """
        Apply a transaction to an account balance.
        """

        amount = Decimal(transaction.amount)

        if transaction.transaction_type == TransactionType.INCOME:
            account.balance += amount

        elif transaction.transaction_type == TransactionType.EXPENSE:
            account.balance -= amount

        elif transaction.transaction_type == TransactionType.TRANSFER:
            # Transfer logic will be implemented later.
            pass

    @staticmethod
    def reverse_transaction(
        account: Account,
        transaction: Transaction,
    ) -> None:
        """
        Reverse an existing transaction from an account balance.
        """

        amount = Decimal(transaction.amount)

        if transaction.transaction_type == TransactionType.INCOME:
            account.balance -= amount

        elif transaction.transaction_type == TransactionType.EXPENSE:
            account.balance += amount

        elif transaction.transaction_type == TransactionType.TRANSFER:
            pass
    @staticmethod
    def update_transaction(
        account,
        old_transaction,
        new_transaction_data,
    ):

        AccountBalanceService.reverse_transaction(
        account,
        old_transaction,
    )

    # Temporarily update values
        if new_transaction_data.amount is not None:
         old_transaction.amount = new_transaction_data.amount

        if new_transaction_data.transaction_type is not None:
         old_transaction.transaction_type = (
            new_transaction_data.transaction_type
        )

        AccountBalanceService.apply_transaction(
        account,
        old_transaction,
    )