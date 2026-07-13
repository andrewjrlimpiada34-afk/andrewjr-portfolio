import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp, ChevronUp } from 'lucide-react'

const isAtPageBottom = () => (
  window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 3
)

function BottomRedirect() {
  const [promptVisible, setPromptVisible] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const touchStartY = useRef(null)
  const promptArmed = useRef(true)

  const showPrompt = useCallback(() => {
    if (!promptArmed.current) return
    promptArmed.current = false
    setPromptVisible(true)
  }, [])

  const goToLanding = () => {
    setPromptVisible(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#top`)
  }

  const stayAtFooter = () => setPromptVisible(false)

  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.scrollY > 520)
      if (!isAtPageBottom()) promptArmed.current = true
    }

    const onWheel = (event) => {
      if (event.deltaY > 18 && isAtPageBottom()) showPrompt()
    }

    const onTouchStart = (event) => {
      touchStartY.current = isAtPageBottom() ? event.touches[0]?.clientY ?? null : null
    }

    const onTouchMove = (event) => {
      if (touchStartY.current === null) return
      const currentY = event.touches[0]?.clientY
      if (typeof currentY === 'number' && touchStartY.current - currentY > 55) {
        touchStartY.current = null
        showPrompt()
      }
    }

    const resetTouch = () => { touchStartY.current = null }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', resetTouch, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', resetTouch)
    }
  }, [showPrompt])

  return (
    <>
      <AnimatePresence>
        {showBackToTop && !promptVisible && (
          <motion.button
            className="floating-back-to-top"
            type="button"
            onClick={goToLanding}
            aria-label="Back to landing page"
            title="Back to top"
            initial={{ opacity: 0, y: 16, scale: 0.82 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.86 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.92 }}
          >
            <ChevronUp size={22} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {promptVisible && (
          <motion.div
            className="bottom-redirect-notice"
            role="dialog"
            aria-modal="true"
            aria-labelledby="end-of-portfolio-title"
            initial={{ opacity: 0, y: 28, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 310, damping: 24 }}
          >
            <span><ArrowUp size={18} /></span>
            <div className="bottom-redirect-copy">
              <p><small>End of portfolio</small><strong id="end-of-portfolio-title">Done exploring?</strong></p>
              <div className="bottom-redirect-actions">
                <button type="button" onClick={goToLanding}>Back to landing page</button>
                <button className="secondary" type="button" onClick={stayAtFooter}>Stay here</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default BottomRedirect
