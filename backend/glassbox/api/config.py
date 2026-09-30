"""Runtime settings, overridable with GLASSBOX_* environment variables."""

from __future__ import annotations

from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="GLASSBOX_", env_file=".env", extra="ignore")

    data_dir: Path = Path(".data/mnist")
    cors_origins: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]
    max_sessions: int = 50
    session_idle_seconds: float = 30 * 60
    # Streaming: how often a snapshot is pushed while training runs.
    tick_seconds: float = 0.1


@lru_cache
def get_settings() -> Settings:
    return Settings()
