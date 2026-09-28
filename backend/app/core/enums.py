from enum import Enum


class AccountType(str, Enum):
    SAVINGS = "Savings"
    CURRENT = "Current"
    CASH = "Cash"
    CREDIT_CARD = "Credit Card"
    INVESTMENT = "Investment"
    E_WALLET = "E-Wallet"


class CategoryType(str, Enum):
    INCOME = "Income"
    EXPENSE = "Expense"

class TransactionType(str, Enum):
    INCOME = "Income"
    EXPENSE = "Expense"
    TRANSFER = "Transfer"

class GoalTransactionType(str, Enum):
    DEPOSIT = "DEPOSIT"
    WITHDRAW = "WITHDRAW"