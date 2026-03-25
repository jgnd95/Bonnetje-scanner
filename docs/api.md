# API Endpoints & OCR Pipeline

All API routes are Next.js server-side route handlers in `src/app/api/`. They are protected by Supabase auth — every request must include a valid auth token.

---

## OCR Endpoint

**`POST /api/ocr`**

Receives a base64-encoded receipt image, sends it to Google Cloud Vision, and returns the extracted data.

### Request
```json
{
  "imageBase64": "data:image/jpeg;base64,/9j/4AAQ..."
}
```

### Response
```json
{
  "store_name": "Albert Heijn",
  "date": "2024-03-15",
  "total_amount": 27.85,
  "tax_percentage": 21.00,
  "tax_amount": 4.83,
  "payment_method": "pin",
  "raw_text": "ALBERT HEIJN\n...",
  "confidence": 0.87
}
```

All fields except `raw_text` and `confidence` can be `null` if the OCR couldn't extract them.

### Error Responses
- `401` — Not authenticated
- `400` — Missing or invalid image
- `500` — Google Vision API error

---

## Export Endpoint

**`GET /api/export`**

Downloads the user's receipts as a CSV file, optionally filtered by date range.

### Query Parameters
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `format` | string | Yes | `csv` (Excel support via SheetJS) |
| `from` | string | No | Start date (YYYY-MM-DD) |
| `to` | string | No | End date (YYYY-MM-DD) |

### Example
```
GET /api/export?format=csv&from=2024-01-01&to=2024-12-31
```

### Response
A downloadable CSV file with columns: date, store, amount, VAT, payment method, category.

---

## OCR Pipeline

This is the full flow from photo to stored receipt:

```
Photo → Compression/Resize → Supabase Storage
                                    │
                            Google Cloud Vision
                            (TEXT_DETECTION)
                                    │
                            parse-receipt.ts
                                    │
                            Show to user (can correct)
                                    │
                            Save to database
```

### Step-by-step

1. **Photo capture** — User takes a photo or uploads an image
2. **Compression** — Image is resized/compressed client-side to reduce upload size
3. **Upload** — Image is stored in Supabase Storage (`receipts/{user_id}/filename.jpg`)
4. **OCR request** — The base64 image is sent to `POST /api/ocr`
5. **Google Cloud Vision** — Uses `TEXT_DETECTION` to extract all text from the image
6. **Receipt parsing** (`parse-receipt.ts`) — Extracts structured data from raw text using:

| Parser | What it finds | Method |
|--------|---------------|--------|
| Date | Receipt date | Regex for DD-MM-YYYY, DD/MM/YYYY, etc. |
| Total amount | Final price | Regex for keywords like TOTAAL, TE BETALEN, TOTAL |
| VAT | Tax percentage & amount | Regex for BTW, VAT patterns |
| Payment method | How it was paid | Regex for PIN, CONTANT, CASH, VISA, MASTERCARD |
| Store name | Name of the store | Heuristic: typically the first 1-2 lines of text |
| Confidence | Overall reliability | Score based on how many fields were successfully extracted |

7. **Review screen** — User sees the extracted data and can correct any mistakes
8. **Save** — Corrected data is saved to the `receipts` table in the database
