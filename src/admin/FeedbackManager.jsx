import { Archive, CheckCheck, Mail, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

function FeedbackManager({ feedback, refresh }) {
  const updateStatus = async (id, status) => {
    await supabase.from('feedback').update({ status }).eq('id', id)
    await refresh()
  }

  const deleteFeedback = async (item) => {
    if (!window.confirm(`Delete feedback from ${item.name}?`)) return
    await supabase.from('feedback').delete().eq('id', item.id)
    await refresh()
  }

  return (
    <section className="admin-section">
      <div className="admin-section-heading"><div><p>Messages</p><h2>Feedback inbox</h2></div><span className="admin-count">{feedback.filter((item) => item.status === 'new').length} new</span></div>
      <div className="feedback-inbox">
        {feedback.length === 0 && <div className="admin-empty"><Mail size={28} /><p>No feedback has arrived yet.</p></div>}
        {feedback.map((item) => (
          <article className={`feedback-item ${item.status}`} key={item.id}>
            <div className="feedback-avatar">{item.name.slice(0, 1).toUpperCase()}</div>
            <div className="feedback-content">
              <div><h3>{item.name}</h3><a href={`mailto:${item.email}`}>{item.email}</a><time>{new Date(item.created_at).toLocaleString()}</time></div>
              <p>{item.message}</p>
              <div className="feedback-actions">
                {item.status !== 'read' && <button type="button" onClick={() => updateStatus(item.id, 'read')}><CheckCheck size={15} /> Mark read</button>}
                {item.status !== 'archived' && <button type="button" onClick={() => updateStatus(item.id, 'archived')}><Archive size={15} /> Archive</button>}
                <button className="danger" type="button" onClick={() => deleteFeedback(item)}><Trash2 size={15} /> Delete</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default FeedbackManager
