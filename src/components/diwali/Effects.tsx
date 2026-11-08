'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'

/**
 * Reusable Diwali animation effects.
 * - TapPulse: persistent idle sonar rings signalling "tap me" (no text)
 * - Sunburst: rotating light rays exploding outward from center
 * - ExpandingRings: multiple staggered shockwave rings
 * - FloatingSparkles: lingering golden stars drifting upward
 */

/** Persistent pulsing rings around a medallion — the non-text "tap me" cue. */
export function TapPulse({ color = 'rgba(251,191,36,0.5)' }: { color?: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 rounded-full" aria-hidden="true">
      <motion.div
        className="absolute inset-0 rounded-full border"
        style={{ borderColor: color }}
        animate={{ scale: [1, 1.45], opacity: [0.6, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
      />
      <motion.div
        className="absolute inset-0 rounded-full border"
        style={{ borderColor: color }}
        animate={{ scale: [1, 1.45], opacity: [0.4, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut', delay: 1.1 }}
      />
    </div>
  )
}

/** Rotating light rays bursting outward — use inside an AnimatePresence with a key. */
export function Sunburst({
  rays = 14,
  length = 240,
  color = '#fbbf24',
  duration = 0.95,
}: {
  rays?: number
  length?: number
  color?: string
  duration?: number
}) {
  return (
    <motion.div
      className="pointer-events-none absolute left-1/2 top-1/2 z-20 h-0 w-0"
      initial={{ scale: 0, opacity: 0, rotate: 0 }}
      animate={{ scale: 1, opacity: [0, 0.85, 0], rotate: 60 }}
      transition={{ duration, ease: 'easeOut' }}
    >
      {Array.from({ length: rays }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 3,
            height: length,
            marginLeft: -1.5,
            background: `linear-gradient(to top, transparent 0%, ${color} 35%, ${color} 60%, transparent 100%)`,
            transformOrigin: 'bottom center',
            transform: `rotate(${(360 / rays) * i}deg)`,
            filter: 'blur(0.5px)',
          }}
        />
      ))}
    </motion.div>
  )
}

/** Multiple staggered expanding shockwave rings — use inside AnimatePresence with a key. */
export function ExpandingRings({
  count = 3,
  colors = ['#fbbf24', '#f97316', '#fff7ed'],
  size = 160,
  maxScale = 3.6,
  duration = 0.9,
}: {
  count?: number
  colors?: string[]
  size?: number
  maxScale?: number
  duration?: number
}) {
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 z-20" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border-2"
          style={{
            width: size,
            height: size,
            marginLeft: -size / 2,
            marginTop: -size / 2,
            borderColor: colors[i % colors.length],
          }}
          initial={{ scale: 0, opacity: 0.9 }}
          animate={{ scale: maxScale, opacity: 0 }}
          transition={{ duration, delay: i * 0.12, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

/** Lingering golden sparkles drifting upward — use inside AnimatePresence with a key. */
export function FloatingSparkles({
  count = 14,
  color = '#fde047',
}: {
  count?: number
  color?: string
}) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        id: Math.random(),
        x: (Math.random() * 80 - 40),
        travel: -(120 + Math.random() * 160),
        size: 4 + Math.random() * 6,
        delay: Math.random() * 0.4,
        rotate: (Math.random() * 360 - 180),
      })),
    [count],
  )
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 z-30 h-0 w-0" aria-hidden="true">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 0, rotate: 0, scale: 0 }}
          animate={{ x: p.x, y: p.travel, opacity: [0, 1, 1, 0], rotate: p.rotate, scale: [0, 1, 1, 0.3] }}
          transition={{ duration: 1.8, delay: p.delay, ease: 'easeOut' }}
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: color,
            clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
            filter: `drop-shadow(0 0 6px ${color})`,
          }}
        />
      ))}
    </div>
  )
}
