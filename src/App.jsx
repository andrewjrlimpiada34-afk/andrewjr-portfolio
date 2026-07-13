import { useState } from 'react'
import { ArrowDownRight, Menu, X } from 'lucide-react'
import './App.css'

const projects = [
  {
    number: '01',
    title: 'LabCab Kiosk',
    type: 'Kiosk Application',
    image: '/projects/labcabkiosk.png',
    tone: 'blue',
    background:
      'A smart laboratory cabinet interface designed to simplify equipment registration, borrowing, and returns.',
    solution:
      'A clear, task-first kiosk experience with oversized actions, status visibility, and an interface built for quick use in the lab.',
  },
  {
    number: '02',
    title: 'LabCab Web App',
    type: 'Web Application',
    image: '/projects/labcabwebapp.png',
    tone: 'lime',
    background:
      'An administrative dashboard for monitoring laboratory assets, borrowers, stock alerts, and system health.',
    solution:
      'A focused command hub that brings real-time activity and inventory data into one structured, easy-to-scan workspace.',
  },
  {
    number: '03',
    title: 'Cooking Ina',
    type: 'Community Platform',
    image: '/projects/recipe.png',
    tone: 'lilac',
    background:
      'A community cooking platform where people can document food memories, discover recipes, and share their own dishes.',
    solution:
      'A warm, approachable dashboard that organizes discovery, diary entries, saved recipes, and profiles around visual storytelling.',
  },
  {
    number: '04',
    title: 'Severino',
    type: 'E-commerce Website',
    image: '/projects/severino.png',
    tone: 'peach',
    background:
      'A refined online storefront for a fragrance collection inspired by the visual language of premium lifestyle brands.',
    solution:
      'An editorial shopping experience with strong typography, elegant spacing, and product-focused browsing that feels calm and luxurious.',
  },
]

const services = [
  'Website Development',
  'Frontend Development',
  'UI / UX Design',
  'Responsive Interfaces',
  'Design Prototyping',
  'Software Engineering',
]

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Andrew Limpiada, home">
          <img src="/logo.webp" alt="" />
          <span>Andrew B. Limpiada Jr.</span>
        </a>

        <button
          className="menu-button"
          type="button"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={19} /> : <Menu size={19} />}
        </button>

        <nav className={menuOpen ? 'nav open' : 'nav'} aria-label="Main navigation">
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#projects" onClick={closeMenu}>Projects</a>
          <a href="#services" onClick={closeMenu}>Services</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Junior developer · UI/UX enthusiast</p>
          <h1>My<br />Portfolio</h1>
          <a className="round-link" href="#projects" aria-label="View projects">
            <ArrowDownRight size={24} />
          </a>
        </div>
        <div className="hero-portrait">
          <span className="portrait-glow" />
          <img src="/ME.png" alt="Andrew B. Limpiada Jr." />
        </div>
      </section>

      <section className="about" id="about">
        <h2>About Me</h2>
        <p className="about-lead">
          I am a passionate junior developer who enjoys learning new technologies
          and building practical, user-centered applications.
        </p>
        <p className="about-note">
          As I grow in this field, my goal is to create efficient, meaningful, and
          impactful digital solutions while embracing every opportunity to learn and innovate.
        </p>
        <div className="reader-card">
          <span>Always learning</span>
          <img src="/meread.png" alt="Andrew reading a book" />
        </div>
        <p className="about-detail">
          I continuously improve my skills through hands-on projects, exploring
          modern web development, UI/UX design, and software engineering best practices.
        </p>
      </section>

      <section className="highlights" id="projects">
        <div className="section-heading">
          <p className="eyebrow dark">Selected work · 2025—26</p>
          <h2>Projects Highlights</h2>
        </div>
        <div className="highlight-grid">
          {projects.map((project) => (
            <a className="highlight" href={`#project-${project.number}`} key={project.number}>
              <span>{project.number}</span>
              <img src={project.image} alt={`${project.title} interface preview`} />
              <strong>{project.title}</strong>
            </a>
          ))}
        </div>
      </section>

      <section className="project-list" aria-label="Project case studies">
        {projects.map((project) => (
          <article className={`project-band ${project.tone}`} id={`project-${project.number}`} key={project.number}>
            <div className="project-title-row">
              <div>
                <span className="project-index">Project {project.number}</span>
                <h2>{project.title}</h2>
              </div>
              <span className="project-type">{project.type}</span>
            </div>
            <div className="case-layout">
              <div className="case-copy">
                <div>
                  <span>01</span>
                  <p><strong>Background</strong>{project.background}</p>
                </div>
                <div>
                  <span>02</span>
                  <p><strong>Solution</strong>{project.solution}</p>
                </div>
              </div>
              <figure>
                <img src={project.image} alt={`${project.title} project screenshot`} />
              </figure>
            </div>
          </article>
        ))}
      </section>

      <section className="services" id="services">
        <div className="services-intro">
          <p className="eyebrow dark">What I do</p>
          <h2>Services</h2>
          <p>Let your idea become a clear, useful digital experience.</p>
        </div>
        <div className="service-list">
          {services.map((service, index) => (
            <div key={service}>
              <span>0{index + 1}</span>
              <p>{service}</p>
            </div>
          ))}
        </div>
      </section>

      <footer>
        <div>
          <p className="eyebrow">Open to opportunities</p>
          <h2>Let’s make<br />something useful.</h2>
        </div>
        <a href="#top">Back to top <ArrowDownRight size={18} /></a>
        <p>© 2026 Andrew B. Limpiada Jr.</p>
      </footer>
    </main>
  )
}

export default App
