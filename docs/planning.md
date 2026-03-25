# Receipt Scanner — Planning

## App Overview

**App_name:** Bonnetje Scanner
**Type:** Progressive Web App (PWA) — mobile-first
**Framework:** Next.js 16 (App Router)
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
| Framework | Next.js 16 (App Router) | Server components, API routes, PWA-ready |
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

#### 1. Project setup
- [ ] Create Next.js 16 project (App Router, TypeScript, `src/` folder)
- [ ] Install + configure Tailwind CSS (dark mode always-on)
- [ ] Install shadcn/ui
- [ ] Set up project structure (`src/app/`, `src/components/`, `src/lib/`, `src/types/`)
- [ ] Configure ESLint

#### 2. Layout, navigatie & placeholder pages
- [ ] **RootLayout** — dark mode class, Inter font, global styles
- [ ] **DashboardLayout** — header + bottom nav + content area
- [ ] **Header** — app title + settings button (top-right, round)
- [ ] **Bottom Navigation** — Home, "+" (raised, blue glow), Bonnetjes
- [ ] **SVG icons** — home, receipt/document, settings gear (no emojis)
- [ ] **Placeholder pages** — `/` (dashboard), `/receipts`, `/settings`

#### 3. Supabase setup
- [ ] Install `@supabase/supabase-js`
- [ ] Create Supabase client (`lib/supabase/client.ts`)
- [ ] Deploy database schema via SQL Editor (profiles, categories, receipts)
- [ ] Enable RLS policies on all tables
- [ ] Create storage bucket `receipts` with RLS policy
- [ ] Create `handle_new_user()` trigger (auto-create profile on signup)
- [ ] Verify database connection from Next.js

#### 4. Authenticatie
- [ ] Auth context/provider (`useAuth` hook)
- [ ] Register page (`/auth/register`) met error handling
- [ ] Login page (`/auth/login`) met error handling
- [ ] Logout functionaliteit (via settings)
- [ ] Route protection middleware (unauthenticated → `/auth/login`)
- [ ] Session persistence (auth state check on app load)

### Phase 2: Core Feature (Week 2-3)
5. Build scan bottom sheet popup + camera/upload components
6. Google Cloud Vision API integration
7. Build and test receipt parser
8. Unified "Controleer gegevens" screen (view/edit for new + existing receipts, image at bottom)

### Phase 3: Overview (Week 3-4)
9. Dashboard with total count + amount, export (CSV), recent receipts
10. Receipts list with category filter tabs (text labels, no emojis), sorted new→old + "manage categories" bottom sheet

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
| [database.md](database.md) | Database schema, RLS policies, storage buckets, Supabase setup & credentials |
| [design-system.md](design-system.md) | Colors, typography, component styles |
| [api.md](api.md) | API endpoints, OCR pipeline |
| [implementation.md](implementation.md) | User flow, security, agents |
| [folder-structure.md](folder-structure.md) | Every file and folder explained |
