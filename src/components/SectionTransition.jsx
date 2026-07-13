import { useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

function SectionTransition({ to = 'surface', label = 'next section' }) {
  const [active, setActive] = useState(false)
  const played = useRef(false)
  const prefersReducedMotion = useReducedMotion()

  const startTransition = () => {
    if (played.current || prefersReducedMotion) return
    played.current = true
    setActive(true)
  }

  const resetTransition = () => {
    played.current = false
    setActive(false)
  }

  return (
    <motion.div
      className={`section-transition transition-to-${to}`}
      title={`Next: ${label}`}
      aria-hidden="true"
      onViewportEnter={startTransition}
      onViewportLeave={resetTransition}
      viewport={{ amount: 0.75, margin: '0px 0px -4% 0px' }}
    >
      <motion.span
        className="section-transition-orb"
        aria-hidden="true"
        animate={prefersReducedMotion ? undefined : {
          rotate: [0, 110, 245, 360],
          y: [0, -4, 2, 0],
          scale: [1, 1.06, 0.95, 1],
          borderRadius: ['50% 45% 52% 48%', '43% 57% 46% 54%', '56% 44% 58% 42%', '50% 45% 52% 48%'],
        }}
        transition={{ duration: 6.8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <AnimatePresence>
        {active && (
          <>
            <motion.span
              className="section-transition-drop"
              aria-hidden="true"
              initial={{ opacity: 0, y: -8, scale: 0.45 }}
              animate={{ opacity: [0, 1, 1, 0], y: [-8, 5, 52, 92], scale: [0.45, 0.8, 1, 0.72] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, times: [0, 0.18, 0.72, 1], ease: 'easeIn' }}
              onAnimationComplete={() => setActive(false)}
            />
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default SectionTransition
