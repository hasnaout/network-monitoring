import logging
import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import declarative_base, sessionmaker

logger = logging.getLogger(__name__)
ENV_FILE = Path(__file__).resolve().parents[1] / ".env"

load_dotenv(ENV_FILE)

DEFAULT_DATABASE_URL = "sqlite:///./network_monitor.db"
DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_DATABASE_URL)

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)

if not DATABASE_URL.startswith("sqlite"):
    try:
        with engine.connect():
            pass
    except OperationalError as exc:
        logger.warning(
            "Unable to connect to configured database '%s'. Falling back to SQLite. Error: %s",
            DATABASE_URL,
            exc,
        )
        DATABASE_URL = DEFAULT_DATABASE_URL
        engine = create_engine(
            DATABASE_URL,
            connect_args={"check_same_thread": False},
        )

SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()
