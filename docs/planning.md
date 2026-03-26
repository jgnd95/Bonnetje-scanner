# Receipt Scanner — Planning

## App Overview

**App_name:** Bonnetje Scanner
**Type:** Progressive Web App (PWA) — mobile-first
**Framework:** Next.js 15 (App Router)
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
| Framework | Next.js 15 (App Router) | Server components, API routes, PWA-ready |
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

#### 1. Project setup ✅
- [x] Create Next.js 15 project (App Router, TypeScript, `src/` folder)
- [x] Install + configure Tailwind CSS v4 (dark mode always-on)
- [x] Install shadcn/ui
- [x] Set up project structure (`src/app/`, `src/components/`, `src/lib/`, `src/types/`)
- [x] Configure ESLint

#### 2. Layout, navigatie & placeholder pages ✅
- [x] **RootLayout** — dark mode class, Inter font, global styles
- [x] **DashboardLayout** — header + bottom nav + content area
- [x] **Header** — app title + settings button (top-right, round)
- [x] **Bottom Navigation** — Home, "+" (raised, blue glow), Bonnetjes
- [x] **SVG icons** — home, receipt/document, settings gear (no emojis)
- [x] **Placeholder pages** — `/` (dashboard), `/receipts`, `/settings`

#### 3. Supabase setup ✅
- [x] Install `@supabase/supabase-js`
- [x] Create Supabase client (`src/lib/supabase/client.ts`)
- [x] Deploy database schema via SQL Editor (profiles, categories, receipts)
- [x] Enable RLS policies on all tables
- [x] Create storage bucket `receipts` with RLS policy
- [x] Create `handle_new_user()` trigger (auto-create profile on signup)
- [x] Verify database connection from Next.js

#### 4. Authenticatie (anonymous-first) ✅
- [x] Enable anonymous sign-ins in Supabase dashboard
- [x] AuthProvider — automatisch anoniem inloggen op app load
- [x] `useAuth` hook (user state, loading state, isAnonymous)
- [x] Settings: optioneel account aanmaken (email + wachtwoord upgrade)

### Phase 2: Core Feature (Week 2-3)

#### 5.1 Scan bottom sheet popup ✅
- [x] BottomSheet component (overlay, drag handle, max 70vh)
- [x] ScanSheet component (2 opties: Maak foto, Upload vanuit galerij)
- [x] "+" button in BottomNav opent sheet

#### 5.2 Camera/upload components ✅
- [x] Camera capture via `capture="environment"` (mobiel) / file picker (desktop)
- [x] File picker voor galerij upload (`<input type="file" accept="image/*">`)
- [x] Client-side compressie/resize voor upload (`src/lib/image.ts`)
- [x] Na selectie → door naar "Controleer gegevens" scherm (`/receipt/new`)

#### 6. "Controleer gegevens" scherm ✅
- [x] Unified scherm voor nieuwe + bestaande bonnetjes
- [x] Formulier: datum, totaalbedrag, BTW% (9% / 21% / leeg), bedrag excl. BTW (berekend), betaalmethode, categorie, extra informatie
- [x] 2-kolom grid layout (datum full-width, rest in paren)
- [x] Categorie selector (dropdown)
- [x] Bonnetje foto onderaan zichtbaar
- [x] Opslaan naar database (receipts tabel + Supabase Storage)
- [x] Na opslaan → terug naar dashboard

#### 7. Dashboard ✅
- [x] Maand header (bijv. "Maart 2026")
- [x] Totaalbedrag van de maand (groot, bold)
- [x] Aantal bonnetjes van de maand
- [x] Recente bonnetjes lijst (laatste 5) gesorteerd van nieuw naar oud

#### 8. Bonnetjes lijst ✅
- [x] Alle bonnetjes gesorteerd nieuw → oud
- [x] Per item: datum (bold) + bedrag • BTW% • categorie label
- [x] Categorie filter tabs (text labels, geen emojis)
- [x] Tik op bonnetje → opent "Controleer gegevens" scherm (bewerken)
- [x] "Categorieën" button → bottom sheet om categorieën te beheren (toevoegen/verwijderen)

#### 9. Google Cloud Vision API integratie
- [ ] Google Cloud Vision API key toevoegen aan `.env.local`
- [ ] `POST /api/ocr` route handler bouwen
- [ ] Auth token verificatie op API route
- [ ] Image naar base64 → Google Vision `TEXT_DETECTION`
- [ ] Raw OCR tekst teruggeven aan client

#### 10. Receipt parser
- [ ] `parse-receipt.ts` — raw OCR tekst → gestructureerde data
- [ ] Datum extraheren (regex: DD-MM-YYYY, DD/MM/YYYY, etc.)
- [ ] Totaalbedrag extraheren (TOTAAL, TE BETALEN, TOTAL)
- [ ] BTW percentage + bedrag extraheren (BTW, VAT patterns)
- [ ] Betaalmethode extraheren (PIN, CONTANT, CASH, VISA)
- [ ] Winkelnaam extraheren (eerste 1-2 regels)
- [ ] Confidence score berekenen

### Phase 3: Polish (Week 4-5)
12. PWA configuration
13. Test on various phones
14. Performance optimization

### Phase 4: Later
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
