import logging
import time
from typing import Any

import httpx

from .config import RunConfig
from .settings import Settings

logger = logging.getLogger(__name__)


class ApiError(Exception):
    """Non-recoverable API error (4xx other than 429, or 5xx after retries)."""


class ApiClient:
    def __init__(self, settings: Settings, run: RunConfig) -> None:
        self.settings = settings
        self.run = run
        self.client = httpx.Client(
            base_url=settings.api_base_url,
            headers={"api_key": settings.api_key, "Accept": "application/json"},
            timeout=120.0,
            verify=run.verify_ssl,
        )

    def close(self) -> None:
        self.client.close()

    def __enter__(self) -> "ApiClient":
        return self

    def __exit__(self, *_: object) -> None:
        self.close()

    def _backoff_for(self, attempt: int) -> float:
        raw = self.run.server_error_backoff_sec * (2 ** (attempt - 1))
        return min(raw, self.run.server_error_backoff_max_sec)

    def get(self, path: str, params: dict[str, Any] | None = None) -> Any:
        """GET with 429 / 5xx / read-timeout retries and inter-request throttling."""
        server_error_attempts = 0
        while True:
            try:
                response = self.client.get(path, params=params)
            except httpx.ReadTimeout as exc:
                if server_error_attempts < self.run.server_error_retries:
                    server_error_attempts += 1
                    backoff = self._backoff_for(server_error_attempts)
                    logger.warning(
                        "Read timeout on %s (attempt %d/%d) — retrying in %.0fs",
                        path, server_error_attempts, self.run.server_error_retries, backoff,
                    )
                    time.sleep(backoff)
                    continue
                raise ApiError(f"Read timeout on GET {path} after retries: {exc}") from exc
            except httpx.RequestError as exc:
                raise ApiError(f"Network error on GET {path}: {exc}") from exc

            if response.status_code == 429:
                logger.warning(
                    "Rate limit hit on %s — sleeping %.0fs",
                    path, self.run.rate_limit_retry_sec,
                )
                time.sleep(self.run.rate_limit_retry_sec)
                continue

            if response.status_code == 401:
                raise ApiError(f"Unauthorized (401) on {path} — check API_KEY")

            if response.status_code >= 500:
                if server_error_attempts < self.run.server_error_retries:
                    server_error_attempts += 1
                    backoff = self._backoff_for(server_error_attempts)
                    logger.warning(
                        "Server %d on %s (attempt %d/%d) — retrying in %.0fs",
                        response.status_code, path, server_error_attempts,
                        self.run.server_error_retries, backoff,
                    )
                    time.sleep(backoff)
                    continue
                raise ApiError(
                    f"Server error {response.status_code} on {path} after retries: "
                    f"{response.text[:200]}"
                )

            if response.status_code >= 400:
                raise ApiError(
                    f"Client error {response.status_code} on {path}: "
                    f"{response.text[:200]}"
                )

            data = response.json()
            time.sleep(self.run.request_delay_sec)
            return data
