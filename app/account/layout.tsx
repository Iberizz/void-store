import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AccountSidebar from '@/components/account/AccountSidebar'

export const metadata = {
  title: 'My Account — VØID',
}

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  return (
    <div className="min-h-screen bg-void-base">
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        <div className="flex flex-col lg:flex-row gap-12">
          <AccountSidebar user={user} />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  )
}
