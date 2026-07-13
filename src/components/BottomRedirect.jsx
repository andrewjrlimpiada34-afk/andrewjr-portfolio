import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

const isAtPageBottom = () => (
  window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 3
)

function BottomRedirect() {
  const [visible, setVisible] = useState(false)
  const redirecting = useRef(false)
  const touchStartY = useRef(null)
  const redirectTimer = useRef(null)
  const hideTimer = useRef(null)

  const redirectToLanding = useCallback(() => {
    if (redirecting.current) return
    redirecting.current = true
    setVisible(true)

    redirectTimer.current = window.setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#top`)

      hideTimer.current = window.setTimeout(() => {
        setVisible(false)
        redirecting.current = false
      }, 650)
    }, 1450)
  }, [])

  useEffect(() => {
    const onWheel = (event) => {
      if (event.deltaY > 18 && isAtPageBottom()) redirectToLanding()
    }

    const onTouchStart = (event) => {
      touchStartY.current = isAtPageBottom() ? event.touches[0]?.clientY ?? null : null
    }

    const onTouchMove = (event) => {
      if (touchStartY.current === null) return
      const currentY = event.touches[0]?.clientY
      if (typeof currentY === 'number' && touchStartY.current - currentY > 55) {
        touchStartY.current = null
        redirectToLanding()
      }
    }

    const resetTouch = () => { touchStartY.current = null }

    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', resetTouch, { passive: true })

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', resetTouch)
      window.clearTimeout(redirectTimer.current)
      window.clearTimeout(hideTimer.current)
    }
  }, [redirectToLanding])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="bottom-redirect-notice"
          role="status"
          initial={{ opacity: 0, y: 28, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 310, damping: 24 }}
        >
          <span><ArrowUp size={18} /></span>
          <p><small>End of portfolio</small>You will be redirected to the landing page.</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default BottomRedirect
