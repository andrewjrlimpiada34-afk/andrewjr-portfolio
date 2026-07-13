import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  FolderKanban,
  Home,
  LayoutDashboard,
  Menu,
  MessageCircle,
  Moon,
  Sun,
  UserRound,
  Wrench,
  X,
} from 'lucide-react'

const navigation = [
  { label: 'Home', href: '#top', id: 'top', icon: Home },
  { label: 'About', href: '#about', id: 'about', icon: UserRound },
  { label: 'Projects', href: '#projects', id: 'projects', icon: FolderKanban },
  { label: 'Skills', href: '#services', id: 'services', icon: Wrench },
  { label: 'Connect', href: '#contact', id: 'contact', icon: MessageCircle },
]

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('top')
  const [scrolled, setScrolled] = useState(false)
  const [theme, setTheme] = useState(() => window.localStorage.getItem('portfolio-theme') || 'light')
  const [themeNotice, setThemeNotice] = useState('')
  const [switchingTheme, setSwitchingTheme] = useState(false)
  const themeTimer = useRef(null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('portfolio-theme', theme)
  }, [theme])

  useEffect(() => () => window.clearTimeout(themeTimer.current), [])

  useEffect(() => {
    const onScroll = () => {
      const isScrolled = window.scrollY > 70
      setScrolled(isScrolled)
      if (isScrolled) setMenuOpen(false)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = navigation.map((item) => document.getElementById(item.id)).filter(Boolean)
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActiveSection(visible.target.id)
      },
      { rootMargin: '-25% 0px -60%', threshold: [0.05, 0.2, 0.5] },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  const closeMenu = () => setMenuOpen(false)

  const toggleTheme = () => {
    if (switchingTheme) return
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setSwitchingTheme(true)
    setThemeNotice(nextTheme === 'dark' ? 'You are about to go dark mode' : 'You are about to go light mode')
    themeTimer.current = window.setTimeout(() => {
      setTheme(nextTheme)
      setThemeNotice('')
      setSwitchingTheme(false)
    }, 900)
  }

  const ThemeIcon = theme === 'dark' ? Sun : Moon

  return (
    <>
      <header className={scrolled ? 'site-header scrolled' : 'site-header'}>
      <a className="brand" href="#top" aria-label="Andrew Limpiada, home" onClick={closeMenu}>
        <img src="/logo.webp" alt="" />
        <span>Andrew B. Limpiada Jr.</span>
      </a>

      <nav className="desktop-nav" aria-label="Main navigation">
        {navigation.map((item) => (
          <a className={activeSection === item.id ? 'active' : ''} href={item.href} key={item.id}>
            {item.label}
            {activeSection === item.id && <motion.span layoutId="active-desktop-navigation" />}
          </a>
        ))}
      </nav>

      <nav className="mobile-icon-nav" aria-label="Quick navigation">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <a className={activeSection === item.id ? 'active' : ''} href={item.href} aria-label={item.label} title={item.label} key={item.id}>
              {activeSection === item.id && <motion.span layoutId="active-mobile-navigation" />}
              <Icon size={19} />
            </a>
          )
        })}
      </nav>

      <button
        className="theme-toggle desktop-theme-toggle"
        type="button"
        onClick={toggleTheme}
        disabled={switchingTheme}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        aria-pressed={theme === 'dark'}
        title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
      >
        <ThemeIcon size={17} />
      </button>

      <a className="admin-link" href="/admin" aria-label="Open admin dashboard">
        <LayoutDashboard size={16} /> Admin
      </a>

      <button className="menu-button" type="button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
        {menuOpen ? <X size={19} /> : <Menu size={19} />}
      </button>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav className="mobile-nav" aria-label="Mobile navigation" initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }}>
            {navigation.map((item, index) => (
              <motion.a href={item.href} onClick={closeMenu} key={item.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
                <span>0{index + 1}</span>{item.label}
              </motion.a>
            ))}
            <a href="/admin" onClick={closeMenu}><LayoutDashboard size={18} /> Admin dashboard</a>
            <motion.button className="mobile-theme-toggle" type="button" onClick={toggleTheme} disabled={switchingTheme} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: navigation.length * 0.05 }}>
              <ThemeIcon size={18} /> {theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            </motion.button>
          </motion.nav>
        )}
      </AnimatePresence>
      </header>

      <AnimatePresence>
        {themeNotice && (
          <motion.div
            className="theme-notice"
            role="status"
            initial={{ opacity: 0, y: -18, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 330, damping: 24 }}
          >
            <ThemeIcon size={17} />
            <span>{themeNotice}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
