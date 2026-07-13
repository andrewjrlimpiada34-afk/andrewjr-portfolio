import { motion } from 'framer-motion'
import ProjectCard from '../components/ProjectCard'
import Reveal from '../components/Reveal'
import SectionTransition from '../components/SectionTransition'

function Projects({ projects, loading }) {
  return (
    <>
      <section className="highlights" id="projects">
        <Reveal className="section-heading">
          <p className="eyebrow dark">Selected work / 2025-26</p>
          <h2>Projects Highlights</h2>
        </Reveal>
        <div className={loading ? 'highlight-grid loading' : 'highlight-grid'}>
          {projects.map((project, index) => (
            <motion.a
              className="highlight"
              href={`#project-${project.number}`}
              key={project.id || project.number}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: (index % 2) * 0.08 }}
              whileHover={{ y: -7 }}
            >
              <motion.span
                initial={{ opacity: 0, x: -22, rotate: -5 }}
                whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                animate={{ y: [0, -5, 0] }}
                viewport={{ once: true }}
                transition={{
                  opacity: { duration: 0.45, delay: index * 0.06 },
                  x: { duration: 0.55, delay: index * 0.06 },
                  rotate: { duration: 0.55, delay: index * 0.06 },
                  y: { duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: index * 0.28 },
                }}
              >
                {project.number}
              </motion.span>
              <div className="project-image-frame">
                <img src={project.image} alt={`${project.title} interface preview`} />
              </div>
              <strong>{project.title}</strong>
            </motion.a>
          ))}
        </div>
        <SectionTransition to={projects[0]?.tone || 'surface'} label={projects[0]?.title || 'project case studies'} />
      </section>

      <section className="project-list" aria-label="Project case studies">
        {projects.map((project, index) => (
          <ProjectCard
            project={project}
            nextColor={projects[index + 1]?.tone || 'surface'}
            nextLabel={projects[index + 1]?.title || 'TechStacks and Skills'}
            key={project.id || project.number}
          />
        ))}
      </section>
    </>
  )
}

export default Projects
