'use client'

import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TapPulse, Sunburst, ExpandingRings } from './Effects'

const POPS = 5

type Spark = {
  id: number
  dx: number
  dy: number
  color: string
  size: number
}

const SPARK_COLORS = ['#fbbf24', '#f97316', '#ef4444', '#fde047', '#fff7ed', '#ec4899', '#22d3ee']
const POP_FLASH = [
  'rgba(255,247,237,0.6)',
  'rgba(253,224,71,0.55)',
  'rgba(249,115,22,0.55)',
  'rgba(239,68,68,0.55)',
  'rgba(255,255,255,0.75)',
]
const POP_RING = ['#fff7ed', '#fde047', '#f97316', '#ef4444', '#ffffff']

export default function CrackerString() {
  const [bursting, setBursting] = useState(false)
  const [popStep, setPopStep] = useState(0)
  const [sparks, setSparks] = useState<Spark[]>([])
  const [popRings, setPopRings] = useState<number[]>([])
  const [finaleKey, setFinaleKey] = useState(0)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const sparkId = useRef(0)

  const handleBurst = useCallback(() => {
    if (bursting) return
    setBursting(true)
    setPopStep(0)
    setPopRings([])

    for (let i = 0; i < POPS; i++) {
      const t = setTimeout(() => {
        setPopStep(i + 1)
        // add a per-pop ring (keyed by step)
        setPopRings((r) => [...r, i])

        // screen flash per pop
        window.dispatchEvent(
          new CustomEvent('diwali:flash', {
            detail: { color: POP_FLASH[i], intensity: 0.65, duration: 190 },
          }),
        )

        // bigger spark burst — 22 sparks
        const newSparks: Spark[] = Array.from({ length: 22 }, () => ({
          id: sparkId.current++,
          dx: (Math.random() * 160 - 80),
          dy: -(40 + Math.random() * 120),
          color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
          size: 2 + Math.random() * 5,
        }))
        setSparks((s) => [...s, ...newSparks])
        const cleanT = setTimeout(() => {
          setSparks((s) => s.filter((sp) => !newSparks.some((ns) => ns.id === sp.id)))
        }, 850)
        timers.current.push(cleanT)

        if (i === POPS - 1) {
          const finalT = setTimeout(() => {
            // GRAND FINALE for the cracker itself
            setFinaleKey((k) => k + 1)
            window.dispatchEvent(
              new CustomEvent('diwali:flash', {
                detail: { color: 'rgba(255,255,255,0.85)', intensity: 0.95, duration: 360 },
              }),
            )
            window.dispatchEvent(
              new CustomEvent('diwali:launch-firework', { detail: { count: 5 } }),
            )
            window.dispatchEvent(new CustomEvent('diwali:activated', { detail: { type: 'crackers' } }))
            setBursting(false)
            setPopStep(0)
            setTimeout(() => setPopRings([]), 1200)
          }, 650)
          timers.current.push(finalT)
        }
      }, i * 175)
      timers.current.push(t)
    }
  }, [bursting])

  return (
    <div className="relative flex flex-col items-center">
      {/* finale explosion — sunburst + 4 rings */}
      <AnimatePresence>
        {finaleKey > 0 && (
          <>
            <Sunburst key={`fs-${finaleKey}`} rays={18} length={300} color="#fff7ed" duration={1.1} />
            <ExpandingRings
              key={`fr-${finaleKey}`}
              count={4}
              colors={['#ffffff', '#fde047', '#f97316', '#ef4444']}
              size={170}
              maxScale={4.2}
              duration={1.1}
            />
          </>
        )}
      </AnimatePresence>

      {/* per-pop rings */}
      <AnimatePresence>
        {popRings.map((step) => (
          <motion.div
            key={`popring-${finaleKey}-${step}`}
            className="pointer-events-none absolute left-1/2 top-1/2 z-20 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
            style={{ borderColor: POP_RING[step % POP_RING.length] }}
            initial={{ scale: 0, opacity: 0.85 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>

      {/* sparks */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-30 h-0 w-0">
        <AnimatePresence>
          {sparks.map((s) => (
            <motion.div
              key={s.id}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{ x: s.dx, y: s.dy, opacity: 0, scale: 0.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.75, ease: 'easeOut' }}
              style={{
                width: s.size,
                height: s.size,
                backgroundColor: s.color,
                borderRadius: '50%',
                boxShadow: `0 0 ${s.size * 2.5}px ${s.color}`,
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* cracker medallion */}
      <button
        onClick={handleBurst}
        disabled={bursting}
        aria-label="Light the crackers"
        className="group relative h-44 w-44 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300/70 disabled:cursor-default sm:h-52 sm:w-52"
      >
        {/* idle tap-pulse cue */}
        {!bursting && <TapPulse color="rgba(249,115,22,0.5)" />}

        {/* ambient glow */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={
            bursting
              ? { opacity: [0.6, 1, 0.6], scale: [1, 1.14, 1] }
              : { opacity: [0.4, 0.7, 0.4], scale: [1, 1.06, 1] }
          }
          transition={{ duration: bursting ? 0.35 : 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            background: 'radial-gradient(circle, rgba(249,115,22,0.6) 0%, rgba(239,68,68,0) 70%)',
            filter: 'blur(14px)',
          }}
        />
        {/* ring border */}
        <div
          className="absolute inset-2 rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, #ef4444, #f97316, #fbbf24, #ef4444, #fde047, #ef4444)',
            padding: 2,
          }}
        >
          <div className="h-full w-full rounded-full bg-[#0b0820]" />
        </div>
        {/* cracker image — shakes violently while bursting */}
        <motion.div
          className="absolute inset-3 overflow-hidden rounded-full"
          animate={
            bursting
              ? { x: [0, -4, 4, -3, 3, -2, 0], y: [0, 3, -3, 2, -2, 1, 0], scale: [1, 1.05, 0.96, 1.04, 0.98, 1.02, 1] }
              : { x: 0, y: 0, scale: 1 }
          }
          transition={{ duration: 0.16, repeat: bursting ? Infinity : 0 }}
          whileHover={{ scale: 1.05 }}
        >
          <img
            src="/images/diwali/crackers.png"
            alt="Firecrackers"
            className="h-full w-full object-cover"
            style={{
              maskImage: 'radial-gradient(circle, black 62%, transparent 78%)',
              WebkitMaskImage: 'radial-gradient(circle, black 62%, transparent 78%)',
            }}
          />
          {/* pop flash overlay on the image */}
          <AnimatePresence>
            {popStep > 0 && bursting && (
              <motion.div
                key={popStep}
                initial={{ opacity: 0.95 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(253,224,71,0.5) 40%, transparent 70%)',
                }}
              />
            )}
          </AnimatePresence>
        </motion.div>
        {/* progress dots */}
        {bursting && (
          <div className="absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 gap-1">
            {Array.from({ length: POPS }).map((_, i) => (
              <div
                key={i}
                className="h-1.5 w-1.5 rounded-full transition-colors duration-200"
                style={{
                  backgroundColor: i < popStep ? '#fde047' : 'rgba(255,255,255,0.25)',
                  boxShadow: i < popStep ? '0 0 6px #fde047' : 'none',
                }}
              />
            ))}
          </div>
        )}
      </button>
    </div>
  )
}
