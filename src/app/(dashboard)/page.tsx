'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth/provider'
import { supabase } from '@/lib/supabase/client'

interface Receipt {
  id: string
  date: string | null
  total_amount: number | null
  tax_percentage: number | null
  category: { name: string }[] | null
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [loading, setLoading] = useState(true)

  const now = new Date()
  const monthName = now.toLocaleString('nl-NL', { month: 'long' })
  const year = now.getFullYear()
  const monthStart = `${year}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
  const monthEnd = `${year}-${String(now.getMonth() + 1).padStart(2, '0')}-31`

  useEffect(() => {
    if (!user) return

    async function loadReceipts() {
      const { data } = await supabase
        .from('receipts')
        .select('id, date, total_amount, tax_percentage, category:categories(name)')
        .eq('user_id', user!.id)
        .gte('date', monthStart)
        .lte('date', monthEnd)
        .order('date', { ascending: false })

      if (data) setReceipts(data as Receipt[])
      setLoading(false)
    }

    loadReceipts()
  }, [user, monthStart, monthEnd])

  const totalAmount = receipts.reduce((sum, r) => sum + (r.total_amount || 0), 0)
  const recentReceipts = receipts.slice(0, 5)

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
    <div className="space-y-6">
      {/* Monthly total */}
      <div className="rounded-2xl border border-border bg-card p-6 text-center">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {monthName} {year}
        </p>
        <p className="mt-2 text-3xl font-bold">
          {formatAmount(totalAmount)}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {receipts.length} bonnetje{receipts.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Recent receipts */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-bold">Recente bonnetjes</h2>
          {receipts.length > 0 && (
            <Link href="/receipts" className="text-sm text-primary">
              Alles bekijken
            </Link>
          )}
        </div>

        {loading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Laden...</p>
        ) : recentReceipts.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card py-8 text-center">
            <p className="text-muted-foreground">Nog geen bonnetjes deze maand</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentReceipts.map((receipt) => (
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
      </div>
    </div>
  )
}
