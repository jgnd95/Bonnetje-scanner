# Folder Structure

Complete overview of every file and folder in the project, with explanations.

```
bonnetje-scanner/
│
├── docs/                                   # Project documentation
│   ├── planning.md                         # App overview, tech stack, roadmap
│   ├── database.md                         # Schema, RLS policies, storage buckets, Supabase setup
│   ├── design-system.md                    # Colors, typography, component styles
│   ├── api.md                              # API endpoints, OCR pipeline
│   ├── implementation.md                   # User flow, security
│   └── folder-structure.md                 # This file
│
├── scripts/
│   └── init-database.sql                   # SQL to initialize Supabase database
│
├── src/
│   ├── app/                                # Pages & routes (Next.js App Router)
│   │   ├── layout.tsx                      # Root layout — Inter font, dark mode, AuthProvider
│   │   ├── globals.css                     # Global styles, Tailwind v4 imports, design system colors
│   │   └── (dashboard)/                    # Authenticated pages (with header + bottom nav)
│   │       ├── layout.tsx                  # Dashboard layout — Header + BottomNav wrapper
│   │       ├── page.tsx                    # Dashboard — monthly total, receipt count, recent 5
│   │       ├── receipts/page.tsx           # Bonnetjes lijst — all receipts, category filters, manage categories
│   │       ├── receipt/
│   │       │   ├── new/page.tsx            # New receipt — loads pending image, shows ReceiptForm
│   │       │   └── [id]/page.tsx           # Edit receipt — loads from Supabase, shows ReceiptForm
│   │       └── settings/page.tsx           # Settings — account info, upgrade to email/password, logout
│   │
│   ├── components/
│   │   ├── ui/                             # shadcn/ui components (auto-generated)
│   │   │   └── button.tsx
│   │   ├── BottomNav.tsx                   # Bottom nav — Home, + (scan popup), Bonnetjes + scan sheet
│   │   ├── BottomSheet.tsx                 # Reusable bottom sheet — overlay, drag handle, max 70vh
│   │   ├── Header.tsx                      # Top bar — app title + settings button (gear icon)
│   │   ├── ReceiptForm.tsx                 # Unified receipt form — new + edit, upload + save to Supabase
│   │   └── ScanSheet.tsx                   # Scan options — "Maak foto" / "Upload vanuit galerij"
│   │
│   ├── lib/
│   │   ├── auth/
│   │   │   └── provider.tsx                # AuthProvider — anonymous login, useAuth hook, account upgrade
│   │   ├── supabase/
│   │   │   └── client.ts                   # Supabase client (browser-side)
│   │   ├── image.ts                        # Client-side image compression/resize (max 1920px, JPEG 80%)
│   │   └── utils.ts                        # shadcn/ui cn() helper
│   │
│   └── types/                              # (To be added: shared TypeScript types)
│
├── next.config.ts                          # Next.js config
├── postcss.config.mjs                      # PostCSS config (Tailwind v4)
├── tailwind.config.ts                      # Tailwind config — design system colors, Inter font
├── tsconfig.json                           # TypeScript — path aliases (@/*), strict mode
├── components.json                         # shadcn/ui config
├── package.json                            # Dependencies, scripts (dev, build, start, lint)
├── .env.local                              # Supabase URL + key (never commit)
├── .gitignore                              # Ignores node_modules, .next, .env.local
└── CLAUDE.md                               # Instructions for Claude Code
```

## Key architectural decisions

- **`src/` folder** — all source code lives in `src/`, keeping root clean
- **`(dashboard)` route group** — groups all authenticated pages under one layout with Header + BottomNav
- **No auth pages** — anonymous-first auth, no login/register needed (upgrade optional in Settings)
- **`ReceiptForm` shared component** — same form for `/receipt/new` and `/receipt/[id]` (create + edit)
- **`BottomNav` owns scan state** — scan sheet lives inside BottomNav, keeps dashboard layout as server component
- **Next.js 15** — downgraded from 16 due to hydration issues
- **Tailwind v4** — uses `@theme` CSS config instead of `tailwind.config.ts` for colors
