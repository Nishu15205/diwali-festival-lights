'use client'

import { useState } from 'react'
import { Sparkles, Share2, RotateCcw, Heart, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

const PRESET_WISHES = [
  'May this Diwali light up your life with endless joy, prosperity and happiness. Wishing you a sparkling festival of lights!',
  'Let every diya we light bring warmth to your home and peace to your heart. Happy Diwali!',
  'May the glow of diyas illuminate your path and the fireworks fill your life with colours. Shubh Deepavali!',
  'Wishing you wealth, health and endless smiles this Diwali. May Goddess Lakshmi bless your home abundantly.',
  'Like the festival of lights, may your life always shine bright with love and laughter. Happy Diwali!',
]

export default function WishCard() {
  const [fromName, setFromName] = useState('')
  const [toName, setToName] = useState('')
  const [message, setMessage] = useState(PRESET_WISHES[0])
  const [revealed, setRevealed] = useState(false)
  const [liked, setLiked] = useState(false)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleGenerate = () => {
    if (!fromName.trim()) {
      toast({
        title: 'Naam toh likho bhai',
        description: 'Apna naam daalo taaki wish personalized ho.',
      })
      return
    }
    setRevealed(true)
    // small delay so the flip animation reads
    setTimeout(() => {
      document.getElementById('wish-card-result')?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }, 250)
  }

  const handleReset = () => {
    setRevealed(false)
    setLiked(false)
    setCopied(false)
  }

  const handleShare = async () => {
    const wish = buildWishText()
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Happy Diwali!',
          text: wish,
        })
      } catch {
        // user cancelled — ignore
      }
    } else {
      try {
        await navigator.clipboard.writeText(wish)
        setCopied(true)
        toast({
          title: 'Wish copy ho gaya!',
          description: 'Ab kahin bhi paste karke share kar lo.',
        })
        setTimeout(() => setCopied(false), 2000)
      } catch {
        toast({
          title: 'Share nahi hua',
          description: 'Wish text manually copy kar lo.',
          variant: 'destructive',
        })
      }
    }
  }

  const handleCopy = async () => {
    const wish = buildWishText()
    try {
      await navigator.clipboard.writeText(wish)
      setCopied(true)
      toast({
        title: 'Copy ho gaya!',
        description: 'Wish clipboard mein hai.',
      })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast({
        title: 'Copy fail',
        variant: 'destructive',
      })
    }
  }

  const buildWishText = () => {
    const toLine = toName.trim() ? `Dear ${toName.trim()},\n\n` : ''
    const fromLine = fromName.trim() ? `\n\n— ${fromName.trim()}` : ''
    return `${toLine}${message}${fromLine}`
  }

  return (
    <div className="relative w-full">
      {/* control panel */}
      {!revealed && (
        <div className="animate-card-reveal relative mx-auto w-full max-w-xl rounded-2xl border border-amber-400/30 bg-slate-900/70 p-6 shadow-[0_0_40px_rgba(251,146,60,0.25)] backdrop-blur-md sm:p-8">
          <div className="mb-5 flex items-center gap-2 text-amber-300">
            <Sparkles className="h-5 w-5 animate-bob" />
            <h2 className="text-lg font-semibold tracking-wide sm:text-xl">
              Apni wish banao
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="toName" className="mb-1.5 block text-sm font-medium text-amber-100/80">
                Kiske liye? (optional)
              </label>
              <Input
                id="toName"
                value={toName}
                onChange={(e) => setToName(e.target.value)}
                placeholder="e.g. Priya, Maa, Team..."
                maxLength={40}
                className="border-amber-400/30 bg-slate-950/60 text-amber-50 placeholder:text-amber-200/30 focus-visible:ring-amber-400/50"
              />
            </div>

            <div>
              <label htmlFor="fromName" className="mb-1.5 block text-sm font-medium text-amber-100/80">
                Aapka naam
              </label>
              <Input
                id="fromName"
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
                placeholder="e.g. Rahul"
                maxLength={40}
                className="border-amber-400/30 bg-slate-950/60 text-amber-50 placeholder:text-amber-200/30 focus-visible:ring-amber-400/50"
              />
            </div>

            <div>
              <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-amber-100/80">
                Wish message
              </label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                maxLength={400}
                className="resize-none border-amber-400/30 bg-slate-950/60 text-amber-50 placeholder:text-amber-200/30 focus-visible:ring-amber-400/50"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {PRESET_WISHES.map((w, i) => (
                  <button
                    key={i}
                    onClick={() => setMessage(w)}
                    className="rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-xs text-amber-200 transition hover:border-amber-400/60 hover:bg-amber-500/20"
                  >
                    Preset {i + 1}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              className="animate-btn-glow w-full rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-base font-semibold text-white transition hover:from-amber-400 hover:via-orange-400 hover:to-rose-400"
              size="lg"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Wish generate karo
            </Button>
            <p className="text-center text-xs text-amber-200/40">
              Tip: aasman pe click karke fireworks bhi chalao
            </p>
          </div>
        </div>
      )}

      {/* revealed wish card */}
      {revealed && (
        <div
          id="wish-card-result"
          className="animate-card-reveal relative mx-auto w-full max-w-xl"
        >
          {/* rotating conic glow border */}
          <div
            className="animate-border-rotate pointer-events-none absolute -inset-[2px] rounded-3xl opacity-80"
            style={{
              background:
                'conic-gradient(from var(--angle, 0deg), transparent 0%, #fbbf24 10%, transparent 25%, #f97316 40%, transparent 55%, #ef4444 70%, transparent 85%, #fbbf24 100%)',
              filter: 'blur(2px)',
            }}
          />
          <div className="relative overflow-hidden rounded-3xl border border-amber-400/40 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 p-6 shadow-[0_0_60px_rgba(251,146,60,0.35)] backdrop-blur-md sm:p-10">
            {/* corner sparkles */}
            <CornerSparkles />

            {/* top diya row */}
            <div className="mb-6 flex items-end justify-center gap-3 sm:gap-6">
              <DiyaMini />
              <DiyaMini delay={0.3} />
              <DiyaMini delay={0.6} />
            </div>

            {/* greeting */}
            <div className="text-center">
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.3em] text-amber-300/70">
                Shubh Deepavali
              </p>
              {toName.trim() && (
                <p className="mb-3 text-lg font-medium text-amber-100">
                  Dear {toName.trim()},
                </p>
              )}
              <p className="mx-auto max-w-md text-base leading-relaxed text-amber-50/90 sm:text-lg">
                {message}
              </p>
              {fromName.trim() && (
                <p className="mt-5 text-right text-base font-semibold text-amber-300">
                  — {fromName.trim()}
                </p>
              )}
            </div>

            {/* decorative divider */}
            <div className="my-6 flex items-center justify-center gap-2">
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400/50" />
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400/50" />
            </div>

            {/* actions */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                onClick={handleShare}
                className="rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-400 hover:to-orange-500"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share karo
              </Button>
              <Button
                onClick={handleCopy}
                variant="outline"
                className="rounded-full border-amber-400/40 bg-slate-950/40 text-amber-100 hover:bg-amber-500/10 hover:text-amber-50"
              >
                {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              <Button
                onClick={() => setLiked((v) => !v)}
                variant="outline"
                className={`rounded-full border-rose-400/40 bg-slate-950/40 transition hover:bg-rose-500/10 ${
                  liked ? 'text-rose-400' : 'text-amber-100'
                }`}
              >
                <Heart className={`mr-2 h-4 w-4 ${liked ? 'fill-rose-400' : ''}`} />
                {liked ? 'Liked' : 'Like'}
              </Button>
              <Button
                onClick={handleReset}
                variant="ghost"
                className="rounded-full text-amber-200/70 hover:bg-amber-500/10 hover:text-amber-100"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Naya banao
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function DiyaMini({ delay = 0 }: { delay?: number }) {
  return (
    <div className="relative h-12 w-10 sm:h-16 sm:w-12">
      <div
        className="animate-flicker absolute left-1/2 top-0 h-6 w-3 -translate-x-1/2 sm:h-8 sm:w-3.5"
        style={{
          animationDelay: `${delay}s`,
          background:
            'linear-gradient(to top, rgba(251,146,60,1) 0%, rgba(251,191,36,1) 50%, rgba(255,247,200,1) 100%)',
          clipPath: 'ellipse(50% 100% at 50% 100%)',
          filter: 'blur(0.3px)',
          boxShadow: '0 0 12px rgba(251,191,36,0.8)',
        }}
      />
      <div
        className="absolute bottom-0 left-1/2 h-3 w-8 -translate-x-1/2 rounded-b-full sm:h-4 sm:w-10"
        style={{
          background: 'linear-gradient(to bottom, #f0a32f, #7a3b0c)',
        }}
      />
    </div>
  )
}

function CornerSparkles() {
  const corners = [
    { pos: 'top-3 left-3', size: 14, delay: 0 },
    { pos: 'top-3 right-3', size: 10, delay: 0.4 },
    { pos: 'bottom-3 left-3', size: 12, delay: 0.8 },
    { pos: 'bottom-3 right-3', size: 16, delay: 1.2 },
  ]
  return (
    <>
      {corners.map((c, i) => (
        <Sparkles
          key={i}
          className={`animate-bob absolute ${c.pos} text-amber-300/50`}
          style={{ width: c.size, height: c.size, animationDelay: `${c.delay}s` }}
        />
      ))}
    </>
  )
}
