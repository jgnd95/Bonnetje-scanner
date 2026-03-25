# Implementation Details

## User Flow

```
Open App → Login/Register → Dashboard (+ Export)
                                │
                    ┌───────────┼───────────┐
                    │           │           │
                 Scan/Upload  Receipts   Settings
                    │         (+ Categories)
                    ▼           │
               OCR Processing Detail/Edit
                    │
               Review & Category
                    │
                 Saved!
```

### Flow explanation

1. **Open App** — PWA loads, checks if user is authenticated
2. **Login/Register** — If not authenticated, redirect to login. New users can register
3. **Dashboard** — Shows monthly spending overview, recent receipts, quick stats. Export CSV/Excel from here
4. **Scan/Upload** — User takes a photo with camera or picks an image from gallery
5. **OCR Processing** — Image is sent to Google Vision, data is extracted
6. **Review & Category** — User reviews extracted data, corrects mistakes, picks a category
7. **Saved** — Receipt is stored in the database, user returns to dashboard
8. **Receipts List** — Browse all receipts with category filter tabs, filterable by date and amount. "Manage categories" button opens a bottom sheet to add/edit/delete categories
9. **Detail/Edit** — View a single receipt, edit fields, delete

---

## Security

| Measure | What it does |
|---------|-------------|
| **Supabase RLS** | Database-level enforcement — users can only read/write their own data, even if the frontend is bypassed |
| **API Route protection** | Every API endpoint verifies the Supabase auth token before processing |
| **Image upload validation** | Max 10MB file size, only JPEG/PNG accepted, validated server-side |
| **API key protection** | Google Vision API key is only used server-side in API routes, never exposed to the frontend |
| **Environment variables** | All secrets stored in `.env.local`, never committed to version control |

