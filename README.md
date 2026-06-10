# Portfolio - T3 Stack

A personal growth portfolio built with the T3 stack (Next.js, TypeScript, Tailwind CSS, tRPC, Prisma).

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS Design System
- **API**: tRPC (type-safe APIs)
- **Database**: Prisma + SQLite
- **Deployment**: Vercel

## Getting Started

```bash
# Install dependencies
npm install

# Set up database
npx prisma db push
npx tsx prisma/seed.ts

# Start development server
npm run dev
```

## Features

- Responsive design with dark/light theme
- Content editing via tRPC API
- Evidence file management with upload/restore
- Self-assessment radar chart
- Scroll animations with Framer Motion

## Database

The app uses SQLite with Prisma ORM. To reset the database:

```bash
rm prisma/db.sqlite
npx prisma db push
npx tsx prisma/seed.ts
```

## Deployment

Deploy to Vercel:

```bash
npm run build
vercel deploy
```

For production with a real database, update `DATABASE_URL` in `.env` to use PostgreSQL or MySQL.
