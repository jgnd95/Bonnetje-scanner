export interface Profile {
  id: string
  display_name: string | null
  email: string | null
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  user_id: string
  name: string
  is_preset: boolean
  icon: string | null
  created_at: string
}

export interface Receipt {
  id: string
  user_id: string
  store_name: string | null
  date: string
  total_amount: number
  tax_percentage: number | null
  tax_amount: number | null
  payment_method: string | null
  currency: string
  category_id: string | null
  extra_info: string | null
  image_url: string
  image_path: string
  raw_ocr_text: string | null
  ocr_confidence: number | null
  created_at: string
  updated_at: string
}
