'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TapPulse, Sunburst, ExpandingRings } from './Effects'

type Ember = {
  id: number
  dx: number
  dy: number
  size: number
  delay: number
}

/** Continuous gentle ember rise while the diya is lit. */
function ContinuousEmbers({ active }: { active: boolean }) {
  const [batch, setBatch] = useState<Ember[]>([])
  const emberId = useRef(0)

  useEffect(() => {
    if (!active) return
    const interval = setInterval(() => {
      const e: Ember = {
        id: emberId.current++,
        dx: (Math.random() * 60 - 30),
        dy: -(100 + Math.random() * 140),
        size: 2 + Math.random() * 3,
        delay: 0,
      }
      setBatch((b) => [...b, e])
      setTimeout(() => setBatch((b) => b.filter((x) => x.id !== e.id)), 2200)
    }, 380)
    return () => clearInterval(interval)
  }, [active])

  if (!active) return null
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 z-30 h-0 w-0" aria-hidden="true">
      <AnimatePresence>
        {batch.map((em) => (
          <motion.div
            key={em.id}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={{ x: em.dx, y: em.dy, opacity: [0, 1, 1, 0], scale: [0, 1, 1, 0.2] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: 'easeOut' }}
            style={{
              width: em.size,
              height: em.size,
              backgroundColor: '#fde047',
              borderRadius: '50%',
              boxShadow: '0 0 8px #fbbf24',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

export default function LightableDiya() {
  const [lit, setLit] = useState(false)
  const [ignitionKey, setIgnitionKey] = useState(0)
  const [embers, setEmbers] = useState<Ember[]>([])
  const [showRay, setShowRay] = useState(false)
  const emberId = useRef(0)

  const handleLight = useCallback(() => {
    if (!lit) {
      setLit(true)
      setIgnitionKey((k) => k + 1)

      // warm screen flash
      window.dispatchEvent(
        new CustomEvent('diwali:flash', {
          detail: { color: 'rgba(251,191,36,0.55)', intensity: 0.75, duration: 560 },
        }),
      )
      // sweeping warm light ray across screen
      setShowRay(true)
      setTimeout(() => setShowRay(false), 1400)
      // sky fireworks
      window.dispatchEvent(
        new CustomEvent('diwali:launch-firework', { detail: { count: 2 } }),
      )
      // activation for grand finale
      window.dispatchEvent(new CustomEvent('diwali:activated', { detail: { type: 'diya' } }))

      // initial ember burst
      const newEmbers: Ember[] = Array.from({ length: 20 }, () => ({
        id: emberId.current++,
        dx: (Math.random() * 80 - 40),
        dy: -(140 + Math.random() * 200),
        size: 2 + Math.random() * 3.5,
        delay: Math.random() * 200,
      }))
      setEmbers(newEmbers)
      setTimeout(() => setEmbers([]), 1800)
    } else {
      // relight — ember pop + small flash + ring
      setIgnitionKey((k) => k + 1)
      window.dispatchEvent(
        new CustomEvent('diwali:flash', {
          detail: { color: 'rgba(253,224,71,0.4)', intensity: 0.45, duration: 300 },
        }),
      )
      const newEmbers: Ember[] = Array.from({ length: 12 }, () => ({
        id: emberId.current++,
        dx: (Math.random() * 70 - 35),
        dy: -(90 + Math.random() * 130),
        size: 1.5 + Math.random() * 2.5,
        delay: Math.random() * 120,
      }))
      setEmbers((e) => [...e, ...newEmbers])
      setTimeout(() => setEmbers((e) => e.filter((em) => !newEmbers.some((ne) => ne.id === em.id))), 1300)
    }
  }, [lit])

  return (
    <div className="relative flex flex-col items-center">
      {/* sweeping warm light ray across the whole screen on ignition */}
      <AnimatePresence>
        {showRay && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-[55]"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            style={{
              background:
                'linear-gradient(110deg, transparent 30%, rgba(251,191,36,0.45) 45%, rgba(255,247,200,0.6) 50%, rgba(251,191,36,0.45) 55%, transparent 70%)',
            }}
          >
            <motion.div
              className="absolute inset-y-0 w-1/3"
              initial={{ left: '-33%' }}
              animate={{ left: '100%' }}
              transition={{ duration: 1.3, ease: 'easeInOut' }}
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(255,247,200,0.5), transparent)',
                filter: 'blur(6px)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ignition effects: sunburst + multi-rings */}
      <AnimatePresence>
        {ignitionKey > 0 && (
          <>
            <Sunburst key={`ds-${ignitionKey}`} rays={16} length={280} color="#fde047" duration={1.05} />
            <ExpandingRings
              key={`dr-${ignitionKey}`}
              count={3}
              colors={['#fde047', '#fbbf24', '#fff7ed']}
              size={160}
              maxScale={3.8}
              duration={1}
            />
          </>
        )}
      </AnimatePresence>

      {/* initial / relight ember burst */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-30 h-0 w-0">
        <AnimatePresence>
          {embers.map((em) => (
            <motion.div
              key={em.id}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{ x: em.dx, y: em.dy, opacity: 0, scale: 0.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, delay: em.delay / 1000, ease: 'easeOut' }}
              style={{
                width: em.size,
                height: em.size,
                backgroundColor: '#fde047',
                borderRadius: '50%',
                boxShadow: '0 0 8px #fbbf24',
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* continuous gentle embers while lit */}
      <ContinuousEmbers active={lit} />

      {/* diya medallion */}
      <button
        onClick={handleLight}
        aria-label={lit ? 'Relight the diya' : 'Light the diya'}
        className="group relative h-44 w-44 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/70 sm:h-52 sm:w-52"
      >
        {/* idle tap-pulse cue — only before first lighting */}
        {!lit && <TapPulse color="rgba(253,224,71,0.55)" />}

        {/* glow halo — grows dramatically when lit */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={lit ? { opacity: 1, scale: 1.18 } : { opacity: 0.4, scale: 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 14 }}
          style={{
            background: 'radial-gradient(circle, rgba(251,191,36,0.75) 0%, rgba(251,146,60,0.35) 40%, rgba(251,146,60,0) 70%)',
            filter: 'blur(16px)',
          }}
        />
        {/* breathing pulse when lit */}
        {lit && (
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{ opacity: [0.5, 0.85, 0.5], scale: [1.15, 1.3, 1.15] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              background: 'radial-gradient(circle, rgba(253,224,71,0.45) 0%, rgba(253,224,71,0) 60%)',
              filter: 'blur(22px)',
            }}
          />
        )}
        {/* ring border */}
        <motion.div
          className="absolute inset-2 rounded-full"
          animate={lit ? { opacity: 1 } : { opacity: 0.55 }}
          style={{
            background: 'conic-gradient(from 0deg, #fbbf24, #fde047, #f97316, #fbbf24, #fff7ed, #fbbf24)',
            padding: 2,
          }}
        >
          <div className="h-full w-full rounded-full bg-[#0b0820]" />
        </motion.div>
        {/* diya image */}
        <motion.div
          className="absolute inset-3 overflow-hidden rounded-full"
          animate={
            lit
              ? { scale: 1, filter: 'brightness(1.18) saturate(1.15)' }
              : { scale: 0.98, filter: 'brightness(0.42) saturate(0.6)' }
          }
          transition={{ type: 'spring', stiffness: 140, damping: 16 }}
          whileHover={{ scale: lit ? 1.05 : 1.03 }}
        >
          <img
            src="/images/diwali/diya.png"
            alt="Diya oil lamp"
            className="h-full w-full object-cover"
            style={{
              maskImage: 'radial-gradient(circle, black 62%, transparent 78%)',
              WebkitMaskImage: 'radial-gradient(circle, black 62%, transparent 78%)',
            }}
          />
        </motion.div>
        {/* central flame bloom when lit */}
        <AnimatePresence>
          {lit && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 14 }}
              className="pointer-events-none absolute left-1/2 top-[38%] z-10 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(255,247,200,0.75) 0%, rgba(251,191,36,0.35) 40%, transparent 70%)',
                filter: 'blur(8px)',
              }}
            />
          )}
        </AnimatePresence>
      </button>
    </div>
  )
}
