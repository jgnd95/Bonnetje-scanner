# Implementation Details

## User Flow

```
Open App → Login/Register → Dashboard (+ Export)
                                │
                    ┌───────────┼───────────┐
                    │           │           │
                 + (popup)   Bonnetjes   Instellingen
                    │        (+ Categorieën)  (via header)
                    ▼           │
              Maak foto /       │
              Upload galerij    │
                    │           │
               OCR Processing   │
                    │           │
                    └─────┬─────┘
                          ▼
                  Controleer gegevens
                  (unified scherm)
                          │
                       Opslaan
```

### Flow explanation

1. **Open App** — PWA loads, checks if user is authenticated
2. **Login/Register** — If not authenticated, redirect to login. New users can register
3. **Dashboard** — Shows total receipts count + monthly amount, export CSV, recent receipts. No weekly stats or averages
4. **"+" button** — Opens a bottom sheet popup with two options: "Maak foto" or "Upload vanuit galerij"
5. **OCR Processing** — Image is sent to Google Vision, data is extracted
6. **Controleer gegevens** — Unified screen for both new and existing receipts. User reviews/edits fields: datum, bruto totaal, BTW%, BTW bedrag, betaalmethode, categorie, extra informatie. Receipt image visible at the bottom
7. **Saved** — Receipt is stored in the database, user returns to dashboard
8. **Bonnetjes lijst** — Browse all receipts sorted newest first, with category filter tabs. No search bar. Each item shows: datum, bedrag, BTW%, categorie (text label). "Categorieën" button opens bottom sheet to manage categories
9. **Opening existing receipt** — Tapping a receipt opens the same "Controleer gegevens" screen with all fields editable + image at the bottom. No separate detail or edit screen
10. **Instellingen** — Accessible via round settings button in the header (top-right), not in the bottom nav

---

## Security

| Measure | What it does |
|---------|-------------|
| **Supabase RLS** | Database-level enforcement — users can only read/write their own data, even if the frontend is bypassed |
| **API Route protection** | Every API endpoint verifies the Supabase auth token before processing |
| **Image upload validation** | Max 10MB file size, only JPEG/PNG accepted, validated server-side |
| **API key protection** | Google Vision API key is only used server-side in API routes, never exposed to the frontend |
| **Environment variables** | All secrets stored in `.env.local`, never committed to version control |

