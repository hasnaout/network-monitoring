from sqlalchemy import Column, Integer, String, DateTime
from database.db import Base
import datetime

class Machine(Base):
    __tablename__ = "machines"

    id = Column(Integer, primary_key=True, index=True)
    pc_name = Column(String)
    ip = Column(String)
    user = Column(String)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)