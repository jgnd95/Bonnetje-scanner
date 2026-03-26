'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth/provider'
import { supabase } from '@/lib/supabase/client'
import { BottomSheet } from '@/components/BottomSheet'

interface Receipt {
  id: string
  date: string | null
  total_amount: number | null
  tax_percentage: number | null
  category_id: string | null
  category: { name: string }[] | null
}

interface Category {
  id: string
  name: string
  is_preset: boolean
}

export default function ReceiptsPage() {
  const { user } = useAuth()
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Category management
  const [catSheetOpen, setCatSheetOpen] = useState(false)
  const [newCatName, setNewCatName] = useState('')

  useEffect(() => {
    if (!user) return
    loadReceipts()
    loadCategories()
  }, [user])

  async function loadReceipts() {
    const { data } = await supabase
      .from('receipts')
      .select('id, date, total_amount, tax_percentage, category_id, category:categories(name)')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false })

    if (data) setReceipts(data as Receipt[])
    setLoading(false)
  }

  async function loadCategories() {
    const { data } = await supabase
      .from('categories')
      .select('id, name, is_preset')
      .order('name')

    if (data) setCategories(data)
  }

  async function addCategory() {
    if (!newCatName.trim() || !user) return

    const { error } = await supabase.from('categories').insert({
      user_id: user.id,
      name: newCatName.trim(),
    })

    if (!error) {
      setNewCatName('')
      loadCategories()
    }
  }

  async function deleteCategory(id: string) {
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (!error) loadCategories()
  }

  const filtered = activeFilter
    ? receipts.filter((r) => r.category_id === activeFilter)
    : receipts

  function formatDate(dateStr: string | null) {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  function formatAmount(amount: number | null) {
    if (amount === null) return '—'
    return `€ ${amount.toFixed(2).replace('.', ',')}`
  }

  return (
    <div className="space-y-4">
      {/* Category filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveFilter(null)}
          className={`shrink-0 cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition ${
            activeFilter === null
              ? 'bg-primary text-primary-foreground'
              : 'bg-surface text-muted-foreground'
          }`}
        >
          Alles
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveFilter(cat.id)}
            className={`shrink-0 cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition ${
              activeFilter === cat.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-surface text-muted-foreground'
            }`}
          >
            {cat.name}
          </button>
        ))}
        <button
          onClick={() => setCatSheetOpen(true)}
          className="shrink-0 cursor-pointer rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground transition hover:text-foreground"
        >
          Categorieën
        </button>
      </div>

      {/* Receipts list */}
      {loading ? (
        <p className="py-12 text-center text-sm text-muted-foreground">Laden...</p>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <svg className="mb-4 h-12 w-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-muted-foreground">Nog geen bonnetjes</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((receipt) => (
            <Link
              key={receipt.id}
              href={`/receipt/${receipt.id}`}
              className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 transition active:opacity-80"
            >
              <span className="font-medium">{formatDate(receipt.date)}</span>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{formatAmount(receipt.total_amount)}</span>
                {receipt.tax_percentage && (
                  <>
                    <span>•</span>
                    <span>{receipt.tax_percentage}%</span>
                  </>
                )}
                {receipt.category?.[0] && (
                  <>
                    <span>•</span>
                    <span className="rounded-md bg-border px-2 py-0.5 text-xs font-medium text-foreground">
                      {receipt.category[0].name}
                    </span>
                  </>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Categories bottom sheet */}
      <BottomSheet open={catSheetOpen} onClose={() => setCatSheetOpen(false)}>
        <div className="space-y-4">
          <h2 className="text-center text-lg font-bold">Categorieën</h2>

          {/* Add new category */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="Nieuwe categorie..."
              onKeyDown={(e) => e.key === 'Enter' && addCategory()}
              className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none"
            />
            <button
              onClick={addCategory}
              disabled={!newCatName.trim()}
              className="cursor-pointer rounded-xl bg-primary px-4 py-3 font-medium text-primary-foreground disabled:opacity-50"
            >
              +
            </button>
          </div>

          {/* Category list */}
          <div className="space-y-2">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between rounded-xl border border-border bg-background p-3"
              >
                <span>{cat.name}</span>
                {!cat.is_preset && (
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className="cursor-pointer text-sm text-destructive"
                  >
                    Verwijder
                  </button>
                )}
              </div>
            ))}
            {categories.length === 0 && (
              <p className="py-4 text-center text-sm text-muted-foreground">
                Nog geen categorieën
              </p>
            )}
          </div>
        </div>
      </BottomSheet>
    </div>
  )
}
