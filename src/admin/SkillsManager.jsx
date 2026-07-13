import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

function SkillsManager({ skills, refresh }) {
  const [form, setForm] = useState({ name: '', category: 'technology' })
  const [message, setMessage] = useState('')

  const addSkill = async (event) => {
    event.preventDefault()
    const categorySkills = skills.filter((skill) => skill.category === form.category)
    const { error } = await supabase.from('skills').insert({
      name: form.name.trim(),
      category: form.category,
      sort_order: categorySkills.length + 1,
    })
    if (error) setMessage(error.message)
    else {
      setForm((current) => ({ ...current, name: '' }))
      setMessage('')
      await refresh()
    }
  }

  const removeSkill = async (skill) => {
    if (!window.confirm(`Remove ${skill.name}?`)) return
    const { error } = await supabase.from('skills').delete().eq('id', skill.id)
    if (error) setMessage(error.message)
    else await refresh()
  }

  return (
    <section className="admin-section">
      <div className="admin-section-heading"><div><p>Capabilities</p><h2>Skills & services</h2></div></div>
      <form className="admin-quick-form" onSubmit={addSkill}>
        <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Add a skill or service" required />
        <select value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}>
          <option value="technology">Technology</option><option value="service">Service</option>
        </select>
        <button className="admin-primary" type="submit"><Plus size={17} /> Add</button>
      </form>
      {message && <p className="admin-inline-message">{message}</p>}
      {['service', 'technology'].map((category) => (
        <div className="admin-skill-group" key={category}>
          <h3>{category === 'service' ? 'Services' : 'Technologies'}</h3>
          <div className="admin-skill-list">
            {skills.filter((skill) => skill.category === category).map((skill) => (
              <span key={skill.id}>{skill.name}<button type="button" onClick={() => removeSkill(skill)} aria-label={`Remove ${skill.name}`}><Trash2 size={13} /></button></span>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}

export default SkillsManager
