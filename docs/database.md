# Database Schema

All data is stored in Supabase (PostgreSQL). This document covers all tables, indexes, row-level security policies, and the storage bucket for receipt images.

---

## Table: `profiles`

Stores basic user info in the `public` schema. A database trigger automatically inserts a row here whenever a new user signs up via Supabase Auth. This is needed because `auth.users` lives in a restricted schema your app can't query directly.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Matches the user's `auth.users` ID |
| `display_name` | TEXT | User's chosen display name |
| `email` | TEXT | User's email address |
| `created_at` | TIMESTAMPTZ | When the profile was created |
| `updated_at` | TIMESTAMPTZ | Last profile update |

---

## Table: `categories`

Each user can have custom categories to organize their receipts. Some categories are presets (available to all users).

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_preset BOOLEAN DEFAULT FALSE,
  icon TEXT, -- icon name (no emojis in UI)
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Auto-generated unique ID |
| `user_id` | UUID | Owner of the category |
| `name` | TEXT | Category name (e.g. "Groceries", "Transport") |
| `is_preset` | BOOLEAN | `true` = available to all users, `false` = custom |
| `icon` | TEXT | Icon identifier for display (no emojis in UI) |
| `created_at` | TIMESTAMPTZ | When the category was created |

---

## Table: `receipts`

The core table — every scanned receipt is stored here with its OCR-extracted data and metadata.

```sql
CREATE TABLE receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,

  -- OCR-extracted data
  store_name TEXT,                          -- extracted by OCR but not displayed in UI
  date DATE,
  total_amount DECIMAL(10,2),
  tax_percentage DECIMAL(5,2),
  tax_amount DECIMAL(10,2),
  payment_method TEXT, -- 'cash', 'pin', 'creditcard', 'ideal', etc.
  currency TEXT DEFAULT 'EUR',

  -- User input
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  extra_info TEXT,                           -- was "notes", renamed to "extra informatie"

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
```

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Auto-generated unique ID |
| `user_id` | UUID | Owner of the receipt |
| `store_name` | TEXT | Store name extracted by OCR (stored but not displayed in UI) |
| `date` | DATE | Receipt date extracted by OCR |
| `total_amount` | DECIMAL(10,2) | Total amount on receipt |
| `tax_percentage` | DECIMAL(5,2) | VAT percentage (e.g. 21.00) |
| `tax_amount` | DECIMAL(10,2) | VAT amount in currency |
| `payment_method` | TEXT | How it was paid: cash, pin, creditcard, ideal |
| `currency` | TEXT | Defaults to EUR |
| `category_id` | UUID | User-assigned category (nullable) |
| `extra_info` | TEXT | Optional extra information (renamed from "notes") |
| `image_url` | TEXT | Public URL to the receipt image |
| `image_path` | TEXT | Storage path in Supabase bucket |
| `raw_ocr_text` | TEXT | Full text returned by Google Vision |
| `ocr_confidence` | DECIMAL(3,2) | Confidence score (0.00–1.00) |
| `created_at` | TIMESTAMPTZ | When the receipt was added |
| `updated_at` | TIMESTAMPTZ | Last edit timestamp |

### Indexes

```sql
CREATE INDEX idx_receipts_user_id ON receipts(user_id);
CREATE INDEX idx_receipts_date ON receipts(date DESC);
CREATE INDEX idx_receipts_category ON receipts(category_id);
```

| Index | Purpose |
|-------|---------|
| `idx_receipts_user_id` | Fast lookup of all receipts for a user |
| `idx_receipts_date` | Sort receipts by date (newest first) |
| `idx_receipts_category` | Filter receipts by category |

---

## Row Level Security (RLS)

RLS ensures each user can only access their own data. These policies are enforced at the database level — even if someone bypasses the frontend, they can't read other users' data.

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

| Table | Rule |
|-------|------|
| `receipts` | Users can only read/write their own receipts |
| `categories` | Users see their own categories + all presets |
| `profiles` | Users can only access their own profile |

---

## Storage Bucket

Receipt images are stored in a private Supabase Storage bucket called `receipts`. Each user's images are stored in a subfolder named after their user ID.

```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', false);

CREATE POLICY "Users manage own receipt images"
ON storage.objects FOR ALL
USING (bucket_id = 'receipts' AND auth.uid()::text = (storage.foldername(name))[1]);
```

**How it works:**
- Images are stored at: `receipts/{user_id}/filename.jpg`
- `public: false` — images are not publicly accessible
- The RLS policy checks that the first folder in the path matches the authenticated user's ID
- Users can only upload, view, and delete their own images
