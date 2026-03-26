'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { ReceiptForm } from '@/components/ReceiptForm'

export default function EditReceiptPage() {
  const { id } = useParams<{ id: string }>()
  const [receipt, setReceipt] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadReceipt() {
      const { data } = await supabase
        .from('receipts')
        .select('*')
        .eq('id', id)
        .single()

      if (data) setReceipt(data)
      setLoading(false)
    }

    if (id) loadReceipt()
  }, [id])

  if (loading) {
    return <p className="py-12 text-center text-muted-foreground">Laden...</p>
  }

  if (!receipt) {
    return <p className="py-12 text-center text-muted-foreground">Bonnetje niet gevonden</p>
  }

  return <ReceiptForm receipt={receipt} />
}
