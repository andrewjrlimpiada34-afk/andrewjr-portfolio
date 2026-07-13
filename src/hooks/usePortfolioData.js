import { useCallback, useEffect, useState } from 'react'
import fallbackProjects from '../data/projects'
import { skills as fallbackSkills, techStacks as fallbackTechStacks } from '../data/skills'
import { isSupabaseConfigured, normalizeProject, supabase } from '../lib/supabase'

const normalizeSkill = (skill) => ({
  id: skill.id,
  name: skill.name,
  image: skill.image_url || null,
})

function usePortfolioData() {
  const [projects, setProjects] = useState(fallbackProjects)
  const [skills, setSkills] = useState(fallbackSkills)
  const [techStacks, setTechStacks] = useState(fallbackTechStacks)
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
      const skillRows = skillResult.data.filter((item) => ['skill', 'service'].includes(item.category))
      const techStackRows = skillResult.data.filter((item) => ['techstack', 'technology'].includes(item.category))
      if (skillRows.length) setSkills(skillRows.map(normalizeSkill))
      if (techStackRows.length) setTechStacks(techStackRows.map(normalizeSkill))
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(refresh, 0)
    return () => window.clearTimeout(timer)
  }, [refresh])

  return { projects, skills, techStacks, loading, refresh }
}

export default usePortfolioData
