from decimal import Decimal

from sqlalchemy import Enum, ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.enums import GoalTransactionType
from app.models.base import BaseModel


class GoalTransaction(BaseModel):
    __tablename__ = "goal_transactions"

    goal_id: Mapped[str] = mapped_column(
        ForeignKey("goals.id", ondelete="CASCADE"),
        nullable=False,
    )

    account_id: Mapped[str] = mapped_column(
        ForeignKey("accounts.id", ondelete="CASCADE"),
        nullable=False,
    )

    transaction_type: Mapped[GoalTransactionType] = mapped_column(
        Enum(GoalTransactionType),
        nullable=False,
    )

    amount: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
    )

    note: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    goal: Mapped["Goal"] = relationship(
        "Goal",
        back_populates="transactions",
    )

    account: Mapped["Account"] = relationship(
        "Account",
    )