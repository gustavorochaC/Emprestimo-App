<!-- BEGIN:nextjs-agent-rules -->
# Next.js Version Warning

This repo uses Next.js **16.2.4** and React **19.2.4**. APIs, conventions, and file structure differ from older versions. Read the relevant guide in `node_modules/next/dist/docs/` before writing code, and heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:opencode-agent-rules -->
# OpenCode Agent Safety Rules

- **NEVER use `taskkill /F /IM node.exe`** on Windows, as this will kill the OpenCode agent process itself.
- To stop a Next.js dev server, use `npx kill-port 3000` (or the specific port) instead.
- Alternatively, find the specific PID of the Next.js process and kill only that one.
<!-- END:opencode-agent-rules -->

# EmpréstimosApp — Agent Guide

Single Next.js app (App Router) for loan management. UI language is Portuguese (pt-BR).

## Tech Stack & Versions

- **Next.js** 16.2.4 (App Router) | **React** 19.2.4 | **TypeScript** 5
- **Tailwind CSS** v4 (CSS-based config, no `tailwind.config.js`)
- **shadcn/ui** — `base-nova` style using `@base-ui/react`
- **Prisma** 7.8.0 + **Neon** PostgreSQL (`@prisma/adapter-neon`)
- **Clerk** auth (`@clerk/nextjs`)
- **React Hook Form** + **Zod** for forms
- **Recharts** (charts), **@react-pdf/renderer** (PDFs)

## Commands

```bash
npm run dev      # start dev server (port 3000)
npm run build    # production build
npm run start    # start production server
npm run lint     # ESLint (flat config in eslint.config.mjs)
```

There are no test or typecheck scripts in `package.json`. Run `npx tsc --noEmit` for a manual typecheck.

## App Architecture

- `src/app/(dashboard)/` — Protected app routes (dashboard, `/clientes`, `/emprestimos`, `/pagamentos`, `/relatorios`). Auth guard lives in `src/app/(dashboard)/layout.tsx` via Clerk `auth()`.
- `src/app/login/page.tsx` — Clerk `SignIn` component.
- `src/app/actions.ts` — All Server Actions. Serializes Prisma `Decimal` and `DateTime` to plain `number` / `ISO string` before returning to client.
- `src/lib/prisma.ts` — Prisma client singleton with Neon HTTP adapter.
- `src/lib/schemas.ts` — Zod validation schemas for forms.
- `src/lib/juros.ts` — Business logic for interest / overdue days.
- `src/types/index.ts` — Domain types (serialized values, not Prisma raw types).

## Database

- Neon PostgreSQL via `DATABASE_URL`.
- Schema: `prisma/schema.prisma`. Tables mapped with `@@map("emp_...")`.
- `prisma.config.ts` sets the schema, migrations path, and datasource URL.
- Client setup (`src/lib/prisma.ts`) uses `PrismaNeonHttp` with `arrayMode: true, fullResults: true`.
- Run migrations with Prisma CLI (`npx prisma migrate dev`).

## Auth

- Clerk manages users. The dashboard layout checks `session.userId` and redirects to `/login`.
- There is **no `middleware.ts`**; route protection is layout-based.

## Styling

- Tailwind v4 is configured entirely in `src/app/globals.css` (`@import "tailwindcss"`, `@theme inline`).
- PostCSS config: `postcss.config.mjs` uses `@tailwindcss/postcss`.
- `next.config.ts` sets `allowedDevOrigins: ['192.168.1.71']`.

## Environment Variables

Copy `.env.example` to `.env` and fill:

```bash
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
```

## Notes

- Decimal values from Prisma are explicitly converted to `Number()` in server actions and business logic before being passed to client components.
- The `scripts/` folder contains standalone Node scripts for Supabase testing; they are not part of the application runtime.
