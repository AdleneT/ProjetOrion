# Frontend Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# In dev we don't build, just run dev
CMD ["npm", "run", "dev"]
