'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function BottomNav() {
  const pathname = usePathname()

  const isActive = (href: string) => pathname === href

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border py-3 px-4">
      <div className="max-w-md mx-auto flex justify-around items-end">
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg transition ${
            isActive('/') ? 'text-accent' : 'text-gray-400 hover:text-white'
          }`}
        >
          <HomeIcon />
        </Link>

        {/* Scan button */}
        <button className="relative -top-6 flex flex-col items-center justify-center w-14 h-14 bg-accent rounded-full shadow-lg shadow-accent/40 hover:bg-blue-600 transition">
          <PlusIcon />
        </button>

        {/* Receipts */}
        <Link
          href="/receipts"
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg transition ${
            isActive('/receipts') ? 'text-accent' : 'text-gray-400 hover:text-white'
          }`}
        >
          <ReceiptIcon />
        </Link>
      </div>
    </nav>
  )
}

function HomeIcon() {
  return (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 4v4m0 0H9m4 0h4"
      />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg
      className="w-6 h-6 text-white"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4v16m8-8H4"
      />
    </svg>
  )
}

function ReceiptIcon() {
  return (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  )
}
