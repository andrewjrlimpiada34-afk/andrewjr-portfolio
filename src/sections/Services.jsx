import Reveal from '../components/Reveal'
import Skills from './Skills'

function Services({ services, technologies }) {
  return (
    <section className="services" id="services">
      <Reveal className="services-intro">
        <p className="eyebrow dark">What I do</p>
        <h2>TechStacks and Skills</h2>
        <p>Let your idea become a clear, useful digital experience.</p>
      </Reveal>
      <Skills services={services} technologies={technologies} />
    </section>
  )
}

export default Services
