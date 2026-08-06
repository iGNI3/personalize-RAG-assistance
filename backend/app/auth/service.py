from datetime import datetime, timedelta
from jose import jwt, JWTError
import bcrypt
import uuid
from typing import Optional, Tuple
from app.config import settings
from app.auth.models import UserInDB, User, TokenData, RegisterRequest, GoogleLoginRequest, UserRole
from app.db import get_db_connection

def get_password_hash(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    if not hashed_password:
        return False
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def seed_default_users():
    conn = get_db_connection()
    cursor = conn.cursor()
    default_users = [
        ("admin", "admin@rag-os.com", "Admin User", "admin", "admin123", "local"),
        ("analyst", "analyst@rag-os.com", "Data Analyst", "analyst", "analyst123", "local"),
        ("viewer", "viewer@rag-os.com", "Report Viewer", "viewer", "viewer123", "local")
    ]
    for uname, email, fname, role, pwd, provider in default_users:
        cursor.execute("SELECT username FROM users WHERE username = ?", (uname,))
        if not cursor.fetchone():
            hashed_pwd = get_password_hash(pwd)
            cursor.execute(
                "INSERT INTO users (username, email, full_name, role, hashed_password, auth_provider, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
                (uname, email, fname, role, hashed_pwd, provider, datetime.utcnow().isoformat())
            )
    conn.commit()
    conn.close()

def get_user_by_username_or_email(identifier: str) -> Optional[UserInDB]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE username = ? OR email = ?", (identifier, identifier))
    row = cursor.fetchone()
    conn.close()
    if row:
        return UserInDB(
            username=row["username"],
            email=row["email"],
            full_name=row["full_name"],
            role=UserRole(row["role"]),
            hashed_password=row["hashed_password"],
            auth_provider=row["auth_provider"],
            is_guest=False
        )
    return None

def authenticate_user(username_or_email: str, password: str) -> Optional[User]:
    user = get_user_by_username_or_email(username_or_email)
    if not user or not user.hashed_password:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return User(
        username=user.username,
        role=user.role,
        full_name=user.full_name,
        email=user.email,
        auth_provider=user.auth_provider,
        is_guest=False
    )

def register_new_user(data: RegisterRequest) -> Tuple[Optional[User], str]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT username FROM users WHERE username = ?", (data.username,))
    if cursor.fetchone():
        conn.close()
        return None, "Username already taken"
    cursor.execute("SELECT email FROM users WHERE email = ?", (data.email,))
    if cursor.fetchone():
        conn.close()
        return None, "Email address already registered"
        
    hashed_pwd = get_password_hash(data.password)
    created_at = datetime.utcnow().isoformat()
    cursor.execute(
        "INSERT INTO users (username, email, full_name, role, hashed_password, auth_provider, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
        (data.username, data.email, data.full_name, data.role.value if hasattr(data.role, "value") else data.role, hashed_pwd, "local", created_at)
    )
    conn.commit()
    conn.close()
    
    user = User(
        username=data.username,
        role=data.role,
        full_name=data.full_name,
        email=data.email,
        auth_provider="local",
        is_guest=False
    )
    return user, "Success"

def authenticate_google_user(data: GoogleLoginRequest) -> User:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (data.email,))
    row = cursor.fetchone()
    if row:
        conn.close()
        return User(
            username=row["username"],
            role=UserRole(row["role"]),
            full_name=row["full_name"],
            email=row["email"],
            auth_provider=row["auth_provider"],
            is_guest=False
        )
        
    base_username = data.email.split('@')[0].lower()
    clean_username = "".join(e for e in base_username if e.isalnum())
    username = clean_username
    counter = 1
    while True:
        cursor.execute("SELECT username FROM users WHERE username = ?", (username,))
        if not cursor.fetchone():
            break
        username = f"{clean_username}{counter}"
        counter += 1
        
    created_at = datetime.utcnow().isoformat()
    cursor.execute(
        "INSERT INTO users (username, email, full_name, role, hashed_password, auth_provider, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
        (username, data.email, data.full_name, UserRole.analyst.value, "", "google", created_at)
    )
    conn.commit()
    conn.close()
    
    return User(
        username=username,
        role=UserRole.analyst,
        full_name=data.full_name,
        email=data.email,
        auth_provider="google",
        is_guest=False
    )

def create_guest_user() -> User:
    guest_id = uuid.uuid4().hex[:6]
    return User(
        username=f"guest_{guest_id}",
        role=UserRole.guest,
        full_name="Guest User",
        email=None,
        auth_provider="guest",
        is_guest=True
    )

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.JWT_EXPIRY_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> Optional[TokenData]:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        username: str = payload.get("sub")
        role: str = payload.get("role")
        is_guest: bool = payload.get("is_guest", False)
        if username is None or role is None:
            return None
        return TokenData(username=username, role=role, is_guest=is_guest)
    except JWTError:
        return None
