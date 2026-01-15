# Orion AI - Automated UGC Video SaaS

A premium SaaS platform for generating performance-oriented UGC videos using AI agents, built with Next.js, BullMQ, and a monolithic Agentic workflow.

## Architecture

This project uses a monorepo structure managed by `pnpm` workspaces:

- **apps/web**: Next.js 14 App Router (Frontend + API).
- **apps/worker**: Node.js worker with BullMQ (Job processing).
- **packages/core**: Shared business logic, Zod schemas, Agent definitions, and Mocks.
- **packages/db**: Prisma ORM, Database schema, and migrations.

## tech Stack

- **Framework**: Next.js (TypeScript)
- **Queue**: BullMQ + Redis
- **Database**: PostgreSQL + Prisma
- **Storage**: MinIO (S3 Compatible) - *Easy swap to Cloudflare R2*
- **Styling**: Tailwind CSS
- **Deployment**: Docker Compose (Local)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Docker & Docker Compose

### Step 1: Install Dependencies

```bash
pnpm install
```

### Step 2: Start Infrastructure

Start Postgres, Redis, and MinIO:

```bash
docker-compose up -d
```

### Step 3: Database Setup

Run migrations and seed the database with initial prompts:

```bash
pnpm db:migrate
pnpm db:seed
```

### Step 4: Start Applications

In one terminal, start the Next.js app:

```bash
pnpm dev
```

In another terminal, start the Worker:

```bash
pnpm worker
```

### Step 5: Usage

1.  Open [http://localhost:3000](http://localhost:3000)
2.  Go to Dashboard.
3.  Click "New Campaign" to create a job.
4.  Watch the job progress in real-time on the Job Detail page.
5.  The worker log will show the "Mock" agents executing steps.

## API Endpoints

- `POST /api/jobs`: Create a new job.
- `GET /api/jobs`: List recent jobs.
- `GET /api/jobs/:id`: Get job status and assets.

## Providers

The system uses a modular `Provider` pattern in `packages/core`. currently, it uses `MockLLMProvider`, `MockVideoProvider`, and `MockTTSProvider` for demonstration.

To switch to real providers (e.g., OpenAI, ElevenLabs):
1.  Implement the interfaces in `packages/core/src/providers`.
2.  Update `apps/worker/src/index.ts` to instantiate the real providers instead of mocks.
