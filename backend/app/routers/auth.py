from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.security import (
    create_access_token,
    get_password_hash,
    verify_password,
)
from app.database import get_db
from app.deps import get_current_user
from app.models import User
from app.schemas import (
    LoginPayload,
    Token,
    UserCreate,
    UserOut,
    UserUpdate,
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentification"],
)


@router.post(
    "/register",
    response_model=UserOut,
    status_code=201,
)
def register(
    payload: UserCreate,
    db: Session = Depends(get_db),
):
    email = payload.email.strip().lower()

    existing_user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email déjà utilisé",
        )

    user = User(
        name=payload.name.strip(),
        email=email,
        hashed_password=get_password_hash(payload.password),
        district=payload.district,
        dietary_preferences=payload.dietary_preferences,
        allergies=payload.allergies,
        role="user",
        is_active=True,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


@router.post(
    "/login",
    response_model=Token,
)
def login(
    payload: LoginPayload,
    db: Session = Depends(get_db),
):
    email = payload.email.strip().lower()

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if not user or not verify_password(
        payload.password,
        user.hashed_password,
    ):
        raise HTTPException(
            status_code=400,
            detail="Email ou mot de passe incorrect",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=403,
            detail="Ce compte a été bloqué par un administrateur",
        )

    return Token(
        access_token=create_access_token(str(user.id)),
    )


@router.post(
    "/login-form",
    response_model=Token,
)
def login_form(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    email = form_data.username.strip().lower()

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if not user or not verify_password(
        form_data.password,
        user.hashed_password,
    ):
        raise HTTPException(
            status_code=400,
            detail="Email ou mot de passe incorrect",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=403,
            detail="Ce compte a été bloqué par un administrateur",
        )

    return Token(
        access_token=create_access_token(str(user.id)),
    )


@router.get(
    "/me",
    response_model=UserOut,
)
def me(
    current_user: User = Depends(get_current_user),
):
    return current_user


@router.patch(
    "/me",
    response_model=UserOut,
)
def update_me(
    payload: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    allowed_fields = {
        "name",
        "district",
        "dietary_preferences",
        "allergies",
    }

    update_data = payload.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        if field in allowed_fields:
            setattr(current_user, field, value)

    db.commit()
    db.refresh(current_user)

    return current_user
