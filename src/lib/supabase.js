import { createClient } from '@supabase/supabase-js'

const rawUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || ''
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '')
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || ''

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null

export const ADMIN_EMAIL = 'andrewjrlimpiada34@gmail.com'

const safeDemoUrl = (value) => typeof value === 'string' && /^https?:\/\//i.test(value)
  ? value
  : null

export function normalizeProject(project) {
  return {
    id: project.id,
    number: project.number,
    title: project.title,
    type: project.type,
    image: project.image_url || project.image,
    demoUrl: safeDemoUrl(project.demo_url || project.demoUrl),
    tone: project.tone,
    background: project.background,
    solution: project.solution,
    sortOrder: project.sort_order ?? project.sortOrder ?? 0,
  }
}
