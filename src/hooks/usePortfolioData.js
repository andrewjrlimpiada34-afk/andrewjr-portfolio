import { useCallback, useEffect, useState } from 'react'
import fallbackProjects from '../data/projects'
import { services as fallbackServices, technologies as fallbackTechnologies } from '../data/skills'
import { isSupabaseConfigured, normalizeProject, supabase } from '../lib/supabase'

function usePortfolioData() {
  const [projects, setProjects] = useState(fallbackProjects)
  const [services, setServices] = useState(fallbackServices)
  const [technologies, setTechnologies] = useState(fallbackTechnologies)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  const refresh = useCallback(async () => {
    if (!supabase) {
      setLoading(false)
      return
    }

    const [projectResult, skillResult] = await Promise.all([
      supabase.from('projects').select('*').order('sort_order'),
      supabase.from('skills').select('*').order('sort_order'),
    ])

    if (!projectResult.error && projectResult.data?.length) {
      setProjects(projectResult.data.map(normalizeProject))
    }

    if (!skillResult.error && skillResult.data?.length) {
      const serviceRows = skillResult.data.filter((skill) => skill.category === 'service')
      const technologyRows = skillResult.data.filter((skill) => skill.category === 'technology')
      if (serviceRows.length) setServices(serviceRows.map((skill) => skill.name))
      if (technologyRows.length) setTechnologies(technologyRows.map((skill) => skill.name))
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(refresh, 0)
    return () => window.clearTimeout(timer)
  }, [refresh])

  return { projects, services, technologies, loading, refresh }
}

export default usePortfolioData
