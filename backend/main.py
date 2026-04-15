from contextlib import asynccontextmanager
from datetime import datetime
from typing import Literal

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.database import Base, SessionLocal, engine
from backend.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    oauth2_scheme,
    verify_password,
)
from backend.logger import logger
from backend.models import Admin, Machine


DEFAULT_ADMIN_USERNAME = "admin"
DEFAULT_ADMIN_PASSWORD = "123456"


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def ensure_default_admin():
    db = SessionLocal()
    try:
        admin = db.query(Admin).filter(Admin.username == DEFAULT_ADMIN_USERNAME).first()
        if admin is None:
            db.add(
                Admin(
                    username=DEFAULT_ADMIN_USERNAME,
                    password=hash_password(DEFAULT_ADMIN_PASSWORD),
                )
            )
            db.commit()
            logger.info("Default admin created")
    finally:
        db.close()


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    ensure_default_admin()
    yield


app = FastAPI(title="Network Monitor API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class LoginRequest(BaseModel):
    username: str
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str


class MachineCreate(BaseModel):
    name: str
    ip: str
    location: str | None = None
    status: Literal["Online", "Offline", "Maintenance"] = "Offline"
    description: str | None = None


def serialize_machine(machine: Machine):
    return {
        "id": machine.id,
        "name": machine.name,
        "ip": machine.ip,
        "location": machine.location,
        "status": machine.status,
        "description": machine.description,
        "created_at": machine.created_at.isoformat() if isinstance(machine.created_at, datetime) else None,
    }


def get_current_admin(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    payload = decode_token(token)

    if not payload or "sub" not in payload:
        logger.warning("Invalid token")
        raise HTTPException(status_code=401, detail="Invalid token")

    username = payload["sub"]
    admin = db.query(Admin).filter(Admin.username == username).first()

    if not admin:
        logger.warning("Admin not found")
        raise HTTPException(status_code=401, detail="Unauthorized")

    return admin


@app.get("/")
def home():
    return {"message": "API works"}


@app.post("/create-admin")
def create_admin(payload: LoginRequest, db: Session = Depends(get_db)):
    existing_admin = db.query(Admin).filter(Admin.username == payload.username).first()

    if existing_admin:
        raise HTTPException(status_code=409, detail="Admin already exists")

    admin = Admin(username=payload.username, password=hash_password(payload.password))
    db.add(admin)
    db.commit()

    logger.info("Admin created: %s", payload.username)
    return {"message": "Admin created"}


@app.post("/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    admin = db.query(Admin).filter(Admin.username == payload.username).first()

    if not admin or not verify_password(payload.password, admin.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token({"sub": admin.username})
    refresh_token = create_refresh_token({"sub": admin.username})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "username": admin.username,
    }


@app.post("/refresh")
def refresh(payload: RefreshRequest):
    token_payload = decode_token(payload.refresh_token)

    if not token_payload or "sub" not in token_payload:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    new_access_token = create_access_token({"sub": token_payload["sub"]})
    return {"access_token": new_access_token}


@app.get("/dashboard")
def dashboard(current_admin: Admin = Depends(get_current_admin)):
    logger.info("Dashboard access granted for %s", current_admin.username)
    return {"message": f"Bienvenue {current_admin.username}", "username": current_admin.username}


@app.get("/machines")
def list_machines(
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
):
    machines = db.query(Machine).order_by(Machine.created_at.desc()).all()
    return {"items": [serialize_machine(machine) for machine in machines]}


@app.post("/machines", status_code=201)
def create_machine(
    payload: MachineCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    existing_machine = db.query(Machine).filter(Machine.ip == payload.ip).first()

    if existing_machine:
        raise HTTPException(status_code=409, detail="Une machine avec cette adresse IP existe deja")

    machine = Machine(
        name=payload.name,
        ip=payload.ip,
        location=payload.location,
        status=payload.status,
        description=payload.description,
    )

    db.add(machine)
    db.commit()
    db.refresh(machine)

    logger.info("Machine created by %s: %s", current_admin.username, machine.ip)
    return {
        "message": "Machine ajoutee avec succes",
        "machine": serialize_machine(machine),
    }
