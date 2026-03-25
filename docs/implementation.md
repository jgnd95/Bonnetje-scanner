# Implementation Details

## User Flow

```
Open App → Auto anonymous login → Dashboard (+ Export)
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

1. **Open App** — PWA loads, AuthProvider checks for existing session. If none → automatically signs in anonymously via Supabase. User lands directly on Dashboard.
2. **Dashboard** — Shows total receipts count + monthly amount, export CSV, recent receipts. No weekly stats or averages
4. **"+" button** — Opens a bottom sheet popup with two options: "Maak foto" or "Upload vanuit galerij"
5. **OCR Processing** — Image is sent to Google Vision, data is extracted
6. **Controleer gegevens** — Unified screen for both new and existing receipts. User reviews/edits fields: datum, bruto totaal, BTW%, BTW bedrag, betaalmethode, categorie, extra informatie. Receipt image visible at the bottom
7. **Saved** — Receipt is stored in the database, user returns to dashboard
8. **Bonnetjes lijst** — Browse all receipts sorted newest first, with category filter tabs. No search bar.
   - Each item shows in a single line: datum (left) + meta (bedrag • BTW% • categorie label)
   - No store name displayed
   - Category shown as text label chip, not emoji
   - "Categorieën" button opens bottom sheet to manage categories
9. **Opening existing receipt** — Tapping a receipt opens the same "Controleer gegevens" screen with all fields editable + image at the bottom. No separate detail or edit screen
10. **Instellingen** — Accessible via round settings button in the header (top-right), not in the bottom nav
11. **Account aanmaken (optioneel)** — In Settings, anonymous users can upgrade to a full account (email + password) via `updateUser()`. Same user_id is retained, all data stays linked. Without an account: clearing browser data = losing access to receipts

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

