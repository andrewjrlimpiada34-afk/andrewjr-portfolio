import { useState } from 'react'
import { ArrowLeft, LockKeyhole } from 'lucide-react'
import { ADMIN_EMAIL, supabase } from '../lib/supabase'

function AdminLogin() {
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const login = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    const { error } = await supabase.auth.signInWithPassword({ email: ADMIN_EMAIL, password })
    setLoading(false)
    if (error) setMessage(error.message)
  }

  return (
    <main className="admin-auth-page">
      <form className="admin-login-card" onSubmit={login}>
        <div className="admin-lock"><LockKeyhole size={26} /></div>
        <p className="admin-kicker">Protected area</p>
        <h1>Admin Login</h1>
        <p>Sign in with the only email authorized to manage this portfolio.</p>
        <label>
          <span>Email</span>
          <input type="email" value={ADMIN_EMAIL} readOnly aria-readonly="true" />
        </label>
        <label>
          <span>Password</span>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required placeholder="Your Supabase password" />
        </label>
        {message && <p className="admin-error" role="alert">{message}</p>}
        <button type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
        <a href="/"><ArrowLeft size={16} /> Back to portfolio</a>
      </form>
    </main>
  )
}

export default AdminLogin
