import Reveal from '../components/Reveal'
import Skills from './Skills'

function Services({ skills, techStacks }) {
  return (
    <section className="services" id="services">
      <Reveal className="services-intro">
        <p className="eyebrow dark">Capabilities</p>
        <h2>TechStacks<br />& Skills</h2>
        <p>Explore my core skills, then browse the compact toolkit I use to turn ideas into working products.</p>
      </Reveal>
      <Skills skills={skills} techStacks={techStacks} />
    </section>
  )
}

export default Services
