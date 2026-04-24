'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export type MessageStatus = 'new' | 'read' | 'processed'

export async function submitContact(payload: {
  name: string
  email: string
  topic: string
  message: string
}) {
  // Use anon client — anyone can submit (INSERT policy allows it)
  const supabase = await createClient()
  const { error } = await supabase.from('contact_messages').insert(payload)
  if (error) return { error: error.message }
  return { success: true }
}

export async function deleteMessage(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.user_metadata?.is_admin) return { error: 'Unauthorized' }

  const admin = createAdminClient()
  const { error } = await admin.from('contact_messages').delete().eq('id', id)
  if (error) return { error: error.message }
  return { success: true }
}

export async function updateMessageStatus(id: string, status: MessageStatus) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.user_metadata?.is_admin) return { error: 'Unauthorized' }

  const admin = createAdminClient()
  const { error } = await admin
    .from('contact_messages')
    .update({
      status,
      processed_by: status === 'processed' ? user.email : null,
    })
    .eq('id', id)

  if (error) return { error: error.message }
  return { success: true }
}
