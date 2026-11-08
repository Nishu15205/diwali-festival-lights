'use client'

import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame } from 'lucide-react'

const CRACKER_COUNT = 5

type Spark = {
  id: number
  crackerIndex: number
  dx: number
  dy: number
  color: string
  size: number
}

const SPARK_COLORS = ['#fbbf24', '#f97316', '#ef4444', '#fde047', '#fff7ed']

export default function CrackerString() {
  const [bursting, setBursting] = useState(false)
  const [popped, setPopped] = useState<boolean[]>(Array(CRACKER_COUNT).fill(false))
  const [sparks, setSparks] = useState<Spark[]>([])
  const [count, setCount] = useState(0)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const sparkId = useRef(0)

  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  const handleBurst = useCallback(() => {
    if (bursting) return
    setBursting(true)
    setCount((c) => c + 1)

    // reset all to unpopped first
    setPopped(Array(CRACKER_COUNT).fill(false))

    // pop bottom-to-top
    for (let i = 0; i < CRACKER_COUNT; i++) {
      const t = setTimeout(() => {
        setPopped((prev) => {
          const next = [...prev]
          next[i] = true
          return next
        })

        // spawn sparks for this cracker
        const newSparks: Spark[] = Array.from({ length: 14 }, () => ({
          id: sparkId.current++,
          crackerIndex: i,
          dx: (Math.random() * 90 - 45),
          dy: -(20 + Math.random() * 60),
          color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
          size: 2 + Math.random() * 3,
        }))
        setSparks((s) => [...s, ...newSparks])
        // clean up these sparks shortly after
        const cleanT = setTimeout(() => {
          setSparks((s) => s.filter((sp) => !newSparks.some((ns) => ns.id === sp.id)))
        }, 900)
        timers.current.push(cleanT)

        // on the last cracker, launch sky fireworks + reset
        if (i === CRACKER_COUNT - 1) {
          const finalT = setTimeout(() => {
            window.dispatchEvent(
              new CustomEvent('diwali:launch-firework', { detail: { count: 3 } }),
            )
            setBursting(false)
            setPopped(Array(CRACKER_COUNT).fill(false))
          }, 700)
          timers.current.push(finalT)
        }
      }, i * 190)
      timers.current.push(t)
    }
  }, [bursting])

  return (
    <div className="relative flex flex-col items-center gap-3">
      {/* fuse flame at top while bursting */}
      <AnimatePresence>
        {bursting && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute left-1/2 top-[18px] z-20 -translate-x-1/2"
          >
            <div
              className="animate-flicker h-5 w-3"
              style={{
                background: 'linear-gradient(to top, #f97316, #fde047, #fff)',
                clipPath: 'ellipse(50% 100% at 50% 100%)',
                filter: 'blur(0.3px)',
                boxShadow: '0 0 12px rgba(251,191,36,0.9)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* the clickable cracker string */}
      <button
        onClick={handleBurst}
        disabled={bursting}
        aria-label="Patakhe jalao"
        className="group relative flex h-44 w-32 flex-col items-center justify-center rounded-2xl pb-6 pt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 disabled:cursor-wait sm:h-52 sm:w-36"
      >
        {/* hanging rope — spans the cracker column */}
        <div className="absolute left-1/2 top-6 bottom-8 w-[3px] -translate-x-1/2 rounded-full bg-amber-950/80" />

        {/* crackers threaded on the rope — centered */}
        <div className="relative z-10 flex flex-col items-center gap-1.5">
          {Array.from({ length: CRACKER_COUNT }).map((_, i) => (
            <Cracker key={i} index={i} popped={popped[i]} sparks={sparks.filter((s) => s.crackerIndex === i)} />
          ))}
        </div>

        {/* hover hint */}
        {!bursting && (
          <span className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium text-amber-300/70 transition group-hover:text-amber-200">
            Dabao jalane ke liye
          </span>
        )}
        {bursting && (
          <span className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium text-rose-300">
            Chal rahe hain... 💥
          </span>
        )}
      </button>

      {/* counter */}
      <div className="mt-4 flex items-center gap-1.5 rounded-full border border-amber-400/25 bg-amber-500/10 px-3 py-1 text-xs text-amber-200">
        <Flame className="h-3.5 w-3.5" />
        {count} baar patakhe chale
      </div>
    </div>
  )
}

function Cracker({
  index,
  popped,
  sparks,
}: {
  index: number
  popped: boolean
  sparks: Spark[]
}) {
  return (
    <div className="relative flex items-center justify-center">
      {/* the cracker cylinder — centered on the rope */}
      <motion.div
        className="relative z-10"
        animate={popped ? { scale: [1, 1.25, 0], opacity: [1, 1, 0] } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* cracker body */}
        <div
          className="h-7 w-6 rounded-sm"
          style={{
            background: 'linear-gradient(to right, #7f1d1d 0%, #dc2626 40%, #b91c1c 60%, #7f1d1d 100%)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.5), inset 0 0 3px rgba(0,0,0,0.4)',
          }}
        >
          {/* top cap */}
          <div className="h-1.5 w-full rounded-t-sm bg-amber-950" />
          {/* label stripe */}
          <div className="mt-0.5 h-1 w-full bg-amber-400/80" />
          {/* gold ring detail */}
          <div className="mt-0.5 h-0.5 w-full bg-amber-600/60" />
        </div>
        {/* fuse — only on the top cracker */}
        {index === 0 && (
          <div className="absolute -top-2 left-1/2 h-2 w-[2px] -translate-x-1/2 bg-amber-200/70" />
        )}
      </motion.div>

      {/* flash + sparks when popped */}
      <AnimatePresence>
        {popped && (
          <>
            {/* flash */}
            <motion.div
              initial={{ opacity: 0.9, scale: 0 }}
              animate={{ opacity: [0.9, 0.6, 0], scale: [0, 2.5, 3] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background: 'radial-gradient(circle, #fff7ed 0%, #fde047 30%, #f97316 60%, transparent 80%)',
                filter: 'blur(1px)',
              }}
            />
            {/* sparks */}
            {sparks.map((s) => (
              <motion.div
                key={s.id}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: s.dx, y: s.dy, opacity: 0, scale: 0.2 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="absolute left-1/2 top-1/2"
                style={{
                  width: s.size,
                  height: s.size,
                  backgroundColor: s.color,
                  borderRadius: '50%',
                  boxShadow: `0 0 ${s.size * 2}px ${s.color}`,
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
