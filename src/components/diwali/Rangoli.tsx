'use client'

/**
 * Animated Rangoli mandala — concentric symmetric petals built with SVG,
 * rotating slowly in opposite directions. Sits behind the wish card as a
 * decorative floor piece.
 */
export default function Rangoli({ size = 360 }: { size?: number }) {
  return (
    <div
      className="pointer-events-none relative"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {/* outer glow */}
      <div
        className="absolute inset-0 rounded-full opacity-60"
        style={{
          background:
            'radial-gradient(circle, rgba(251,191,36,0.35) 0%, rgba(251,146,60,0.12) 50%, rgba(251,146,60,0) 70%)',
          filter: 'blur(12px)',
        }}
      />
      {/* layer 1 — outer petals, slow spin */}
      <svg
        viewBox="0 0 200 200"
        className="animate-spin-slow absolute inset-0 h-full w-full"
      >
        <RangoliLayer
          petals={16}
          innerR={70}
          outerR={92}
          petalW={14}
          colors={['#f59e0b', '#dc2626', '#facc15', '#fb923c']}
        />
      </svg>
      {/* layer 2 — mid petals, reverse spin */}
      <svg
        viewBox="0 0 200 200"
        className="animate-spin-slow-rev absolute inset-0 h-full w-full"
      >
        <RangoliLayer
          petals={12}
          innerR={42}
          outerR={64}
          petalW={12}
          colors={['#fde047', '#f97316', '#ef4444', '#fbbf24']}
        />
      </svg>
      {/* layer 3 — inner petals, normal spin */}
      <svg
        viewBox="0 0 200 200"
        className="animate-spin-slow absolute inset-0 h-full w-full"
        style={{ animationDuration: '30s' }}
      >
        <RangoliLayer
          petals={8}
          innerR={18}
          outerR={36}
          petalW={10}
          colors={['#fef08a', '#fbbf24', '#f97316', '#dc2626']}
        />
      </svg>
      {/* center dot */}
      <div
        className="absolute left-1/2 top-1/2 h-[14px] w-[14px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: 'radial-gradient(circle, #fff6c2 0%, #f59e0b 60%, #b45309 100%)',
          boxShadow: '0 0 18px rgba(251,191,36,0.9)',
        }}
      />
    </div>
  )
}

function RangoliLayer({
  petals,
  innerR,
  outerR,
  petalW,
  colors,
}: {
  petals: number
  innerR: number
  outerR: number
  petalW: number
  colors: string[]
}) {
  const cx = 100
  const cy = 100
  const paths = []
  for (let i = 0; i < petals; i++) {
    const angle = (Math.PI * 2 * i) / petals
    const tx = cx + Math.cos(angle) * outerR
    const ty = cy + Math.sin(angle) * outerR
    const ctrlAngle1 = angle - 0.18
    const ctrlAngle2 = angle + 0.18
    const c1x = cx + Math.cos(ctrlAngle1) * innerR
    const c1y = cy + Math.sin(ctrlAngle1) * innerR
    const c2x = cx + Math.cos(ctrlAngle2) * innerR
    const c2y = cy + Math.sin(ctrlAngle2) * innerR
    const tipAngleBack = angle + Math.PI / petals
    const tbx = cx + Math.cos(tipAngleBack) * (outerR - petalW)
    const tby = cy + Math.sin(tipAngleBack) * (outerR - petalW)
    const d = `M ${c1x} ${c1y} Q ${tx} ${ty} ${c2x} ${c2y} Q ${tbx} ${tby} ${c1x} ${c1y} Z`
    paths.push(
      <path
        key={i}
        d={d}
        fill={colors[i % colors.length]}
        opacity={0.88}
        stroke="rgba(120,40,5,0.4)"
        strokeWidth={0.5}
      />,
    )
  }
  // central ring
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={innerR}
        fill="none"
        stroke="rgba(251,191,36,0.5)"
        strokeWidth={1.2}
      />
      {paths}
    </g>
  )
}
