# Folder Structure

Complete overview of every file and folder in the project, with explanations.

```
receipt-scanner/
│
├── docs/                                   # Project documentation
│   ├── planning.md                         # App overview, tech stack, costs, roadmap
│   ├── database.md                         # Schema, RLS policies, storage buckets
│   ├── design-system.md                    # Colors, typography, component styles
│   ├── api.md                              # API endpoints, OCR pipeline
│   ├── implementation.md                   # User flow, security, agents
│   └── folder-structure.md                 # This file
│
├── public/                                 # Static assets (served directly to browser)
│   ├── manifest.json                       # PWA manifest — app name, icons, colors, display mode
│   ├── sw.js                               # Service worker — offline caching, background sync
│   ├── icons/                              # App icons (192x192, 512x512, etc.)
│   └── favicon.ico                         # Browser tab icon
│
├── src/
│   ├── app/                                # Pages & routes (Next.js App Router)
│   │   ├── layout.tsx                      # Root layout — fonts, providers, dark mode on <html>
│   │   ├── page.tsx                        # Landing page — redirects to dashboard or login
│   │   ├── globals.css                     # Global styles, Tailwind imports
│   │   ├── (auth)/                         # Auth pages (no bottom nav)
│   │   │   ├── login/page.tsx              # Login form — email + password
│   │   │   └── register/page.tsx           # Register form — email, password, display name
│   │   ├── (app)/                          # Authenticated pages (with bottom nav)
│   │   │   ├── layout.tsx                  # App layout — BottomNav + Header wrapper
│   │   │   ├── dashboard/page.tsx          # Monthly overview, recent receipts, export CSV/Excel
│   │   │   ├── scan/page.tsx               # Camera/upload — take photo or pick from gallery
│   │   │   ├── receipts/
│   │   │   │   ├── page.tsx                # All receipts — category filters, date/amount filters
│   │   │   │   └── [id]/page.tsx           # Single receipt detail — view, edit, delete
│   │   │   └── settings/page.tsx           # User settings — display name, email, account
│   │   └── api/                            # Server-side API routes
│   │       ├── ocr/route.ts                # POST /api/ocr — send image, get extracted data
│   │       └── export/route.ts             # GET /api/export — download CSV/Excel
│   │
│   ├── components/
│   │   ├── ui/                             # shadcn/ui components (auto-generated, don't edit)
│   │   ├── layout/
│   │   │   ├── BottomNav.tsx               # Bottom nav — Dashboard, Receipts, Scan, Settings
│   │   │   ├── Header.tsx                  # Top bar — page title, back button, avatar
│   │   │   └── PageContainer.tsx           # Page wrapper — padding, max-width, spacing
│   │   ├── receipt/
│   │   │   ├── ReceiptCard.tsx             # Receipt list item — store, date, amount, category
│   │   │   ├── ReceiptDetail.tsx           # Full receipt view — all fields + image
│   │   │   ├── ReceiptForm.tsx             # Edit form — used for OCR review + editing
│   │   │   └── ReceiptList.tsx             # Scrollable receipt list — loading, empty, pagination
│   │   ├── scan/
│   │   │   ├── CameraCapture.tsx           # Camera interface — live preview, capture button
│   │   │   ├── ImageUpload.tsx             # File upload — drag-and-drop or gallery pick
│   │   │   └── OcrResultReview.tsx         # Review OCR results — editable fields + image
│   │   └── common/
│   │       ├── CategoryPicker.tsx          # Category dropdown — presets + custom, with icons
│   │       ├── CategoryManager.tsx         # Bottom sheet — add/edit/delete categories
│   │       ├── AmountDisplay.tsx           # Currency display — "€ 27,85" formatting
│   │       └── EmptyState.tsx              # Empty list placeholder — message + illustration
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts                   # Browser-side Supabase client
│   │   │   ├── server.ts                   # Server-side Supabase client (service role key)
│   │   │   └── middleware.ts               # Auth middleware — session refresh, redirects
│   │   ├── ocr/
│   │   │   ├── google-vision.ts            # Google Vision API wrapper — send image, get text
│   │   │   └── parse-receipt.ts            # Receipt parser — regex extraction of structured data
│   │   ├── export/
│   │   │   └── csv-generator.ts            # CSV/Excel generation via SheetJS
│   │   └── utils/
│   │       ├── format.ts                   # Currency, date, percentage formatting helpers
│   │       └── image.ts                    # Image compression, resize, base64 conversion
│   │
│   ├── hooks/
│   │   ├── useReceipts.ts                  # CRUD receipts, loading/error states
│   │   ├── useCategories.ts                # Fetch/create/delete categories, caching
│   │   ├── useCamera.ts                    # Camera access, permissions, capture photo
│   │   └── useAuth.ts                      # Auth state — login, register, logout, session
│   │
│   └── types/
│       └── index.ts                        # Shared types: Receipt, Category, Profile, OcrResult
│
├── supabase/
│   ├── migrations/
│   │   └── 001_initial.sql                 # Creates all tables, indexes, RLS, storage bucket
│   └── seed.sql                            # Preset categories (Groceries, Transport, etc.)
│
├── next.config.js                          # Next.js config — PWA plugin, image domains
├── tailwind.config.ts                      # Tailwind config — dark mode, custom colors, Inter font
├── tsconfig.json                           # TypeScript — path aliases (@/), strict mode
├── package.json                            # Dependencies, scripts (dev, build, start, lint)
└── .env.local                              # Secrets — Supabase URL/key, Vision API key (never commit)
```
