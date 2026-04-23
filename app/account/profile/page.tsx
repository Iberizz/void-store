import { createClient } from '@/lib/supabase/server'
import ProfileClient from './ProfileClient'

export const metadata = {
  title: 'Profile — VØID Account',
}

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <ProfileClient
      initialName={(user?.user_metadata?.full_name as string) || ''}
      email={user?.email || ''}
    />
  )
}
