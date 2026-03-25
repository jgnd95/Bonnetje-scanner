'use client'

import { useAuth } from '@/lib/auth/context'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SettingsPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    try {
      await signOut()
      router.push('/auth/login')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-surface border border-border rounded-2xl p-6">
        <h2 className="font-bold mb-4">Account</h2>
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-gray-400">Email</p>
            <p className="font-medium">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-6">
        <h2 className="font-bold mb-4">App</h2>
        <p className="text-sm text-gray-400 mb-4">Versie: 1.0.0 (Phase 1)</p>
      </div>

      <button
        onClick={handleLogout}
        disabled={loading}
        className="w-full py-3 border border-danger text-danger rounded-full hover:bg-danger/10 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
      >
        {loading ? 'Bezig...' : 'Uitloggen'}
      </button>
    </div>
  )
}
