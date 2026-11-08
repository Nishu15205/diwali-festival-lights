'use client'

import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Ember = {
  id: number
  dx: number
  dy: number
  size: number
  delay: number
}

export default function LightableDiya() {
  const [lit, setLit] = useState(false)
  const [embers, setEmbers] = useState<Ember[]>([])
  const [ringKey, setRingKey] = useState(0)
  const emberId = useRef(0)

  const handleLight = useCallback(() => {
    if (!lit) {
      setLit(true)
      setRingKey((k) => k + 1)

      // warm screen flash
      window.dispatchEvent(
        new CustomEvent('diwali:flash', {
          detail: { color: 'rgba(251,191,36,0.5)', intensity: 0.7, duration: 520 },
        }),
      )
      // sky firework
      window.dispatchEvent(
        new CustomEvent('diwali:launch-firework', { detail: { count: 1 } }),
      )

      // rising embers
      const newEmbers: Ember[] = Array.from({ length: 16 }, () => ({
        id: emberId.current++,
        dx: (Math.random() * 70 - 35),
        dy: -(120 + Math.random() * 160),
        size: 2 + Math.random() * 3,
        delay: Math.random() * 200,
      }))
      setEmbers(newEmbers)
      setTimeout(() => setEmbers([]), 1600)
    } else {
      // relight — ember pop + small flash
      setRingKey((k) => k + 1)
      window.dispatchEvent(
        new CustomEvent('diwali:flash', {
          detail: { color: 'rgba(253,224,71,0.35)', intensity: 0.4, duration: 280 },
        }),
      )
      const newEmbers: Ember[] = Array.from({ length: 10 }, () => ({
        id: emberId.current++,
        dx: (Math.random() * 60 - 30),
        dy: -(80 + Math.random() * 120),
        size: 1.5 + Math.random() * 2.5,
        delay: Math.random() * 120,
      }))
      setEmbers((e) => [...e, ...newEmbers])
      setTimeout(() => setEmbers((e) => e.filter((em) => !newEmbers.some((ne) => ne.id === em.id))), 1200)
    }
  }, [lit])

  return (
    <div className="relative flex flex-col items-center">
      {/* shockwave ring */}
      <AnimatePresence>
        {ringKey > 0 && (
          <motion.div
            key={ringKey}
            initial={{ scale: 0, opacity: 0.85 }}
            animate={{ scale: 3.4, opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="pointer-events-none absolute left-1/2 top-1/2 z-20 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-amber-300"
          />
        )}
      </AnimatePresence>

      {/* rising embers */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-30 h-0 w-0">
        <AnimatePresence>
          {embers.map((em) => (
            <motion.div
              key={em.id}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{ x: em.dx, y: em.dy, opacity: 0, scale: 0.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, delay: em.delay / 1000, ease: 'easeOut' }}
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

      {/* diya medallion */}
      <button
        onClick={handleLight}
        aria-label={lit ? 'Relight the diya' : 'Light the diya'}
        className="group relative h-44 w-44 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/70 sm:h-52 sm:w-52"
      >
        {/* glow halo — grows dramatically when lit */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={lit ? { opacity: 1, scale: 1.15 } : { opacity: 0.35, scale: 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 14 }}
          style={{
            background: 'radial-gradient(circle, rgba(251,191,36,0.7) 0%, rgba(251,146,60,0.3) 40%, rgba(251,146,60,0) 70%)',
            filter: 'blur(16px)',
          }}
        />
        {/* breathing pulse when lit */}
        {lit && (
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{ opacity: [0.5, 0.8, 0.5], scale: [1.1, 1.25, 1.1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              background: 'radial-gradient(circle, rgba(253,224,71,0.4) 0%, rgba(253,224,71,0) 60%)',
              filter: 'blur(20px)',
            }}
          />
        )}
        {/* ring border — brightens when lit */}
        <motion.div
          className="absolute inset-2 rounded-full"
          animate={lit ? { opacity: 1 } : { opacity: 0.5 }}
          style={{
            background: 'conic-gradient(from 0deg, #fbbf24, #fde047, #f97316, #fbbf24, #fff7ed, #fbbf24)',
            padding: 2,
          }}
        >
          <div className="h-full w-full rounded-full bg-[#0b0820]" />
        </motion.div>
        {/* diya image — dims when unlit, glows when lit */}
        <motion.div
          className="absolute inset-3 overflow-hidden rounded-full"
          animate={
            lit
              ? { scale: 1, filter: 'brightness(1.15) saturate(1.1)' }
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
        {/* extra flame glow when lit — central bloom */}
        <AnimatePresence>
          {lit && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 14 }}
              className="pointer-events-none absolute left-1/2 top-[38%] z-10 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(255,247,200,0.7) 0%, rgba(251,191,36,0.3) 40%, transparent 70%)',
                filter: 'blur(8px)',
              }}
            />
          )}
        </AnimatePresence>
      </button>
    </div>
  )
}
