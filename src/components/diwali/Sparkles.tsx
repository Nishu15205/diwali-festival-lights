'use client'

import { useMemo } from 'react'

/**
 * Twinkling stars + rising sparkle motes layered over the night sky.
 * Pure CSS — fixed position, pointer-events disabled.
 */
export default function Sparkles({ starCount = 60, sparkleCount = 24 }: { starCount?: number; sparkleCount?: number }) {
  const stars = useMemo(
    () =>
      Array.from({ length: starCount }, () => ({
        top: Math.random() * 70,
        left: Math.random() * 100,
        size: 1 + Math.random() * 2.4,
        duration: 1.6 + Math.random() * 3,
        delay: Math.random() * 4,
      })),
    [starCount],
  )

  const sparkles = useMemo(
    () =>
      Array.from({ length: sparkleCount }, () => ({
        left: Math.random() * 100,
        size: 2 + Math.random() * 3,
        duration: 7 + Math.random() * 9,
        delay: Math.random() * 10,
        hue: Math.random() > 0.5 ? 45 : Math.random() > 0.5 ? 12 : 320,
      })),
    [sparkleCount],
  )

  return (
    <div className="pointer-events-none fixed inset-0 z-[4] overflow-hidden" aria-hidden="true">
      {/* twinkling stars */}
      {stars.map((s, i) => (
        <span
          key={`star-${i}`}
          className="animate-twinkle absolute rounded-full bg-white"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
            boxShadow: `0 0 ${s.size * 2}px rgba(255,255,255,0.8)`,
          }}
        />
      ))}

      {/* rising sparkles */}
      {sparkles.map((s, i) => (
        <span
          key={`spark-${i}`}
          className="animate-sparkle-float absolute bottom-0 rounded-full"
          style={{
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            background: `hsl(${s.hue}, 100%, 70%)`,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
            boxShadow: `0 0 ${s.size * 3}px hsl(${s.hue}, 100%, 65%)`,
          }}
        />
      ))}
    </div>
  )
}
