from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.user import UserProfile
from app.schemas.user import UserProfileCreate

router = APIRouter()

@router.post("/")
def create_user_profile(user: UserProfileCreate, db: Session = Depends(get_db)):
    # Save user data in the database
    db_user = UserProfile(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"message": "User profile created successfully", "user_id": db_user.id}