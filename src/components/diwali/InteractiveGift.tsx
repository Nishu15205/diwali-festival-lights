'use client'

import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const WISHES = [
  'Happy Diwali! May your life be filled with light and laughter.',
  'Wishing you a sparkling and prosperous Diwali!',
  'May the festival of lights brighten your world.',
  'Shubh Deepavali! Warm wishes for joy and success.',
  'Let every diya bring warmth, peace, and happiness to you.',
  'May this Diwali light up endless moments of joy.',
  'Wishing you wealth, health, and boundless happiness.',
  'May the glow of diyas illuminate your path forever.',
]

const CONFETTI_COLORS = ['#fbbf24', '#f97316', '#ef4444', '#ec4899', '#a855f7', '#22d3ee', '#fde047', '#fff7ed']

type Piece = {
  id: number
  x: number
  dx: number
  dy: number
  rotate: number
  color: string
  size: number
  delay: number
  shape: 'rect' | 'circle'
}

export default function InteractiveGift() {
  const [opened, setOpened] = useState(false)
  const [wish, setWish] = useState(WISHES[0])
  const [confetti, setConfetti] = useState<Piece[]>([])
  const [ringKey, setRingKey] = useState(0)
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const idRef = useRef(0)

  const handleOpen = useCallback(() => {
    if (opened) return
    setWish(WISHES[Math.floor(Math.random() * WISHES.length)])
    setOpened(true)
    setRingKey((k) => k + 1)

    // big confetti burst — 48 pieces
    const pieces: Piece[] = Array.from({ length: 48 }, () => ({
      id: idRef.current++,
      x: (Math.random() * 30 - 15),
      dx: (Math.random() * 280 - 140),
      dy: -(160 + Math.random() * 220),
      rotate: (Math.random() * 900 - 450),
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: 7 + Math.random() * 9,
      delay: Math.random() * 100,
      shape: Math.random() > 0.5 ? 'rect' : 'circle',
    }))
    setConfetti(pieces)

    // screen flash — golden
    window.dispatchEvent(
      new CustomEvent('diwali:flash', {
        detail: { color: 'rgba(251,191,36,0.45)', intensity: 0.65, duration: 420 },
      }),
    )
    // sky fireworks
    window.dispatchEvent(
      new CustomEvent('diwali:launch-firework', { detail: { count: 2 } }),
    )

    if (resetTimer.current) clearTimeout(resetTimer.current)
    resetTimer.current = setTimeout(() => setOpened(false), 4600)
    setTimeout(() => setConfetti([]), 2400)
  }, [opened])

  return (
    <div className="relative flex flex-col items-center">
      {/* wish reveal */}
      <AnimatePresence>
        {opened && (
          <motion.div
            key={wish}
            initial={{ opacity: 0, y: 40, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 240, damping: 16 }}
            className="absolute -top-6 z-40 w-60 rounded-2xl border border-amber-300/50 bg-gradient-to-br from-amber-500/25 via-orange-500/20 to-rose-500/20 px-4 py-3 text-center text-sm font-medium text-amber-50 shadow-[0_0_40px_rgba(251,146,60,0.5)] backdrop-blur-md sm:w-72 sm:text-base"
          >
            <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.3em] text-amber-300/80">
              A wish for you
            </span>
            {wish}
            <span className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-b border-r border-amber-300/50 bg-orange-500/20" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* shockwave ring */}
      <AnimatePresence>
        {ringKey > 0 && (
          <motion.div
            key={ringKey}
            initial={{ scale: 0, opacity: 0.9 }}
            animate={{ scale: 3.2, opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="pointer-events-none absolute left-1/2 top-1/2 z-20 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-amber-300"
          />
        )}
      </AnimatePresence>

      {/* confetti */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-30 h-0 w-0">
        <AnimatePresence>
          {confetti.map((p) => (
            <motion.div
              key={p.id}
              initial={{ x: p.x, y: 0, opacity: 1, rotate: 0 }}
              animate={{ x: p.x + p.dx, y: p.dy, opacity: 0, rotate: p.rotate }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.9, delay: p.delay / 1000, ease: 'easeOut' }}
              style={{
                width: p.size,
                height: p.shape === 'circle' ? p.size : p.size * 0.55,
                backgroundColor: p.color,
                borderRadius: p.shape === 'circle' ? '50%' : 2,
                boxShadow: `0 0 8px ${p.color}`,
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* the gift medallion */}
      <button
        onClick={handleOpen}
        aria-label="Open the gift"
        className="group relative h-44 w-44 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/70 sm:h-52 sm:w-52"
      >
        {/* ambient glow */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ opacity: [0.45, 0.75, 0.45], scale: [1, 1.06, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            background: 'radial-gradient(circle, rgba(251,146,60,0.55) 0%, rgba(251,146,60,0) 70%)',
            filter: 'blur(14px)',
          }}
        />
        {/* golden ring border */}
        <div
          className="absolute inset-2 rounded-full"
          style={{
            background:
              'conic-gradient(from 0deg, #fbbf24, #f97316, #ef4444, #fbbf24, #fde047, #fbbf24)',
            padding: 2,
          }}
        >
          <div className="h-full w-full rounded-full bg-[#0b0820]" />
        </div>
        {/* gift image — masked to fade edges */}
        <motion.div
          className="absolute inset-3 overflow-hidden rounded-full"
          animate={opened ? { scale: [1, 1.12, 1] } : { scale: 1 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
        >
          <img
            src="/images/diwali/gift.png"
            alt="Diwali gift"
            className="h-full w-full object-cover"
            style={{
              maskImage: 'radial-gradient(circle, black 62%, transparent 78%)',
              WebkitMaskImage: 'radial-gradient(circle, black 62%, transparent 78%)',
            }}
          />
        </motion.div>
        {/* shimmer sheen on hover */}
        <div className="pointer-events-none absolute inset-3 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{
          background: 'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)',
        }} />
      </button>
    </div>
  )
}
