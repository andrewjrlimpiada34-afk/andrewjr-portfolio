import { useState } from 'react'
import { Send } from 'lucide-react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

const initialForm = { name: '', email: '', message: '', website: '' }

function FeedbackForm() {
  const [form, setForm] = useState(initialForm)
  const [state, setState] = useState({ status: 'idle', message: '' })

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  const submitFeedback = async (event) => {
    event.preventDefault()
    if (form.website) return
    if (!isSupabaseConfigured) {
      setState({ status: 'error', message: 'Feedback storage is not configured yet.' })
      return
    }

    setState({ status: 'loading', message: '' })
    const { error } = await supabase.from('feedback').insert({
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    })

    if (error) {
      const setupMessage = error.code === '42P01'
        ? 'The feedback database still needs its one-time setup.'
        : 'Your message could not be sent. Please try again.'
      setState({ status: 'error', message: setupMessage })
      return
    }

    setForm(initialForm)
    setState({ status: 'success', message: 'Thank you! Your feedback was sent successfully.' })
  }

  return (
    <form className="feedback-form" onSubmit={submitFeedback}>
      <div className="form-grid">
        <label>
          <span>Name</span>
          <input name="name" value={form.name} onChange={updateField} minLength="2" maxLength="80" required placeholder="Your name" />
        </label>
        <label>
          <span>Email</span>
          <input name="email" value={form.email} onChange={updateField} type="email" maxLength="160" required placeholder="you@example.com" />
        </label>
      </div>
      <label className="honeypot" aria-hidden="true">
        Website<input name="website" value={form.website} onChange={updateField} tabIndex="-1" autoComplete="off" />
      </label>
      <label>
        <span>Feedback or message</span>
        <textarea name="message" value={form.message} onChange={updateField} minLength="5" maxLength="2000" required rows="6" placeholder="Tell me what you think, or let's talk about a project..." />
      </label>
      <div className="form-actions">
        <p className={`form-message ${state.status}`} aria-live="polite">{state.message}</p>
        <button type="submit" disabled={state.status === 'loading'}>
          {state.status === 'loading' ? 'Sending...' : 'Send message'} <Send size={16} />
        </button>
      </div>
    </form>
  )
}

export default FeedbackForm
