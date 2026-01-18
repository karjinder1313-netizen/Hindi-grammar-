from fastapi import HTTPException, status
from pydantic import BaseModel, validator
from motor.motor_asyncio import AsyncIOMotorClient
import os
import jwt
from datetime import datetime, timedelta
import bcrypt
import uuid
import re

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'hindi_grammar_db')
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# JWT Configuration
SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
if not SECRET_KEY:
    raise ValueError("JWT_SECRET_KEY environment variable is required for security")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30 * 24 * 60  # 30 days

# Pydantic Models
class UserRegister(BaseModel):
    name: str
    mobile: str
    school: str
    class_name: str
    password: str
    
    @validator('mobile')
    def validate_mobile(cls, v):
        # Indian mobile number validation (10 digits)
        if not re.match(r'^[6-9]\d{9}$', v):
            raise ValueError('मोबाइल नंबर 10 अंकों का होना चाहिए और 6-9 से शुरू होना चाहिए')
        return v
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError('पासवर्ड कम से कम 6 अक्षरों का होना चाहिए')
        return v

class UserLogin(BaseModel):
    mobile: str
    password: str

class User(BaseModel):
    id: str
    name: str
    mobile: str
    school: str
    class_name: str
    created_at: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: User

# Helper Functions
def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_access_token(data: dict):
    """Create JWT access token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str):
    """Decode JWT access token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except jwt.JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate token"
        )

# Auth Service Functions
async def register_user(user_data: UserRegister) -> TokenResponse:
    """Register a new user"""
    # Check if user already exists (optimized query - only check if exists)
    existing_user = await db.users.find_one({"mobile": user_data.mobile}, {"_id": 1})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="यह मोबाइल नंबर पहले से पंजीकृत है"
        )
    
    # Create user document
    user_id = str(uuid.uuid4())
    user_doc = {
        "id": user_id,
        "name": user_data.name,
        "mobile": user_data.mobile,
        "school": user_data.school,
        "class_name": user_data.class_name,
        "password": hash_password(user_data.password),
        "created_at": datetime.utcnow().isoformat()
    }
    
    # Insert user
    await db.users.insert_one(user_doc)
    
    # Create token
    access_token = create_access_token({"sub": user_id, "mobile": user_data.mobile})
    
    # Return user data without password
    user = User(
        id=user_id,
        name=user_data.name,
        mobile=user_data.mobile,
        school=user_data.school,
        class_name=user_data.class_name,
        created_at=user_doc["created_at"]
    )
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=user
    )

async def login_user(login_data: UserLogin) -> TokenResponse:
    """Login user"""
    # Find user by mobile
    user_doc = await db.users.find_one({"mobile": login_data.mobile})
    
    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="मोबाइल नंबर या पासवर्ड गलत है"
        )
    
    # Verify password
    if not verify_password(login_data.password, user_doc["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="मोबाइल नंबर या पासवर्ड गलत है"
        )
    
    # Create token
    access_token = create_access_token({"sub": user_doc["id"], "mobile": user_doc["mobile"]})
    
    # Return user data
    user = User(
        id=user_doc["id"],
        name=user_doc["name"],
        mobile=user_doc["mobile"],
        school=user_doc["school"],
        class_name=user_doc["class_name"],
        created_at=user_doc["created_at"]
    )
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=user
    )

async def get_current_user(token: str) -> User:
    """Get current user from token"""
    payload = decode_access_token(token)
    user_id = payload.get("sub")
    
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    user_doc = await db.users.find_one({"id": user_id})
    
    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    return User(
        id=user_doc["id"],
        name=user_doc["name"],
        mobile=user_doc["mobile"],
        school=user_doc["school"],
        class_name=user_doc["class_name"],
        created_at=user_doc["created_at"]
    )
