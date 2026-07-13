import { motion } from 'framer-motion'
import { ArrowDownRight } from 'lucide-react'

const copyMotion = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
  }),
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-orbit orbit-one" />
      <div className="hero-orbit orbit-two" />
      <div className="hero-copy">
        <motion.p className="eyebrow" variants={copyMotion} initial="hidden" animate="visible" custom={0.15}>
          <i className="status-dot" /> Junior developer / UI/UX enthusiast
        </motion.p>
        <motion.h1 variants={copyMotion} initial="hidden" animate="visible" custom={0.28}>My<br />Portfolio</motion.h1>
        <motion.a
          className="round-link"
          href="#projects"
          aria-label="View projects"
          variants={copyMotion}
          initial="hidden"
          animate="visible"
          custom={0.42}
          whileHover={{ rotate: -10, scale: 1.06 }}
        >
          <ArrowDownRight size={24} />
        </motion.a>
      </div>
      <motion.div
        className="hero-portrait"
        initial={{ opacity: 0, x: 60, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.span className="portrait-glow" animate={{ scale: [1, 1.045, 1] }} transition={{ duration: 5, repeat: Infinity }} />
        <img src="/ME.png" alt="Andrew B. Limpiada Jr." />
      </motion.div>
    </section>
  )
}

export default Hero
