import { useMemo, useState } from 'react'
import { ImagePlus, Pencil, Plus, Trash2, X } from 'lucide-react'
import { supabase } from '../lib/supabase'

const blankProject = {
  number: '', title: '', type: '', image_url: '', tone: 'blue',
  background: '', solution: '', sort_order: 0,
}

function ProjectManager({ projects, refresh }) {
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(blankProject)
  const [imageFile, setImageFile] = useState(null)
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  const orderedProjects = useMemo(
    () => [...projects].sort((a, b) => a.sort_order - b.sort_order),
    [projects],
  )

  const openForm = (project = null) => {
    setEditing(project?.id || 'new')
    setForm(project ? { ...project } : { ...blankProject, number: String(projects.length + 1).padStart(2, '0'), sort_order: projects.length + 1 })
    setImageFile(null)
    setMessage('')
  }

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: name === 'sort_order' ? Number(value) : value }))
  }

  const saveProject = async (event) => {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    let imageUrl = form.image_url

    if (imageFile) {
      const extension = imageFile.name.split('.').pop()?.toLowerCase() || 'png'
      const path = `${Date.now()}-${crypto.randomUUID()}.${extension}`
      const upload = await supabase.storage.from('portfolio-projects').upload(path, imageFile, { upsert: false })
      if (upload.error) {
        setMessage(upload.error.message)
        setSaving(false)
        return
      }
      imageUrl = supabase.storage.from('portfolio-projects').getPublicUrl(path).data.publicUrl
    }

    const payload = {
      number: form.number.trim(),
      title: form.title.trim(),
      type: form.type.trim(),
      image_url: imageUrl.trim(),
      tone: form.tone,
      background: form.background.trim(),
      solution: form.solution.trim(),
      sort_order: Number(form.sort_order),
    }

    const result = editing === 'new'
      ? await supabase.from('projects').insert(payload)
      : await supabase.from('projects').update(payload).eq('id', editing)

    setSaving(false)
    if (result.error) {
      setMessage(result.error.message)
      return
    }
    setEditing(null)
    setForm(blankProject)
    await refresh()
  }

  const deleteProject = async (project) => {
    if (!window.confirm(`Delete ${project.title}? This cannot be undone.`)) return
    const { error } = await supabase.from('projects').delete().eq('id', project.id)
    if (error) setMessage(error.message)
    else await refresh()
  }

  return (
    <section className="admin-section">
      <div className="admin-section-heading">
        <div><p>Content library</p><h2>Projects</h2></div>
        <button className="admin-primary" type="button" onClick={() => openForm()}><Plus size={17} /> Add project</button>
      </div>

      {message && <p className="admin-inline-message">{message}</p>}

      <div className="admin-project-grid">
        {orderedProjects.map((project) => (
          <article className="admin-project-card" key={project.id}>
            <img src={project.image_url} alt="" />
            <div>
              <span>{project.number} / {project.type}</span>
              <h3>{project.title}</h3>
              <p>{project.background}</p>
              <div className="admin-card-actions">
                <button type="button" onClick={() => openForm(project)}><Pencil size={15} /> Edit</button>
                <button className="danger" type="button" onClick={() => deleteProject(project)}><Trash2 size={15} /> Delete</button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {editing && (
        <div className="admin-modal-backdrop" role="presentation">
          <form className="admin-modal" onSubmit={saveProject}>
            <div className="admin-modal-heading">
              <div><p>{editing === 'new' ? 'Create' : 'Update'}</p><h2>{editing === 'new' ? 'New project' : form.title}</h2></div>
              <button className="icon-button" type="button" onClick={() => setEditing(null)} aria-label="Close"><X size={20} /></button>
            </div>
            <div className="admin-form-grid three">
              <label><span>Number</span><input name="number" value={form.number} onChange={updateField} required /></label>
              <label><span>Type</span><input name="type" value={form.type} onChange={updateField} required /></label>
              <label><span>Order</span><input name="sort_order" type="number" value={form.sort_order} onChange={updateField} required /></label>
            </div>
            <label><span>Title</span><input name="title" value={form.title} onChange={updateField} required /></label>
            <div className="admin-form-grid">
              <label><span>Color tone</span><select name="tone" value={form.tone} onChange={updateField}><option value="blue">Blue</option><option value="lime">Lime</option><option value="lilac">Lilac</option><option value="peach">Peach</option></select></label>
              <label><span>Existing image URL</span><input name="image_url" value={form.image_url} onChange={updateField} required={!imageFile} placeholder="/projects/image.png or https://..." /></label>
            </div>
            <label className="admin-upload"><ImagePlus size={20} /><span>{imageFile ? imageFile.name : 'Upload a replacement project image'}</span><input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => setImageFile(event.target.files?.[0] || null)} /></label>
            <label><span>Background</span><textarea name="background" value={form.background} onChange={updateField} rows="3" required /></label>
            <label><span>Solution</span><textarea name="solution" value={form.solution} onChange={updateField} rows="3" required /></label>
            {message && <p className="admin-error">{message}</p>}
            <button className="admin-primary full" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save project'}</button>
          </form>
        </div>
      )}
    </section>
  )
}

export default ProjectManager
