'use client'

import { useEffect, useState } from 'react'
import { ReceiptForm } from '@/components/ReceiptForm'

export default function NewReceiptPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    const url = sessionStorage.getItem('pendingImage')
    if (url) setImageUrl(url)
  }, [])

  return <ReceiptForm pendingImageUrl={imageUrl} />
}
