import { useEffect, useRef, useState } from 'react'
import {
  motion, AnimatePresence,
  useMotionValue, useSpring, useAnimationFrame,
} from 'framer-motion'

// ── Constants ────────────────────────────────────────────────────────────────

const CX = 420
const CY = 400

const RINGS = [
  { rx: 308, ry: 105, opacity: 0.55 },
  { rx: 232, ry: 79,  opacity: 0.38 },
  { rx: 158, ry: 54,  opacity: 0.25 },
  { rx: 88,  ry: 30,  opacity: 0.15 },
]
const ORX = RINGS[0].rx
const ORY = RINGS[0].ry

const NODES = [
  {
    id: '01', label: 'Data',
    sub:    'Industry trajectories (Eastworld)',
    detail: 'Industry-grade datasets (Eastworld). 300h → 1,000h+ scaling trajectories.',
  },
  {
    id: '02', label: 'Annotation',
    sub:    'VLM-powered auto-labeling (−80% cost)',
    detail: 'VLM-automated labeling. Goal arrows & captions. 80% cost reduction.',
  },
  {
    id: '03', label: 'World Model',
    sub:    'N-step latent dynamics prediction',
    detail: 'Action-conditioned latent dynamics. N-step risk-filtering rollout.',
  },
  {
    id: '04', label: 'Policy',
    sub:    'VLA end-to-end control',
    detail: 'Goal-conditioned VLA models. End-to-end dexterous manipulation control.',
  },
  {
    id: '05', label: 'Deployment',
    sub:    'Unitree G1 humanoid benchmark',
    detail: 'Unitree G1 Humanoid Benchmark. Real-world 43 DoF physical validation.',
  },
  {
    id: '06', label: 'Feedback',
    sub:    'Evaluation flywheel',
    detail: 'Closed-loop optimization. Success rates directly updating model weights.',
  },
]

const ORBIT_MS   = 30_000
const CYCLE_MS   = 8_000
const ORBIT_FRAC = 0.72
const PANEL_W    = 228

// ── Component ────────────────────────────────────────────────────────────────

export default function BetaLoop() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const svgRef  = useRef<SVGSVGElement>(null)

  // Mouse parallax
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sX = useSpring(mx, { stiffness: 55, damping: 18 })
  const sY = useSpring(my, { stiffness: 55, damping: 18 })

  // Orbit animation via refs so hover can modulate speed without re-render
  const orbitRef    = useRef(0)
  const cycleRef    = useRef(0)
  const hoverRef    = useRef(false)
  const [, forceRender] = useState(0)

  useAnimationFrame((_, delta) => {
    const speed = hoverRef.current ? 0 : 1
    orbitRef.current += (delta / ORBIT_MS) * Math.PI * 2 * speed
    cycleRef.current  = (cycleRef.current + (delta / CYCLE_MS) * speed) % 1
    forceRender(n => n + 1)
  })

  // Mouse move / leave
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      mx.set(((e.clientX - r.left) / r.width  - 0.5) * 10)
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

  // Hover state
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [panel, setPanel] = useState<{
    idx: number; left: number; top: number; side: 'left' | 'right'
  } | null>(null)

  const handleEnter = (i: number, nx: number, ny: number) => {
    hoverRef.current = true
    setHoveredIdx(i)

    const svgEl  = svgRef.current
    const wrapEl = wrapRef.current
    if (!svgEl || !wrapEl) return

    const svgRect  = svgEl.getBoundingClientRect()
    const wrapRect = wrapEl.getBoundingClientRect()
    const scaleX   = svgRect.width  / 840
    const scaleY   = svgRect.height / 800
    const px = svgRect.left - wrapRect.left + nx * scaleX
    const py = svgRect.top  - wrapRect.top  + ny * scaleY
    const side = nx >= CX ? 'right' : 'left'

    setPanel({
      idx:  i,
      left: side === 'right' ? px + 22 : px - 22 - PANEL_W,
      top:  py - 24,
      side,
    })
  }

  const handleLeave = () => {
    hoverRef.current = false
    setHoveredIdx(null)
    setPanel(null)
  }

  // ── Derived values ─────────────────────────────────────────────────────────
  const orbit = orbitRef.current
  const cycle = cycleRef.current

  const nodes = NODES.map((n, i) => {
    const a = (i / NODES.length) * Math.PI * 2 - Math.PI / 2 + orbit
    return { ...n, x: CX + ORX * Math.cos(a), y: CY + ORY * Math.sin(a), a }
  })

  let pulseX = 0, pulseY = 0
  let showDash = false, dashFrac = 0
  let dashSx = 0, dashSy = 0, dashEx = 0, dashEy = 0

  if (cycle < ORBIT_FRAC) {
    const a = orbit - Math.PI / 2 + (cycle / ORBIT_FRAC) * Math.PI * 2
    pulseX = CX + ORX * Math.cos(a)
    pulseY = CY + ORY * Math.sin(a)
  } else {
    const t   = (cycle - ORBIT_FRAC) / (1 - ORBIT_FRAC)
    dashFrac  = t
    showDash  = true
    const eA  = orbit - Math.PI / 2 + Math.PI * 2
    const sA  = orbit - Math.PI / 2
    dashSx = CX + ORX * Math.cos(eA); dashSy = CY + ORY * Math.sin(eA)
    dashEx = CX + ORX * Math.cos(sA); dashEy = CY + ORY * Math.sin(sA)
    pulseX = dashSx + (dashEx - dashSx) * t
    pulseY = dashSy + (dashEy - dashSy) * t
  }

  const dimRings = hoveredIdx !== null

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <section
      id="loop"
      ref={wrapRef}
      className="relative w-full bg-black flex flex-col items-center justify-center overflow-hidden"
      style={{ minHeight: '100vh' }}
    >
      {/* Laser flow keyframe */}
      <style>{`
        @keyframes laser-flow {
          from { stroke-dashoffset: 16; }
          to   { stroke-dashoffset: 0; }
        }
        .laser-flow { animation: laser-flow 0.45s linear infinite; }
      `}</style>

      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0" style={{
        background: 'radial-gradient(ellipse 60% 40% at 50% 55%, rgba(30,58,138,0.18) 0%, transparent 70%)',
      }}/>

      {/* Header */}
      <div className="absolute top-16 left-0 right-0 flex flex-col items-center z-20 pointer-events-none">
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase"
          style={{ color: 'rgba(59,130,246,0.6)' }}>
          [ 01 / THE_BETA_LOOP ]
        </p>
        <h2 className="mt-4 text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
          The BETA Loop
        </h2>
        <p className="mt-3 text-sm max-w-md text-center" style={{ color: 'rgba(255,255,255,0.38)' }}>
          A closed-loop flywheel — from real-world data collection to deployed policy and back.
        </p>
      </div>

      {/* ── SVG orbit ── */}
      <div style={{ perspective: '1100px' }}>
        <motion.div style={{ rotateX: sY, rotateY: sX }}>
          <svg
            ref={svgRef}
            viewBox="0 0 840 800"
            style={{ width: 'min(860px, 94vw)', height: 'auto', overflow: 'visible' }}
          >
            <defs>
              <linearGradient id="ring-grad" x1="0" y1="1" x2="0" y2="0" gradientUnits="objectBoundingBox">
                <stop offset="0%"   stopColor="#3B82F6" stopOpacity="1"    />
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
              <filter id="laser-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3.5" result="b"/>
                <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>

            {/* Rings */}
            <g style={{ opacity: dimRings ? 0.08 : 1, transition: 'opacity 0.25s' }}>
              {RINGS.map((r, i) => (
                <ellipse key={i} cx={CX} cy={CY} rx={r.rx} ry={r.ry}
                  fill="none" stroke="url(#ring-grad)"
                  strokeWidth="0.5" strokeOpacity={r.opacity}
                  style={{ filter: 'drop-shadow(0 0 4px rgba(59,130,246,0.35))' }}
                />
              ))}
            </g>

            {/* Center crosshair */}
            <g style={{ opacity: dimRings ? 0.2 : 1, transition: 'opacity 0.25s' }}>
              <line x1={CX-14} y1={CY} x2={CX+14} y2={CY}
                stroke="rgba(59,130,246,0.18)" strokeWidth="0.5"/>
              <line x1={CX} y1={CY-7} x2={CX} y2={CY+7}
                stroke="rgba(59,130,246,0.18)" strokeWidth="0.5"/>
            </g>

            {/* Return dash */}
            {showDash && (
              <line
                x1={dashSx} y1={dashSy}
                x2={dashSx + (dashEx - dashSx) * dashFrac}
                y2={dashSy + (dashEy - dashSy) * dashFrac}
                stroke="rgba(59,130,246,0.45)" strokeWidth="0.8" strokeDasharray="5 4"
                style={{
                  filter: 'drop-shadow(0 0 3px rgba(59,130,246,0.6))',
                  opacity: dimRings ? 0.08 : 1,
                  transition: 'opacity 0.25s',
                }}
              />
            )}

            {/* Data pulse */}
            <g style={{ opacity: dimRings ? 0.08 : 1, transition: 'opacity 0.25s' }}>
              <circle cx={pulseX} cy={pulseY} r={4} fill="#93C5FD" filter="url(#pulse-glow)"/>
              <circle cx={pulseX} cy={pulseY} r={2} fill="#DBEAFE"/>
            </g>

            {/* Laser line to center */}
            {hoveredIdx !== null && (
              <line
                x1={nodes[hoveredIdx].x} y1={nodes[hoveredIdx].y}
                x2={CX} y2={CY}
                stroke="rgba(96,165,250,0.65)"
                strokeWidth="0.9"
                strokeDasharray="5 3"
                className="laser-flow"
                filter="url(#laser-glow)"
              />
            )}

            {/* Nodes */}
            {nodes.map((node, i) => {
              const right     = Math.cos(node.a) >= 0
              const lx        = node.x + (right ? 14 : -14)
              const isHovered = hoveredIdx === i
              const isDimmed  = hoveredIdx !== null && !isHovered

              return (
                <g key={node.id}
                  style={{ opacity: isDimmed ? 0.08 : 1, transition: 'opacity 0.25s' }}>

                  {/* Hit area — large invisible circle */}
                  <circle
                    cx={node.x} cy={node.y} r={52}
                    fill="transparent"
                    style={{ cursor: 'crosshair' }}
                    onMouseEnter={() => handleEnter(i, node.x, node.y)}
                    onMouseLeave={handleLeave}
                  />

                  {/* High-freq pulse ring on hover */}
                  {isHovered && (
                    <motion.circle
                      cx={node.x} cy={node.y}
                      fill="none" stroke="#60A5FA" strokeWidth="1.2"
                      animate={{ r: [4, 20, 4], opacity: [0.9, 0, 0.9] }}
                      transition={{ duration: 0.7, repeat: Infinity, ease: 'easeOut' }}
                    />
                  )}

                  {/* Outer glow ring */}
                  <circle cx={node.x} cy={node.y} r={6}
                    fill="none"
                    stroke={isHovered ? 'rgba(147,197,253,0.55)' : 'rgba(59,130,246,0.35)'}
                    strokeWidth="1"
                    filter="url(#node-glow)"
                  />
                  {/* Hollow dot */}
                  <circle cx={node.x} cy={node.y} r={3.5}
                    fill="none"
                    stroke={isHovered ? '#BAE6FD' : '#60A5FA'}
                    strokeWidth="1.2"
                  />

                  {/* ID */}
                  <text x={lx} y={node.y + 1}
                    textAnchor={right ? 'start' : 'end'}
                    fontFamily="'JetBrains Mono','Fira Mono','Courier New',monospace"
                    fontSize="10" fontWeight="700" letterSpacing="0.1em"
                    fill={isHovered ? 'rgba(147,197,253,1)' : 'rgba(96,165,250,1)'}>
                    {node.id}
                  </text>
                  {/* Label name */}
                  <text x={lx + (right ? 22 : -22)} y={node.y + 1}
                    textAnchor={right ? 'start' : 'end'}
                    fontFamily="'JetBrains Mono','Fira Mono','Courier New',monospace"
                    fontSize="11" fontWeight="600" letterSpacing="0.04em"
                    fill={isHovered ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.92)'}>
                    {node.label}
                  </text>
                  {/* Sub */}
                  <text x={lx} y={node.y + 15}
                    textAnchor={right ? 'start' : 'end'}
                    fontFamily="'JetBrains Mono','Fira Mono','Courier New',monospace"
                    fontSize="8" letterSpacing="0.03em"
                    fill="rgba(148,163,184,0.55)">
                    {node.sub}
                  </text>
                </g>
              )
            })}
          </svg>
        </motion.div>
      </div>

      {/* ── Detail panel ── */}
      <AnimatePresence>
        {panel && (
          <motion.div
            key={`panel-${panel.idx}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6, transition: { duration: 0.15 } }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position:      'absolute',
              left:          `${panel.left}px`,
              top:           `${panel.top}px`,
              width:         `${PANEL_W}px`,
              zIndex:        30,
              pointerEvents: 'none',
            }}
          >
            {/* Corner brackets — engineering drawing feel */}
            {(['tl','tr','bl','br'] as const).map((c) => (
              <div key={c} style={{
                position: 'absolute',
                width: 8, height: 8,
                top:    c.startsWith('t') ? 0 : 'auto',
                bottom: c.startsWith('b') ? 0 : 'auto',
                left:   c.endsWith('l')   ? 0 : 'auto',
                right:  c.endsWith('r')   ? 0 : 'auto',
                borderTop:    c.startsWith('t') ? '1px solid rgba(59,130,246,0.75)' : 'none',
                borderBottom: c.startsWith('b') ? '1px solid rgba(59,130,246,0.75)' : 'none',
                borderLeft:   c.endsWith('l')   ? '1px solid rgba(59,130,246,0.75)' : 'none',
                borderRight:  c.endsWith('r')   ? '1px solid rgba(59,130,246,0.75)' : 'none',
              }}/>
            ))}

            {/* Glass panel */}
            <div style={{
              margin:         '2px',
              padding:        '12px 14px',
              background:     'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              borderLeft:     '2px solid rgba(59,130,246,0.75)',
              borderTop:      '1px solid rgba(59,130,246,0.1)',
              borderBottom:   '1px solid rgba(59,130,246,0.1)',
            }}>
              {/* ID + label */}
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.16, delay: 0.04 }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}
              >
                <span style={{
                  fontFamily:    'monospace',
                  fontSize:      10,
                  fontWeight:    700,
                  letterSpacing: '0.12em',
                  color:         'rgba(147,197,253,1)',
                }}>
                  {NODES[panel.idx].id}
                </span>
                <span style={{
                  fontFamily:    'monospace',
                  fontSize:      11,
                  fontWeight:    600,
                  letterSpacing: '0.04em',
                  color:         'rgba(255,255,255,0.95)',
                }}>
                  {NODES[panel.idx].label}
                </span>
              </motion.div>

              {/* Detail text */}
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18, delay: 0.1 }}
                style={{
                  fontFamily:  'monospace',
                  fontSize:    9,
                  lineHeight:  1.7,
                  color:       'rgba(148,163,184,0.82)',
                  margin:      0,
                  letterSpacing: '0.02em',
                }}
              >
                {NODES[panel.idx].detail}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
