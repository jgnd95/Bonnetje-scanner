'use client'

import { useEffect, useState } from 'react'

export default function NewReceiptPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    const url = sessionStorage.getItem('pendingImage')
    if (url) setImageUrl(url)
  }, [])

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold">Controleer gegevens</h2>
      <p className="text-sm text-muted-foreground">Formulier komt in stap 6</p>

      {imageUrl && (
        <div className="overflow-hidden rounded-2xl border border-border">
          <img src={imageUrl} alt="Bonnetje" className="w-full" />
        </div>
      )}
    </div>
  )
}
