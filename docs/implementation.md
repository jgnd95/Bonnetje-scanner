# Implementation Details

## User Flow

```
Open App → Auto anonymous login → Dashboard
                                       │
                           ┌───────────┼───────────┐
                           │           │           │
                        + (popup)   Bonnetjes   Instellingen
                           │     (+ Categorieën   (via header)
                           │      + Export CSV)
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

1. **Open App** — PWA loads, AuthProvider checks for existing session. If none → automatically signs in anonymously via Supabase. User lands directly on Dashboard.
2. **Dashboard** — Shows total receipts count + monthly amount, recent receipts. No weekly stats or averages. No export here
3. **"+" button** — Opens a bottom sheet popup with two options: "Maak foto" or "Upload vanuit galerij"
4. **Image capture** — "Maak foto" opens camera (mobile) or file picker (desktop). "Upload" opens file picker. Image is compressed client-side (max 1920px, JPEG 80%)
5. **Controleer gegevens** (`/receipt/new`) — User fills in: datum, totaalbedrag, BTW% (9%/21%/geen), bedrag excl. BTW (auto-berekend), betaalmethode, categorie, extra informatie. Receipt image visible at the bottom. Later: OCR pre-fills these fields
6. **Saved** — Image uploaded to Supabase Storage, receipt saved to database, user returns to dashboard
7. **Bonnetjes lijst** (`/receipts`) — Browse all receipts sorted newest first (by `created_at`), with category filter tabs (+ button to manage). No search bar.
   - Each item: datum (bold, left) + bedrag • BTW% • categorie label (right)
   - "+" button (blue, first in row) opens bottom sheet to add/delete categories
   - Export: later toevoegen
8. **Opening existing receipt** (`/receipt/[id]`) — Tapping a receipt opens the same "Controleer gegevens" form with all fields pre-filled + image at bottom. Same `ReceiptForm` component as new receipt
9. **Instellingen** (`/settings`) — Accessible via round settings button in the header (top-right), not in the bottom nav
10. **Account aanmaken (optioneel)** — In Settings, anonymous users can upgrade to a full account (email + password) via `updateUser()`. Same user_id is retained, all data stays linked. Without an account: clearing browser data = losing access to receipts

---

## Security

| Measure | What it does |
|---------|-------------|
| **Supabase Anonymous Auth** | Users get a real `auth.uid()` without login — data is isolated per device session |
| **Supabase RLS** | Database-level enforcement — users can only read/write their own data, even if the frontend is bypassed |
| **API Route protection** | Every API endpoint verifies the Supabase auth token before processing |
| **Image upload validation** | Max 10MB file size, only JPEG/PNG accepted, validated server-side |
| **API key protection** | Google Vision API key is only used server-side in API routes, never exposed to the frontend |
| **Environment variables** | All secrets stored in `.env.local`, never committed to version control |

### Anonymous Auth — aandachtspunten
- Browser data wissen = anonieme sessie kwijt (waarschuwen in settings)
- Geen cross-device sync voor anonieme users
- Later: CAPTCHA toevoegen tegen abuse
- Later: cleanup job voor verlaten anonieme accounts (30+ dagen)

