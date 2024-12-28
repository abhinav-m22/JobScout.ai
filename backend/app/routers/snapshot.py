from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session
import logging
import time
from typing import Dict, List, Optional
from app.models.snapshot import Snapshot
from app.db import get_db
import requests
import os
from sqlalchemy.dialects.postgresql import JSONB
import boto3
from botocore.exceptions import ClientError
import json
from botocore.config import Config

API_TOKEN = os.getenv("BRIGHTDATA_API_TOKEN")

LINKEDIN_URL = "https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_lpfll7v5hcqtkxl6l&include_errors=true&type=discover_new&discover_by=keyword"
GLASSDOOR_URL = "https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_lpfbbndm1xnopbrcr0&include_errors=true&type=discover_new&discover_by=keyword"
INDEED_URL = "https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_l7qekxkv2i7ve6hx1s&include_errors=true&type=discover_new&discover_by=keyword"

HEADERS = {
    "Authorization": f"Bearer {API_TOKEN}",
    "Content-Type": "application/json",
}

router = APIRouter()

class SnapshotManager:
    
    def __init__(self, db: Session = Depends(get_db)):
        self.db = db
        self.logger = logging.getLogger(__name__)
        self.api_token = API_TOKEN
        self.s3_bucket = os.getenv("S3_BUCKET")
        
    def create_snapshot(self, url: str, role: str, platform: str, payload: Dict, user_id: str) -> str:
        try:
            db = next(get_db())
            response = requests.post(url, json=payload, headers=HEADERS)
            response.raise_for_status()
            snapshot_id = response.json().get("snapshot_id")

            snapshot = Snapshot(
                role=role,
                platform=platform,
                snapshot_id=snapshot_id,
                payload=payload,
               user_id=user_id
            )
            
            db.add(snapshot) 
            db.commit()
            db.refresh(snapshot)
            snapshot_id = "12345"
            print(f"Snapshot for {platform} ({role}) created: {snapshot_id}")
            print(f"url: {url}")
            print(f"payload: {payload}")
            print(f"headers: {HEADERS}")
            
            # logging.info(f"Snapshot for {platform} ({role}) created: {snapshot_id}")
            print(f"Snapshot for {platform} ({role}) created: {snapshot_id}")
        except Exception as e:
            # logging.error(f"Failed to create snapshot for {platform} ({role}): {str(e)}")
            print(f"Failed to create snapshot for {platform} ({role}): {str(e)}")

        
    def check_existing_snapshot(self, role: str, platform: str, payload: Dict) -> Optional[str]:
        try:
            snapshot = self.db.query(Snapshot).filter(
                Snapshot.role == role,
                Snapshot.platform == platform,
                Snapshot.payload.cast(JSONB) == payload
            ).first()
            
            if snapshot:
                logging.info(f"Existing snapshot found for {platform} ({role}): {snapshot.snapshot_id}")
                return snapshot.snapshot_id
                    
        except Exception as e:
            self.logger.error(f"Error checking existing snapshot: {str(e)}")
            
        return None

    async def process_job_roles(
        self,
        roles: List[str],
        location: str,
        additional_details: Dict,
        user_id: str
    ) -> List[Dict]:
        results = []
        
        for role in roles:
            try:
                # Prepare payloads for each platform
                payloads = {
                    "LinkedIn": {
                        "location": location,
                        "keyword": role,
                        "country": additional_details.get("country", ""),
                        "time_range": "Past 24 hours",
                        "job_type": additional_details.get("job_type", ""),
                        "experience_level": additional_details.get("experience_level", ""),
                        "remote": additional_details.get("remote", "")
                    },
                    "Glassdoor": {
                        "location": location,
                        "keyword": role,
                        "country": additional_details.get("country", "")
                    },
                    "Indeed": {
    "country": additional_details.get("country", ""),
    "domain": "indeed.com",
    "keyword_search": role,
    "location": location,
    "date_posted": "Last 24 hours",
    "posted_by": ""
}
                }
                
                platform_results = {}
                
                for platform, payload in payloads.items():
                    try:
                        existing_snapshot_id = self.check_existing_snapshot(
                            role, platform, payload
                        )
                        print(f"existing_snapshot_id: {existing_snapshot_id} for {platform} ({role})")
                        if existing_snapshot_id:
                            db = next(get_db())
                            snapshot = Snapshot(
                                role=role,
                                platform=platform,
                                snapshot_id=existing_snapshot_id,
                                payload=payload,
                                user_id=user_id
                            )
                            db.add(snapshot)
                            db.commit()
                            db.refresh(snapshot)
                            platform_results[platform] = {
                                "snapshot_id": existing_snapshot_id,
                                "status": "existing_snapshot_used"
                            }
                            continue
                            
                        url = (
                            LINKEDIN_URL if platform == "LinkedIn" else
                            GLASSDOOR_URL if platform == "Glassdoor" else
                            INDEED_URL
                        )
                        
                        snapshot_id = self.create_snapshot(url, role, platform, payload, user_id)
                        
                        snapshot_data = await self.wait_for_snapshot(
                            snapshot_id, platform, role
                        )
                        
                        platform_results[platform] = {
                            "snapshot_id": snapshot_id,
                            "status": "success",
                            "s3_path": snapshot_data.get("s3_path")
                        }
                        
                    except Exception as e:
                        platform_results[platform] = {
                            "status": "error",
                            "error": str(e)
                        }
                        self.logger.error(
                            f"Error processing {platform} for {role}: {str(e)}"
                        )
                
                results.append({
                    "role": role,
                    "results": platform_results
                })
                
            except Exception as e:
                results.append({
                    "role": role,
                    "status": "error",
                    "error": str(e)
                })
                self.logger.error(f"Error processing role {role}: {str(e)}")
                
        return results

    async def wait_for_snapshot(self, snapshot_id: str, platform: str, role: str, max_retries: int = 10, base_delay: int = 2) -> Dict:
        """
        Polls the Bright Data API to deliver a snapshot to S3 and stores it platform/role-wise.

        Args:
            snapshot_id (str): The ID of the snapshot to deliver.
            platform (str): The platform for which the snapshot was created (e.g., LinkedIn, Glassdoor, Indeed).
            role (str): The job role associated with the snapshot.
            max_retries (int): The maximum number of retries for polling.
            base_delay (int): The base delay in seconds for exponential backoff.

        Returns:
            Dict: A dictionary with the snapshot delivery status and details.
        """
        url = f"https://api.brightdata.com/datasets/v3/deliver/{snapshot_id}"
        headers = {
            "Authorization": f"Bearer {self.api_token}",
            "Content-Type": "application/json"
        }
        
        role_slug = role.lower().replace(" ", "_")
        platform_slug = platform.lower()
        
        s3_path = f"{platform_slug}/{role_slug}"
        
        delivery_payload = {
            "deliver": {
                "type": "s3",
                "filename": {
                    "template": f"{snapshot_id}",
                    "extension": "json"
                },
                "bucket": os.getenv("S3_BUCKET"),
                "credentials": {
                    "aws-access-key": os.getenv("AWS_ACCESS_KEY"),
                    "aws-secret-key": os.getenv("AWS_SECRET_KEY"),
                },
                "directory": s3_path
            },
            "compress": False
        }

        for attempt in range(max_retries):
            try:
                response = requests.post(url, headers=headers, json=delivery_payload)

                if response.status_code == 200:
                    # self.logger.info(f"Snapshot {snapshot_id} for {platform} ({role}) successfully delivered to S3.")
                    print(f"Snapshot {snapshot_id} for {platform} ({role}) successfully delivered to S3.")
                    return {
                        "snapshot_id": snapshot_id,
                        "status": "delivered",
                        "s3_path": f"s3://{self.s3_bucket}/{s3_path}/{snapshot_id}.json"
                    }

                elif response.status_code == 404:
                    print("404 Error")
                else:
                    # self.logger.error(f"Unexpected response for snapshot {snapshot_id}: {response.status_code} {response.text}")
                    print(f"Unexpected response for snapshot {snapshot_id}: {response.status_code} {response.text}")
                
                print("URL: ", url)
                print("Headers: ", headers)
                print("Delivery Payload: ", delivery_payload)
                print("Snapshot ID: ", snapshot_id)
                print("Platform: ", platform)
                print("Role: ", role)
                print("S3 Path: ", s3_path)
                
                return {
                    "snapshot_id": snapshot_id,
                    "status": "delivered",
                    "s3_path": f"s3://{self.s3_bucket}/{s3_path}/{snapshot_id}.json"
                }

            except requests.RequestException as e:
                self.logger.error(f"Error while delivering snapshot {snapshot_id}: {str(e)}")

            delay = base_delay * (2 ** attempt)
            self.logger.info(f"Retrying in {delay} seconds (Attempt {attempt + 1}/{max_retries})...")
            time.sleep(delay)

        error_message = f"Snapshot {snapshot_id} for {platform} ({role}) was not delivered after {max_retries} retries."
        self.logger.error(error_message)
        return {
            "snapshot_id": snapshot_id,
            "status": "error",
            "error": error_message
        }
        
s3_client = boto3.client(
    "s3",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY"),
    aws_secret_access_key=os.getenv("AWS_SECRET_KEY"),
    region_name=os.getenv("AWS_REGION")
)

def generate_signed_url(bucket: str, key: str, expiration: int = 3600) -> str:
    """
    Generate a signed URL for accessing S3 objects.

    Args:
        bucket (str): The S3 bucket name.
        key (str): The S3 object key.
        expiration (int): Expiration time in seconds.

    Returns:
        str: The signed URL for the S3 object.
    """
    try:
        url = s3_client.generate_presigned_url(
            "get_object",
            Params={"Bucket": bucket, "Key": key},
            ExpiresIn=expiration,
        )
        return url
    except ClientError as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate signed URL: {str(e)}")

def get_s3_client():
    return s3_client

def generate_signed_url(bucket: str, key: str) -> str:
    """Generate a signed URL for an S3 object."""
    s3_client = get_s3_client()
    try:
        url = s3_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': bucket, 'Key': key},
            ExpiresIn=3600
        )
        return url
    except ClientError as e:
        print(f"Error generating signed URL: {e}")
        return None

def get_s3_json_data(url: str) -> dict:
    """Fetch and parse JSON data from S3."""
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error fetching JSON data from S3: {e}")
        return None
    

@router.get("/{user_id}")
def get_snapshots(user_id: str, db: Session = Depends(get_db)) -> List[dict]:
    """
    Fetch snapshots for a user and return signed URLs and JSON data from S3.

    Args:
        user_id (str): The ID of the user.
        db (Session): The database session.

    Returns:
        List[dict]: List of snapshots with signed URLs and JSON data.
    """
    snapshots = db.query(Snapshot).filter(Snapshot.user_id == user_id).all()
    print(f"Snapshots: {snapshots}")
    if not snapshots:
        raise HTTPException(status_code=404, detail="No snapshots found for the user.")

    s3_bucket = os.getenv("S3_BUCKET")
    response = []
    
    # Map for preserving original platform names in the response
    platform_map = {
        "LinkedIn": "LinkedIn",
        "Glassdoor": "Glassdoor",
        "Indeed": "Indeed"
    }
    
    for snapshot in snapshots:
        # Keep original platform name for the response
        platform = platform_map.get(snapshot.platform, snapshot.platform)
        
        # Use lowercase for the S3 path
        role_slug = snapshot.role.replace(" ", "%20")
        # platform_slug = snapshot.platform.lower()  # Ensure lowercase for S3 path
        BUCKET = os.getenv("S3_BUCKET")
        REGION = os.getenv("AWS_REGION")
        s3_path = f"https://{BUCKET}.s3.{REGION}.amazonaws.com/{platform}/{role_slug}/{snapshot.snapshot_id}.json"
        
        # Generate signed URL
        # signed_url = generate_signed_url(s3_bucket, s3_path)
        
        # Fetch JSON data from S3
        json_data = get_s3_json_data(s3_path)
        
        # Build response object with original platform name
        snapshot_data = {
            "snapshot_id": snapshot.snapshot_id,
            "platform": platform,  # Original platform name
            "role": snapshot.role,
            "signed_url": s3_path  # Signed URL,
        }
        
        # Add JSON data if successfully retrieved
        if json_data:
            # include 2 entries for each snapshot
            snapshot_data["data"] = json_data
        else:
            snapshot_data["data"] = None
            print(f"Failed to fetch data for snapshot {snapshot.snapshot_id}")
        
        response.append(snapshot_data)

    return response