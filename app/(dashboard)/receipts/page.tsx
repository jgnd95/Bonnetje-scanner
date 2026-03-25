'use client'

export default function ReceiptsPage() {
  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <p className="text-gray-400">Nog geen bonnetjes</p>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-6">
        <h3 className="font-bold mb-4">Functies in development</h3>
        <ul className="text-sm text-gray-400 space-y-2">
          <li>✓ Bonnetjes uploaden</li>
          <li>✓ Filteren op categorie</li>
          <li>✓ Categorieën beheren</li>
        </ul>
      </div>
    </div>
  )
}
