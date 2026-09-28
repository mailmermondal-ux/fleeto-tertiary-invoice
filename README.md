# Fleeto Tertiary Invoice

Premium red/black/white enterprise dealer billing starter for Next.js + Vercel + Supabase + GitHub.

## Architecture intent
This repository implements the new Dealer Portal surface described in the supplied specification, while keeping company/distributor/dealer upstream architecture integration-ready rather than recreating it. The specification explicitly says existing authentication, roles, dealer/distributor management and upstream billing should be reused.

## Key differentiator: metadata-driven Super Admin Studio
`ui_sections`, `ui_fields`, `validation_rules`, and `theme_settings` make the UI configurable from data. Super Admin/Admin can rename sections and fields, create new fields, reorder/hide fields, configure labels/options, and manage validation rules. System fields remain identifiable via `is_system`; business-critical immutable identifiers should be protected in production.

## Setup
1. `npm install`
2. Copy `.env.example` to `.env.local` and fill Supabase values.
3. Create/link a Supabase project.
4. Review existing schema first if integrating with an existing application.
5. Apply migrations only after mapping existing company/distributor/dealer/inventory tables.
6. `npm run dev`
7. Push to GitHub and import the repository in Vercel.

## Production integration gate
Do not blindly apply the dealer billing migration to an existing production database. Audit existing auth, roles, company/distributor/dealer relationships, inventory, billing, RLS and storage first, then adapt foreign keys and reuse tables.

## Security baseline
RLS, server-side authorization, private invoice storage, signed URLs, audit logs, decimal monetary columns, server-side tax recalculation, immutable invoice snapshots, and database-level reservation/locking are expected before go-live.

## UI
Responsive desktop/tablet/mobile shell, premium Big-4-inspired restraint with red accents, black navigation, white cards and neutral gray canvas.

Main written by: Raju Monal
