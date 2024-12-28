from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.user import UserRecommendations 
from openai import OpenAI
import os
from app.models.snapshot import Snapshot

router = APIRouter()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class AIRequest(BaseModel):
    user_id: str
    user_profile: dict

@router.post("/recommend")
async def recommend_job_roles(request: AIRequest, db: Session = Depends(get_db)):
    try:
        # Constructing the prompt
        prompt = f"""
        Based on the following user profile, recommend **only applicable job roles**:
        - Name: {request.user_profile.get('name', 'N/A')}
        - Skills: {', '.join(request.user_profile.get('skills', []))}
        - Experience: {request.user_profile.get('experience', 'N/A')} years
        - Education: {request.user_profile.get('education', 'N/A')}
        - Certifications: {', '.join(request.user_profile.get('certifications', []))}
        - Location: {request.user_profile.get('location', 'N/A')}
        - Desired role: {request.user_profile.get('desired_role', 'N/A')}
        """

        # Call the OpenAI API
        completion = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a job recommendation assistant. Your task is to analyze user profiles and recommend the top 3 applicable job roles. Only return job roles without any additional explanation. Example Output: [Job Role 1, Job Role 2, Job Role 3]"},
                {"role": "user", "content": prompt},
            ]
        )
        print("Response: ", completion.choices[0].message.content)

        recommendations = completion.choices[0].message.content.strip("[]").replace("'", "").replace('"', "").split(", ")

        existing_recommendation = db.query(UserRecommendations).filter(UserRecommendations.user_id == request.user_id).first()
        
        if existing_recommendation:
            existing_recommendation.recommendations = recommendations
            db.commit()
            db.refresh(existing_recommendation)
        else:
            new_recommendation = UserRecommendations(
            user_id=request.user_id,
            recommendations=recommendations
            )
            db.add(new_recommendation)
            db.commit()
            db.refresh(new_recommendation)
            
        existing_snapshots = db.query(Snapshot).filter(Snapshot.role.in_(recommendations)).all()
        if existing_snapshots:
            for snapshot in existing_snapshots:
                new_snapshot = Snapshot(
                    user_id=request.user_id,
                    role=snapshot.role,
                    platform=snapshot.platform,
                    snapshot_id=snapshot.snapshot_id,
                )
                db.add(new_snapshot)    
            db.commit()
            db.refresh(new_snapshot)

        return {"user_id": request.user_id, "recommendations": recommendations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
