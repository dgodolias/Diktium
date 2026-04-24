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
    request_delay_sec: float = Field(
        default=8.5,
        description="Seconds to sleep between requests — stays under the 8 req/min limit",
    )
    rate_limit_retry_sec: float = Field(
        default=65.0,
        description="Seconds to wait after a 429 before retrying",
    )
    page_size: int = Field(default=100, description="Records requested per /companies call (max 200)")
    server_error_retries: int = Field(
        default=3, description="Retry attempts for 5xx / read-timeout errors before giving up"
    )
    server_error_backoff_sec: float = Field(
        default=20.0, description="Base backoff seconds for 5xx retries (doubled each attempt)"
    )
    max_pages: int = Field(default=500, description="Safety cap on pages scanned per filter set")
    verify_ssl: bool = Field(
        default=False,
        description="Upstream chain has intermediate issues — disabled to match legacy behaviour",
    )
