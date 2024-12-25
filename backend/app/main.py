from fastapi import FastAPI, Depends
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