from sqlalchemy import Boolean, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import BaseModel

class User(BaseModel):
    __tablename__ = "users"

    # -------------------------
    # Basic Information
    # -------------------------

    full_name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
    )

    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    phone: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True,
    )

    avatar_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    # -------------------------
    # Preferences
    # -------------------------

    currency: Mapped[str] = mapped_column(
        String(10),
        default="INR",
    )

    timezone: Mapped[str] = mapped_column(
        String(50),
        default="Asia/Kolkata",
    )

    language: Mapped[str] = mapped_column(
        String(10),
        default="en",
    )

    # -------------------------
    # Status
    # -------------------------

    is_verified: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
    )

    accounts: Mapped[list["Account"]] = relationship(
    "Account",
    back_populates="user",
    cascade="all, delete-orphan",
    lazy="selectin",
     )

    categories: Mapped[list["Category"]] = relationship(
    "Category",
    back_populates="user",
    cascade="all, delete-orphan",
    lazy="selectin",
     )

    transactions: Mapped[list["Transaction"]] = relationship(
    "Transaction",
    back_populates="user",
    cascade="all, delete-orphan",
    lazy="selectin",
     )

    budgets: Mapped[list["Budget"]] = relationship(
    "Budget",
    back_populates="user",
    cascade="all, delete-orphan",
    lazy="selectin",
    )

    goals: Mapped[list["Goal"]] = relationship(
    "Goal",
    back_populates="user",
    cascade="all, delete-orphan",
    lazy="selectin",
)