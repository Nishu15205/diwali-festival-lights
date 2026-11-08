'use client'

import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gift } from 'lucide-react'

const WISHES = [
  'Happy Diwali! 🎉 Aapko khushiyon ka bhaar mile.',
  'Shubh Deepavali! 🪔 Roshni se bhari zindagi mile.',
  'Diwali ki hardik shubhkamnayein! ✨',
  'May this Diwali bring you wealth, health & happiness. 💛',
  'Festival of lights aapke jeevan ko roshan kare! 🌟',
  'Wishing you a sparkling & prosperous Diwali! 🎆',
  'Lakshmi aapke ghar aaye, khushiyan baatein! 🌸',
  'Diwali mubarak ho! Har mann ki murad poori ho. 💫',
  'Let the light of diyas brighten your world! 🪔',
  'Subh Deepavali! Pyaar, shanti aur samriddhi mile. ❤️',
]

const CONFETTI_COLORS = ['#fbbf24', '#f97316', '#ef4444', '#ec4899', '#a855f7', '#22d3ee', '#fde047']

type ConfettiPiece = {
  id: number
  x: number // start offset % from center
  dx: number // end horizontal travel px
  dy: number // end vertical travel px
  rotate: number
  color: string
  size: number
  delay: number
}

export default function InteractiveGift() {
  const [opened, setOpened] = useState(false)
  const [wish, setWish] = useState(WISHES[0])
  const [count, setCount] = useState(0)
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([])
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const confettiTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const idRef = useRef(0)

  const handleOpen = useCallback(() => {
    if (opened) return
    setWish(WISHES[Math.floor(Math.random() * WISHES.length)])
    setOpened(true)
    setCount((c) => c + 1)

    // generate confetti
    const pieces: ConfettiPiece[] = Array.from({ length: 28 }, () => ({
      id: idRef.current++,
      x: (Math.random() * 40 - 20),
      dx: (Math.random() * 240 - 120),
      dy: -(120 + Math.random() * 180),
      rotate: (Math.random() * 720 - 360),
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: 6 + Math.random() * 8,
      delay: Math.random() * 120,
    }))
    setConfetti(pieces)

    // trigger a couple of sky fireworks as part of the celebration
    window.dispatchEvent(
      new CustomEvent('diwali:launch-firework', { detail: { count: 2 } }),
    )

    if (resetTimer.current) clearTimeout(resetTimer.current)
    resetTimer.current = setTimeout(() => setOpened(false), 4500)

    if (confettiTimer.current) clearTimeout(confettiTimer.current)
    confettiTimer.current = setTimeout(() => setConfetti([]), 2200)
  }, [opened])

  return (
    <div className="relative flex flex-col items-center gap-3">
      {/* wish bubble */}
      <AnimatePresence>
        {opened && (
          <motion.div
            key={wish}
            initial={{ opacity: 0, y: 30, scale: 0.6 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 220, damping: 18 }}
            className="absolute -top-2 z-30 w-64 rounded-2xl border border-amber-400/40 bg-gradient-to-br from-amber-500/20 to-rose-500/20 px-4 py-3 text-center text-sm font-medium text-amber-50 shadow-[0_0_30px_rgba(251,146,60,0.4)] backdrop-blur-md sm:w-72 sm:text-base"
          >
            {wish}
            {/* tail */}
            <span className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-b border-r border-amber-400/40 bg-amber-500/20" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* confetti burst */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 h-0 w-0">
        <AnimatePresence>
          {confetti.map((p) => (
            <motion.div
              key={p.id}
              initial={{ x: p.x, y: 0, opacity: 1, rotate: 0 }}
              animate={{ x: p.x + p.dx, y: p.dy, opacity: 0, rotate: p.rotate }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8, delay: p.delay / 1000, ease: 'easeOut' }}
              style={{
                width: p.size,
                height: p.size * 0.6,
                backgroundColor: p.color,
                borderRadius: 2,
                boxShadow: `0 0 6px ${p.color}`,
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* the gift box — clickable */}
      <button
        onClick={handleOpen}
        aria-label="Gift kholo — Diwali wish paao"
        className="group relative flex h-44 w-40 items-end justify-center rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 sm:h-52 sm:w-48"
      >
        {/* glow under box */}
        <motion.div
          animate={opened ? { opacity: 0.9, scale: 1.4 } : { opacity: 0.4, scale: 1 }}
          className="absolute bottom-2 left-1/2 h-10 w-32 -translate-x-1/2 rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(251,146,60,0.6) 0%, rgba(251,146,60,0) 70%)',
            filter: 'blur(8px)',
          }}
        />

        {/* box body */}
        <motion.div
          className="relative h-28 w-32 rounded-b-lg rounded-t-sm sm:h-32 sm:w-36"
          style={{
            background: 'linear-gradient(145deg, #b91c1c 0%, #7f1d1d 100%)',
            boxShadow: 'inset 0 -8px 16px rgba(0,0,0,0.4), 0 8px 20px rgba(0,0,0,0.5)',
          }}
          animate={opened ? { y: 0 } : { y: 0 }}
        >
          {/* vertical ribbon */}
          <div className="absolute inset-y-0 left-1/2 w-5 -translate-x-1/2 bg-amber-400" style={{ boxShadow: 'inset 0 0 6px rgba(120,40,0,0.4)' }} />
          {/* horizontal ribbon */}
          <div className="absolute left-0 right-0 top-1/2 h-5 -translate-y-1/2 bg-amber-400" style={{ boxShadow: 'inset 0 0 6px rgba(120,40,0,0.4)' }} />
          {/* highlight */}
          <div className="absolute inset-0 rounded-b-lg rounded-t-sm" style={{ background: 'linear-gradient(120deg, rgba(255,255,255,0.18) 0%, transparent 40%)' }} />
        </motion.div>

        {/* lid — pops off when opened */}
        <motion.div
          className="absolute left-1/2 top-[calc(100%-112px)] z-10 h-7 w-36 -translate-x-1/2 rounded-md sm:top-[calc(100%-132px)] sm:w-40"
          style={{
            background: 'linear-gradient(145deg, #dc2626 0%, #991b1b 100%)',
            boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
          }}
          animate={
            opened
              ? { y: -70, rotate: -22, opacity: 0 }
              : { y: 0, rotate: 0, opacity: 1 }
          }
          transition={{ type: 'spring', stiffness: 200, damping: 14 }}
        >
          {/* lid ribbon */}
          <div className="absolute inset-y-0 left-1/2 w-5 -translate-x-1/2 bg-amber-400" />
        </motion.div>

        {/* bow on top */}
        <motion.div
          className="absolute left-1/2 top-[calc(100%-124px)] z-20 -translate-x-1/2 sm:top-[calc(100%-144px)]"
          animate={opened ? { y: -90, opacity: 0, rotate: 30 } : { y: 0, opacity: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 180, damping: 12 }}
        >
          <Bow />
        </motion.div>

        {/* idle shimmer hint */}
        {!opened && (
          <motion.div
            className="absolute inset-0 rounded-2xl"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2.4, repeat: Infinity }}
            style={{ boxShadow: 'inset 0 0 24px rgba(251,191,36,0.4)' }}
          />
        )}

        {/* hover label */}
        <span className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium text-amber-300/70 transition group-hover:text-amber-200">
          Dabao khulne ke liye
        </span>
      </button>

      {/* counter + icon */}
      <div className="mt-4 flex items-center gap-1.5 rounded-full border border-amber-400/25 bg-amber-500/10 px-3 py-1 text-xs text-amber-200">
        <Gift className="h-3.5 w-3.5" />
        {count} {count === 1 ? 'wish' : 'wishes'} nikle
      </div>
    </div>
  )
}

function Bow() {
  return (
    <div className="relative h-7 w-12">
      <div
        className="absolute left-0 top-1 h-6 w-6 rounded-full"
        style={{ background: 'radial-gradient(circle at 30% 30%, #fde047, #f59e0b)', boxShadow: '0 0 8px rgba(251,191,36,0.6)' }}
      />
      <div
        className="absolute right-0 top-1 h-6 w-6 rounded-full"
        style={{ background: 'radial-gradient(circle at 70% 30%, #fde047, #f59e0b)', boxShadow: '0 0 8px rgba(251,191,36,0.6)' }}
      />
      <div
        className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: 'radial-gradient(circle, #fbbf24, #b45309)' }}
      />
    </div>
  )
}
