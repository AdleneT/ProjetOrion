from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class InvoiceMetadata(BaseModel):
    filename: str
    file_type: str # PDF, XML, CSV

class InvoiceData(BaseModel):
    siren_emetteur: Optional[str] = None
    siren_recepteur: Optional[str] = None
    date_facture: Optional[datetime] = None
    devise: str = "EUR"
    montant_ht: Optional[float] = None
    montant_tva: Optional[float] = None
    montant_ttc: Optional[float] = None
    ocr_text: Optional[str] = None # For heuristics

class AnalysisRequest(BaseModel):
    metadata: InvoiceMetadata
    data: InvoiceData

class ErrorDetail(BaseModel):
    code: str
    message: str
    severity: str # BLOCKING, WARNING

class AnalysisResponse(BaseModel):
    is_valid: bool
    status: str # READY, NEEDS_FIX, ERROR
    errors: List[ErrorDetail]
    warnings: List[ErrorDetail]
    compliance_score: int # 0-100
    e_reporting_required: bool

class FixRequest(BaseModel):
    data: InvoiceData
    # Instructions on what to fix could go here

class FixResponse(BaseModel):
    original: InvoiceData
    fixed: InvoiceData
    changes_made: List[str]

class AuditLogCreate(BaseModel):
    action: str
    details: Optional[str] = None
    user_id: str
