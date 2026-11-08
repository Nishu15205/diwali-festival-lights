'use client'

import { useEffect, useRef, useCallback } from 'react'

/**
 * Interactive fireworks canvas.
 * - Auto-launches fireworks on a timer.
 * - Click / tap anywhere to launch a firework toward that point.
 * - Multiple burst patterns: peony, ring, willow, chrysanthemum, crackle.
 * - Gravity, air drag, fading trails, additive glow.
 */

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  hue: number
  sat: number
  light: number
  size: number
  trail: boolean
  flicker: boolean
}

type Rocket = {
  x: number
  y: number
  vx: number
  vy: number
  targetY: number
  hue: number
  trail: { x: number; y: number; a: number }[]
}

const PATTERNS = ['peony', 'ring', 'willow', 'chrysanthemum', 'crackle'] as const
type Pattern = (typeof PATTERNS)[number]

const FESTIVE_HUE_BANDS: Array<[number, number]> = [
  [10, 35], // saffron / orange
  [40, 55], // gold / yellow
  [0, 8], // red
  [320, 345], // magenta / pink
  [160, 190], // teal / green
  [270, 300], // violet
]

function randomHue(): number {
  const band = FESTIVE_HUE_BANDS[Math.floor(Math.random() * FESTIVE_HUE_BANDS.length)]
  return band[0] + Math.random() * (band[1] - band[0])
}

export default function FireworksCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rocketsRef = useRef<Rocket[]>([])
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef<number | null>(null)
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 })
  const lastLaunchRef = useRef(0)

  const spawnBurst = useCallback((x: number, y: number, hue?: number, pattern?: Pattern) => {
    const p = pattern ?? (PATTERNS[Math.floor(Math.random() * PATTERNS.length)] as Pattern)
    const baseHue = hue ?? randomHue()
    const particles = particlesRef.current
    const count = 70 + Math.floor(Math.random() * 50)

    if (p === 'ring') {
      const ringCount = 60
      const speed = 5 + Math.random() * 2
      for (let i = 0; i < ringCount; i++) {
        const angle = (Math.PI * 2 * i) / ringCount
        const v = speed * (0.95 + Math.random() * 0.1)
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * v,
          vy: Math.sin(angle) * v,
          life: 1,
          maxLife: 90 + Math.random() * 30,
          hue: baseHue + (Math.random() * 20 - 10),
          sat: 95,
          light: 60,
          size: 2.2,
          trail: true,
          flicker: false,
        })
      }
      return
    }

    if (p === 'willow') {
      const willowCount = 80
      for (let i = 0; i < willowCount; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = 2 + Math.random() * 4
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1,
          life: 1,
          maxLife: 140 + Math.random() * 60,
          hue: baseHue,
          sat: 90,
          light: 65,
          size: 1.8,
          trail: true,
          flicker: true,
        })
      }
      return
    }

    if (p === 'chrysanthemum') {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = 1 + Math.random() * 6
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          maxLife: 80 + Math.random() * 40,
          hue: baseHue + (Math.random() * 40 - 20),
          sat: 95,
          light: 58,
          size: 2 + Math.random() * 1.5,
          trail: true,
          flicker: false,
        })
      }
      return
    }

    if (p === 'crackle') {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = 1 + Math.random() * 5
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          maxLife: 50 + Math.random() * 40,
          hue: baseHue,
          sat: 100,
          light: 70,
          size: 1.6,
          trail: false,
          flicker: true,
        })
      }
      return
    }

    // peony (default)
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 2 + Math.random() * 4.5
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: 90 + Math.random() * 40,
        hue: baseHue + (Math.random() * 20 - 10),
        sat: 95,
        light: 60,
        size: 2.2,
        trail: true,
        flicker: false,
      })
    }
  }, [])

  const launchRocket = useCallback((targetX?: number, targetY?: number) => {
    const { w, h } = sizeRef.current
    const startX = targetX ?? Math.random() * w
    const startY = h + 10
    const targetYReal = targetY ?? h * (0.18 + Math.random() * 0.25)
    const dx = ((targetX ?? startX) - startX) * 0.001
    const vy = -(Math.sqrt(2 * 0.12 * Math.max(40, startY - targetYReal)) + 2)
    rocketsRef.current.push({
      x: startX,
      y: startY,
      vx: dx,
      vy,
      targetY: targetYReal,
      hue: randomHue(),
      trail: [],
    })
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      sizeRef.current = { w, h, dpr }
    }
    resize()
    window.addEventListener('resize', resize)

    const handleClick = (e: MouseEvent) => {
      launchRocket(e.clientX, e.clientY)
    }
    const handleTouch = (e: TouchEvent) => {
      const t = e.touches[0]
      if (t) launchRocket(t.clientX, t.clientY)
    }
    canvas.addEventListener('click', handleClick)
    canvas.addEventListener('touchstart', handleTouch, { passive: true })

    const tick = (now: number) => {
      const { w, h } = sizeRef.current
      // Trail fade — semi-transparent dark rect creates motion trails
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = 'rgba(7, 6, 20, 0.22)'
      ctx.fillRect(0, 0, w, h)

      // Auto-launch
      if (now - lastLaunchRef.current > 1100 + Math.random() * 1400) {
        lastLaunchRef.current = now
        launchRocket()
      }

      ctx.globalCompositeOperation = 'lighter'

      // Rockets
      const rockets = rocketsRef.current
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i]
        r.vy += 0.06 // mild gravity on rocket
        r.x += r.vx
        r.y += r.vy
        r.trail.push({ x: r.x, y: r.y, a: 1 })
        if (r.trail.length > 12) r.trail.shift()

        // draw trail
        for (let t = 0; t < r.trail.length; t++) {
          const tp = r.trail[t]
          const a = (t / r.trail.length) * 0.8
          ctx.fillStyle = `hsla(${r.hue}, 95%, 70%, ${a})`
          ctx.beginPath()
          ctx.arc(tp.x, tp.y, 1.6, 0, Math.PI * 2)
          ctx.fill()
        }
        // rocket head glow
        ctx.fillStyle = `hsla(${r.hue}, 100%, 80%, 0.95)`
        ctx.beginPath()
        ctx.arc(r.x, r.y, 2.4, 0, Math.PI * 2)
        ctx.fill()

        if (r.vy >= -0.5 || r.y <= r.targetY) {
          spawnBurst(r.x, r.y, r.hue)
          rockets.splice(i, 1)
        }
      }

      // Particles
      const particles = particlesRef.current
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.vx *= 0.985 // air drag
        p.vy *= 0.985
        p.vy += 0.045 // gravity
        p.x += p.vx
        p.y += p.vy
        p.life -= 1 / p.maxLife

        if (p.life <= 0) {
          particles.splice(i, 1)
          continue
        }

        const alpha = Math.max(0, p.life)
        const flick = p.flicker ? 0.55 + Math.random() * 0.45 : 1
        const light = p.light + (1 - p.life) * 15

        if (p.trail) {
          // glowing core
          ctx.fillStyle = `hsla(${p.hue}, ${p.sat}%, ${light}%, ${alpha * flick})`
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
          // soft halo
          ctx.fillStyle = `hsla(${p.hue}, ${p.sat}%, ${light}%, ${alpha * 0.18})`
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 3.2, 0, Math.PI * 2)
          ctx.fill()
        } else {
          ctx.fillStyle = `hsla(${p.hue}, ${p.sat}%, ${light}%, ${alpha * flick})`
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    // initial volley so the sky is alive on load
    const initialVolley = setTimeout(() => {
      launchRocket()
      setTimeout(() => launchRocket(), 300)
      setTimeout(() => launchRocket(), 650)
    }, 400)

    return () => {
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('click', handleClick)
      canvas.removeEventListener('touchstart', handleTouch)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      clearTimeout(initialVolley)
    }
  }, [launchRocket, spawnBurst])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-auto fixed inset-0 z-10 h-full w-full cursor-crosshair"
    />
  )
}
