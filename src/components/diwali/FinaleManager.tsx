'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sunburst, ExpandingRings, FloatingSparkles } from './Effects'

const REQUIRED = new Set(['gift', 'crackers', 'diya'])

/**
 * Grand finale. Listens for `diwali:activated` events from each of the
 * three objects. Once all three have been activated at least once, it
 * triggers a screen-wide celebration: a massive golden flash, a huge
 * sunburst across the center, multiple expanding rings, a fireworks
 * barrage, and floating sparkles. Re-arms after each finale so doing
 * all three again sets off another one.
 */
export default function FinaleManager() {
  const [finaleKey, setFinaleKey] = useState(0)
  const activated = useRef<Set<string>>(new Set())

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { type?: string } | undefined
      const type = detail?.type
      if (!type) return
      activated.current.add(type)
      if (REQUIRED.has(type) && activated.current.size >= REQUIRED.size) {
        // trigger finale
        activated.current.clear()
        setFinaleKey((k) => k + 1)
      }
    }
    window.addEventListener('diwali:activated', handler)
    return () => window.removeEventListener('diwali:activated', handler)
  }, [])

  // when finaleKey changes, fire the barrage
  useEffect(() => {
    if (finaleKey === 0) return
    // big golden flash
    window.dispatchEvent(
      new CustomEvent('diwali:flash', {
        detail: { color: 'rgba(255,247,200,0.85)', intensity: 0.95, duration: 700 },
      }),
    )
    // a second smaller flash for a double-pulse feel
    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent('diwali:flash', {
          detail: { color: 'rgba(251,191,36,0.6)', intensity: 0.7, duration: 500 },
        }),
      )
    }, 350)
    // fireworks barrage — staggered
    window.dispatchEvent(
      new CustomEvent('diwali:launch-firework', { detail: { count: 6 } }),
    )
    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent('diwali:launch-firework', { detail: { count: 4 } }),
      )
    }, 900)
  }, [finaleKey])

  return (
    <AnimatePresence>
      {finaleKey > 0 && (
        <motion.div
          key={finaleKey}
          className="pointer-events-none fixed inset-0 z-[58] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* huge central sunburst */}
          <Sunburst rays={24} length={520} color="#fff7ed" duration={1.6} />
          {/* secondary golden sunburst */}
          <div className="absolute left-1/2 top-1/2">
            <Sunburst rays={20} length={420} color="#fbbf24" duration={1.8} />
          </div>
          {/* expanding rings — 5 layers */}
          <ExpandingRings
            count={5}
            colors={['#ffffff', '#fde047', '#fbbf24', '#f97316', '#ef4444']}
            size={220}
            maxScale={5}
            duration={1.6}
          />
          {/* floating sparkles */}
          <div className="absolute left-1/2 top-1/2">
            <FloatingSparkles count={24} color="#fff7ed" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
