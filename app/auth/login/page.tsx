'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth/context'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signIn(email, password)
      router.push('/')
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Email of wachtwoord is onjuist'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Bonnetje Scanner</h1>
        <p className="text-gray-400 mt-2">Inloggen</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="je@voorbeeld.com"
            required
            className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:border-accent text-white"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            Wachtwoord
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:border-accent text-white"
          />
        </div>

        {error && (
          <div className="p-3 bg-danger/10 border border-danger text-danger rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-accent text-white font-medium rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Bezig...' : 'Inloggen'}
        </button>
      </form>

      <div className="text-center">
        <p className="text-gray-400">
          Nog geen account?{' '}
          <Link href="/auth/register" className="text-accent hover:underline">
            Registreer
          </Link>
        </p>
      </div>
    </div>
  )
}
