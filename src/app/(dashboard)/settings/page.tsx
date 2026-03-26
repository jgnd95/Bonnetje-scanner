'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth/provider'

export default function SettingsPage() {
  const { user, isAnonymous, upgradeAccount } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      await upgradeAccount(email, password)
      setSuccess(true)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Er is iets misgegaan'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Account section */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-bold">Account</h2>
        {isAnonymous ? (
          <p className="mt-2 text-sm text-muted-foreground">
            Je gebruikt een gastaccount. Maak een account aan om je gegevens te
            bewaren op meerdere apparaten.
          </p>
        ) : (
          <div className="mt-2 text-sm">
            <p className="text-muted-foreground">Email</p>
            <p className="font-medium">{user?.email}</p>
          </div>
        )}
      </div>

      {/* Upgrade form — only for anonymous users */}
      {isAnonymous && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-bold">Account aanmaken</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Je bonnetjes blijven gekoppeld aan je account.
          </p>

          <form onSubmit={handleUpgrade} className="mt-4 space-y-4">
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
                disabled={loading}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none disabled:opacity-50"
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
                placeholder="Minimaal 6 tekens"
                required
                minLength={6}
                disabled={loading}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none disabled:opacity-50"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-lg border border-green-500 bg-green-500/10 p-3 text-sm text-green-500">
                Account aangemaakt! Check je email om te bevestigen.
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:brightness-110 active:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Bezig...' : 'Account aanmaken'}
            </button>
          </form>
        </div>
      )}

      {/* App info */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-bold">App</h2>
        <p className="mt-2 text-sm text-muted-foreground">Versie 1.0.0</p>
      </div>

      {/* Warning for anonymous users */}
      {isAnonymous && (
        <p className="text-center text-xs text-muted-foreground px-4">
          Let op: zonder account raak je je gegevens kwijt als je je browserdata wist.
        </p>
      )}
    </div>
  )
}
