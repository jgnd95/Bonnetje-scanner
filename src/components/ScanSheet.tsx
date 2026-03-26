'use client'

interface ScanSheetProps {
  onCamera: () => void
  onUpload: () => void
}

export function ScanSheet({ onCamera, onUpload }: ScanSheetProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-center text-lg font-bold">Bonnetje toevoegen</h2>

      <button
        onClick={onCamera}
        className="flex w-full items-center gap-4 rounded-2xl border border-border bg-background p-4 transition active:opacity-80"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div className="text-left">
          <p className="font-medium">Maak foto</p>
          <p className="text-sm text-muted-foreground">Gebruik je camera</p>
        </div>
      </button>

      <button
        onClick={onUpload}
        className="flex w-full items-center gap-4 rounded-2xl border border-border bg-background p-4 transition active:opacity-80"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="text-left">
          <p className="font-medium">Upload vanuit galerij</p>
          <p className="text-sm text-muted-foreground">Kies een bestaande foto</p>
        </div>
      </button>
    </div>
  )
}
