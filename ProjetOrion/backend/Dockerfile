# Backend Dockerfile
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Prisma setup will happen at runtime or via a separate command
# For now, we just copy the code
COPY . .

# Generate Prisma Client (if schema exists)
# RUN prisma generate

EXPOSE 8000
