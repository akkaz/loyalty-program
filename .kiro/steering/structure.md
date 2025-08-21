# Project Structure

## Directory Organization

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (server-side)
│   │   ├── auth/          # Authentication endpoints
│   │   ├── customers/     # Customer management API
│   │   ├── stays/         # Guest stays tracking API
│   │   └── consents/      # Consent management API
│   ├── dashboard/         # Protected dashboard pages
│   │   ├── calendar/      # Calendar view for bookings
│   │   ├── policy/        # Privacy policy management
│   │   └── layout.tsx     # Dashboard layout wrapper
│   ├── login/             # Authentication pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/
│   └── ui/                # shadcn/ui components
├── lib/                   # Utilities and configurations
│   ├── supabase.ts       # Database client & types
│   └── utils.ts          # Common utilities (cn function)
└── hooks/                 # Custom React hooks
```

## Architectural Patterns

### API Routes
- Located in `/src/app/api/`
- Use `supabaseAdmin` for server-side operations (bypasses RLS)
- Return proper HTTP status codes and error handling
- Accept query parameters for filtering (e.g., `?email=user@example.com`)

### Database Integration
- **Client**: `supabase` for browser operations with RLS
- **Admin**: `supabaseAdmin` for server-side operations
- TypeScript interfaces defined in `/src/lib/supabase.ts`
- Relationships fetched using Supabase's select syntax

### Component Structure
- **UI Components**: Pure components in `/src/components/ui/`
- **Page Components**: Business logic in `/src/app/*/page.tsx`
- **Layouts**: Shared layouts in `/src/app/*/layout.tsx`

### Styling Conventions
- Use `cn()` utility for conditional classes
- shadcn/ui components with CVA for variants
- Tailwind CSS with design system tokens
- Responsive design with mobile-first approach

### Data Flow
1. Client requests → API routes → Supabase Admin
2. Dashboard pages → Client-side fetch → API routes
3. Real-time updates via Supabase subscriptions (when needed)

## File Naming
- **Pages**: `page.tsx` (App Router convention)
- **Layouts**: `layout.tsx` (App Router convention)  
- **API Routes**: `route.ts` (App Router convention)
- **Components**: PascalCase (e.g., `Button.tsx`)
- **Utilities**: kebab-case (e.g., `use-mobile.ts`)