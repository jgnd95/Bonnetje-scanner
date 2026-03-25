-- Bonnetje Scanner Database Initialization
-- Run this in Supabase SQL Editor to initialize the database

-- ============================================
-- 1. CREATE PROFILES TABLE + TRIGGER
-- ============================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own profile" ON profiles
  FOR ALL USING (auth.uid() = id);

-- Trigger to automatically create profile on signup
CREATE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (new.id, new.email, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 2. CREATE CATEGORIES TABLE
-- ============================================

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_preset BOOLEAN DEFAULT FALSE,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own categories" ON categories
  FOR ALL USING (auth.uid() = user_id OR is_preset = true);

-- ============================================
-- 3. CREATE RECEIPTS TABLE
-- ============================================

CREATE TABLE receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,

  -- OCR-extracted data
  store_name TEXT,
  date DATE,
  total_amount DECIMAL(10,2),
  tax_percentage DECIMAL(5,2),
  tax_amount DECIMAL(10,2),
  payment_method TEXT,
  currency TEXT DEFAULT 'EUR',

  -- User input
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  extra_info TEXT,

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

ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own receipts" ON receipts
  FOR ALL USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_receipts_user_id ON receipts(user_id);
CREATE INDEX idx_receipts_date ON receipts(date DESC);
CREATE INDEX idx_receipts_category ON receipts(category_id);

-- ============================================
-- 4. CREATE STORAGE BUCKET
-- ============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', false);

CREATE POLICY "Users manage own receipt images"
ON storage.objects FOR ALL
USING (bucket_id = 'receipts' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================
-- Done! Database is ready for use
-- ============================================
