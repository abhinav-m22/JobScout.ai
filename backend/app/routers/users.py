from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.user import UserProfile, UserCreate, UserResponse, UserProfileUpdate
from app.schemas.user import UserProfileCreate
import os
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from datetime import datetime, timedelta
import uuid
from sqlalchemy.exc import IntegrityError

router = APIRouter()

@router.post("/")
def create_user_profile(user: UserProfileCreate, db: Session = Depends(get_db)):
    # Save user data in the database
    db_user = UserProfile(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"message": "User profile created successfully", "user_id": db_user.id}

SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 3*24*60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(UserProfile).filter(UserProfile.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user

@router.post("/auth/register")
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    try:
        user = UserProfile(
            id=str(uuid.uuid4()),
            email=user_data.email,
            name=user_data.name,
            hashed_password=get_password_hash(user_data.password)
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
        access_token = create_access_token(data={"sub": user.id})
        return {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "access_token": access_token,
            "is_profile_complete": user.is_profile_complete
        }
    except IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

@router.post("/auth/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(UserProfile).filter(UserProfile.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.id})
    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "access_token": access_token,
        "is_profile_complete": user.is_profile_complete
    }

@router.post("/auth/logout")
async def logout():
    return {"message": "Successfully logged out"}

@router.get("/auth/me", response_model=UserResponse)
async def read_users_me(current_user: UserProfile = Depends(get_current_user)):
    return current_user

@router.get("/profile/{user_id}")
async def get_profile(user_id: str, current_user: UserProfile = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to view this profile")
    return current_user

@router.patch("/profile/{user_id}")
async def update_profile(
    user_id: str,
    profile_data: UserProfileUpdate,
    current_user: UserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this profile")
    
    for field, value in profile_data.dict(exclude_unset=True).items():
        setattr(current_user, field, value)
        current_user.is_profile_complete = True
    
    db.commit()
    db.refresh(current_user)
    return current_user