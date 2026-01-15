from fastapi import APIRouter
from models import FixRequest, FixResponse
import logic

router = APIRouter()

@router.post("/fix", response_model=FixResponse)
async def fix_invoice(request: FixRequest):
    original = request.data
    fixed = original.copy(deep=True) # Pydantic copy
    changes = []

    # Auto-fix arithmetic?
    # Strategy: Trust HT and TVA, recompute TTC.
    if fixed.montant_ht is not None and fixed.montant_tva is not None:
        recalc_ttc = round(fixed.montant_ht + fixed.montant_tva, 2)
        if fixed.montant_ttc != recalc_ttc:
            fixed.montant_ttc = recalc_ttc
            changes.append("Recalcul automatique du TTC basé sur HT + TVA")

    # Format SIRETS (remove spaces)
    if fixed.siren_emetteur:
        clean = fixed.siren_emetteur.replace(" ", "").replace(".", "")
        if clean != fixed.siren_emetteur:
            fixed.siren_emetteur = clean
            changes.append("Normalisation du format SIRET Émetteur")

    return FixResponse(
        original=original,
        fixed=fixed,
        changes_made=changes
    )
