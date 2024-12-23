from pydantic import BaseModel, EmailStr
from typing import Optional, List

class UserProfileCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str]
    location: Optional[str]
    current_title: Optional[str]
    employment_type: Optional[str]
    experience_years: Optional[float]
    current_industry: Optional[str]
    education: Optional[str]
    skills: List[str]
    certifications: Optional[List[str]]
    career_goals: Optional[str]
    preferred_job_titles: List[str]
    preferred_industries: Optional[List[str]]
    salary_expectations: Optional[float]
    relocation_willingness: bool
    linkedin: Optional[str]
    portfolio: Optional[str]
    resume_link: Optional[str]
