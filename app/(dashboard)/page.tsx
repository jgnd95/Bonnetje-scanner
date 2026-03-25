'use client'

import { useAuth } from '@/lib/auth/context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Laden...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-surface border border-border rounded-2xl p-6 text-center">
        <h2 className="text-2xl font-bold mb-2">Welkom!</h2>
        <p className="text-gray-400 mb-4">
          {user?.email}
        </p>
        <p className="text-sm text-gray-500">
          Phase 1: Foundation in progress...
        </p>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-6">
        <h3 className="font-bold mb-4">Dashboard</h3>
        <div className="text-gray-400 text-sm">
          <p>📊 Totale bonnetjes: 0</p>
          <p>💰 Totaal bedrag: € 0,00</p>
        </div>
      </div>
    </div>
  )
}
