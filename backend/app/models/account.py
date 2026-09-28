from sqlalchemy import String, ForeignKey, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.base import BaseModel

class Account(BaseModel):
    __tablename__ = "accounts"

    user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    account_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False
    )

    balance: Mapped[float] = mapped_column(
        Numeric(12, 2),
        default=0
    )

    currency: Mapped[str] = mapped_column(
        String(10),
        default="INR"
    )

    user: Mapped["User"] = relationship(
    "User",
    back_populates="accounts",
    lazy="selectin",
     )

    transactions: Mapped[list["Transaction"]] = relationship(
    "Transaction",
    back_populates="account",
    cascade="all, delete-orphan",
    lazy="selectin",
     )