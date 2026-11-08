'use client'

import { Sparkles, Gift, Flame, MousePointerClick, PartyPopper } from 'lucide-react'
import FireworksCanvas from '@/components/diwali/FireworksCanvas'
import SkyLanterns from '@/components/diwali/SkyLanterns'
import SparklesLayer from '@/components/diwali/Sparkles'
import Rangoli from '@/components/diwali/Rangoli'
import InteractiveGift from '@/components/diwali/InteractiveGift'
import CrackerString from '@/components/diwali/CrackerString'
import LightableDiya from '@/components/diwali/LightableDiya'

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#07061a] text-amber-50">
      {/* ===== Fixed background layers (night sky) ===== */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, #1a1140 0%, #0d0a2a 35%, #07061a 70%), radial-gradient(ellipse at 50% 100%, #2a0e1a 0%, #07061a 60%)',
        }}
      />
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
      <SkyLanterns count={6} />
      {/* Interactive fireworks */}
      <FireworksCanvas />

      {/* ===== Foreground content ===== */}
      <div className="relative z-20 flex min-h-screen flex-col">
        {/* ---------- HERO ---------- */}
        <header className="relative flex flex-col items-center justify-center px-4 pt-16 pb-10 text-center sm:pt-24">
          {/* click hint */}
          <div className="animate-bob mb-6 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-4 py-1.5 text-xs text-amber-200 backdrop-blur-sm sm:text-sm">
            <MousePointerClick className="h-3.5 w-3.5" />
            Neeche koi bhi dabao — man kare toh aasman pe bhi!
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
            className="animate-title-rise mt-5 max-w-xl text-base text-amber-100/80 sm:text-lg"
            style={{ animationDelay: '0.3s' }}
          >
            <span className="animate-text-glow inline-block font-semibold text-amber-300">
              Click &amp; celebrate
            </span>
            {' — '}tohfa kholo, patakhe jalao, diya roshan karo. Har click me ek chhota sa tyohaar.
          </p>

          {/* decorative ornaments row */}
          <div className="animate-title-rise mt-6 flex items-center gap-3 opacity-90" style={{ animationDelay: '0.5s' }}>
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-amber-400/60 sm:w-20" />
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span className="text-amber-300/80 text-xs tracking-[0.4em] uppercase">Festival of Lights</span>
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-amber-400/60 sm:w-20" />
          </div>
        </header>

        {/* ---------- INTERACTIVE OBJECTS ---------- */}
        <section className="relative px-4 py-12 sm:py-16">
          {/* rangoli backdrop */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 -z-0 hidden -translate-x-1/2 -translate-y-1/2 opacity-25 lg:block">
            <Rangoli size={560} />
          </div>

          <div className="relative z-10 mb-10 text-center">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-4 py-1 text-xs text-amber-200">
              <PartyPopper className="h-3.5 w-3.5" />
              Kuch bhi dabao
            </div>
            <h2 className="text-2xl font-bold text-amber-100 sm:text-3xl">
              Teeno me maza <span className="text-amber-400">alag</span> hai
            </h2>
          </div>

          {/* three interactive cards */}
          <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-stretch justify-center gap-8 sm:flex-row sm:gap-6 lg:gap-12">
            {/* gift */}
            <InteractionCard label="Tohfa" icon={<Gift className="h-5 w-5" />} accent="rose">
              <InteractiveGift />
            </InteractionCard>
            {/* crackers */}
            <InteractionCard label="Patakhe" icon={<Flame className="h-5 w-5" />} accent="orange">
              <CrackerString />
            </InteractionCard>
            {/* diya */}
            <InteractionCard label="Diya" icon={<Sparkles className="h-5 w-5" />} accent="amber">
              <LightableDiya />
            </InteractionCard>
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
              Har click ek tyohaar. Tohfa kholo, patakhe jalao, diya roshan karo — aur aasman pe click karke fireworks bhi chalao.
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

function InteractionCard({
  label,
  icon,
  accent,
  children,
}: {
  label: string
  icon: React.ReactNode
  accent: 'rose' | 'orange' | 'amber'
  children: React.ReactNode
}) {
  const accentMap = {
    rose: 'border-rose-400/30 from-rose-500/10',
    orange: 'border-orange-400/30 from-orange-500/10',
    amber: 'border-amber-400/30 from-amber-500/10',
  } as const
  const iconColor = {
    rose: 'text-rose-300',
    orange: 'text-orange-300',
    amber: 'text-amber-300',
  } as const

  return (
    <div
      className={`relative flex flex-1 flex-col items-center rounded-2xl border ${accentMap[accent]} bg-gradient-to-b to-transparent px-4 py-6 backdrop-blur-sm sm:px-6`}
    >
      <div className={`mb-6 inline-flex items-center gap-1.5 rounded-full border ${accentMap[accent]} bg-slate-950/40 px-3 py-1 text-xs font-medium ${iconColor[accent]}`}>
        {icon}
        {label}
      </div>
      {children}
    </div>
  )
}
