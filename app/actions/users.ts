'use server'

import { createClient }      from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath }    from 'next/cache'

export async function deleteUser(userId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.user_metadata?.is_admin) throw new Error('Unauthorized')

  const admin = createAdminClient()
  await admin.auth.admin.deleteUser(userId)
  revalidatePath('/admin/users')
}
