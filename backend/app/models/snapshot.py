# app/models.py
from sqlalchemy import Column, String, Integer, JSON, DateTime
from app.db import Base
from datetime import datetime

class Snapshot(Base):
    __tablename__ = "snapshots"

    id = Column(Integer, primary_key=True, index=True)
    role = Column(String, nullable=False) 
    platform = Column(String, nullable=False)
    snapshot_id = Column(String, nullable=False)
    payload = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    user_id = Column(String, nullable=True, default="1")
