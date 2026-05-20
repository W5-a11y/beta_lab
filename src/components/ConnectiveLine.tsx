import { useScroll, useTransform, motion } from 'framer-motion'

const NODES = [0.02, 0.27, 0.54, 0.80]

// Each node needs its own component so hooks are called at top level
function NodeDot({ fraction, scrollYProgress }: { fraction: number; scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'] }) {
  const lo = Math.max(0, fraction - 0.04)
  const opacity = useTransform(
    scrollYProgress,
    [lo, fraction, fraction + 0.08],
    [0, 1, 0.55],
  )
  const scale = useTransform(
    scrollYProgress,
    [lo, fraction],
    [0.4, 1],
  )
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: 6,
        top: `${fraction * 100}%`,
        width: 12,
        height: 12,
        borderRadius: '50%',
        border: '1px solid rgba(59,130,246,0.7)',
        background: 'rgba(59,130,246,0.15)',
        boxShadow: '0 0 8px rgba(59,130,246,0.4)',
        opacity,
        scale,
      }}
    />
  )
}

export default function ConnectiveLine() {
  const { scrollYProgress } = useScroll()
  const pathLength = useTransform(scrollYProgress, [0, 0.95], [0, 1])

  return (
    <div
      style={{
        position: 'fixed',
        left: 28,
        top: 0,
        width: 24,
        height: '100vh',
        zIndex: 5,
        pointerEvents: 'none',
      }}
    >
      <svg
        width="24"
        height="100%"
        viewBox="0 0 24 100"
        preserveAspectRatio="none"
        overflow="visible"
      >
        <line
          x1="12" y1="0" x2="12" y2="100"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="0.6"
        />
        <motion.line
          x1="12" y1="0" x2="12" y2="100"
          stroke="rgba(59,130,246,0.45)"
          strokeWidth="0.8"
          strokeLinecap="round"
          style={{ pathLength }}
        />
      </svg>

      {NODES.map((fraction, i) => (
        <NodeDot key={i} fraction={fraction} scrollYProgress={scrollYProgress} />
      ))}
    </div>
  )
}
