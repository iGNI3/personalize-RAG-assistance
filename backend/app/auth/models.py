from pydantic import BaseModel
from enum import Enum
from typing import Optional

class UserRole(str, Enum):
    admin = "admin"
    analyst = "analyst"
    viewer = "viewer"
    guest = "guest"

class User(BaseModel):
    username: str
    role: UserRole
    full_name: str
    email: Optional[str] = None
    auth_provider: str = "local"
    is_guest: bool = False

class UserInDB(User):
    hashed_password: Optional[str] = None

class LoginRequest(BaseModel):
    username: str
    password: str

class RegisterRequest(BaseModel):
    username: str
    email: str
    full_name: str
    password: str
    role: UserRole = UserRole.analyst

class GoogleLoginRequest(BaseModel):
    email: str
    full_name: str
    google_token: Optional[str] = None
    picture: Optional[str] = None

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: User

class TokenData(BaseModel):
    username: str
    role: str
    is_guest: bool = False
