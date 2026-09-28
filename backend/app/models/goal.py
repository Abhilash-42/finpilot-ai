from datetime import date
from decimal import Decimal

from sqlalchemy import Date, ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel


class Goal(BaseModel):
    __tablename__ = "goals"

    user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    target_amount: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
    )

    saved_amount: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        default=0,
        nullable=False,
    )

    target_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    user: Mapped["User"] = relationship(
        "User",
        back_populates="goals",
        lazy="selectin",
    )

    transactions: Mapped[list["GoalTransaction"]] = relationship(
    "GoalTransaction",
    back_populates="goal",
    cascade="all, delete-orphan",
    lazy="selectin",
    )