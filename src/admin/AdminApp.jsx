import { useEffect, useState } from 'react'
import AdminDashboard from './AdminDashboard'
import AdminLogin from './AdminLogin'
import { ADMIN_EMAIL, isSupabaseConfigured, supabase } from '../lib/supabase'

function AdminApp() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!supabase) return undefined

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setLoading(false)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  if (!isSupabaseConfigured) {
    return <main className="admin-auth-page"><div className="admin-login-card"><h1>Configuration required</h1><p>Add the Supabase environment variables before using the admin dashboard.</p><a href="/">Back to portfolio</a></div></main>
  }

  if (loading) return <main className="admin-auth-page"><div className="admin-loading"><i /><span>Checking session...</span></div></main>
  if (!session) return <AdminLogin />

  if (session.user.email?.toLowerCase() !== ADMIN_EMAIL) {
    supabase.auth.signOut()
    return <main className="admin-auth-page"><div className="admin-login-card"><h1>Access denied</h1><p>This account is not authorized to manage the portfolio.</p><a href="/admin">Try another account</a></div></main>
  }

  return <AdminDashboard session={session} />
}

export default AdminApp
