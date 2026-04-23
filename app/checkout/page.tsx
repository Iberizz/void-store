import { createClient } from '@/lib/supabase/server'
import CheckoutClient from './CheckoutClient'

export const metadata = { title: 'Checkout — VØID' }

export default async function CheckoutPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return <CheckoutClient userEmail={user?.email ?? ''} />
}
