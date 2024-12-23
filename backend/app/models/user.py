import uuid
from sqlalchemy import Column, Integer, String, Text, Float, Boolean
from sqlalchemy.ext.declarative import declarative_base

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
