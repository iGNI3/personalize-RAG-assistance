from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.auth.service import verify_token, get_user_by_username_or_email
from app.auth.models import User, UserRole

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    token_data = verify_token(token)
    if token_data is None:
        raise credentials_exception
        
    if token_data.is_guest or token_data.role == "guest":
        return User(
            username=token_data.username,
            role=UserRole.guest,
            full_name="Guest User",
            email=None,
            auth_provider="guest",
            is_guest=True
        )
        
    user_db = get_user_by_username_or_email(token_data.username)
    if not user_db:
        raise credentials_exception
        
    return User(
        username=user_db.username,
        role=user_db.role,
        full_name=user_db.full_name,
        email=user_db.email,
        auth_provider=user_db.auth_provider,
        is_guest=False
    )

def require_role(*roles: str):
    def role_checker(current_user: User = Depends(get_current_user)):
        role_val = current_user.role.value if hasattr(current_user.role, "value") else current_user.role
        if role_val not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operation not permitted. Required roles: {', '.join(roles)}"
            )
        return current_user
    return role_checker
