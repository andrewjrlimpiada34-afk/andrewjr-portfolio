import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

function ProjectCard({ project }) {
  return (
    <motion.article
      className={`project-band ${project.tone}`}
      id={`project-${project.number}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.7 }}
    >
      <motion.div className="project-title-row" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
        <div>
          <span className="project-index">Project {project.number}</span>
          <h2>{project.title}</h2>
        </div>
        <span className="project-type">{project.type}</span>
      </motion.div>

      <div className="case-layout">
        <motion.div className="case-copy" initial={{ opacity: 0, x: -35 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.65 }}>
          <div>
            <span>01</span>
            <p><strong>Background</strong>{project.background}</p>
          </div>
          <div>
            <span>02</span>
            <p><strong>Solution</strong>{project.solution}</p>
          </div>
          {project.demoUrl && (
            <a className="project-demo-link" href={project.demoUrl} target="_blank" rel="noreferrer">
              View live demo <ExternalLink size={16} />
            </a>
          )}
        </motion.div>
        <motion.figure className="case-image-frame" initial={{ opacity: 0, x: 40, rotate: 0 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.08 }} whileHover={{ y: -8, rotate: 0 }}>
          <img src={project.image} alt={`${project.title} project screenshot`} />
        </motion.figure>
      </div>
    </motion.article>
  )
}

export default ProjectCard
