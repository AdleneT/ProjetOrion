from fastapi import FastAPI
from prisma import Prisma
from routes import analyze, fix, audit

app = FastAPI(title="InvoiceCheck 2026 API")
prisma = Prisma()

app.include_router(analyze.router, tags=["Compliance"])
app.include_router(fix.router, tags=["Tools"])
app.include_router(audit.router, tags=["Audit"])

@app.on_event("startup")
async def startup():
    try:
        await prisma.connect()
    except Exception as e:
        print(f"Prisma connect failed (expected during build without DB): {e}")

@app.on_event("shutdown")
async def shutdown():
    if prisma.is_connected():
        await prisma.disconnect()

@app.get("/")
def read_root():
    return {"message": "InvoiceCheck 2026 Backend is running"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
