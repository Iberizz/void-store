import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import AdminSidebar from '@/components/admin/AdminSidebar'

export const dynamic  = 'force-dynamic'
export const metadata = { title: 'Admin — VØID' }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const adminEmail = process.env.ADMIN_EMAIL
  if (adminEmail && user.email !== adminEmail) redirect('/account')

  // Unread messages count for sidebar badge
  const admin = createAdminClient()
  const { count: newMessages } = await admin
    .from('contact_messages')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'new')

  return (
    <div className="min-h-screen bg-void-base">
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        <div className="flex flex-col lg:flex-row gap-12">
          <AdminSidebar user={user} newMessages={newMessages ?? 0} />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  )
}
