import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  FolderKanban,
  Home,
  LayoutDashboard,
  Menu,
  MessageCircle,
  UserRound,
  Wrench,
  X,
} from 'lucide-react'

const navigation = [
  { label: 'Home', href: '#top', id: 'top', icon: Home },
  { label: 'About', href: '#about', id: 'about', icon: UserRound },
  { label: 'Projects', href: '#projects', id: 'projects', icon: FolderKanban },
  { label: 'Services', href: '#services', id: 'services', icon: Wrench },
  { label: 'Connect', href: '#contact', id: 'contact', icon: MessageCircle },
]

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('top')
  const [scrolled, setScrolled] = useState(false)

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

  return (
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
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
