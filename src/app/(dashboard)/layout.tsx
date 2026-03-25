import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col">
      <Header />
      <main className="flex-1 px-4 py-6 pb-24">{children}</main>
      <BottomNav />
    </div>
  )
}
