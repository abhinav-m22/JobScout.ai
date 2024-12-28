from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from app.routers import users, ai, snapshot
from fastapi.background import BackgroundTasks
from app.tasks import process_job_roles
from fastapi import Depends
from app.db import get_db
from app.routers.snapshot import SnapshotManager
from sqlalchemy.orm import Session
from typing import List, Dict
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import json
# import openai
from openai import OpenAI
import pdfplumber
import os
from app.models.user import UserRecommendations

app = FastAPI(
    title="Job Role Recommendation System",
    version="1.0.0",
    description="Backend for profile collection and job role recommendations"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(ai.router, prefix="/ai", tags=["AI"])
app.include_router(snapshot.router, prefix="/snapshots", tags=["Snapshots"])

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to the Job Recommendation API"}

@app.get("/health")
async def health():
    return {"status": "ok"}

class JobRequest(BaseModel):
    roles: List[str]
    location: str
    additional_details: Dict
    user_id: str

@app.post("/process-jobs")
async def process_jobs(request: JobRequest, db: Session = Depends(get_db)):
    manager = SnapshotManager(db)
    results = await manager.process_job_roles(
        roles=request.roles,
        location=request.location,
        additional_details=request.additional_details,
        user_id=request.user_id
    )
    return {"results": results}

@app.post("/resume/upload")
async def upload_resume(file: UploadFile = File(...), userId: str = None):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    try:
        # Read PDF content
        content = ""
        with pdfplumber.open(file.file) as pdf:
            for page in pdf.pages:
                content += page.extract_text()

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": """You must respond with only a valid JSON object, no markdown, no code blocks. Extract these fields from the resume:
                    - current_title: string
                    - current_industry: string
                    - experience_years: number
                    - education: array of strings
                    - skills: array of strings
                    - certifications: array of strings (if present)
                    - location: string
                    - phone: string
                    - linkedin: string (if present)
                    - preferred_job_titles: array of strings (determined by you)
                    - preferred_industries: array of strings (determined by you)
                    Only include information explicitly found in the resume."""},
                {"role": "user", "content": content}
            ]
        )
        
        # Get just the content string and parse it directly
        extracted_data = json.loads(response.choices[0].message.content)
        
        # Ensure all expected fields exist, even if empty
        default_fields = {
            "current_title": "",
            "current_industry": "",
            "experience_years": 0,
            "education": [],
            "skills": [],
            "certifications": [],
            "location": "",
            "phone": "",
            "linkedin": ""
        }
        
        # Merge extracted data with defaults
        complete_data = {**default_fields, **extracted_data}
        
        return complete_data

    except json.JSONDecodeError as e:
        print("JSON parsing error:", e)
        print("Raw response:", response.choices[0].message.content)
        raise HTTPException(status_code=500, detail="Failed to parse resume data")
    except Exception as e:
        print("Error processing resume:", str(e))
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/roles/{user_id}")
async def get_user_roles(user_id: str, db: Session = Depends(get_db)):
    # load the user recommendations model
    user_recommendations = db.query(UserRecommendations).filter(UserRecommendations.user_id == user_id).first()
    if user_recommendations:
        return user_recommendations.recommendations