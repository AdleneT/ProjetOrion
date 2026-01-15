from fastapi import APIRouter, HTTPException
from models import AnalysisRequest, AnalysisResponse, ErrorDetail
import logic

router = APIRouter()

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_invoice(request: AnalysisRequest):
    data = request.data
    errors = []
    warnings = []
    
    # 1. SIRET Validation
    if data.siren_emetteur:
        if not logic.validate_siret(data.siren_emetteur):
            errors.append(ErrorDetail(code="SIRET_INVALID", message="SIREN Émetteur invalide (Luhn)", severity="BLOCKING"))
    else:
        errors.append(ErrorDetail(code="SIRET_MISSING", message="SIREN Émetteur manquant", severity="BLOCKING"))

    # 2. Arithmetic Consistency
    if data.montant_ht is not None and data.montant_tva is not None and data.montant_ttc is not None:
        if not logic.check_arithmetic_consistency(data.montant_ht, data.montant_tva, data.montant_ttc):
             errors.append(ErrorDetail(code="MATH_ERROR", message="Incohérence HT + TVA != TTC", severity="BLOCKING"))
    
    # 3. E-Reporting & PPF
    is_e_reporting = logic.check_e_reporting_status(data.siren_recepteur)
    
    # Check Receiver if B2B
    if not is_e_reporting and data.siren_recepteur:
         if not logic.validate_siret(data.siren_recepteur):
             errors.append(ErrorDetail(code="SIRET_REC_INVALID", message="SIREN Récepteur invalide", severity="BLOCKING"))
         
         # Mock PPF check
         if not logic.mock_ppf_lookup(data.siren_recepteur):
             warnings.append(ErrorDetail(code="PPF_UNKNOWN", message="SIREN Récepteur non trouvé sur PPF (Simulation)", severity="WARNING"))

    # Determine status
    status = "READY"
    if errors:
        status = "ERROR"
    elif warnings:
        status = "NEEDS_FIX"

    return AnalysisResponse(
        is_valid=(len(errors) == 0),
        status=status,
        errors=errors,
        warnings=warnings,
        compliance_score=100 if not errors else 50,
        e_reporting_required=is_e_reporting
    )
