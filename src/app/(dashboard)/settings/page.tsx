export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-bold">Account</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Nog niet ingelogd
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-bold">App</h2>
        <p className="mt-2 text-sm text-muted-foreground">Versie 1.0.0</p>
      </div>
    </div>
  )
}
