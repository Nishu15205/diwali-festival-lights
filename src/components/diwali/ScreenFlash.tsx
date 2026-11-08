'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Flash = {
  id: number
  color: string
  intensity: number
  duration: number
}

/**
 * Full-screen flash overlay. Listens for `diwali:flash` CustomEvents
 * with detail { color, intensity, duration } and bursts a quick
 * screen-wide light pulse. Used for "tagda" click feedback.
 */
export default function ScreenFlash() {
  const [flashes, setFlashes] = useState<Flash[]>([])
  const idRef = useRef(0)

  const trigger = useCallback((color: string, intensity: number, duration: number) => {
    const id = idRef.current
    idRef.current += 1
    setFlashes((f) => [...f, { id, color, intensity, duration }])
    setTimeout(() => {
      setFlashes((f) => f.filter((x) => x.id !== id))
    }, duration + 60)
  }, [])

  useEffect(() => {
    const handler = (e: Event) => {
      const d = (e as CustomEvent).detail as { color?: string; intensity?: number; duration?: number } | undefined
      trigger(
        d?.color ?? 'rgba(251,191,36,0.5)',
        d?.intensity ?? 0.5,
        d?.duration ?? 350,
      )
    }
    window.addEventListener('diwali:flash', handler)
    return () => window.removeEventListener('diwali:flash', handler)
  }, [trigger])

  return (
    <div className="pointer-events-none fixed inset-0 z-[60]" aria-hidden="true">
      <AnimatePresence>
        {flashes.map((f) => (
          <motion.div
            key={f.id}
            initial={{ opacity: f.intensity }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: f.duration / 1000, ease: 'easeOut' }}
            className="absolute inset-0"
            style={{ backgroundColor: f.color }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
