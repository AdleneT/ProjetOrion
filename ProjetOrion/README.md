# InvoiceCheck 2026

MVP for French "Facturation Électronique 2026" compliance.

## Project Structure
- `backend/`: FastAPI + Prisma (Python)
- `frontend/`: Next.js 14 + Tailwind + Shadcn UI
- `docker-compose.yml`: Orchestration

## Getting Started

### Prerequisites
- Docker & Docker Compose

### Running the App
1. Build and start services:
   ```bash
   docker-compose up --build
   ```
2. Access the Frontend: http://localhost:3000
3. Access the Backend API Docs: http://localhost:8000/docs
4. Access Database (if needed): localhost:5432

### Development
- **Backend**: Update `backend/` files. The container should auto-reload (using uvicorn reload).
- **Frontend**: Update `frontend/` files. Next.js HMR is active.
