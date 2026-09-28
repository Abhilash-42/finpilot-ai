from sqlalchemy.orm import Session

from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
)
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    TokenResponse,
)


class AuthService:

    @staticmethod
    def register(
        db: Session,
        user_data: RegisterRequest,
    ) -> User:

        existing_user = UserRepository.get_by_email(
            db,
            user_data.email,
        )

        if existing_user:
            raise ValueError("Email is already registered.")

        user = User(
            full_name=user_data.full_name,
            email=user_data.email,
            password_hash=hash_password(user_data.password),
        )

        return UserRepository.create(db, user)

    @staticmethod
    def login(
        db: Session,
        credentials: LoginRequest,
    ) -> TokenResponse:

        user = UserRepository.get_by_email(
            db,
            credentials.email,
        )

        if not user:
            raise ValueError("Invalid email or password.")

        if not verify_password(
            credentials.password,
            user.password_hash,
        ):
            raise ValueError("Invalid email or password.")

        access_token = create_access_token(
            subject=str(user.id),
        )

        return TokenResponse(
            access_token=access_token,
        )