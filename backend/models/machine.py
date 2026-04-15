from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String, Text

from backend.database import Base


class Machine(Base):
    __tablename__ = "managed_machines"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    ip = Column(String(45), unique=True, index=True, nullable=False)
    location = Column(String(255), nullable=True)
    status = Column(String(50), nullable=False, default="Offline")
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
