'use client'

import { useMemo } from 'react'

/**
 * A single animated Diya (oil lamp) rendered with SVG + CSS flame flicker.
 * `size` controls the lamp scale. `delay` offsets the flicker animation so
 * a row of diyas flickers organically rather than in sync.
 */
export default function Diya({
  size = 80,
  delay = 0,
  className = '',
}: {
  size?: number
  delay?: number
  className?: string
}) {
  // unique flame flicker timing per diya
  const flickerDur = useMemo(() => 0.45 + Math.random() * 0.25, [])
  const coreDur = useMemo(() => 0.25 + Math.random() * 0.15, [])

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size * 1.3 }}
      aria-hidden="true"
    >
      {/* warm glow halo */}
      <div
        className="animate-glow-pulse absolute left-1/2 top-[18%] -z-10 rounded-full"
        style={{
          width: size * 1.6,
          height: size * 1.6,
          transform: 'translateX(-50%)',
          background:
            'radial-gradient(circle, rgba(251,191,36,0.55) 0%, rgba(251,146,60,0.25) 40%, rgba(251,146,60,0) 70%)',
          filter: 'blur(6px)',
        }}
      />

      {/* flame */}
      <div
        className="absolute left-1/2 top-0"
        style={{
          width: size * 0.22,
          height: size * 0.5,
          transform: 'translateX(-50%)',
        }}
      >
        {/* outer flame */}
        <div
          className="animate-flicker absolute inset-0"
          style={{
            animationDelay: `${delay}s`,
            animationDuration: `${flickerDur}s`,
            background:
              'linear-gradient(to top, rgba(251,146,60,0.95) 0%, rgba(251,191,36,0.95) 45%, rgba(255,237,160,0.85) 75%, rgba(255,255,255,0) 100%)',
            clipPath: 'ellipse(50% 100% at 50% 100%)',
            filter: 'blur(0.5px)',
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
          }}
        />
        {/* inner hot core */}
        <div
          className="animate-flame-core absolute inset-x-[25%] bottom-[10%] top-[20%]"
          style={{
            animationDelay: `${delay * 0.5}s`,
            animationDuration: `${coreDur}s`,
            background:
              'linear-gradient(to top, rgba(255,160,40,1) 0%, rgba(255,237,160,1) 60%, rgba(255,255,255,0.95) 100%)',
            clipPath: 'ellipse(50% 100% at 50% 100%)',
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
          }}
        />
      </div>

      {/* lamp body (the diya bowl) — SVG */}
      <svg
        viewBox="0 0 100 60"
        className="absolute bottom-0 left-0 w-full"
        style={{ height: size * 0.6 }}
        preserveAspectRatio="xMidYMax meet"
      >
        <defs>
          <linearGradient id={`diyaBody-${delay}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f6b94b" />
            <stop offset="45%" stopColor="#e08a1f" />
            <stop offset="100%" stopColor="#7a3b0c" />
          </linearGradient>
          <linearGradient id={`diyaRim-${delay}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffe7a3" />
            <stop offset="100%" stopColor="#f0a32f" />
          </linearGradient>
        </defs>
        {/* rim / spout */}
        <path
          d="M5 18 Q50 0 95 18 L88 24 Q50 12 12 24 Z"
          fill={`url(#diyaRim-${delay})`}
        />
        {/* bowl */}
        <path
          d="M12 24 Q50 18 88 24 Q82 52 50 54 Q18 52 12 24 Z"
          fill={`url(#diyaBody-${delay})`}
        />
        {/* inner shadow */}
        <ellipse cx="50" cy="26" rx="32" ry="6" fill="rgba(60,20,5,0.55)" />
        {/* highlight */}
        <path
          d="M20 28 Q50 22 80 28 Q72 34 50 33 Q28 34 20 28 Z"
          fill="rgba(255,240,200,0.25)"
        />
      </svg>
    </div>
  )
}
