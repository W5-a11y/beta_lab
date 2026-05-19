import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useAnimationFrame } from 'framer-motion'

// ── Constants ────────────────────────────────────────────────────────────────

const CX = 420
const CY = 400

// ry ≈ rx × cos(70°) ≈ rx × 0.342  →  deep orbital tilt
const RINGS = [
  { rx: 308, ry: 105, opacity: 0.55 },
  { rx: 232, ry: 79,  opacity: 0.38 },
  { rx: 158, ry: 54,  opacity: 0.25 },
  { rx: 88,  ry: 30,  opacity: 0.15 },
]
const ORX = RINGS[0].rx
const ORY = RINGS[0].ry

const NODES = [
  { id: '01', label: 'Data',        sub: 'Industry trajectories (Eastworld)' },
  { id: '02', label: 'Annotation',  sub: 'VLM-powered auto-labeling (−80% cost)' },
  { id: '03', label: 'World Model', sub: 'N-step latent dynamics prediction' },
  { id: '04', label: 'Policy',      sub: 'VLA end-to-end control' },
  { id: '05', label: 'Deployment',  sub: 'Unitree G1 humanoid benchmark' },
  { id: '06', label: 'Feedback',    sub: 'Evaluation flywheel' },
]

const ORBIT_MS   = 30_000   // 30 s per full rotation
const CYCLE_MS   = 8_000    // 8 s per pulse cycle
const ORBIT_FRAC = 0.72     // fraction of cycle spent on orbit; rest = dash

// ── Component ────────────────────────────────────────────────────────────────

export default function BetaLoop() {
  const wrapRef = useRef<HTMLDivElement>(null)

  // Mouse parallax
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sX = useSpring(mx, { stiffness: 55, damping: 18 })
  const sY = useSpring(my, { stiffness: 55, damping: 18 })

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      mx.set(((e.clientX - r.left) / r.width  - 0.5) *  10)
      my.set(-((e.clientY - r.top)  / r.height - 0.5) * 10)
    }
    const onLeave = () => { mx.set(0); my.set(0) }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  // Animation time
  const [tick, setTick] = useState(0)
  useAnimationFrame((t) => setTick(t))

  const orbitAngle = (tick / ORBIT_MS) * Math.PI * 2
  const cyclePhase = (tick % CYCLE_MS) / CYCLE_MS   // 0 → 1

  // ── Node positions ─────────────────────────────────────────────────────────
  const nodes = NODES.map((n, i) => {
    const base = (i / NODES.length) * Math.PI * 2 - Math.PI / 2
    const a    = base + orbitAngle
    return { ...n, x: CX + ORX * Math.cos(a), y: CY + ORY * Math.sin(a), a }
  })

  // ── Pulse maths ────────────────────────────────────────────────────────────
  let pulseX = 0, pulseY = 0
  let dashFrac = 0, showDash = false
  let dashSx = 0, dashSy = 0, dashEx = 0, dashEy = 0

  if (cyclePhase < ORBIT_FRAC) {
    // pulse travels around the orbit
    const a = orbitAngle - Math.PI / 2 + (cyclePhase / ORBIT_FRAC) * Math.PI * 2
    pulseX = CX + ORX * Math.cos(a)
    pulseY = CY + ORY * Math.sin(a)
  } else {
    // pulse dashes back through the void center
    const t  = (cyclePhase - ORBIT_FRAC) / (1 - ORBIT_FRAC)
    dashFrac = t
    showDash = true
    const endA   = orbitAngle - Math.PI / 2 + Math.PI * 2
    const startA = orbitAngle - Math.PI / 2
    dashSx = CX + ORX * Math.cos(endA);   dashSy = CY + ORY * Math.sin(endA)
    dashEx = CX + ORX * Math.cos(startA); dashEy = CY + ORY * Math.sin(startA)
    pulseX = dashSx + (dashEx - dashSx) * t
    pulseY = dashSy + (dashEy - dashSy) * t
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <section
      ref={wrapRef}
      className="relative w-full bg-black flex flex-col items-center justify-center overflow-hidden"
      style={{ minHeight: '100vh' }}
    >
      {/* Ambient glow – depth cue */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 55%, rgba(30,58,138,0.18) 0%, transparent 70%)',
        }}
      />

      {/* ── Header ── */}
      <div className="absolute top-16 left-0 right-0 flex flex-col items-center z-20 pointer-events-none">
        <p
          className="font-mono text-[10px] tracking-[0.3em] uppercase"
          style={{ color: 'rgba(59,130,246,0.6)' }}
        >
          [ 01 / THE_BETA_LOOP ]
        </p>
        <h2 className="mt-4 text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
          The BETA Loop
        </h2>
        <p
          className="mt-3 text-sm max-w-md text-center"
          style={{ color: 'rgba(255,255,255,0.38)' }}
        >
          A closed-loop flywheel — from real-world data collection
          to deployed policy and back.
        </p>
      </div>

      {/* ── Orbit system ── */}
      <div style={{ perspective: '1100px' }}>
        <motion.div style={{ rotateX: sY, rotateY: sX }}>
          <svg
            viewBox="0 0 840 800"
            style={{ width: 'min(860px, 94vw)', height: 'auto', overflow: 'visible' }}
          >
            <defs>
              {/* Subtle ring gradient – brighter at viewer-facing bottom arc */}
              <linearGradient id="ring-grad" x1="0" y1="1" x2="0" y2="0" gradientUnits="objectBoundingBox">
                <stop offset="0%"   stopColor="#3B82F6" stopOpacity="1" />
                <stop offset="45%"  stopColor="#3B82F6" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.08" />
              </linearGradient>

              <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="2.2" result="b"/>
                <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="pulse-glow" x="-150%" y="-150%" width="400%" height="400%">
                <feGaussianBlur stdDeviation="6" result="b"/>
                <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="node-glow" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="3" result="b"/>
                <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>

            {/* ── Rings ── */}
            {RINGS.map((r, i) => (
              <ellipse
                key={i}
                cx={CX} cy={CY}
                rx={r.rx} ry={r.ry}
                fill="none"
                stroke="url(#ring-grad)"
                strokeWidth="0.5"
                strokeOpacity={r.opacity}
                style={{ filter: 'drop-shadow(0 0 4px rgba(59,130,246,0.35))' }}
              />
            ))}

            {/* ── Center void crosshair ── */}
            <line x1={CX - 14} y1={CY} x2={CX + 14} y2={CY}
              stroke="rgba(59,130,246,0.18)" strokeWidth="0.5" />
            <line x1={CX} y1={CY - 7} x2={CX} y2={CY + 7}
              stroke="rgba(59,130,246,0.18)" strokeWidth="0.5" />

            {/* ── Return dash through void ── */}
            {showDash && (
              <line
                x1={dashSx} y1={dashSy}
                x2={dashSx + (dashEx - dashSx) * dashFrac}
                y2={dashSy + (dashEy - dashSy) * dashFrac}
                stroke="rgba(59,130,246,0.45)"
                strokeWidth="0.8"
                strokeDasharray="5 4"
                style={{ filter: 'drop-shadow(0 0 3px rgba(59,130,246,0.6))' }}
              />
            )}

            {/* ── Data pulse ── */}
            <circle
              cx={pulseX} cy={pulseY} r={4}
              fill="#93C5FD"
              filter="url(#pulse-glow)"
            />
            {/* inner bright core */}
            <circle
              cx={pulseX} cy={pulseY} r={2}
              fill="#DBEAFE"
            />

            {/* ── Orbital nodes ── */}
            {nodes.map((node) => {
              const right = Math.cos(node.a) >= 0
              const lx    = node.x + (right ? 14 : -14)
              return (
                <g key={node.id}>
                  {/* outer glow ring */}
                  <circle
                    cx={node.x} cy={node.y} r={6}
                    fill="none"
                    stroke="rgba(59,130,246,0.35)"
                    strokeWidth="1"
                    filter="url(#node-glow)"
                  />
                  {/* hollow dot */}
                  <circle
                    cx={node.x} cy={node.y} r={3.5}
                    fill="none"
                    stroke="#60A5FA"
                    strokeWidth="1.2"
                  />

                  {/* ID — bright blue */}
                  <text
                    x={lx} y={node.y + 1}
                    textAnchor={right ? 'start' : 'end'}
                    fontFamily="'JetBrains Mono','Fira Mono','Courier New',monospace"
                    fontSize="10"
                    fontWeight="700"
                    letterSpacing="0.1em"
                    fill="rgba(96,165,250,1)"
                  >
                    {node.id}
                  </text>
                  {/* Label name — white */}
                  <text
                    x={lx + (right ? 22 : -22)}
                    y={node.y + 1}
                    textAnchor={right ? 'start' : 'end'}
                    fontFamily="'JetBrains Mono','Fira Mono','Courier New',monospace"
                    fontSize="11"
                    fontWeight="600"
                    letterSpacing="0.04em"
                    fill="rgba(255,255,255,0.92)"
                  >
                    {node.label}
                  </text>
                  {/* Sub — muted blue-grey */}
                  <text
                    x={lx} y={node.y + 15}
                    textAnchor={right ? 'start' : 'end'}
                    fontFamily="'JetBrains Mono','Fira Mono','Courier New',monospace"
                    fontSize="8"
                    letterSpacing="0.03em"
                    fill="rgba(148,163,184,0.55)"
                  >
                    {node.sub}
                  </text>
                </g>
              )
            })}
          </svg>
        </motion.div>
      </div>
    </section>
  )
}
