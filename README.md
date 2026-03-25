# 📸 Bonnetje Scanner

A mobile-first PWA for scanning and organizing receipts with automatic OCR data extraction.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm
- Supabase account (already configured)

### Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Opens at: **http://localhost:3000**

### First Time Setup

1. **Deploy Database Schema** — See [DEPLOYMENT.md](DEPLOYMENT.md) for SQL setup
2. **Create Test Account** — Sign up at http://localhost:3000/auth/register
3. **Done!** — You're on the dashboard

## 📁 Project Structure

```
app/
  (dashboard)/        # Protected routes (dashboard layout)
    page.tsx          # Dashboard / Home
    receipts/         # Receipts list
    settings/         # Settings + Logout
  auth/               # Auth routes
    login/
    register/
  layout.tsx          # Root layout + providers
  globals.css         # Global styles + Tailwind

components/
  Header.tsx          # Top header with settings button
  BottomNav.tsx       # Bottom navigation (3 items)

lib/
  auth/
    context.tsx       # AuthProvider + useAuth hook
  supabase/
    client.ts         # Supabase client
  types/
    database.ts       # TypeScript types for DB

docs/                 # All documentation
  planning.md         # Phase roadmap
  database.md         # Schema + credentials
  design-system.md    # Colors, components
  implementation.md   # User flows, security
  folder-structure.md # File structure
```

## 🎨 Design

- **Dark Mode** — Always on, minimalist
- **Mobile First** — Responsive, touch-friendly
- **Color Scheme**:
  - Background: `#0F0F0F`
  - Surface: `#1E1E1E`
  - Accent: `#2563EB` (blue)
  - Danger: `#EF4444` (red)

See [docs/design-system.md](docs/design-system.md) for full design specs.

## 🔐 Authentication

- **Method**: Email + Password (Supabase Auth)
- **Pages**: `/auth/login`, `/auth/register`
- **Session**: Automatic, persisted
- **Protected Routes**: Middleware redirects to login if not authenticated

## 📊 Current Phase

**Phase 1: Foundation** ✅
- [x] Next.js 14 + Tailwind setup
- [x] Supabase auth (login/register)
- [x] Bottom navigation + Header
- [x] Protected routes + middleware
- [ ] Database schema deployment (next step)

## 🔄 Next Steps (Phase 2)

- Scan popup + camera/upload
- Google Cloud Vision OCR integration
- Receipt data review/edit screen
- Save to database

## 📖 Documentation

All docs in `docs/` folder:
- **[planning.md](docs/planning.md)** — Phases, roadmap
- **[database.md](docs/database.md)** — Schema, RLS, setup
- **[design-system.md](docs/design-system.md)** — UI/UX specs
- **[implementation.md](docs/implementation.md)** — User flows, security
- **[deployment.md](DEPLOYMENT.md)** — How to deploy

## 🛠️ Available Commands

```bash
npm run dev     # Start dev server
npm run build   # Build for production
npm start       # Start production server
npm run lint    # Run ESLint
```

## 🌐 Environment

Variables in `.env.local` (never commit):
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=...
```

## 💡 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Backend | Supabase (PostgreSQL, Auth, Storage) |
| Language | TypeScript |
| Hosting | Vercel (ready) |
| OCR | Google Cloud Vision (Phase 2) |

---

**Status**: Phase 1 Complete → Ready for Schema Deployment
