from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.auth.models import (
    LoginRequest, LoginResponse, User, RegisterRequest, 
    GoogleLoginRequest, UserRole
)
from app.auth.service import (
    authenticate_user, create_access_token, register_new_user,
    authenticate_google_user, create_guest_user
)
from app.auth.dependencies import get_current_user

router = APIRouter()

@router.post("/login", response_model=LoginResponse)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username/email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    role_val = user.role.value if hasattr(user.role, "value") else user.role
    access_token = create_access_token(
        data={"sub": user.username, "role": role_val, "is_guest": False}
    )
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        user=user
    )

@router.post("/register", response_model=LoginResponse)
async def register(payload: RegisterRequest):
    user, err = register_new_user(payload)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=err
        )
    role_val = user.role.value if hasattr(user.role, "value") else user.role
    access_token = create_access_token(
        data={"sub": user.username, "role": role_val, "is_guest": False}
    )
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        user=user
    )

@router.post("/google-login", response_model=LoginResponse)
async def google_login(payload: GoogleLoginRequest):
    user = authenticate_google_user(payload)
    role_val = user.role.value if hasattr(user.role, "value") else user.role
    access_token = create_access_token(
        data={"sub": user.username, "role": role_val, "is_guest": False}
    )
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        user=user
    )

@router.post("/guest-login", response_model=LoginResponse)
async def guest_login():
    user = create_guest_user()
    access_token = create_access_token(
        data={"sub": user.username, "role": "guest", "is_guest": True}
    )
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        user=user
    )

@router.get("/me", response_model=User)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user
