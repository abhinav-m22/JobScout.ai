# app/tasks.py
import requests
import logging
from app.models.snapshot import Snapshot
from app.db import get_db
from sqlalchemy.orm import Session
import os
from typing import List, Dict
from fastapi import Depends

API_TOKEN = os.getenv("BRIGHTDATA_API_TOKEN")

LINKEDIN_URL = "https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_lpfll7v5hcqtkxl6l&include_errors=true&type=discover_new&discover_by=keyword"
GLASSDOOR_URL = "https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_lpfbbndm1xnopbrcr0&include_errors=true&type=discover_new&discover_by=keyword"
INDEED_URL = "https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_l7qekxkv2i7ve6hx1s&include_errors=true&type=discover_new&discover_by=keyword"

HEADERS = {
    "Authorization": f"Bearer {API_TOKEN}",
    "Content-Type": "application/json",
}

def call_brightdata_api(url: str, payload: list, platform: str, role: str, db: Session):
    try:
        response = requests.post(url, json=payload, headers=HEADERS)
        response.raise_for_status()
        snapshot_id = response.json().get("snapshot_id")

        snapshot = Snapshot(
            role=role,
            platform=platform,
            snapshot_id=snapshot_id,
            payload=payload
        )
        
        db.add(snapshot)
        db.commit()
        db.refresh(snapshot)
        
        logging.info(f"Snapshot for {platform} ({role}) created: {snapshot_id}")
    except Exception as e:
        logging.error(f"Failed to create snapshot for {platform} ({role}): {str(e)}")


def process_job_roles(roles: List[str], location: str, additional_details: Dict):
    for role in roles:
        linkedin_payload = [
            {
                "location": location,
                "keyword": role,
                "country": additional_details.get("country", ""),
                "time_range": additional_details.get("time_range", "Any time"),
                "job_type": additional_details.get("job_type", ""),
                "experience_level": additional_details.get("experience_level", ""),
                "remote": additional_details.get("remote", ""),
                "company": additional_details.get("company", "")
            }
        ]
        
        glassdoor_payload = [
            {
                "location": location,
                "keyword": role,
                "country": additional_details.get("country", "")
            }
        ]

        indeed_payload = [
            {
                "keyword": role
            }
        ]
        
        db = next(get_db())

        call_brightdata_api(LINKEDIN_URL, linkedin_payload, "LinkedIn", role, db)
        call_brightdata_api(GLASSDOOR_URL, glassdoor_payload, "Glassdoor", role, db)
        call_brightdata_api(INDEED_URL, indeed_payload, "Indeed", role, db)
