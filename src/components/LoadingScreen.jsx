import { useEffect } from 'react'
import { motion } from 'framer-motion'

function LoadingScreen({ onComplete }) {
  useEffect(() => {
    const timer = window.setTimeout(onComplete, 1700)
    return () => window.clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      className="loading-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.45 } }}
    >
      <div className="loading-panel">
        <div className="loading-status">
          <span><i /> System ready</span>
          <span>Portfolio 2026</span>
          <span>UI loading</span>
        </div>
        <div className="loading-copy">
          <p>Initializing experience</p>
          <h1>Welcome to<br />my portfolio.</h1>
        </div>
        <div className="loading-track"><motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.25, ease: 'easeInOut' }} /></div>
        <div className="loading-meta"><span>Core UI</span><strong>Online</strong></div>
      </div>
    </motion.div>
  )
}

export default LoadingScreen
