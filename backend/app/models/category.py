from sqlalchemy import Boolean, Enum, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.enums import CategoryType
from app.models.base import BaseModel


class Category(BaseModel):
    __tablename__ = "categories"

    user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    type: Mapped[CategoryType] = mapped_column(
        Enum(CategoryType),
        nullable=False,
    )

    color: Mapped[str] = mapped_column(
        String(20),
        default="#2196F3",
    )

    icon: Mapped[str] = mapped_column(
        String(50),
        default="category",
    )

    is_default: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
    )

    user: Mapped["User"] = relationship(
        "User",
        back_populates="categories",
        lazy="selectin",
    )

    transactions: Mapped[list["Transaction"]] = relationship(
    "Transaction",
    back_populates="category",
    lazy="selectin",
     )

    budgets = relationship(
    "Budget",
    back_populates="category",
    lazy="selectin",
     )