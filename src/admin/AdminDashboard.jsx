import { useCallback, useEffect, useState } from 'react'
import { BarChart3, BriefcaseBusiness, ExternalLink, LogOut, MessageSquareText, Sparkles } from 'lucide-react'
import { supabase } from '../lib/supabase'
import FeedbackManager from './FeedbackManager'
import ProjectManager from './ProjectManager'
import SkillsManager from './SkillsManager'

const tabs = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'projects', label: 'Projects', icon: BriefcaseBusiness },
  { id: 'skills', label: 'Skills', icon: Sparkles },
  { id: 'feedback', label: 'Feedback', icon: MessageSquareText },
]

function AdminDashboard({ session }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [projects, setProjects] = useState([])
  const [skills, setSkills] = useState([])
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    setLoading(true)
    const [projectResult, skillResult, feedbackResult] = await Promise.all([
      supabase.from('projects').select('*').order('sort_order'),
      supabase.from('skills').select('*').order('sort_order'),
      supabase.from('feedback').select('*').order('created_at', { ascending: false }),
    ])
    const firstError = projectResult.error || skillResult.error || feedbackResult.error
    if (firstError) {
      setError(firstError.code === '42P01'
        ? 'Database tables are not created yet. Run supabase/schema.sql in the Supabase SQL Editor.'
        : firstError.message)
    } else {
      setError('')
      setProjects(projectResult.data || [])
      setSkills(skillResult.data || [])
      setFeedback(feedbackResult.data || [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(refresh, 0)
    return () => window.clearTimeout(timer)
  }, [refresh])

  const signOut = async () => {
    await supabase.auth.signOut()
    window.location.assign('/admin')
  }

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="/"><img src="/logo.webp" alt="" /><span>Andrew<br /><small>Admin panel</small></span></a>
        <nav>
          {tabs.map((tab) => {
            const Icon = tab.icon
            return <button className={activeTab === tab.id ? 'active' : ''} type="button" onClick={() => setActiveTab(tab.id)} key={tab.id}><Icon size={18} />{tab.label}{tab.id === 'feedback' && feedback.filter((item) => item.status === 'new').length > 0 && <span>{feedback.filter((item) => item.status === 'new').length}</span>}</button>
          })}
        </nav>
        <div className="admin-sidebar-footer">
          <a href="/" target="_blank" rel="noreferrer"><ExternalLink size={16} /> View portfolio</a>
          <button type="button" onClick={signOut}><LogOut size={16} /> Sign out</button>
        </div>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div><p>Portfolio control center</p><h1>{tabs.find((tab) => tab.id === activeTab)?.label}</h1></div>
          <div className="admin-user"><span>{session.user.email?.slice(0, 1).toUpperCase()}</span><div><strong>Administrator</strong><small>{session.user.email}</small></div></div>
        </header>

        {error && <div className="admin-setup-warning"><strong>Setup required</strong><p>{error}</p><code>supabase/schema.sql</code></div>}
        {loading && <div className="admin-loading"><i /><span>Syncing dashboard...</span></div>}

        {!loading && !error && activeTab === 'overview' && (
          <section className="admin-overview">
            <div className="admin-stat-grid">
              <article><BriefcaseBusiness /><span>Projects</span><strong>{projects.length}</strong><small>Published case studies</small></article>
              <article><Sparkles /><span>Skills</span><strong>{skills.length}</strong><small>Services and technologies</small></article>
              <article><MessageSquareText /><span>New feedback</span><strong>{feedback.filter((item) => item.status === 'new').length}</strong><small>{feedback.length} total messages</small></article>
            </div>
            <div className="admin-overview-grid">
              <article className="admin-panel">
                <div className="admin-panel-heading"><div><p>Recent</p><h2>Latest projects</h2></div><button type="button" onClick={() => setActiveTab('projects')}>Manage</button></div>
                {projects.slice(0, 4).map((project) => <div className="admin-list-row" key={project.id}><img src={project.image_url} alt="" /><div><strong>{project.title}</strong><span>{project.type}</span></div><small>{project.number}</small></div>)}
              </article>
              <article className="admin-panel">
                <div className="admin-panel-heading"><div><p>Inbox</p><h2>Latest feedback</h2></div><button type="button" onClick={() => setActiveTab('feedback')}>Open</button></div>
                {feedback.length === 0 && <div className="admin-empty"><MessageSquareText size={26} /><p>No feedback yet.</p></div>}
                {feedback.slice(0, 4).map((item) => <div className="admin-message-row" key={item.id}><span>{item.name.slice(0, 1).toUpperCase()}</span><div><strong>{item.name}</strong><p>{item.message}</p></div><i className={item.status} /></div>)}
              </article>
            </div>
          </section>
        )}
        {!loading && !error && activeTab === 'projects' && <ProjectManager projects={projects} refresh={refresh} />}
        {!loading && !error && activeTab === 'skills' && <SkillsManager skills={skills} refresh={refresh} />}
        {!loading && !error && activeTab === 'feedback' && <FeedbackManager feedback={feedback} refresh={refresh} />}
      </section>
    </main>
  )
}

export default AdminDashboard
