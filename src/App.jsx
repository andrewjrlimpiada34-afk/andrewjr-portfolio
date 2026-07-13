import { lazy, Suspense, useCallback, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import LoadingScreen from './components/LoadingScreen'
import BottomRedirect from './components/BottomRedirect'
import Navbar from './components/Navbar'
import usePortfolioData from './hooks/usePortfolioData'
import About from './sections/About'
import Contact from './sections/Contact'
import Hero from './sections/Hero'
import Projects from './sections/Projects'
import Services from './sections/Services'
import './App.css'

const AdminApp = lazy(() => import('./admin/AdminApp'))

function Portfolio() {
  const { projects, skills, techStacks, loading } = usePortfolioData()
  const [showIntro, setShowIntro] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const finishIntro = useCallback(() => setShowIntro(false), [])

  return (
    <>
      <AnimatePresence>{showIntro && <LoadingScreen onComplete={finishIntro} />}</AnimatePresence>
      <main className="portfolio-main">
        <Navbar />
        <div className="intro-shell">
          <Hero />
          <About />
        </div>
        <Projects projects={projects} loading={loading} />
        <Services skills={skills} techStacks={techStacks} />
        <Contact />
        <BottomRedirect />
      </main>
    </>
  )
}

function App() {
  return window.location.pathname.startsWith('/admin')
    ? <Suspense fallback={<main className="admin-auth-page"><div className="admin-loading"><i /><span>Loading admin...</span></div></main>}><AdminApp /></Suspense>
    : <Portfolio />
}

export default App
