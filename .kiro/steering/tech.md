# Technology Stack

## Core Framework
- **Next.js 15** with App Router and React 19
- **TypeScript** for full type safety
- **Turbopack** for fast development builds

## Backend & Database
- **Supabase** as Backend-as-a-Service
  - PostgreSQL database with Row Level Security (RLS)
  - Real-time subscriptions
  - Authentication and user management
- **API Routes** in `/src/app/api/` for server-side logic

## Frontend & UI
- **shadcn/ui** component library (New York style)
- **Radix UI** primitives for accessibility
- **Tailwind CSS v4** for styling
- **Lucide React** for icons
- **CVA (Class Variance Authority)** for component variants

## Key Libraries
- **React Hook Form** + **Zod** for form validation
- **date-fns** for date manipulation
- **Recharts** for data visualization
- **Sonner** for toast notifications

## Development Tools
- **ESLint** with Next.js config
- **TypeScript 5** with strict mode
- Path aliases configured (`@/*` → `./src/*`)

## Common Commands

```bash
# Development
npm run dev          # Start dev server with Turbopack
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint

# Environment Setup
cp .env.example .env # Copy environment template
```

## Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Server-side admin key