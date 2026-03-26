'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { BottomSheet } from '@/components/BottomSheet'
import { ScanSheet } from '@/components/ScanSheet'
import { compressImage } from '@/lib/image'

export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [scanOpen, setScanOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    const compressed = await compressImage(file)
    const url = URL.createObjectURL(compressed)
    sessionStorage.setItem('pendingImage', url)
    sessionStorage.setItem('pendingImageName', file.name)
    router.push('/receipt/new')
  }

  function handleCamera() {
    setScanOpen(false)
    // On mobile, input with capture="environment" opens the camera directly
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'environment')
      fileInputRef.current.click()
    }
  }

  function handleUpload() {
    setScanOpen(false)
    if (fileInputRef.current) {
      fileInputRef.current.removeAttribute('capture')
      fileInputRef.current.click()
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
        onChange={handleFileChange}
      />

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface">
        <div className="mx-auto flex max-w-md items-center justify-evenly py-2">
          {/* Home */}
          <Link
            href="/"
            className={`flex h-12 w-12 items-center justify-center rounded-lg transition ${
              pathname === '/' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-8 7 8M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </Link>

          {/* Scan button */}
          <button
            onClick={() => setScanOpen(true)}
            className="-mt-6 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_2px_12px_rgba(37,99,235,0.4)] transition hover:brightness-110 active:opacity-80"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>

          {/* Bonnetjes */}
          <Link
            href="/receipts"
            className={`flex h-12 w-12 items-center justify-center rounded-lg transition ${
              pathname === '/receipts' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </Link>
        </div>
      </nav>

      <BottomSheet open={scanOpen} onClose={() => setScanOpen(false)}>
        <ScanSheet onCamera={handleCamera} onUpload={handleUpload} />
      </BottomSheet>
    </>
  )
}
