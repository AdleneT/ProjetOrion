from fastapi import APIRouter
from models import AuditLogCreate

router = APIRouter()

@router.post("/audit")
async def create_audit_log(log: AuditLogCreate):
    # In a real app, write to DB via Prisma
    # await prisma.auditlog.create(...)
    return {"status": "logged", "log": log}
