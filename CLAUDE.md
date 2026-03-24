# Pivot — Property Management Platform

## What This Is
AI-native Property Management Platform demo. Showcases 4 portals (Tenant, Owner, Contractor, Admin) with AI-powered maintenance triage, dynamic pricing, tenant screening, and a persistent AI chat assistant. Fully client-side — no backend required for demo.

## Architecture
- **Frontend:** Next.js 14 (App Router, TypeScript) + Tailwind CSS + Recharts + Lucide React
- **Data:** All hardcoded in `src/data/demoData.ts` — no API calls
- **Auth:** Demo quick-login buttons, role stored in React state (no JWT needed)
- **Layout:** 3-zone (collapsible sidebar + main content + right AI chat panel)

## Design System
- **Color palette:** Navy dark background (navy-950/900/800/700), teal (#0D9488) brand accent, same card/badge patterns as EHS-OS
- **CSS variables:** `--brand-color: #0D9488`, `--brand-color-primary: #0f1a2e`
- **Component classes:** `.card`, `.card-hover`, `.btn-primary`, `.btn-secondary`, `.badge-*`, `.kpi-card`, `.input-field`, `.modal-overlay`, `.modal-panel`
- **Recharts:** AreaChart, BarChart, LineChart, PieChart — all styled with navy grid lines and teal fills

## Portal Routing
`Dashboard.tsx` manages a `currentPage` string and renders the appropriate page component. No Next.js routing used — all single-page.

## Portals
1. **Tenant** — `t-1` (Sarah Chen): payments, maintenance, lease, messages
2. **Owner** — `o-1` (Marcus Rivera): portfolio dashboard, properties, maintenance approvals, tenants, invoices, P&L
3. **Contractor** — `c-1` (Jake Torres): job requests, schedule, completion/invoicing
4. **Admin** — platform admin: business dashboard, accounts, contractor vetting, disputes, settings, audit log

## Key Files
- `src/data/demoData.ts` — ALL mock data (properties, tenants, maintenance, payments, etc.)
- `src/types/index.ts` — TypeScript interfaces
- `src/components/Dashboard.tsx` — Layout shell + page router
- `src/components/Sidebar.tsx` — Collapsible role-aware nav
- `src/components/ChatPanel.tsx` — AI property assistant (fully offline, pattern-matched responses)
- `src/components/DashboardHome.tsx` — Routes to portal-specific dashboards
- `src/components/dashboards/` — Per-portal home dashboard components

## Demo Data Summary
- 3 properties owned by Marcus Rivera (o-1): Harlow Apartments (LTR), Pacific Pines Cabin (STR), Bayview Lofts (mixed)
- 12 units, 6 tenants (varying payment status)
- 3 vetted contractors (plumber, electrician, HVAC/general)
- 11 maintenance requests in various states
- 5 invoices with line items and platform fees
- 6-month P&L data per property
- 2 open disputes, 12-entry audit log
- 5 IoT events (smart lock, leak detector, noise sensor)

## Running
```bash
cd C:\Users\Chris\Documents\Pivot
npm install
npm run dev
# Visit http://localhost:3000
```

## Build Notes
- Uses Next.js App Router with `"use client"` components throughout
- No server components with data fetching needed — everything is client-side with hardcoded data
- Tailwind `darkMode: "class"` — html element has `class="dark"`
- Brand color applied via CSS custom property `--brand-color`
