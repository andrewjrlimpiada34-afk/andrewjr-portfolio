import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import TechBadge from '../components/TechBadge'

const wrapIndex = (index, length) => (index + length) % length

function relativePosition(index, activeIndex, length) {
  let position = index - activeIndex
  if (position > length / 2) position -= length
  if (position < -length / 2) position += length
  return position
}

function SkillCarousel({ items }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (items.length < 2 || prefersReducedMotion) return undefined
    const timer = window.setInterval(() => {
      setActiveIndex((current) => wrapIndex(current + 1, items.length))
    }, 5200)
    return () => window.clearInterval(timer)
  }, [items.length, prefersReducedMotion])

  if (!items.length) return null

  const selectedIndex = activeIndex % items.length

  const move = (direction) => {
    setActiveIndex((current) => wrapIndex(current + direction, items.length))
  }

  return (
    <div className="skill-showcase">
      <div className="skill-carousel" aria-roledescription="carousel" aria-label="Skills">
        {items.map((item, index) => {
          const position = relativePosition(index, selectedIndex, items.length)
          const isActive = position === 0
          const isVisible = Math.abs(position) <= 2

          return (
            <motion.article
              className="skill-slide"
              key={item.id || item.name}
              animate={{
                x: `${position * 78}%`,
                scale: isActive ? 1 : Math.abs(position) === 1 ? 0.86 : 0.72,
                opacity: isVisible ? (isActive ? 1 : Math.abs(position) === 1 ? 0.48 : 0.18) : 0,
                filter: isActive ? 'blur(0px)' : `blur(${Math.abs(position) === 1 ? 2 : 5}px)`,
              }}
              transition={{ type: 'spring', stiffness: 165, damping: 24, mass: 0.8 }}
              style={{ zIndex: isActive ? 5 : 4 - Math.abs(position) }}
              drag={isActive && items.length > 1 ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.16}
              onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) > 55) move(info.offset.x < 0 ? 1 : -1)
              }}
              aria-hidden={!isActive}
            >
              <div className="skill-slide-media">
                {item.image
                  ? <img src={item.image} alt="" loading={isActive ? 'eager' : 'lazy'} />
                  : <span aria-hidden="true">{item.name.slice(0, 2).toUpperCase()}</span>}
              </div>
              <div className="skill-slide-copy">
                <small>Featured skill</small>
                <h4>{item.name}</h4>
              </div>
            </motion.article>
          )
        })}

        {items.length > 1 && (
          <>
            <button className="carousel-arrow previous" type="button" onClick={() => move(-1)} aria-label="Previous skill">
              <ChevronLeft size={20} />
            </button>
            <button className="carousel-arrow next" type="button" onClick={() => move(1)} aria-label="Next skill">
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {items.length > 1 && (
        <div className="carousel-dots" aria-label="Choose a skill">
          {items.map((item, index) => (
            <button
              className={index === selectedIndex ? 'active' : ''}
              key={item.id || item.name}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show ${item.name}`}
              aria-current={index === selectedIndex ? 'true' : undefined}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function Skills({ skills, techStacks }) {
  return (
    <div className="skills-column">
      <div className="capability-group skill-group">
        <h3>Skills</h3>
        <SkillCarousel items={skills} />
      </div>

      <div className="capability-group techstack-group">
        <h3>TechStacks</h3>
        <div className="techstack-grid">
          {techStacks.map((item, index) => (
            <motion.div
              key={item.id || item.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.35, delay: index * 0.035 }}
            >
              <TechBadge item={item} compact />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Skills
