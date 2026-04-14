from fastapi import FastAPI
from database.db import Base, engine
from models.machine import Machine
app = FastAPI()

Base.metadata.create_all(bind=engine)

@app.get("/")
def home():
    return {"message": "API works"}

@app.post("/heartbeat")
def heartbeat(data: dict):
    print(data)
    return {"status": "received"}