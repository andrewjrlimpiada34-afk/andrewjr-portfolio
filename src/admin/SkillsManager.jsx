import { useState } from 'react'
import { ImagePlus, Pencil, Plus, Trash2, X } from 'lucide-react'
import { supabase } from '../lib/supabase'

const categoryLabel = {
  skill: 'Skills',
  techstack: 'TechStacks',
}

const matchesCategory = (value, category) => value === category
  || (category === 'skill' && value === 'service')
  || (category === 'techstack' && value === 'technology')

const normalizeCategory = (category) => {
  if (category === 'service') return 'skill'
  if (category === 'technology') return 'techstack'
  return category
}

async function uploadSkillImage(imageFile) {
  const extension = imageFile.name.split('.').pop()?.toLowerCase() || 'png'
  const path = `skills/${Date.now()}-${crypto.randomUUID()}.${extension}`
  const upload = await supabase.storage.from('portfolio-projects').upload(path, imageFile, { upsert: false })
  if (upload.error) return { error: upload.error }
  return { imageUrl: supabase.storage.from('portfolio-projects').getPublicUrl(path).data.publicUrl }
}

function SkillsManager({ skills, refresh }) {
  const [form, setForm] = useState({ name: '', category: 'techstack' })
  const [imageFile, setImageFile] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState(null)
  const [editImageFile, setEditImageFile] = useState(null)
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  const addSkill = async (event) => {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    let imageUrl = null

    if (imageFile) {
      const result = await uploadSkillImage(imageFile)
      if (result.error) {
        setMessage(result.error.message)
        setSaving(false)
        return
      }
      imageUrl = result.imageUrl
    }

    const categorySkills = skills.filter((skill) => matchesCategory(skill.category, form.category))
    const { error } = await supabase.from('skills').insert({
      name: form.name.trim(),
      category: form.category,
      image_url: imageUrl,
      sort_order: categorySkills.length + 1,
    })

    setSaving(false)
    if (error) setMessage(error.message)
    else {
      setForm((current) => ({ ...current, name: '' }))
      setImageFile(null)
      await refresh()
    }
  }

  const openEdit = (skill) => {
    setEditingId(skill.id)
    setEditForm({
      name: skill.name,
      category: normalizeCategory(skill.category),
      image_url: skill.image_url || '',
      sort_order: Number(skill.sort_order) || 0,
    })
    setEditImageFile(null)
    setMessage('')
  }

  const updateEditField = (event) => {
    const { name, value } = event.target
    setEditForm((current) => ({
      ...current,
      [name]: name === 'sort_order' ? Number(value) : value,
    }))
  }

  const saveEdit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    let imageUrl = editForm.image_url?.trim() || null

    if (editImageFile) {
      const result = await uploadSkillImage(editImageFile)
      if (result.error) {
        setMessage(result.error.message)
        setSaving(false)
        return
      }
      imageUrl = result.imageUrl
    }

    const { error } = await supabase.from('skills').update({
      name: editForm.name.trim(),
      category: editForm.category,
      image_url: imageUrl,
      sort_order: Number(editForm.sort_order),
    }).eq('id', editingId)

    setSaving(false)
    if (error) {
      setMessage(error.message)
      return
    }

    setEditingId(null)
    setEditForm(null)
    setEditImageFile(null)
    await refresh()
  }

  const closeEdit = () => {
    setEditingId(null)
    setEditForm(null)
    setEditImageFile(null)
    setMessage('')
  }

  const removeSkill = async (skill) => {
    if (!window.confirm(`Remove ${skill.name}?`)) return
    const { error } = await supabase.from('skills').delete().eq('id', skill.id)
    if (error) setMessage(error.message)
    else await refresh()
  }

  return (
    <section className="admin-section">
      <div className="admin-section-heading">
        <div><p>Capabilities</p><h2>TechStacks & Skills</h2></div>
      </div>

      <form className="admin-quick-form skill-form" onSubmit={addSkill}>
        <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Add a TechStack or Skill" required />
        <select value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}>
          <option value="techstack">TechStack</option>
          <option value="skill">Skill</option>
        </select>
        <label className="admin-skill-upload">
          <ImagePlus size={17} />
          <span>{imageFile ? imageFile.name : 'Add picture'}</span>
          <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={(event) => setImageFile(event.target.files?.[0] || null)} />
        </label>
        <button className="admin-primary" type="submit" disabled={saving}><Plus size={17} /> {saving ? 'Adding...' : 'Add'}</button>
      </form>

      {message && !editingId && <p className="admin-inline-message">{message}</p>}

      {['skill', 'techstack'].map((category) => (
        <div className="admin-skill-group" key={category}>
          <h3>{categoryLabel[category]}</h3>
          <div className="admin-skill-list">
            {skills.filter((skill) => matchesCategory(skill.category, category)).map((skill) => (
              <span key={skill.id}>
                {skill.image_url
                  ? <img src={skill.image_url} alt="" />
                  : <i>{skill.name.slice(0, 1).toUpperCase()}</i>}
                <b>{skill.name}</b>
                <button className="edit" type="button" onClick={() => openEdit(skill)} aria-label={`Edit ${skill.name}`}><Pencil size={13} /></button>
                <button type="button" onClick={() => removeSkill(skill)} aria-label={`Remove ${skill.name}`}><Trash2 size={13} /></button>
              </span>
            ))}
          </div>
        </div>
      ))}

      {editingId && editForm && (
        <div className="admin-modal-backdrop" role="presentation">
          <form className="admin-modal admin-skill-modal" onSubmit={saveEdit}>
            <div className="admin-modal-heading">
              <div><p>Update capability</p><h2>{editForm.name}</h2></div>
              <button className="icon-button" type="button" onClick={closeEdit} aria-label="Close"><X size={20} /></button>
            </div>

            <label><span>Name</span><input name="name" value={editForm.name} onChange={updateEditField} required /></label>
            <div className="admin-form-grid">
              <label>
                <span>Type</span>
                <select name="category" value={editForm.category} onChange={updateEditField}>
                  <option value="techstack">TechStack</option>
                  <option value="skill">Skill</option>
                </select>
              </label>
              <label><span>Display order</span><input name="sort_order" type="number" min="0" value={editForm.sort_order} onChange={updateEditField} required /></label>
            </div>

            <label><span>Existing image URL <small>(optional)</small></span><input name="image_url" value={editForm.image_url} onChange={updateEditField} placeholder="https://..." /></label>

            {editForm.image_url && !editImageFile && (
              <div className="admin-skill-preview"><img src={editForm.image_url} alt="Current capability" /><span>Current picture</span></div>
            )}

            <label className="admin-upload">
              <ImagePlus size={20} />
              <span>{editImageFile ? editImageFile.name : 'Upload a replacement picture'}</span>
              <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={(event) => setEditImageFile(event.target.files?.[0] || null)} />
            </label>

            {message && <p className="admin-error">{message}</p>}
            <button className="admin-primary full" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</button>
          </form>
        </div>
      )}
    </section>
  )
}

export default SkillsManager
