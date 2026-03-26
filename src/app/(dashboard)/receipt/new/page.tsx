'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/provider'
import { supabase } from '@/lib/supabase/client'

export default function NewReceiptPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Form state
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [totalAmount, setTotalAmount] = useState('')
  const [taxPercentage, setTaxPercentage] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [extraInfo, setExtraInfo] = useState('')

  // Categories
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])

  // Calculated fields
  const total = parseFloat(totalAmount) || 0
  const taxPct = parseFloat(taxPercentage) || 0
  const amountExclBtw = taxPct > 0 ? total / (1 + taxPct / 100) : total
  const taxAmount = total - amountExclBtw

  useEffect(() => {
    const url = sessionStorage.getItem('pendingImage')
    if (url) setImageUrl(url)
  }, [])

  useEffect(() => {
    async function loadCategories() {
      const { data } = await supabase
        .from('categories')
        .select('id, name')
        .order('name')
      if (data) setCategories(data)
    }
    loadCategories()
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !imageUrl) return

    setSaving(true)
    setError('')

    try {
      // Convert blob URL to file
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const fileName = `${Date.now()}.jpg`
      const filePath = `${user.id}/${fileName}`

      // Upload image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(filePath, blob, { contentType: 'image/jpeg' })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('receipts')
        .getPublicUrl(filePath)

      // Save receipt to database
      const { error: insertError } = await supabase.from('receipts').insert({
        user_id: user.id,
        date: date || null,
        total_amount: total || null,
        tax_percentage: taxPct || null,
        tax_amount: taxAmount || null,
        payment_method: paymentMethod || null,
        category_id: categoryId || null,
        extra_info: extraInfo || null,
        image_url: urlData.publicUrl,
        image_path: filePath,
      })

      if (insertError) throw insertError

      // Cleanup
      sessionStorage.removeItem('pendingImage')
      sessionStorage.removeItem('pendingImageName')
      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Opslaan mislukt')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold">Controleer gegevens</h2>

      <form onSubmit={handleSave} className="space-y-4">
        {/* 2-column grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Datum — full width */}
          <div className="col-span-2">
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Datum
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          {/* Totaalbedrag */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Totaalbedrag
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-muted-foreground">€</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                placeholder="0,00"
                className="w-full rounded-xl border border-border bg-background py-3.5 pl-8 pr-4 text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* BTW% */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              BTW%
            </label>
            <div className="relative">
              <select
                value={taxPercentage}
                onChange={(e) => setTaxPercentage(e.target.value)}
                className="w-full appearance-none rounded-xl border border-border bg-background px-4 py-3.5 pr-10 text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">Geen</option>
                <option value="9">9%</option>
                <option value="21">21%</option>
              </select>
              <svg className="pointer-events-none absolute right-3 top-4 h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Bedrag excl. BTW (berekend) */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Excl. BTW
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-muted-foreground">€</span>
              <input
                type="text"
                value={taxPct > 0 && total > 0 ? amountExclBtw.toFixed(2) : ''}
                readOnly
                placeholder="—"
                className="w-full rounded-xl border border-border bg-surface py-3.5 pl-8 pr-4 text-muted-foreground"
              />
            </div>
          </div>

          {/* Betaalmethode */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Betaalmethode
            </label>
            <div className="relative">
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full appearance-none rounded-xl border border-border bg-background px-4 py-3.5 pr-10 text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">Kies...</option>
                <option value="pin">Pin</option>
                <option value="cash">Contant</option>
                <option value="creditcard">Creditcard</option>
                <option value="ideal">iDEAL</option>
              </select>
              <svg className="pointer-events-none absolute right-3 top-4 h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Categorie — full width */}
          <div className="col-span-2">
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Categorie
            </label>
            <div className="relative">
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full appearance-none rounded-xl border border-border bg-background px-4 py-3.5 pr-10 text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">Geen categorie</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <svg className="pointer-events-none absolute right-3 top-4 h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Extra informatie — full width */}
          <div className="col-span-2">
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Extra informatie
            </label>
            <textarea
              value={extraInfo}
              onChange={(e) => setExtraInfo(e.target.value)}
              placeholder="Optioneel..."
              rows={2}
              className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3.5 text-foreground focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Save button */}
        <button
          type="submit"
          disabled={saving || !totalAmount}
          className="w-full cursor-pointer rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:brightness-110 active:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? 'Opslaan...' : 'Opslaan'}
        </button>
      </form>

      {/* Receipt image */}
      {imageUrl && (
        <div className="overflow-hidden rounded-2xl border border-border">
          <img src={imageUrl} alt="Bonnetje" className="w-full" />
        </div>
      )}
    </div>
  )
}
