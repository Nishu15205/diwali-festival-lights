'use client'

import { Sparkles, Flame, Gift, MousePointerClick } from 'lucide-react'
import FireworksCanvas from '@/components/diwali/FireworksCanvas'
import SkyLanterns from '@/components/diwali/SkyLanterns'
import SparklesLayer from '@/components/diwali/Sparkles'
import Rangoli from '@/components/diwali/Rangoli'
import Diya from '@/components/diwali/Diya'
import WishCard from '@/components/diwali/WishCard'

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#07061a] text-amber-50">
      {/* ===== Fixed background layers (night sky) ===== */}
      {/* Deep gradient sky */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, #1a1140 0%, #0d0a2a 35%, #07061a 70%), radial-gradient(ellipse at 50% 100%, #2a0e1a 0%, #07061a 60%)',
        }}
      />
      {/* subtle warm horizon glow at bottom */}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[1] h-1/3"
        style={{
          background:
            'linear-gradient(to top, rgba(251,146,60,0.18) 0%, rgba(251,146,60,0.05) 40%, rgba(251,146,60,0) 100%)',
        }}
      />

      {/* Stars + rising sparkles */}
      <SparklesLayer />
      {/* Floating sky lanterns */}
      <SkyLanterns count={7} />
      {/* Interactive fireworks */}
      <FireworksCanvas />

      {/* ===== Foreground content ===== */}
      <div className="relative z-20 flex min-h-screen flex-col">
        {/* ---------- HERO ---------- */}
        <header className="relative flex flex-col items-center justify-center px-4 pt-20 pb-24 text-center sm:pt-28 sm:pb-32">
          {/* click hint */}
          <div className="animate-bob mb-6 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-4 py-1.5 text-xs text-amber-200 backdrop-blur-sm sm:text-sm">
            <MousePointerClick className="h-3.5 w-3.5" />
            Aasman pe click karke fireworks chalao
          </div>

          {/* main title */}
          <h1 className="animate-title-rise relative px-2">
            <span
              className="animate-gold-shimmer block bg-clip-text text-5xl font-black leading-none text-transparent drop-shadow-[0_0_30px_rgba(251,146,60,0.45)] sm:text-7xl md:text-8xl lg:text-9xl"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, #fbbf24 0%, #fff6c2 25%, #f97316 50%, #fff6c2 75%, #fbbf24 100%)',
              }}
            >
              Happy Diwali
            </span>
          </h1>

          {/* subtitle */}
          <p
            className="animate-title-rise mt-5 max-w-2xl text-base text-amber-100/80 sm:text-lg md:text-xl"
            style={{ animationDelay: '0.3s' }}
          >
            <span className="animate-text-glow inline-block font-semibold text-amber-300">
              Shubh Deepavali
            </span>
            {' — '}may the festival of lights fill your life with brightness, joy and endless prosperity.
          </p>

          {/* decorative ornaments row */}
          <div className="animate-title-rise mt-8 flex items-center gap-3 opacity-90" style={{ animationDelay: '0.5s' }}>
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-amber-400/60 sm:w-20" />
            <Flame className="h-5 w-5 text-amber-400" />
            <span className="text-amber-300/80 text-xs tracking-[0.4em] uppercase">Festival of Lights</span>
            <Flame className="h-5 w-5 text-amber-400" />
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-amber-400/60 sm:w-20" />
          </div>

          {/* scroll hint */}
          <div className="mt-16 flex flex-col items-center gap-2 text-amber-200/50">
            <span className="text-xs uppercase tracking-widest">Apni wish banao</span>
            <div className="animate-bob">
              <Gift className="h-6 w-6 text-amber-400" />
            </div>
          </div>
        </header>

        {/* ---------- WISH BUILDER ---------- */}
        <section className="relative flex flex-col items-center px-4 py-16 sm:py-24">
          {/* rangoli behind the card */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 -z-0 hidden -translate-x-1/2 -translate-y-1/2 opacity-40 sm:block">
            <Rangoli size={520} />
          </div>

          <div className="relative z-10 mb-8 text-center">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-4 py-1 text-xs text-amber-200">
              <Sparkles className="h-3.5 w-3.5" />
              Personalized Diwali Wish
            </div>
            <h2 className="text-3xl font-bold text-amber-100 sm:text-4xl">
              Apne loved ones ke liye <span className="text-amber-400">wish</span> banao
            </h2>
            <p className="mt-2 text-sm text-amber-200/60 sm:text-base">
              Naam likho, message choose karo, aur ek khoobsurat animated wish card banao.
            </p>
          </div>

          <WishCard />
        </section>

        {/* ---------- DIYA ROW ---------- */}
        <section className="relative px-4 py-16">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 text-center">
              <h3 className="text-2xl font-bold text-amber-100 sm:text-3xl">
                Diya jalao, andhera hatao
              </h3>
              <p className="mt-1 text-sm text-amber-200/60">
                Har diya ek umeed, ek khwahish, ek duaa hai.
              </p>
            </div>
            <div className="flex flex-wrap items-end justify-center gap-6 sm:gap-12">
              {Array.from({ length: 5 }).map((_, i) => (
                <Diya key={i} size={80 + (i % 2) * 20} delay={i * 0.2} />
              ))}
            </div>
          </div>
        </section>

        {/* ---------- FOOTER (sticky to bottom) ---------- */}
        <footer className="mt-auto border-t border-amber-400/15 bg-[#07061a]/80 backdrop-blur-sm">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 py-8 text-center">
            <div className="flex items-center gap-2 text-amber-300">
              <Flame className="h-4 w-4" />
              <span className="text-sm font-semibold tracking-wide">Happy Diwali</span>
              <Flame className="h-4 w-4" />
            </div>
            <p className="max-w-md text-xs text-amber-200/50">
              Made with light, love and a whole lot of patakhas. Click the sky to launch more fireworks.
            </p>
            <p className="text-[11px] text-amber-200/30">
              © {new Date().getFullYear()} · Festival of Lights
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
