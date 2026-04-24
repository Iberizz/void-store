export const dynamic  = 'force-dynamic'
export const metadata = { title: 'Messages — VØID Admin' }

import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import MessagesClient from './MessagesClient'

export default async function AdminMessagesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.user_metadata?.is_admin) return null

  const admin = createAdminClient()
  const { data: messages } = await admin
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })

  const all      = messages ?? []
  const newCount = all.filter(m => m.status === 'new').length

  return (
    <div>
      <div className="mb-10 pb-8 border-b border-void-border">
        <p className="font-sans text-void-muted text-xs tracking-[0.2em] uppercase mb-2">Admin</p>
        <div className="flex items-end justify-between">
          <h1 className="font-display text-4xl md:text-5xl text-void-white tracking-[-0.03em]">Messages.</h1>
          {newCount > 0 && (
            <div className="text-right">
              <p className="font-sans text-void-muted text-xs mb-0.5">Unread</p>
              <p className="font-display text-2xl text-void-green">{newCount} new</p>
            </div>
          )}
        </div>
      </div>

      {all.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-display text-2xl text-void-muted">No messages yet.</p>
        </div>
      ) : (
        <MessagesClient messages={all} />
      )}
    </div>
  )
}
