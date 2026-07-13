import { motion } from 'framer-motion'
import TechBadge from '../components/TechBadge'

function Skills({ services, technologies }) {
  return (
    <div className="skills-column">
      <div className="service-list">
        {services.map((service, index) => (
          <motion.div key={service} initial={{ opacity: 0, x: 25 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <p>{service}</p>
          </motion.div>
        ))}
      </div>
      <div className="tech-stack" aria-label="Technologies and skills">
        {technologies.map((technology, index) => (
          <motion.span key={technology} initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.04 }}>
            <TechBadge>{technology}</TechBadge>
          </motion.span>
        ))}
      </div>
    </div>
  )
}

export default Skills
