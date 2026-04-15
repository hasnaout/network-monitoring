from datetime import datetime

from fastapi import Depends, FastAPI
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database.db import Base, SessionLocal, engine
from database.models.machine import Machine


app = FastAPI(title="Network Monitor API")

Base.metadata.create_all(bind=engine)


class HeartbeatPayload(BaseModel):
    pcName: str
    ip: str
    user: str
    timestamp: datetime | None = None


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def home():
    return {"message": "API works"}


@app.get("/machines")
def list_machines(db: Session = Depends(get_db)):
    machines = db.query(Machine).order_by(Machine.timestamp.desc()).all()
    return [
        {
            "id": machine.id,
            "pcName": machine.pc_name,
            "ip": machine.ip,
            "user": machine.user,
            "timestamp": machine.timestamp.isoformat() if machine.timestamp else None,
        }
        for machine in machines
    ]


@app.post("/heartbeat")
def heartbeat(payload: HeartbeatPayload, db: Session = Depends(get_db)):
    machine = (
        db.query(Machine)
        .filter(Machine.pc_name == payload.pcName, Machine.ip == payload.ip)
        .first()
    )

    if machine is None:
        machine = Machine(pc_name=payload.pcName, ip=payload.ip, user=payload.user)
        db.add(machine)

    machine.user = payload.user
    machine.timestamp = payload.timestamp or datetime.utcnow()

    db.commit()
    db.refresh(machine)

    return {
        "status": "received",
        "machine": {
            "id": machine.id,
            "pcName": machine.pc_name,
            "ip": machine.ip,
            "user": machine.user,
            "timestamp": machine.timestamp.isoformat() if machine.timestamp else None,
        },
    }
