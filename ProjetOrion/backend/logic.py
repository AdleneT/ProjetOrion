import re

def luhn_checksum(s: str) -> bool:
    """Validate a string using the Luhn algorithm (SIREN/SIRET)."""
    # Remove whitespace
    s = s.replace(" ", "")
    if not s.isdigit():
        return False
    
    digits = [int(d) for d in s]
    checksum = 0
    double = False
    
    # Process digits from right to left
    for digit in reversed(digits):
        if double:
            digit *= 2
            if digit > 9:
                digit -= 9
        checksum += digit
        double = not double
        
    return (checksum % 10) == 0

def validate_siret(siret: str) -> bool:
    """Check if SIRET is valid (14 digits + Luhn)."""
    clean_siret = siret.replace(" ", "").replace("-", "")
    if len(clean_siret) != 14:
        return False
    return luhn_checksum(clean_siret)

def check_arithmetic_consistency(ht: float, tva: float, ttc: float, tolerance: float = 0.01) -> bool:
    """Check if HT + TVA = TTC within tolerance."""
    calc_ttc = ht + tva
    diff = abs(calc_ttc - ttc)
    return diff <= tolerance

def detect_tva_rule(ocr_text: str) -> str:
    """Heuristic to determine TVA exigibility based on keywords."""
    ocr_text_lower = ocr_text.lower()
    if "livraison de bien" in ocr_text_lower:
        return "DEBIT" # TVA due à la livraison (souvent facturation)
    elif "prestation de service" in ocr_text_lower:
        return "ENCAISSEMENT" # TVA due à l'encaissement
    return "UNKNOWN"

def check_e_reporting_status(siren_recepteur: str | None) -> bool:
    """
    If no receiver SIREN (B2C or Foreign), e-reporting is required.
    In MVP: if siren_recepteur is empty -> True.
    """
    if not siren_recepteur:
        return True
    return False

def mock_ppf_lookup(siret: str) -> bool:
    """
    Simulate checking the Portail Public de Facturation.
    In MVP: Assume valid if it starts with '8' or '9' (random heuristic for demo).
    """
    clean_siret = siret.replace(" ", "")
    # Simulation: specific mock Logic
    if clean_siret.startswith("9"):
        return True # Registered
    return False # Not registered
