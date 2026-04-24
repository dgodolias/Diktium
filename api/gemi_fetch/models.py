from datetime import date
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class CompanyFilter(BaseModel):
    """Search criteria mirroring the Γ.Ε.ΜΗ. web UI filter form."""

    search_scope: str = Field(default="all", description="all | name | title")
    legal_form_id: int | None = None
    legal_form_descr: str | None = None
    status_id: int | None = None
    status_descr: str | None = None
    suspension_id: int | None = None
    special_characterization_id: int | None = None
    local_office_id: int | None = None
    activity_code_prefixes: list[str] = Field(
        default_factory=list,
        description="ΚΑΔ prefixes — a company matches if ANY of its activity ids starts with ANY prefix",
    )
    activity_descr: str | None = None
    incorporation_from: date | None = None
    incorporation_to: date | None = None
    closing_from: date | None = None
    closing_to: date | None = None
    kak_change_from: date | None = None
    kak_change_to: date | None = None
    region_ids: list[int] = Field(
        default_factory=list,
        description="Prefecture IDs to include — a descriptive name like 'Αττική' expands to {5, 52, 53}",
    )
    region_descr: str | None = None
    city: str | None = None
    zip_code: str | None = None


class KadEntry(BaseModel):
    """A single ΚΑΔ code with its Greek description."""

    code: str
    descr: str | None = None


class HistoryEntry(BaseModel):
    """One row in Ιστορικό Νομικής Μορφής / Ιστορικό Κατάστασης."""

    change_date: date
    value: str


class CompanyRecord(BaseModel):
    """Normalized view of a business — from list response, optionally enriched by detail."""

    model_config = ConfigDict(extra="allow")

    ar_gemi: str
    euid: str | None = None
    name_el: str | None = None
    name_en: str | None = None
    distinctive_titles: list[str] = Field(default_factory=list)
    afm: str | None = None
    incorporation_date: date | None = None
    legal_form: str | None = None
    status: str | None = None
    status_date: date | None = None
    street: str | None = None
    street_number: str | None = None
    city: str | None = None
    municipality: str | None = None
    region: str | None = None
    zip_code: str | None = None
    website: str | None = None
    eshop: str | None = None
    email: str | None = None
    phone: str | None = None
    local_office: str | None = None
    office_department: str | None = None
    office_reg_number: str | None = None
    office_phone: str | None = None
    office_website: str | None = None
    office_reg_date: date | None = None
    purpose_text: str | None = None
    main_kad: KadEntry | None = None
    secondary_kads: list[KadEntry] = Field(default_factory=list)
    legal_form_history: list[HistoryEntry] = Field(default_factory=list)
    status_history: list[HistoryEntry] = Field(default_factory=list)
    raw_list_json: dict[str, Any] | None = None
    raw_detail_json: dict[str, Any] | None = None
