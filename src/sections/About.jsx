import { GraduationCap } from 'lucide-react'
import Reveal from '../components/Reveal'
import SectionTransition from '../components/SectionTransition'

function About() {
  return (
    <section className="about" id="about">
      <div className="about-intro">
        <Reveal as="h2">About<br />Me</Reveal>
        <Reveal className="about-lead" delay={0.08}>
          I am a passionate junior developer who enjoys learning new technologies
          and building practical, user-centered applications.
        </Reveal>
        <Reveal className="about-note" delay={0.14}>
          As I grow in this field, my goal is to create efficient, meaningful, and
          impactful digital solutions while embracing every opportunity to learn and innovate.
        </Reveal>
      </div>

      <div className="about-story">
        <Reveal className="reader-card" delay={0.12}>
          <span>Always learning</span>
          <img src="/meread.png" alt="Andrew reading a book" />
        </Reveal>
        <Reveal className="about-detail" delay={0.18}>
          <span className="about-detail-icon" aria-hidden="true"><GraduationCap size={21} /></span>
          <p>
            I continuously improve my skills through hands-on projects, exploring
            modern web development, UI/UX design, and software engineering best practices.
          </p>
        </Reveal>
      </div>
      <SectionTransition to="surface" label="Projects Highlights" />
    </section>
  )
}

export default About
