# Receipt Scanner — Technical Plan

## 1. App Overview

**Name:** Receipt Scanner
**Type:** Progressive Web App (PWA) — mobile-first
**Framework:** Next.js 14+ (App Router)
**Backend:** Supabase (PostgreSQL, Auth, Storage)
**OCR:** Google Cloud Vision API (1000 free/month)
**UI Language:** Dutch
**Design:** Dark mode, minimalist & clean

### What does the app do?
Users take a photo of a receipt or upload one. The app automatically extracts the data (date, amount, store name, VAT, payment method) via Google Cloud Vision. Everything is stored in a clear overview list. Users can categorize receipts and export them as CSV/Excel for bookkeeping.

---

## 2. Tech Stack

| Layer | Technology | Why |
|-------|------------|-----|
| Framework | Next.js 14 (App Router) | Server components, API routes, PWA-ready |
| Styling | Tailwind CSS | Fast, clean, responsive |
| UI Components | shadcn/ui | Professional components, works well with Tailwind |
| Backend/DB | Supabase | PostgreSQL + Auth + Storage in one |
| OCR | Google Cloud Vision API | Accurate, 1000 free/month |
| State | Zustand | Lightweight, easy to use |
| Export | SheetJS (xlsx) | CSV/Excel export |
| PWA | next-pwa | Service worker, installable |
| Hosting | Vercel | Free tier, perfect for Next.js |

---

## 3. Database Schema (Supabase/PostgreSQL)

### Table: `profiles`
Automatically created on registration via Supabase Auth trigger.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: `categories`
Preset + custom categories per user.

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_preset BOOLEAN DEFAULT FALSE,
  icon TEXT, -- emoji or icon name
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: `receipts`
The core of the app — each receipt.

```sql
CREATE TABLE receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,

  -- OCR-extracted data
  store_name TEXT,
  date DATE,
  total_amount DECIMAL(10,2),
  tax_percentage DECIMAL(5,2),
  tax_amount DECIMAL(10,2),
  payment_method TEXT, -- 'cash', 'pin', 'creditcard', 'ideal', etc.
  currency TEXT DEFAULT 'EUR',

  -- User input
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  notes TEXT,

  -- Image
  image_url TEXT NOT NULL,
  image_path TEXT NOT NULL,

  -- OCR metadata
  raw_ocr_text TEXT,
  ocr_confidence DECIMAL(3,2),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_receipts_user_id ON receipts(user_id);
CREATE INDEX idx_receipts_date ON receipts(date DESC);
CREATE INDEX idx_receipts_category ON receipts(category_id);
```

### Row Level Security (RLS)

```sql
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own receipts" ON receipts
  FOR ALL USING (auth.uid() = user_id);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own categories" ON categories
  FOR ALL USING (auth.uid() = user_id OR is_preset = true);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own profile" ON profiles
  FOR ALL USING (auth.uid() = id);
```

### Supabase Storage Bucket

```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', false);

CREATE POLICY "Users manage own receipt images"
ON storage.objects FOR ALL
USING (bucket_id = 'receipts' AND auth.uid()::text = (storage.foldername(name))[1]);
```

---

## 4. Folder Structure

```
receipt-scanner/
├── public/
│   ├── manifest.json
│   ├── sw.js
│   ├── icons/
│   └── favicon.ico
│
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (app)/
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── scan/page.tsx
│   │   │   ├── receipts/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── categories/page.tsx
│   │   │   ├── export/page.tsx
│   │   │   └── settings/page.tsx
│   │   └── api/
│   │       ├── ocr/route.ts
│   │       └── export/route.ts
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   │   ├── BottomNav.tsx
│   │   │   ├── Header.tsx
│   │   │   └── PageContainer.tsx
│   │   ├── receipt/
│   │   │   ├── ReceiptCard.tsx
│   │   │   ├── ReceiptDetail.tsx
│   │   │   ├── ReceiptForm.tsx
│   │   │   └── ReceiptList.tsx
│   │   ├── scan/
│   │   │   ├── CameraCapture.tsx
│   │   │   ├── ImageUpload.tsx
│   │   │   └── OcrResultReview.tsx
│   │   └── common/
│   │       ├── CategoryPicker.tsx
│   │       ├── AmountDisplay.tsx
│   │       └── EmptyState.tsx
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── middleware.ts
│   │   ├── ocr/
│   │   │   ├── google-vision.ts
│   │   │   └── parse-receipt.ts
│   │   ├── export/
│   │   │   └── csv-generator.ts
│   │   └── utils/
│   │       ├── format.ts
│   │       └── image.ts
│   │
│   ├── hooks/
│   │   ├── useReceipts.ts
│   │   ├── useCategories.ts
│   │   ├── useCamera.ts
│   │   └── useAuth.ts
│   │
│   └── types/
│       └── index.ts
│
├── supabase/
│   ├── migrations/
│   │   └── 001_initial.sql
│   └── seed.sql
│
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── .env.local
```

---

## 5. User Flow

```
Open App → Login/Register → Dashboard
                                │
            ┌───────────────────┼───────────┐
            │                   │           │
         Scan/Upload        Receipts     Export CSV
            │                 List
            ▼                   │
       OCR Processing       Detail/Edit
            │
       Review & Category
            │
         Saved!
```

---

## 6. API Endpoints

### OCR Endpoint
```
POST /api/ocr
Body: { imageBase64: string }
Response: {
  store_name: string | null,
  date: string | null,
  total_amount: number | null,
  tax_percentage: number | null,
  tax_amount: number | null,
  payment_method: string | null,
  raw_text: string,
  confidence: number
}
```

### Export Endpoint
```
GET /api/export?format=csv&from=2024-01-01&to=2024-12-31
Response: CSV file download
```

---

## 7. OCR Pipeline

```
Photo → Compression/Resize → Supabase Storage
                                    │
                            Google Cloud Vision
                            (TEXT_DETECTION)
                                    │
                            parse-receipt.ts:
                            ├── Regex: date (DD-MM-YYYY etc.)
                            ├── Regex: total amount (TOTAL, AMOUNT DUE)
                            ├── Regex: VAT percentage and amount
                            ├── Regex: payment method (PIN, CASH, VISA)
                            ├── Heuristic: store name (first lines)
                            └── Confidence score
                                    │
                            Show to user (can correct)
```

---

## 8. Design System

### Style: Dark Mode — Minimalist & Clean

Dark card-based UI with one blue accent. Always dark mode.

**Color Palette:**

| Role | Color | Usage |
|------|-------|-------|
| Background | `#0F0F0F` | Main background |
| Surface | `#1E1E1E` | Cards, list items |
| Border | `#2E2E2E` | Subtle dividers |
| Text Primary | `#FFFFFF` | Main text, amounts |
| Text Secondary | `#6B7280` | Labels, subtext |
| Accent | `#2563EB` | CTA buttons, active navigation |
| Danger | `#EF4444` | Error/expired states |

**Typography:**
- Font: Inter (Google Fonts)
- Amounts: 28-32px, bold, white
- Labels: 11-12px, uppercase, letter-spacing, `#6B7280`
- Body: 16px, regular, white
- Subtext: 14px, `#6B7280`

**Components:**
- Cards: `bg-[#1E1E1E] border border-[#2E2E2E] rounded-2xl`
- Primary button: `bg-[#2563EB] rounded-full px-6 py-3`
- No shadows — borders do the work
- FAB (scan button): blue, bottom-right, `rounded-full`

**Tailwind config:**
```js
// tailwind.config.ts
module.exports = {
  darkMode: 'class', // always 'dark' on <html>
}
```

**PWA manifest:**
```json
{
  "background_color": "#0F0F0F",
  "theme_color": "#0F0F0F"
}
```

---

## 9. Security

- **Supabase RLS**: users only see their own data
- **API Route protection**: OCR endpoint checks Supabase auth token
- **Image upload**: Max 10MB, JPEG/PNG only, server-side validation
- **Google Vision API key**: server-side only, never in frontend
- **Environment variables**: `.env.local`, never committed

---

## 10. Costs (at launch)

| Service | Free tier | Limit |
|---------|-----------|-------|
| Vercel | Free | 100GB bandwidth/month |
| Supabase | Free | 500MB DB, 1GB storage |
| Google Cloud Vision | Free | 1000 requests/month |
| **Total** | **€0/month** | ~1000 receipts/month |

---

## 11. Implementation Order

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
9. Dashboard with monthly overview
10. Receipts list with filters
11. Detail page per receipt
12. Manage categories

### Phase 4: Export & Polish (Week 4-5)
13. CSV/Excel export
14. PWA configuration
15. Test on various phones
16. Performance optimization

### Phase 5: Later
- English language (i18n)
- Monthly/yearly reports
- Full-text search on OCR text

---

## 12. Agents

This project uses specialized agents:

- **Architect** (`agents/architect.md`) — reviews plan and structure before implementation
- **Builder** — default Claude Code role, implements based on approved specs
- **Tester** (`agents/tester.md`) — writes and reviews test cases after implementation
