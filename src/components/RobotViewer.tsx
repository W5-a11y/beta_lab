import { useRef, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

// ─── Swap this path to change the robot image ─────────────────────────────────
const ROBOT_IMAGE = '/davinci-robot.png'

// ─── Floating metadata labels ─────────────────────────────────────────────────
// top/left are % positions within the container
// depthScale controls parallax intensity vs. the image (>1 = floats in front)
const LABELS = [
  {
    id: 'vla',
    text: 'VLA Policy',
    top: '8%',
    left: '60%',
    depthScale: 2.2,
  },
  {
    id: 'world',
    text: 'World Model Training',
    top: '42%',
    left: '66%',
    depthScale: 1.8,
  },
  {
    id: 'eval',
    text: 'Real-World Evaluation',
    top: '35%',
    left: '-2%',
    depthScale: 2.0,
  },
  {
    id: 'g1',
    text: 'Unitree G1 Humanoid',
    top: '84%',
    left: '55%',
    depthScale: 1.6,
  },
] as const

// Spring config — tuned for that "warm, premium" feel
const SPRING = { stiffness: 90, damping: 22, mass: 0.8 }

export default function RobotViewer() {
  const containerRef = useRef<HTMLDivElement>(null)

  const rawX = useMotionValue(0) // –1 → +1 normalized
  const rawY = useMotionValue(0)

  const springX = useSpring(rawX, SPRING)
  const springY = useSpring(rawY, SPRING)

  // Image rotation — ±4 deg
  const rotateY = useTransform(springX, [-1, 1], [-4, 4])
  const rotateX = useTransform(springY, [-1, 1], [4, -4])

  // Drop-shadow shifts subtly with tilt
  const shadowX = useTransform(springX, [-1, 1], [-12, 12])
  const shadowY = useTransform(springY, [-1, 1], [-8, 8])

  const dropShadow = useTransform(
    [shadowX, shadowY],
    ([sx, sy]: number[]) =>
      `drop-shadow(${sx}px ${sy}px 40px rgba(0, 80, 200, 0.45)) drop-shadow(${sx * 0.4}px ${sy * 0.4}px 80px rgba(0, 50, 98, 0.25))`
  )

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    rawX.set(((e.clientX - rect.left) / rect.width - 0.5) * 2)
    rawY.set(((e.clientY - rect.top) / rect.height - 0.5) * 2)
  }

  const handleMouseLeave = () => {
    rawX.set(0)
    rawY.set(0)
  }

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center"
      style={{ perspective: '1000px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Image layer ─────────────────────────────────────────────────────── */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          filter: dropShadow,
        }}
        className="relative w-full max-w-[480px]"
      >
        <img
          src={ROBOT_IMAGE}
          alt="Vitruvian Robot — BETA Robotics Lab"
          className="w-full h-auto block"
          style={{ userSelect: 'none', pointerEvents: 'none' }}
          draggable={false}
        />
      </motion.div>

      {/* ── Label layer — parallax depth scale > 1 so they float in front ──── */}
      {LABELS.map((label) => {
        // Each label gets its own translateX/Y derived from the same springs,
        // multiplied by depthScale for the floating-in-front illusion.
        // We compute these inside a wrapper component to keep hooks at top level.
        return (
          <FloatingLabel
            key={label.id}
            label={label}
            springX={springX}
            springY={springY}
          />
        )
      })}
    </div>
  )
}

// ─── Sub-component so each label can call useTransform individually ────────────
function FloatingLabel({
  label,
  springX,
  springY,
}: {
  label: (typeof LABELS)[number]
  springX: ReturnType<typeof useSpring>
  springY: ReturnType<typeof useSpring>
}) {
  const RANGE = 18 // max px shift at full tilt
  const scale = label.depthScale

  const tx = useTransform(springX, [-1, 1], [-RANGE * scale, RANGE * scale])
  const ty = useTransform(springY, [-1, 1], [RANGE * scale, -RANGE * scale])

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        top: label.top,
        left: label.left,
        x: tx,
        y: ty,
      }}
    >
      <span
        className="font-mono text-[11px] font-medium tracking-widest uppercase whitespace-nowrap"
        style={{ color: 'rgba(255,255,255,0.72)' }}
      >
        {label.text}
      </span>
    </motion.div>
  )
}
