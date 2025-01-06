# SBAAA-Backend

A backend service for SBAAA LLC (Small Business Accounting & Advisory Administration)

## Prerequisites

- Node.js (v18 or higher)
- TypeScript (v5 or higher)
- npm
- Git

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/sbaa-backend.git
cd sbaa-backend
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration settings.

4. Set up the database:

```bash
# Generate Prisma Client
npm run prisma:generate

# Sync database schema
npm run prisma:push
```

## Running the Application

Development mode:

```bash
# Watch mode
npm run dev
```

Production mode:

```bash
npm start
```
