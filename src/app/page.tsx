'use client'

import { Sparkles, Flame } from 'lucide-react'
import FireworksCanvas from '@/components/diwali/FireworksCanvas'
import SkyLanterns from '@/components/diwali/SkyLanterns'
import SparklesLayer from '@/components/diwali/Sparkles'
import InteractiveGift from '@/components/diwali/InteractiveGift'
import CrackerString from '@/components/diwali/CrackerString'
import LightableDiya from '@/components/diwali/LightableDiya'
import ScreenFlash from '@/components/diwali/ScreenFlash'

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#05030f] text-amber-50">
      {/* ===== AI night-sky background ===== */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/images/diwali/night-sky.png")',
          backgroundColor: '#05030f',
        }}
      />
      {/* darken overlay so foreground reads clearly + vignette */}
      <div
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(5,3,15,0.35) 0%, rgba(5,3,15,0.7) 60%, rgba(5,3,15,0.92) 100%)',
        }}
      />
      {/* warm horizon glow */}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[2] h-1/3"
        style={{
          background:
            'linear-gradient(to top, rgba(251,146,60,0.22) 0%, rgba(251,146,60,0.06) 45%, rgba(251,146,60,0) 100%)',
        }}
      />

      {/* Stars + rising sparkles */}
      <SparklesLayer />
      {/* Floating sky lanterns */}
      <SkyLanterns count={6} />
      {/* Interactive fireworks (transparent — AI sky shows through) */}
      <FireworksCanvas />
      {/* Screen-wide flash overlay for tagde click feedback */}
      <ScreenFlash />

      {/* ===== Foreground content ===== */}
      <div className="relative z-20 flex min-h-screen flex-col">
        {/* ---------- HERO ---------- */}
        <header className="relative flex flex-col items-center justify-center px-4 pt-16 pb-8 text-center sm:pt-24">
          {/* title */}
          <h1 className="animate-title-rise relative px-2">
            <span
              className="animate-gold-shimmer block bg-clip-text text-6xl font-black leading-none text-transparent drop-shadow-[0_0_40px_rgba(251,146,60,0.55)] sm:text-8xl md:text-9xl"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, #fbbf24 0%, #fff6c2 25%, #f97316 50%, #fff6c2 75%, #fbbf24 100%)',
              }}
            >
              Happy Diwali
            </span>
          </h1>

          {/* tagline */}
          <p
            className="animate-title-rise mt-5 max-w-xl text-base text-amber-100/75 sm:text-lg"
            style={{ animationDelay: '0.3s' }}
          >
            <span className="animate-text-glow inline-block font-semibold text-amber-300">
              The festival of lights
            </span>
            {' — '}wishes, warmth, and boundless joy.
          </p>

          {/* ornaments */}
          <div className="animate-title-rise mt-6 flex items-center gap-2 opacity-90 sm:gap-3" style={{ animationDelay: '0.5s' }}>
            <span className="h-px w-6 bg-gradient-to-r from-transparent to-amber-400/60 sm:w-24" />
            <Sparkles className="h-4 w-4 shrink-0 text-amber-400" />
            <span className="whitespace-nowrap text-[10px] tracking-[0.3em] uppercase text-amber-300/80 sm:text-[11px] sm:tracking-[0.45em]">
              Light · Celebrate · Joy
            </span>
            <Sparkles className="h-4 w-4 shrink-0 text-amber-400" />
            <span className="h-px w-6 bg-gradient-to-l from-transparent to-amber-400/60 sm:w-24" />
          </div>
        </header>

        {/* ---------- INTERACTIVE OBJECTS ---------- */}
        <section className="relative px-4 py-10 sm:py-14">
          <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center justify-center gap-12 sm:flex-row sm:gap-6 lg:gap-14">
            <InteractiveGift />
            <CrackerString />
            <LightableDiya />
          </div>
        </section>

        {/* ---------- FOOTER (clean wish only) ---------- */}
        <footer className="mt-auto">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-4 py-8 text-center">
            <div className="flex items-center gap-2 text-amber-300">
              <Flame className="h-4 w-4 animate-flicker" />
              <span className="text-sm font-medium tracking-wide text-amber-200/90">
                Wishing you a bright and prosperous Diwali
              </span>
              <Flame className="h-4 w-4 animate-flicker" />
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
