'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/provider'
import { supabase } from '@/lib/supabase/client'

interface ReceiptData {
  id?: string
  date?: string | null
  total_amount?: number | null
  tax_percentage?: number | null
  tax_amount?: number | null
  payment_method?: string | null
  category_id?: string | null
  extra_info?: string | null
  image_url?: string | null
  image_path?: string | null
}

interface ReceiptFormProps {
  receipt?: ReceiptData | null
  pendingImageUrl?: string | null
}

export function ReceiptForm({ receipt, pendingImageUrl }: ReceiptFormProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const isNew = !receipt?.id

  // Form state
  const [date, setDate] = useState(receipt?.date || new Date().toISOString().split('T')[0])
  const [totalAmount, setTotalAmount] = useState(receipt?.total_amount?.toString() || '')
  const [taxPercentage, setTaxPercentage] = useState(receipt?.tax_percentage?.toString() || '')
  const [paymentMethod, setPaymentMethod] = useState(receipt?.payment_method || '')
  const [categoryId, setCategoryId] = useState(receipt?.category_id || '')
  const [extraInfo, setExtraInfo] = useState(receipt?.extra_info || '')

  // Categories
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])

  // Calculated fields
  const total = parseFloat(totalAmount) || 0
  const taxPct = parseFloat(taxPercentage) || 0
  const amountExclBtw = taxPct > 0 ? total / (1 + taxPct / 100) : total
  const taxAmount = total - amountExclBtw

  // Image to display
  const displayImage = pendingImageUrl || receipt?.image_url || null

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
    if (!user) return

    setSaving(true)
    setError('')

    try {
      let imagePath = receipt?.image_path || ''
      let imageUrl = receipt?.image_url || ''

      // Upload new image if pending
      if (pendingImageUrl) {
        const response = await fetch(pendingImageUrl)
        const blob = await response.blob()
        const fileName = `${Date.now()}.jpg`
        const filePath = `${user.id}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('receipts')
          .upload(filePath, blob, { contentType: 'image/jpeg' })

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage
          .from('receipts')
          .getPublicUrl(filePath)

        imagePath = filePath
        imageUrl = urlData.publicUrl
      }

      const receiptData = {
        user_id: user.id,
        date: date || null,
        total_amount: total || null,
        tax_percentage: taxPct || null,
        tax_amount: taxAmount || null,
        payment_method: paymentMethod || null,
        category_id: categoryId || null,
        extra_info: extraInfo || null,
        image_url: imageUrl,
        image_path: imagePath,
      }

      if (isNew) {
        const { error: insertError } = await supabase
          .from('receipts')
          .insert(receiptData)
        if (insertError) throw insertError
      } else {
        const { error: updateError } = await supabase
          .from('receipts')
          .update({ ...receiptData, updated_at: new Date().toISOString() })
          .eq('id', receipt!.id!)
        if (updateError) throw updateError
      }

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
      {displayImage && (
        <div className="overflow-hidden rounded-2xl border border-border">
          <img src={displayImage} alt="Bonnetje" className="w-full" />
        </div>
      )}
    </div>
  )
}
