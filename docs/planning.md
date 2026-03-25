# Receipt Scanner — Planning

## App Overview

**App_name:** Bonnetje Scanner
**Type:** Progressive Web App (PWA) — mobile-first
**Framework:** Next.js 14+ (App Router)
**Backend:** Supabase (PostgreSQL, Auth, Storage)
**OCR:** Google Cloud Vision API (1000 free/month)
**UI Language:** Dutch
**Design:** Dark mode, minimalist & clean

### What does the app do?
Users take a photo of a receipt or upload one. The app automatically extracts the data (date, amount, store name, VAT, payment method) via Google Cloud Vision. Everything is stored in a clear overview list. Users can categorize receipts and export them as CSV/Excel for bookkeeping.

---

## Tech Stack

| Layer | Technology | Why |
|-------|------------|-----|
| Framework | Next.js 14 (App Router) | Server components, API routes, PWA-ready |
| Styling | Tailwind CSS | Fast, clean, responsive |
| UI Components | shadcn/ui | Professional components, works well with Tailwind |
| Backend/DB | Supabase | PostgreSQL + Auth + Storage in one |
| OCR | Google Cloud Vision API | Accurate, 1000 free/month |
| State | React built-in (useState, useContext) | No extra dependency needed for this app size |
| Export | SheetJS (xlsx) | CSV/Excel export |
| PWA | next-pwa | Service worker, installable |
| Hosting | Vercel | Free tier, perfect for Next.js |

---

## Implementation Order

### Phase 1: Foundation (Week 1-2)
1. Set up Next.js project with Tailwind + shadcn/ui
2. Create Supabase project, deploy database schema
3. Implement auth (register, login)
4. Basic layout with bottom navigation

### Phase 2: Core Feature (Week 2-3)
5. Build camera/upload component
6. Google Cloud Vision API integration
7. Build and test receipt parser
8. OCR review screen

### Phase 3: Overview (Week 3-4)
9. Dashboard with monthly overview + export (CSV/Excel)
10. Receipts list with category filter tabs + "manage categories" bottom sheet
11. Detail page per receipt

### Phase 4: Polish (Week 4-5)
12. PWA configuration
13. Test on various phones
14. Performance optimization

### Phase 5: Later
- English language (i18n)
- Monthly/yearly reports
- Full-text search on OCR text

---

## Documentation Index

All project documentation lives in the `docs/` folder:

| File | Contents |
|------|----------|
| [planning.md](planning.md) | This file — overview, tech stack, costs, roadmap |
| [database.md](database.md) | Database schema, RLS policies, storage buckets |
| [design-system.md](design-system.md) | Colors, typography, component styles |
| [api.md](api.md) | API endpoints, OCR pipeline |
| [implementation.md](implementation.md) | User flow, security, agents |
| [folder-structure.md](folder-structure.md) | Every file and folder explained |
