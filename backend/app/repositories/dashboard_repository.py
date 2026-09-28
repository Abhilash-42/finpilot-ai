from collections import defaultdict
from decimal import Decimal

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.enums import TransactionType
from app.models.account import Account
from app.models.category import Category
from app.models.transaction import Transaction


class DashboardRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_summary(self, user_id):
        total_balance = (
            self.db.query(func.coalesce(func.sum(Account.balance), 0))
            .filter(Account.user_id == user_id)
            .scalar()
        )

        total_income = (
            self.db.query(func.coalesce(func.sum(Transaction.amount), 0))
            .filter(
                Transaction.user_id == user_id,
                Transaction.transaction_type == TransactionType.INCOME,
            )
            .scalar()
        )

        total_expense = (
            self.db.query(func.coalesce(func.sum(Transaction.amount), 0))
            .filter(
                Transaction.user_id == user_id,
                Transaction.transaction_type == TransactionType.EXPENSE,
            )
            .scalar()
        )

        total_accounts = (
            self.db.query(Account)
            .filter(Account.user_id == user_id)
            .count()
        )

        total_transactions = (
            self.db.query(Transaction)
            .filter(Transaction.user_id == user_id)
            .count()
        )

        total_categories = (
            self.db.query(Category)
            .filter(Category.user_id == user_id)
            .count()
        )

        return {
            "total_balance": Decimal(total_balance),
            "total_income": Decimal(total_income),
            "total_expense": Decimal(total_expense),
            "net_savings": Decimal(total_income) - Decimal(total_expense),
            "total_accounts": total_accounts,
            "total_transactions": total_transactions,
            "total_categories": total_categories,
        }

    def get_monthly_analytics(self, user_id):
        transactions = (
            self.db.query(Transaction)
            .filter(Transaction.user_id == user_id)
            .all()
        )

        monthly_data = defaultdict(
            lambda: {
                "income": Decimal("0"),
                "expense": Decimal("0"),
            }
        )

        month_names = [
            "",
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ]

        for transaction in transactions:
            month = month_names[transaction.transaction_date.month]

            if transaction.transaction_type == TransactionType.INCOME:
                monthly_data[month]["income"] += Decimal(transaction.amount)

            elif transaction.transaction_type == TransactionType.EXPENSE:
                monthly_data[month]["expense"] += Decimal(transaction.amount)

        result = []

        for month in month_names[1:]:
            result.append(
                {
                    "month": month,
                    "income": monthly_data[month]["income"],
                    "expense": monthly_data[month]["expense"],
                }
            )

        return result
    def get_category_analysis(self, user_id):
        results = (
        self.db.query(
            Category.name.label("category"),
            func.coalesce(func.sum(Transaction.amount), 0).label("amount"),
        )
        .join(
            Transaction,
            Transaction.category_id == Category.id,
        )
        .filter(
            Transaction.user_id == user_id,
            Transaction.transaction_type == TransactionType.EXPENSE,
        )
        .group_by(Category.name)
        .order_by(func.sum(Transaction.amount).desc())
        .all()
    )

        return [
        {
            "category": row.category,
            "amount": Decimal(row.amount),
        }
        for row in results
    ]

    def get_recent_transactions(self, user_id, limit=5):
         transactions = (
        self.db.query(Transaction)
        .filter(Transaction.user_id == user_id)
        .order_by(Transaction.transaction_date.desc())
        .limit(limit)
        .all()
         ) 

         return [
        {
            "id": transaction.id,
            "description": transaction.description,
            "amount": Decimal(transaction.amount),
            "transaction_type": transaction.transaction_type.value,
            "transaction_date": transaction.transaction_date,
            "account_name": transaction.account.name,
            "category_name": (
                transaction.category.name
                if transaction.category
                else None
            ),
        }
        for transaction in transactions
    ]