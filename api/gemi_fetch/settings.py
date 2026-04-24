"""Secrets & environment-specific values loaded from .env.

Everything else (filter, pagination, retries, pacing) lives in `config.py` —
this module is deliberately minimal and should stay that way.
"""

from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(Path(__file__).resolve().parent.parent / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    database_url: str = Field(description="Postgres DSN for the gemh_records database")
    api_key: str = Field(description="Γ.Ε.ΜΗ. opendata API key")
    api_base_url: str = Field(
        default="https://opendata-api.businessportal.gr/api/opendata/v1",
        description="Base URL for the Γ.Ε.ΜΗ. opendata API",
    )
