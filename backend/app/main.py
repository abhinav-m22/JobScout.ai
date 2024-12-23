from fastapi import FastAPI
from app.routers import users, ai

app = FastAPI(
    title="Job Role Recommendation System",
    version="1.0.0",
    description="Backend for profile collection and job role recommendations"
)

app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(ai.router, prefix="/ai", tags=["AI"])

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to the Job Recommendation API"}
