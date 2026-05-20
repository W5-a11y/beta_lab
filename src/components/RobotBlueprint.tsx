import { useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

// ── Swap image path here ───────────────────────────────────────────────────────
const ROBOT_IMAGE = '/robot_vitruvian_transparent_vector.svg'

// ── Label definitions ─────────────────────────────────────────────────────────
// rotationFactor: multiplier vs. the base rotation (creates layered depth)
const LABELS = [
  {
    id: 'vla',
    title: 'VLA Policy',
    sub: 'Vision-Language-Action',
    top: '6%',
    left: '56%',
    rotationFactor: 1.15,
  },
  {
    id: 'world',
    title: 'World Model',
    sub: 'Latent Dynamics Model',
    top: '42%',
    left: '72%',
    rotationFactor: 0.85,
  },
  {
    id: 'g1',
    title: 'Unitree G1',
    sub: '23-43 DoF Platform',
    top: '80%',
    left: '55%',
    rotationFactor: 1.2,
  },
  {
    id: 'label',
    title: 'Auto-Labeling',
    sub: 'Vision-Language Models',
    top: '30%',
    left: '-8%',
    rotationFactor: 0.9,
  },
] as const

// SVG dial tick marks
const TICK_COUNT = 60
const DIAL_R = 47 // % of SVG viewBox half-width

export default function RobotBlueprint() {
  const mouseX = useMotionValue(0.5) // normalized 0→1

  // Base rotation: –30° to +30° mapped from mouse X
  const rawRotation = useTransform(mouseX, [0, 1], [-30, 30])
  const rotation = useSpring(rawRotation, { stiffness: 100, damping: 30, mass: 1 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [mouseX])

  return (
    <div className="relative flex items-center justify-center w-full select-none">
      {/* ── Outer container — sets the coordinate space ─────────────────────── */}
      <div className="relative w-full max-w-[520px] aspect-square">

        {/* ── Subtle ambient glow ─────────────────────────────────────────────── */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(0,50,98,0.18) 0%, rgba(60,30,120,0.1) 45%, transparent 72%)',
            filter: 'blur(32px)',
          }}
        />

        {/* ── Precision dial — SVG ring + ticks ──────────────────────────────── */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ rotate: rotation }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Main ring */}
            <circle
              cx="50" cy="50" r={DIAL_R}
              fill="none"
              stroke="#3B82F6"
              strokeWidth="0.25"
              strokeDasharray="2 4"
              opacity="0.3"
            />
            {/* Tick marks */}
            {Array.from({ length: TICK_COUNT }).map((_, i) => {
              const angle = (i / TICK_COUNT) * 2 * Math.PI
              const isMajor = i % 5 === 0
              const inner = DIAL_R - (isMajor ? 2.5 : 1.4)
              const outer = DIAL_R
              return (
                <line
                  key={i}
                  x1={50 + inner * Math.cos(angle)}
                  y1={50 + inner * Math.sin(angle)}
                  x2={50 + outer * Math.cos(angle)}
                  y2={50 + outer * Math.sin(angle)}
                  stroke="#3B82F6"
                  strokeWidth={isMajor ? '0.4' : '0.2'}
                  opacity={isMajor ? '0.7' : '0.35'}
                />
              )
            })}
            {/* Cross-hair guides */}
            <line x1="50" y1={50 - DIAL_R - 2} x2="50" y2={50 - DIAL_R + 5}
              stroke="#3B82F6" strokeWidth="0.3" opacity="0.5" />
            <line x1="50" y1={50 + DIAL_R - 5} x2="50" y2={50 + DIAL_R + 2}
              stroke="#3B82F6" strokeWidth="0.3" opacity="0.5" />
          </svg>
        </motion.div>

        {/* ── Second inner ring (counter-rotates slightly) ──────────────────── */}
        <motion.div
          className="absolute inset-[8%] pointer-events-none"
          style={{ rotate: useTransform(rotation, (r) => -r * 0.4) }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle
              cx="50" cy="50" r="46"
              fill="none"
              stroke="rgba(0,50,98,0.2)"
              strokeWidth="0.3"
              strokeDasharray="1.5 3"
            />
          </svg>
        </motion.div>

        {/* ── Robot image ─────────────────────────────────────────────────────── */}
        <motion.div
          className="absolute inset-[6%] pointer-events-none"
          style={{ rotate: rotation }}
        >
          <img
            src={ROBOT_IMAGE}
            alt="Vitruvian Robot"
            draggable={false}
            className="w-full h-full object-contain"
            style={{
              mixBlendMode: 'screen',
              filter: 'brightness(1.25) contrast(1.5)',
              maskImage:
                'radial-gradient(circle, black 55%, rgba(0,0,0,0.6) 72%, transparent 90%)',
              WebkitMaskImage:
                'radial-gradient(circle, black 55%, rgba(0,0,0,0.6) 72%, transparent 90%)',
            }}
          />
        </motion.div>

        {/* ── Center axis glow dot ─────────────────────────────────────────────── */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#4a90d9',
            boxShadow:
              '0 0 6px 2px rgba(74,144,217,0.8), 0 0 16px 4px rgba(0,50,98,0.5)',
          }}
        />

        {/* ── Floating metadata labels ─────────────────────────────────────────── */}
        {LABELS.map((label) => (
          <LabelPin
            key={label.id}
            label={label}
            baseRotation={rotation}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Label sub-component — own rotation derived from base × factor ─────────────
function LabelPin({
  label,
  baseRotation,
}: {
  label: (typeof LABELS)[number]
  baseRotation: ReturnType<typeof useSpring>
}) {
  const rotate = useTransform(
    baseRotation,
    (r) => r * label.rotationFactor
  )

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        top: label.top,
        left: label.left,
        rotate,
        transformOrigin: 'center center',
      }}
    >
      <div className="flex flex-col gap-0.5">
        <span
          className="font-mono text-[10px] font-semibold tracking-widest uppercase whitespace-nowrap"
          style={{ color: 'rgba(255,255,255,0.75)' }}
        >
          {label.title}
        </span>
        <span
          className="font-mono text-[8px] tracking-wider whitespace-nowrap"
          style={{ color: 'rgba(74,144,217,0.6)' }}
        >
          {label.sub}
        </span>
      </div>
    </motion.div>
  )
}
