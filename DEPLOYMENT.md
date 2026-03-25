# Deployment Guide — Phase 1

## Supabase Database Setup

### Step 1: Open SQL Editor
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select project: **Bonnetje Scanner**
3. Click **SQL Editor** in the left sidebar
4. Click **+ New query**

### Step 2: Initialize Database
Copy the entire content from [`scripts/init-database.sql`](scripts/init-database.sql) and paste it into the SQL Editor.

Then click **Run** (or press `Ctrl+Enter`).

You should see green checkmarks for each statement completing successfully.

### Step 3: Verify Setup

Check that all tables were created:
1. Go to **Table Editor** in the left sidebar
2. You should see three tables:
   - `profiles`
   - `categories`
   - `receipts`
3. Click each table to verify columns

Check that storage bucket exists:
1. Go to **Storage** in the left sidebar
2. You should see a bucket called `receipts`

### Step 4: Test Auth

1. Run `npm run dev` locally
2. Navigate to http://localhost:3000
3. You should be redirected to `/auth/login`
4. Click "Registreer" and create a test account
5. After registration, you should see the Dashboard

If you see an error about profiles table, check:
- The `handle_new_user()` trigger was created
- RLS policies are enabled on all tables

## Local Development

### Run dev server:
```bash
npm run dev
```

Opens at: http://localhost:3000

### Build for production:
```bash
npm run build
npm start
```

## Environment Variables

Your `.env.local` already has:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`

These are safe (public) — no secrets here.

## What's Next (Phase 2)

After schema is deployed:
1. Build scan bottom sheet popup
2. Integrate Google Cloud Vision API
3. Create "Controleer gegevens" screen
4. Test receipt uploading and OCR

---

**Need help?** Check [database.md](docs/database.md) for schema details.
