import uuid
from sqlalchemy import Column, Integer, String, Text, Float, Boolean, ARRAY
from sqlalchemy.ext.declarative import declarative_base
from pydantic import BaseModel
from typing import Optional

Base = declarative_base()

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, nullable=True)
    location = Column(String, nullable=True)
    current_title = Column(String, nullable=True)
    employment_type = Column(String, nullable=True)
    experience_years = Column(Float, nullable=True)
    current_industry = Column(String, nullable=True)
    education = Column(Text, nullable=True)
    skills = Column(Text, nullable=True)
    certifications = Column(Text, nullable=True)
    career_goals = Column(Text, nullable=True)
    preferred_job_titles = Column(Text, nullable=True)
    preferred_industries = Column(Text, nullable=True)
    salary_expectations = Column(Float, nullable=True)
    relocation_willingness = Column(Boolean, default=False)
    linkedin = Column(String, nullable=True)
    portfolio = Column(String, nullable=True)
    resume_link = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)

class UserRecommendations(Base):
    __tablename__ = "user_recommendations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, nullable=False)  # Assume user_id is a string
    recommendations = Column(ARRAY(String), nullable=False)  
    
class UserCreate(BaseModel):
    email: str
    password: str
    name: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str

class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    current_title: Optional[str] = None
    employment_type: Optional[str] = None
    experience_years: Optional[float] = None
    current_industry: Optional[str] = None
    education: Optional[str] = None
    skills: Optional[str] = None
    certifications: Optional[str] = None
    career_goals: Optional[str] = None
    preferred_job_titles: Optional[str] = None
    preferred_industries: Optional[str] = None
    salary_expectations: Optional[float] = None
    relocation_willingness: Optional[bool] = None
    linkedin: Optional[str] = None
    portfolio: Optional[str] = None
    resume_link: Optional[str] = None
