'use client'

import { useMemo } from 'react'

/**
 * Floating sky lanterns (akasha deepam) rising from the bottom of the screen.
 * Pure CSS animation — no canvas. Each lantern has randomized start position,
 * drift, scale, duration and delay so the sky feels alive.
 */
type Lantern = {
  left: number // vw
  scale: number
  duration: number // seconds
  delay: number // seconds
  drift: number // px horizontal drift over the rise
  tilt: number // deg final tilt
  color: string
}

const LANTERN_COLORS = [
  'linear-gradient(to bottom, #ff8a3d, #d44b1a)', // saffron
  'linear-gradient(to bottom, #ffd34d, #e0902a)', // gold
  'linear-gradient(to bottom, #ff5d73, #c81e3a)', // red
  'linear-gradient(to bottom, #ffb14d, #b8500e)', // amber
]

export default function SkyLanterns({ count = 7 }: { count?: number }) {
  const lanterns = useMemo<Lantern[]>(
    () =>
      Array.from({ length: count }, () => ({
        left: Math.random() * 100,
        scale: 0.55 + Math.random() * 0.6,
        duration: 16 + Math.random() * 14,
        delay: Math.random() * 18,
        drift: (Math.random() * 120 - 60).toFixed(0),
        tilt: (Math.random() * 12 - 6).toFixed(1),
        color: LANTERN_COLORS[Math.floor(Math.random() * LANTERN_COLORS.length)],
      })),
    [count],
  )

  return (
    <div className="pointer-events-none fixed inset-0 z-[5] overflow-hidden" aria-hidden="true">
      {lanterns.map((l, i) => (
        <div
          key={i}
          className="animate-lantern-rise absolute bottom-0"
          style={{
            left: `${l.left}vw`,
            animationDuration: `${l.duration}s`,
            animationDelay: `${l.delay}s`,
            ['--drift' as string]: `${l.drift}px`,
            ['--tilt' as string]: `${l.tilt}deg`,
          }}
        >
          <div
            className="animate-lantern-sway origin-top"
            style={{ transform: `scale(${l.scale})` }}
          >
            <SkyLantern color={l.color} />
          </div>
        </div>
      ))}
    </div>
  )
}

function SkyLantern({ color }: { color: string }) {
  return (
    <div className="relative h-[110px] w-[70px]">
      {/* glow halo */}
      <div
        className="absolute left-1/2 top-1/2 -z-10 h-[160px] w-[160px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(255,180,80,0.45) 0%, rgba(255,140,40,0.18) 40%, rgba(255,140,40,0) 70%)',
          filter: 'blur(8px)',
        }}
      />
      {/* top cap */}
      <div
        className="absolute left-1/2 top-0 h-[6px] w-[40px] -translate-x-1/2 rounded-sm bg-amber-900"
      />
      {/* body */}
      <div
        className="absolute left-1/2 top-[6px] h-[80px] w-[60px] -translate-x-1/2 rounded-t-md rounded-b-sm"
        style={{
          background: color,
          boxShadow:
            'inset 0 0 18px rgba(255,255,200,0.6), inset 0 -8px 14px rgba(120,40,5,0.4), 0 0 22px rgba(255,170,60,0.5)',
        }}
      >
        {/* inner light */}
        <div
          className="absolute left-1/2 top-1/2 h-[40px] w-[30px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(255,255,220,0.9) 0%, rgba(255,220,120,0.4) 60%, rgba(255,200,80,0) 100%)',
            filter: 'blur(3px)',
          }}
        />
        {/* vertical frame lines */}
        <div className="absolute inset-y-0 left-1 w-px bg-amber-950/30" />
        <div className="absolute inset-y-0 right-1 w-px bg-amber-950/30" />
        <div className="absolute inset-x-1 top-3 h-px bg-amber-950/25" />
        <div className="absolute inset-x-1 bottom-3 h-px bg-amber-950/25" />
      </div>
      {/* bottom opening */}
      <div className="absolute left-1/2 top-[86px] h-[4px] w-[50px] -translate-x-1/2 rounded-sm bg-amber-950" />
      {/* candle flame inside */}
      <div className="absolute left-1/2 top-[88px] h-[14px] w-[6px] -translate-x-1/2">
        <div
          className="animate-flicker h-full w-full"
          style={{
            background:
              'linear-gradient(to top, #ff9a1f 0%, #ffd34d 60%, #fff6c2 100%)',
            clipPath: 'ellipse(50% 100% at 50% 100%)',
            filter: 'blur(0.4px)',
          }}
        />
      </div>
    </div>
  )
}
