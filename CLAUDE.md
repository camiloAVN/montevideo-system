# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Montevideo Convention Center** — inventory and project management system for a convention center. Manages clients, projects, quotations, and physical inventory with RFID tracking.

## Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Lint
npm run lint

# Database
docker compose up -d          # Start PostgreSQL (required before running app)
npx prisma migrate dev        # Run migrations
npx prisma studio             # GUI database browser
npm run db:seed               # Seed with test data

# Email preview
npm run email:dev
```

## Architecture

### App Router Structure

Uses Next.js App Router with three route groups:
- `app/(auth)/` — login page, no auth required
- `app/(dashboard)/dashboard/` — all protected routes, requires authentication
- `app/(public)/` — public-facing pages (inicio, soluciones, contacto)

The middleware (`proxy.ts`) protects `/dashboard/*` and redirects unauthenticated users to `/login`.

### API Routes

All API routes live in `app/api/`. Each resource follows REST conventions with `route.ts` files handling multiple HTTP methods. All API routes call `canViewModule()` or `canEditModule()` from `lib/auth/check-permission.ts` before processing requests.

### Authentication & Permissions

Auth is handled by NextAuth.js v5 (`auth.ts`) with credentials provider + Prisma adapter. JWT sessions expire after 8 hours.

Permission model is **role + granular per-module**:
- `SUPERADMIN` (hardcoded email `camilo.vargas@xenith.com.co`) — bypasses all permission checks
- `ADMIN` — role-based
- `USER` — must have explicit `UserPermission` records per module

System modules are defined in `lib/validations/user.ts` as `systemModules`. Use `canViewModule(module)` / `canEditModule(module)` from `lib/auth/check-permission.ts` in every API route.

### State Management

Each domain entity has a Zustand store in `store/`. Stores handle fetching, caching, and mutations. Components call store actions rather than `fetch` directly. Stores are at `store/{entity}Store.ts`.

### Validation

All form schemas use Zod and live in `lib/validations/{entity}.ts`. The same schemas are reused for both client-side (react-hook-form + `@hookform/resolvers/zod`) and server-side validation in API routes.

### Inventory System

Two distinct inventory types:
- **UNIT/CONTAINER** (`InventoryItem`) — individual physical items, optionally tracked with RFID tags
- **BULK** (`BulkInventory`) — quantity-based, no RFID

RFID processing pipeline: reader sends detections to `POST /api/rfid/read` → `lib/rfid/processor.ts` matches EPCs to `RfidTag` records → updates `InventoryItem` status (IN/OUT) automatically based on direction.

Items can be grouped into `ItemGroup` packages, which can then be added to `Quotation` records as `QuotationGroup`.

### File Storage

Product images upload to Cloudflare R2 via `lib/storage/r2.ts`. Uses AWS Signature V4 implemented manually (no SDK). Requires env vars: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`.

### Audit Logging

Critical admin actions (user creation, role changes, etc.) are logged to `AuditLog` via `lib/audit/log.ts`. Use `createAuditLog()` for any write operations in admin-level API routes.

### PDF Generation

Quotation PDFs are generated server-side using `@react-pdf/renderer` via `lib/pdf/generator.ts`, served from `GET /api/quotations/[id]/pdf`.

### Email

Transactional emails use Resend + React Email. Templates live in `react-email-starter/`. Preview with `npm run email:dev`.

## Environment Variables

Copy `.env.example` to `.env`. Required for local dev:
- `DATABASE_URL` — PostgreSQL connection string
- `AUTH_SECRET` — generate with `openssl rand -base64 32`
- `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` — typically `http://localhost:3000`

R2 storage variables are optional for local dev (only needed for product image uploads).
