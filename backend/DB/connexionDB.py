import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv()

DEFAULT_DATABASE_URL = "sqlite:///./network_monitor.db"
DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_DATABASE_URL)

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)

if not DATABASE_URL.startswith("sqlite"):
    try:
        with engine.connect():
            pass
    except OperationalError:
        DATABASE_URL = DEFAULT_DATABASE_URL
        engine = create_engine(
            DATABASE_URL,
            connect_args={"check_same_thread": False},
        )

SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()
