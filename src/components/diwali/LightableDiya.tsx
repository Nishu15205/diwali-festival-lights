'use client'

import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame } from 'lucide-react'

type Spark = {
  id: number
  dx: number
  dy: number
  size: number
}

export default function LightableDiya() {
  const [lit, setLit] = useState(false)
  const [count, setCount] = useState(0)
  const [sparks, setSparks] = useState<Spark[]>([])
  const sparkId = useRef(0)

  const handleLight = useCallback(() => {
    if (!lit) {
      // ignite
      setLit(true)
      setCount((c) => c + 1)
      // ignition sparks
      const newSparks: Spark[] = Array.from({ length: 12 }, () => ({
        id: sparkId.current++,
        dx: (Math.random() * 60 - 30),
        dy: -(30 + Math.random() * 50),
        size: 2 + Math.random() * 2.5,
      }))
      setSparks(newSparks)
      setTimeout(() => setSparks([]), 800)
      // soft sky sparkle
      window.dispatchEvent(
        new CustomEvent('diwali:launch-firework', { detail: { count: 1 } }),
      )
    } else {
      // already lit — relight with a little sparkle pop
      setCount((c) => c + 1)
      const newSparks: Spark[] = Array.from({ length: 8 }, () => ({
        id: sparkId.current++,
        dx: (Math.random() * 50 - 25),
        dy: -(20 + Math.random() * 40),
        size: 1.5 + Math.random() * 2,
      }))
      setSparks((s) => [...s, ...newSparks])
      setTimeout(() => setSparks((s) => s.filter((sp) => !newSparks.some((ns) => ns.id === sp.id))), 700)
    }
  }, [lit])

  return (
    <div className="relative flex flex-col items-center gap-3">
      {/* the clickable diya */}
      <button
        onClick={handleLight}
        aria-label={lit ? 'Diya jal gaya' : 'Diya jalao'}
        className="group relative flex h-44 w-40 items-end justify-center rounded-2xl pb-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 sm:h-52 sm:w-48"
      >
        {/* expanding glow halo — grows when lit */}
        <motion.div
          className="absolute left-1/2 top-[30%] -z-10 rounded-full"
          animate={
            lit
              ? { opacity: 1, scale: 1 }
              : { opacity: 0, scale: 0.3 }
          }
          transition={{ type: 'spring', stiffness: 120, damping: 14 }}
          style={{
            width: 160,
            height: 160,
            transform: 'translateX(-50%)',
            background:
              'radial-gradient(circle, rgba(251,191,36,0.7) 0%, rgba(251,146,60,0.3) 40%, rgba(251,146,60,0) 70%)',
            filter: 'blur(10px)',
          }}
        />

        {/* flame — grows from 0 when ignited */}
        <AnimatePresence>
          {lit && (
            <motion.div
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              exit={{ scaleY: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12 }}
              className="absolute left-1/2 top-[14%] z-10 -translate-x-1/2 origin-bottom"
              style={{ width: 22, height: 56 }}
            >
              {/* outer flame */}
              <div
                className="animate-flicker absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to top, rgba(251,146,60,1) 0%, rgba(251,191,36,1) 45%, rgba(255,247,200,0.9) 75%, rgba(255,255,255,0) 100%)',
                  clipPath: 'ellipse(50% 100% at 50% 100%)',
                  borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                  filter: 'blur(0.5px)',
                  boxShadow: '0 0 24px rgba(251,191,36,0.8)',
                }}
              />
              {/* hot inner core */}
              <div
                className="animate-flame-core absolute inset-x-[28%] bottom-[12%] top-[22%]"
                style={{
                  background:
                    'linear-gradient(to top, rgba(255,160,40,1) 0%, rgba(255,237,160,1) 60%, rgba(255,255,255,0.95) 100%)',
                  clipPath: 'ellipse(50% 100% at 50% 100%)',
                  borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ignition sparks */}
        <div className="pointer-events-none absolute left-1/2 top-[20%] z-20 h-0 w-0">
          <AnimatePresence>
            {sparks.map((s) => (
              <motion.div
                key={s.id}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: s.dx, y: s.dy, opacity: 0, scale: 0.2 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                style={{
                  width: s.size,
                  height: s.size,
                  backgroundColor: '#fde047',
                  borderRadius: '50%',
                  boxShadow: '0 0 6px #fbbf24',
                }}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* diya bowl (SVG) — always visible */}
        <svg
          viewBox="0 0 100 60"
          className="relative z-0 w-32 sm:w-36"
          style={{ height: 48 }}
          preserveAspectRatio="xMidYMax meet"
        >
          <defs>
            <linearGradient id="ldBody" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lit ? '#f6b94b' : '#9a7a4b'} />
              <stop offset="45%" stopColor={lit ? '#e08a1f' : '#6b4f2a'} />
              <stop offset="100%" stopColor={lit ? '#7a3b0c' : '#3d2812'} />
            </linearGradient>
            <linearGradient id="ldRim" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lit ? '#ffe7a3' : '#b8a070'} />
              <stop offset="100%" stopColor={lit ? '#f0a32f' : '#7a6238'} />
            </linearGradient>
          </defs>
          {/* rim / spout */}
          <path d="M5 18 Q50 0 95 18 L88 24 Q50 12 12 24 Z" fill="url(#ldRim)" />
          {/* bowl */}
          <path d="M12 24 Q50 18 88 24 Q82 52 50 54 Q18 52 12 24 Z" fill="url(#ldBody)" />
          {/* inner shadow */}
          <ellipse cx="50" cy="26" rx="32" ry="6" fill="rgba(60,20,5,0.55)" />
          {/* highlight */}
          <path
            d="M20 28 Q50 22 80 28 Q72 34 50 33 Q28 34 20 28 Z"
            fill="rgba(255,240,200,0.25)"
          />
        </svg>

        {/* hover hint */}
        <span className="pointer-events-none absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium text-amber-300/70 transition group-hover:text-amber-200">
          {lit ? 'Fir jalao ✨' : 'Dabao jalane ke liye'}
        </span>
      </button>

      {/* counter */}
      <div className="mt-4 flex items-center gap-1.5 rounded-full border border-amber-400/25 bg-amber-500/10 px-3 py-1 text-xs text-amber-200">
        <Flame className={`h-3.5 w-3.5 ${lit ? 'text-amber-400' : ''}`} />
        {count} {count === 1 ? 'diya' : 'diye'} {lit ? 'jal rahe hain' : 'jale'}
      </div>
    </div>
  )
}
