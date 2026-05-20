import { useCallback, useEffect, useRef, useState } from 'react'
import {
  motion, AnimatePresence,
  useMotionValue, useSpring, useAnimationFrame, useInView,
} from 'framer-motion'
import SectionArrow from './SectionArrow'

// ── Constants ─────────────────────────────────────────────────────────────────

const CX = 420
const CY = 400

const RINGS = [
  { rx: 308, ry: 105, opacity: 0.88, sw: 1.0 },
  { rx: 232, ry: 79,  opacity: 0.32, sw: 0.7 },
  { rx: 158, ry: 54,  opacity: 0.18, sw: 0.6 },
  { rx: 88,  ry: 30,  opacity: 0.11, sw: 0.5 },
]
const ORX = RINGS[0].rx
const ORY = RINGS[0].ry

// Cluster IDs
type Cluster = 'autolabel' | 'worldmodel' | 'benchmark'

const NODES = [
  { id: '01', label: 'Data',        sub: 'Industry trajectories', cluster: 'autolabel'  as Cluster,
    detail: 'Industry-grade datasets (Eastworld). 300h → 1,000h+ scaling trajectories.',
    metric: '1,000h+', metricLabel: 'Trajectory Hours' },
  { id: '02', label: 'Annotation',  sub: 'VLM auto-labeling',     cluster: 'autolabel'  as Cluster,
    detail: 'VLM-automated labeling. Goal arrows & captions. 80% cost reduction.',
    metric: '−80%',    metricLabel: 'Cost Reduction' },
  { id: '03', label: 'World Model', sub: 'N-step latent dynamics', cluster: 'worldmodel' as Cluster,
    detail: 'Action-conditioned latent dynamics. N-step risk-filtering rollout.',
    metric: 'N-step',  metricLabel: 'Latent Rollout' },
  { id: '04', label: 'Policy',      sub: 'VLA end-to-end control', cluster: 'worldmodel' as Cluster,
    detail: 'Goal-conditioned VLA models. End-to-end dexterous manipulation control.',
    metric: 'VLA',     metricLabel: 'End-to-End' },
  { id: '05', label: 'Deployment',  sub: 'Unitree G1 humanoid',   cluster: 'benchmark'  as Cluster,
    detail: 'Unitree G1 Humanoid Benchmark. Real-world 43 DoF physical validation.',
    metric: '43 DoF',  metricLabel: 'Physical DoF' },
  { id: '06', label: 'Feedback',    sub: 'Evaluation flywheel',   cluster: 'benchmark'  as Cluster,
    detail: 'Closed-loop optimization. Success rates directly updating model weights.',
    metric: '∞',       metricLabel: 'Flywheel Loop' },
]

// Fixed SVG exit points for connector lines (right side of ellipse)
// These are stable viewBox-space coords — no need to track rotating nodes
const CLUSTER_EXIT: Record<Cluster, { x: number; y: number }> = {
  autolabel:  { x: CX + ORX * 0.78, y: CY - ORY * 0.82 }, // upper right
  worldmodel: { x: CX + ORX * 0.99, y: CY               }, // rightmost
  benchmark:  { x: CX + ORX * 0.78, y: CY + ORY * 0.82 }, // lower right
}

// Accent color per cluster (active state)
const CLUSTER_COLOR: Record<Cluster, string> = {
  autolabel:  '#1E40AF',
  worldmodel: '#1E3A8A',
  benchmark:  '#1D4ED8',
}

const PILLARS = [
  {
    cluster:     'autolabel'  as Cluster,
    index:       '01',
    title:       'Auto-Labeling Pipeline',
    subtitle:    'Robot Manipulation Data',
    description: 'VLM-powered annotation of robot data — reducing manual labeling costs by 80%.',
    bullets:     ['Goal arrow + action verb', 'Trajectory captions', 'Grasp point detection'],
    stat:        '80%',    statLabel: 'Cost Reduction',
  },
  {
    cluster:     'worldmodel' as Cluster,
    index:       '02',
    title:       'Action-Conditioned World Models',
    subtitle:    'Latent Dynamics & Evaluation',
    description: 'Predict future states from trajectory captions — a pre-deployment evaluation proxy.',
    bullets:     ['N-step future rollout', 'Risk filtering before execution', 'Language-conditioned dynamics'],
    stat:        'N-step', statLabel: 'Future Rollout',
  },
  {
    cluster:     'benchmark'  as Cluster,
    index:       '03',
    title:       'Real-World Benchmarking',
    subtitle:    'Unitree G1 Deployment',
    description: 'End-to-end validation on Unitree G1 — linking annotation quality to real success rate.',
    bullets:     ['23–43 DoF humanoid platform', 'Dual-track: sim + physical', 'Full-chain success measurement'],
    stat:        'G1',     statLabel: 'Unitree Platform',
  },
]

const ORBIT_MS  = 34_000
const PULSE_MS  = 6_400
const PANEL_W   = 224

const TICK_ANGLES = [0, Math.PI / 2, Math.PI, Math.PI * 1.5]
const TRAIL_OFFSETS = [0.055, 0.115, 0.195]

const BG_MARKS = [
  { x: 68, y: 108 }, { x: 728, y: 82 }, { x: 42, y: 582 },
  { x: 770, y: 642 }, { x: 188, y: 724 }, { x: 660, y: 740 },
  { x: 138, y: 278 }, { x: 696, y: 168 }, { x: 374, y: 55 },
]

function normalizeAngle(a: number) {
  return ((a % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
}
function angularDistance(a: number, b: number) {
  const d = Math.abs(normalizeAngle(a) - normalizeAngle(b))
  return Math.min(d, Math.PI * 2 - d)
}

// ── Connector path component ──────────────────────────────────────────────────

interface ConnectorProps {
  id:     string
  x1: number; y1: number
  x2: number; y2: number
  active: boolean
  dimmed: boolean
}

function ConnectorPath({ id, x1, y1, x2, y2, active, dimmed }: ConnectorProps) {
  const cx1 = x1 + (x2 - x1) * 0.55
  const cy1 = y1
  const cx2 = x2 - (x2 - x1) * 0.25
  const cy2 = y2
  const d = `M ${x1},${y1} C ${cx1},${cy1} ${cx2},${cy2} ${x2},${y2}`

  return (
    <g style={{ opacity: dimmed ? 0.08 : 1, transition: 'opacity 0.35s ease' }}>
      {/* Base path — always visible, faint */}
      <path d={d} fill="none"
        stroke="rgba(26,26,26,0.14)" strokeWidth="1"
        strokeDasharray="5 6"
      />
      {/* Active overlay — animated flow */}
      {active && (
        <>
          <path d={d} fill="none"
            stroke="#1E3A8A" strokeWidth="1.2"
            strokeDasharray="5 5"
            strokeOpacity="0.7"
            style={{ animation: `connector-flow-${id} 1.2s linear infinite` }}
          />
          {/* Endpoint dot at pillar entry */}
          <circle cx={x2} cy={y2} r={3.5}
            fill="none" stroke="#1E3A8A" strokeWidth="0.8" strokeOpacity="0.5"/>
          <circle cx={x2} cy={y2} r={1.5}
            fill="#1E3A8A" fillOpacity="0.65"/>
          {/* Endpoint dot at loop exit */}
          <circle cx={x1} cy={y1} r={3}
            fill="#1E3A8A" fillOpacity="0.35"/>
        </>
      )}
      <style>{`
        @keyframes connector-flow-${id} {
          from { stroke-dashoffset: 20; }
          to   { stroke-dashoffset: 0; }
        }
      `}</style>
    </g>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function BetaLoop() {
  const wrapRef     = useRef<HTMLDivElement>(null)
  const svgRef      = useRef<SVGSVGElement>(null)
  const containerRef= useRef<HTMLDivElement>(null)
  const inViewRef   = useRef<HTMLDivElement>(null)
  const pillarRefs  = useRef<(HTMLDivElement | null)[]>([])
  const isInView    = useInView(inViewRef, { once: true, margin: '-10%' })

  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Shared active cluster — drives both loop highlights and pillar highlights
  const [activeCluster, setActiveCluster] = useState<Cluster | null>(null)

  // Mouse parallax
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sX = useSpring(mx, { stiffness: 32, damping: 22 })
  const sY = useSpring(my, { stiffness: 32, damping: 22 })

  // Animation refs
  const orbitRef      = useRef(0)
  const pulseAngleRef = useRef(0)
  const hoverRef      = useRef(false)
  const [, forceRender] = useState(0)

  useAnimationFrame((_, delta) => {
    const speed = hoverRef.current ? 0 : 1
    orbitRef.current      = orbitRef.current + (delta / ORBIT_MS) * Math.PI * 2 * speed
    pulseAngleRef.current = normalizeAngle(
      pulseAngleRef.current + (delta / PULSE_MS) * Math.PI * 2
    )
    forceRender(n => n + 1)
  })

  useEffect(() => {
    const el = wrapRef.current
    if (!el || isMobile) return
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      mx.set(((e.clientX - r.left) / r.width  - 0.5) * 6)
      my.set(-((e.clientY - r.top)  / r.height - 0.5) * 6)
    }
    const onLeave = () => { mx.set(0); my.set(0) }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [isMobile])

  // Node hover (tooltip)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [panel, setPanel] = useState<{
    idx: number; left: number; top: number
  } | null>(null)

  const handleNodeEnter = (i: number, nx: number, ny: number) => {
    hoverRef.current = true
    setHoveredIdx(i)
    setActiveCluster(NODES[i].cluster)

    const svgEl  = svgRef.current
    const wrapEl = wrapRef.current
    if (!svgEl || !wrapEl) return
    const svgRect  = svgEl.getBoundingClientRect()
    const wrapRect = wrapEl.getBoundingClientRect()
    const scaleX   = svgRect.width  / 840
    const scaleY   = svgRect.height / 800
    const px = svgRect.left - wrapRect.left + nx * scaleX
    const py = svgRect.top  - wrapRect.top  + ny * scaleY
    setPanel({ idx: i, left: px - PANEL_W - 18, top: py - 28 })
  }

  const handleNodeLeave = () => {
    hoverRef.current = false
    setHoveredIdx(null)
    setActiveCluster(null)
    setPanel(null)
  }

  // ── Connector coordinates ─────────────────────────────────────────────────
  const [connectors, setConnectors] = useState<Array<{
    cluster: Cluster; x1: number; y1: number; x2: number; y2: number
  }>>([])

  const recalcConnectors = useCallback(() => {
    const svgEl       = svgRef.current
    const containerEl = containerRef.current
    if (!svgEl || !containerEl) return

    const svgRect  = svgEl.getBoundingClientRect()
    const contRect = containerEl.getBoundingClientRect()

    const scaleX = svgRect.width  / 840
    const scaleY = svgRect.height / 800

    const result = PILLARS.map((p, i) => {
      const exit = CLUSTER_EXIT[p.cluster]
      // Convert SVG viewBox coords to container-relative DOM coords
      const x1 = svgRect.left - contRect.left + exit.x * scaleX
      const y1 = svgRect.top  - contRect.top  + exit.y * scaleY

      const cardEl = pillarRefs.current[i]
      let x2 = contRect.width * 0.56
      let y2 = contRect.height * ((i + 0.5) / 3)
      if (cardEl) {
        const cardRect = cardEl.getBoundingClientRect()
        x2 = cardRect.left - contRect.left
        y2 = cardRect.top  - contRect.top + cardRect.height * 0.5
      }
      return { cluster: p.cluster, x1, y1, x2, y2 }
    })
    setConnectors(result)
  }, [])

  useEffect(() => {
    if (!isInView) return
    // Small delay so layout is stable
    const t = setTimeout(recalcConnectors, 120)
    const obs = new ResizeObserver(recalcConnectors)
    if (containerRef.current) obs.observe(containerRef.current)
    window.addEventListener('resize', recalcConnectors)
    return () => {
      clearTimeout(t)
      obs.disconnect()
      window.removeEventListener('resize', recalcConnectors)
    }
  }, [isInView, recalcConnectors, isMobile])

  // ── Derived animation values ──────────────────────────────────────────────
  const orbit      = orbitRef.current
  const pulseAngle = pulseAngleRef.current

  const nodes = NODES.map((n, i) => {
    const a = (i / NODES.length) * Math.PI * 2 - Math.PI / 2 + orbit
    const x = CX + ORX * Math.cos(a)
    const y = CY + ORY * Math.sin(a)
    const dist = angularDistance(pulseAngle, normalizeAngle(a))
    const THRESH = Math.PI / 5.5
    const pulseIntensity = dist < THRESH ? 1 - dist / THRESH : 0
    const isClusterActive = activeCluster === n.cluster
    return { ...n, x, y, a, pulseIntensity, isClusterActive }
  })

  const pX = CX + ORX * Math.cos(pulseAngle)
  const pY = CY + ORY * Math.sin(pulseAngle)

  const trailPoints = TRAIL_OFFSETS.map(off => {
    const a = normalizeAngle(pulseAngle - off)
    return { x: CX + ORX * Math.cos(a), y: CY + ORY * Math.sin(a) }
  })

  const isHovering = hoveredIdx !== null

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <section
      id="loop"
      ref={wrapRef}
      className="relative w-full overflow-hidden"
      style={{ background: '#F7F7F2', minHeight: '100vh', paddingTop: 80, paddingBottom: 72 }}
    >
      <style>{`@keyframes breathe {
        0%,100%{opacity:.18;transform:scale(1)}
        50%{opacity:.32;transform:scale(1.12)}
      }
      .center-sphere{animation:breathe 4s ease-in-out infinite;transform-origin:center}`}
      </style>

      {/* Dot texture */}
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 w-full h-full" style={{opacity:.03}}>
        <defs>
          <pattern id="bl-dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="#1A1A1A"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bl-dots)"/>
      </svg>

      {/* Paper vignette */}
      <div className="pointer-events-none absolute inset-0" style={{
        background: 'radial-gradient(ellipse 85% 60% at 35% 55%, transparent 30%, rgba(195,190,180,0.12) 100%)',
      }}/>

      {/* ── Section header ── */}
      <motion.div
        className="max-w-7xl mx-auto px-8 mb-10 text-center"
        initial={{ opacity: 0, y: -14 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="font-mono text-[10px] tracking-[0.35em] uppercase mb-3"
          style={{ color: 'rgba(26,26,26,0.32)' }}>
          [ 01 / TECHNOLOGY_ARCHITECTURE ]
        </p>
        <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3"
          style={{ color: '#1A1A1A' }}>
          The BETA Loop
        </h2>
        <p className="text-sm max-w-lg mx-auto"
          style={{ color: 'rgba(26,26,26,0.40)', fontFamily: 'Inter,system-ui,sans-serif' }}>
          Three research pillars driving a closed-loop flywheel — from data to deployed policy and back.
        </p>
      </motion.div>

      {/* ── Two-column layout ── */}
      <div ref={inViewRef} className="max-w-7xl mx-auto px-8">
        <div
          ref={containerRef}
          style={{
            display:   isMobile ? 'block' : 'flex',
            gap:       40,
            alignItems:'flex-start',
            position:  'relative',
          }}
        >
          {/* ── Connector SVG overlay ── */}
          {!isMobile && (
            <svg
              style={{
                position:       'absolute',
                inset:          0,
                width:          '100%',
                height:         '100%',
                pointerEvents:  'none',
                overflow:       'visible',
                zIndex:         4,
              }}
            >
              {connectors.map(c => (
                <ConnectorPath
                  key={c.cluster}
                  id={c.cluster}
                  x1={c.x1} y1={c.y1}
                  x2={c.x2} y2={c.y2}
                  active={activeCluster === c.cluster}
                  dimmed={activeCluster !== null && activeCluster !== c.cluster}
                />
              ))}
            </svg>
          )}

          {/* ── LEFT: Loop SVG ── */}
          <motion.div
            style={{ flex: '0 0 54%', perspective: isMobile ? 'none' : '1100px' }}
            initial={{ opacity: 0, scale: 0.90 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.0, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div style={isMobile ? {} : { rotateX: sY, rotateY: sX }}>
              <svg
                ref={svgRef}
                viewBox="0 0 840 800"
                style={{ width: '100%', height: 'auto', overflow: 'visible', display: 'block' }}
              >
                <defs>
                  <radialGradient id="center-grad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%"   stopColor="rgba(59,130,246,0.55)"/>
                    <stop offset="55%"  stopColor="rgba(59,130,246,0.12)"/>
                    <stop offset="100%" stopColor="rgba(59,130,246,0)"/>
                  </radialGradient>
                  <filter id="node-glow" x="-120%" y="-120%" width="340%" height="340%">
                    <feGaussianBlur stdDeviation="4.5" result="b"/>
                    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                  <filter id="pulse-glow" x="-200%" y="-200%" width="500%" height="500%">
                    <feGaussianBlur stdDeviation="6" result="b"/>
                    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                  <filter id="ring-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2.5" result="b"/>
                    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                </defs>

                {/* Background precision marks */}
                <g style={{ opacity: isHovering ? 0.04 : 0.07, transition: 'opacity 0.4s' }}>
                  {BG_MARKS.map((m, i) => (
                    <g key={i}>
                      <line x1={m.x-6} y1={m.y} x2={m.x+6} y2={m.y} stroke="#1A1A1A" strokeWidth="0.5"/>
                      <line x1={m.x} y1={m.y-6} x2={m.x} y2={m.y+6} stroke="#1A1A1A" strokeWidth="0.5"/>
                      <circle cx={m.x} cy={m.y} r={0.9} fill="#1A1A1A"/>
                    </g>
                  ))}
                </g>

                {/* Cluster exit marker dots (right side, always visible, faint) */}
                {!isMobile && (Object.entries(CLUSTER_EXIT) as [Cluster, {x:number;y:number}][]).map(([cl, pt]) => (
                  <circle key={cl} cx={pt.x} cy={pt.y} r={3}
                    fill={activeCluster === cl ? CLUSTER_COLOR[cl] : 'rgba(26,26,26,0.20)'}
                    style={{ transition: 'fill 0.3s ease' }}
                  />
                ))}

                {/* Inner rings */}
                <g style={{ opacity: isHovering ? 0.12 : 1, transition: 'opacity 0.35s' }}>
                  {RINGS.slice(1).map((r, i) => (
                    <ellipse key={i} cx={CX} cy={CY} rx={r.rx} ry={r.ry}
                      fill="none" stroke="#1A1A1A" strokeWidth={r.sw} strokeOpacity={r.opacity}/>
                  ))}
                </g>

                {/* Outer ring */}
                <motion.ellipse
                  cx={CX} cy={CY} rx={ORX} ry={ORY}
                  fill="none"
                  stroke={activeCluster ? '#1E3A8A' : '#1A1A1A'}
                  strokeWidth={activeCluster ? 1.4 : 1.0}
                  strokeOpacity={0.88}
                  initial={{ pathLength: 0 }}
                  animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
                  transition={{ duration: 2.4, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    filter: activeCluster ? 'url(#ring-glow)' : 'none',
                    transition: 'stroke 0.35s, stroke-width 0.35s, filter 0.35s',
                  }}
                />

                {/* Cardinal ticks */}
                <g style={{ opacity: isHovering ? 0.10 : 0.48, transition: 'opacity 0.35s' }}>
                  {TICK_ANGLES.map((angle, i) => {
                    const tx = CX + ORX * Math.cos(angle)
                    const ty = CY + ORY * Math.sin(angle)
                    const nv = Math.cos(angle), mv = Math.sin(angle), len = 7
                    return (
                      <line key={i}
                        x1={tx - mv*len} y1={ty + nv*len}
                        x2={tx + mv*len} y2={ty - nv*len}
                        stroke="#1A1A1A" strokeWidth="0.75"
                      />
                    )
                  })}
                </g>

                {/* Center breathing sphere */}
                <g style={{ opacity: isHovering ? 0.5 : 1, transition: 'opacity 0.35s' }}>
                  <circle cx={CX} cy={CY} r={38} fill="url(#center-grad)" className="center-sphere"/>
                  <circle cx={CX} cy={CY} r={5}
                    fill="rgba(59,130,246,0.22)" stroke="rgba(59,130,246,0.5)" strokeWidth="0.8"/>
                  <circle cx={CX} cy={CY} r={2} fill="rgba(59,130,246,0.7)"/>
                </g>

                {/* Center crosshair */}
                <g style={{ opacity: isHovering ? 0.06 : 0.35, transition: 'opacity 0.35s' }}>
                  <line x1={CX-18} y1={CY} x2={CX+18} y2={CY} stroke="#1A1A1A" strokeWidth="0.55"/>
                  <line x1={CX} y1={CY-10} x2={CX} y2={CY+10} stroke="#1A1A1A" strokeWidth="0.55"/>
                  <text x={CX+22} y={CY-3} fontFamily="'Roboto Mono',monospace"
                    fontSize="7" fill="#1A1A1A" fillOpacity="0.45" letterSpacing="0.04em">X: 0.50</text>
                  <text x={CX+22} y={CY+10} fontFamily="'Roboto Mono',monospace"
                    fontSize="7" fill="#1A1A1A" fillOpacity="0.45" letterSpacing="0.04em">Y: 0.50</text>
                </g>

                {/* Guide wires center → nodes */}
                <g style={{ opacity: isHovering ? 0.04 : 0.08, transition: 'opacity 0.35s' }}>
                  {nodes.map((n, i) => (
                    <line key={i} x1={CX} y1={CY} x2={n.x} y2={n.y}
                      stroke="#1A1A1A" strokeWidth="0.5" strokeDasharray="3 5"/>
                  ))}
                </g>

                {/* Energy pulse comet */}
                <g style={{ opacity: isHovering ? 0 : 1, transition: 'opacity 0.35s' }}>
                  {trailPoints.map((tp, i) => (
                    <circle key={i} cx={tp.x} cy={tp.y}
                      r={2.2 - i*0.55} fill="rgba(59,130,246,1)"
                      fillOpacity={0.22 - i*0.05}/>
                  ))}
                  <circle cx={pX} cy={pY} r={4.5} fill="url(#center-grad)" filter="url(#pulse-glow)"/>
                  <circle cx={pX} cy={pY} r={2.2} fill="#3B82F6" fillOpacity={0.85}/>
                  <circle cx={pX} cy={pY} r={1.1} fill="#DBEAFE"/>
                </g>

                {/* Hover connector to center */}
                <AnimatePresence>
                  {hoveredIdx !== null && (
                    <motion.line
                      key="cnx"
                      x1={nodes[hoveredIdx].x} y1={nodes[hoveredIdx].y}
                      x2={CX} y2={CY}
                      stroke="#1E3A8A" strokeWidth="0.8"
                      strokeDasharray="4 3" strokeOpacity={0.45}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </AnimatePresence>

                {/* ── Nodes ── */}
                {nodes.map((node, i) => {
                  const right      = Math.cos(node.a) >= 0
                  const lx         = node.x + (right ? 16 : -16)
                  const isHovered  = hoveredIdx === i
                  const clusterAct = node.isClusterActive
                  const isDimmed   = activeCluster !== null && !clusterAct
                  const pi         = node.pulseIntensity
                  const accent     = CLUSTER_COLOR[node.cluster]

                  return (
                    <g key={node.id}
                      style={{ opacity: isDimmed ? 0.10 : 1, transition: 'opacity 0.3s' }}>

                      {/* Hit area */}
                      <circle cx={node.x} cy={node.y} r={50}
                        fill="transparent" style={{ cursor: 'crosshair' }}
                        onMouseEnter={() => handleNodeEnter(i, node.x, node.y)}
                        onMouseLeave={handleNodeLeave}
                      />

                      {/* Cluster glow aura */}
                      {(clusterAct || pi > 0) && !isDimmed && (
                        <circle cx={node.x} cy={node.y}
                          r={14 + (clusterAct ? 6 : pi * 6)}
                          fill={accent} fillOpacity={clusterAct ? 0.09 : 0.05 * pi}/>
                      )}

                      {/* Engineering cross */}
                      <line x1={node.x-6} y1={node.y} x2={node.x+6} y2={node.y}
                        stroke={clusterAct || pi > 0.5 ? accent : '#1A1A1A'}
                        strokeWidth="0.8"
                        strokeOpacity={clusterAct ? 0.9 : pi > 0 ? 0.45 + pi*0.45 : 0.35}
                        style={{ transition: 'stroke 0.25s' }}
                      />
                      <line x1={node.x} y1={node.y-6} x2={node.x} y2={node.y+6}
                        stroke={clusterAct || pi > 0.5 ? accent : '#1A1A1A'}
                        strokeWidth="0.8"
                        strokeOpacity={clusterAct ? 0.9 : pi > 0 ? 0.45 + pi*0.45 : 0.35}
                        style={{ transition: 'stroke 0.25s' }}
                      />

                      {/* Node ring */}
                      <circle cx={node.x} cy={node.y} r={5}
                        fill={clusterAct ? `rgba(59,130,246,0.13)` : pi > 0 ? `rgba(59,130,246,${0.04+pi*0.08})` : 'rgba(26,26,26,0.05)'}
                        stroke={clusterAct ? accent : pi > 0.4 ? accent : '#1A1A1A'}
                        strokeWidth={clusterAct ? 1.2 : pi > 0.4 ? 1.0 : 0.85}
                        style={{
                          filter: isHovered ? 'url(#node-glow)' : clusterAct ? `drop-shadow(0 0 7px ${accent}55)` : 'none',
                          transition: 'all 0.25s',
                        }}
                      />
                      <circle cx={node.x} cy={node.y} r={2.2}
                        fill={clusterAct ? accent : pi > 0.5 ? '#3B82F6' : '#1A1A1A'}
                        fillOpacity={clusterAct ? 0.9 : pi > 0.5 ? 0.75 : 0.52}
                        style={{ transition: 'fill 0.25s' }}
                      />

                      {/* Hover pulse ring */}
                      {isHovered && (
                        <motion.circle
                          cx={node.x} cy={node.y}
                          fill="none" stroke="rgba(59,130,246,0.28)" strokeWidth="0.9"
                          animate={{ r: [6, 22, 6], opacity: [0.9, 0, 0.9] }}
                          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
                        />
                      )}

                      {/* ID */}
                      <text x={lx} y={node.y - 2}
                        textAnchor={right ? 'start' : 'end'}
                        fontFamily="'Roboto Mono',monospace"
                        fontSize="9" fontWeight="700" letterSpacing="0.13em"
                        fill={clusterAct ? accent : '#1A1A1A'}
                        fillOpacity={clusterAct ? 1 : 0.50}
                        style={{ transition: 'fill 0.25s, fill-opacity 0.25s' }}>
                        {node.id}
                      </text>

                      {/* Label */}
                      <text x={lx + (right ? 21 : -21)} y={node.y - 2}
                        textAnchor={right ? 'start' : 'end'}
                        fontFamily="Inter,system-ui,sans-serif"
                        fontSize="11.5" fontWeight={clusterAct ? '700' : '600'}
                        fill="#1A1A1A"
                        fillOpacity={clusterAct ? 1 : 0.78}
                        style={{ transition: 'fill-opacity 0.25s' }}>
                        {node.label}
                      </text>

                      {/* Sub */}
                      <text x={lx} y={node.y + 13}
                        textAnchor={right ? 'start' : 'end'}
                        fontFamily="'Roboto Mono',monospace"
                        fontSize="7.5" letterSpacing="0.03em"
                        fill="#1A1A1A" fillOpacity={0.26}>
                        {node.sub}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </motion.div>
          </motion.div>

          {/* ── RIGHT: Pillar cards ── */}
          <div style={{
            flex:          '1 1 0%',
            display:       'flex',
            flexDirection: 'column',
            gap:           14,
            paddingTop:    isMobile ? 32 : 40,
            zIndex:        5,
            position:      'relative',
          }}>
            {PILLARS.map((p, i) => {
              const isActive = activeCluster === p.cluster
              const isDimmed = activeCluster !== null && !isActive

              return (
                <motion.div
                  key={p.cluster}
                  ref={el => { pillarRefs.current[i] = el }}
                  initial={{ opacity: 0, x: 28 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.65, delay: 0.3 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  onMouseEnter={() => { setActiveCluster(p.cluster); hoverRef.current = true }}
                  onMouseLeave={() => { setActiveCluster(null); hoverRef.current = false }}
                  style={{ cursor: 'default' }}
                >
                  <motion.div
                    animate={{
                      y:       isActive ? -6 : 0,
                      opacity: isDimmed ? 0.38 : 1,
                      scale:   isActive ? 1.008 : 1,
                    }}
                    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      background:           'rgba(252,252,250,0.80)',
                      backdropFilter:       'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      borderRadius:         4,
                      border:               isActive
                        ? `1px solid ${CLUSTER_COLOR[p.cluster]}45`
                        : '1px solid rgba(255,255,255,0.85)',
                      borderLeft:           isActive
                        ? `2px solid ${CLUSTER_COLOR[p.cluster]}`
                        : '2px solid rgba(26,26,26,0.10)',
                      boxShadow:            isActive
                        ? `0 6px 24px rgba(30,58,138,0.10), 0 2px 8px rgba(0,0,0,0.05)`
                        : '0 2px 10px rgba(0,0,0,0.04)',
                      padding:              '16px 18px',
                      transition:           'border 0.3s, box-shadow 0.3s',
                    }}
                  >
                    {/* Index + title row */}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
                      <span style={{
                        fontFamily:    "'Roboto Mono',monospace",
                        fontSize:      9,
                        fontWeight:    800,
                        letterSpacing: '0.14em',
                        color:         isActive ? CLUSTER_COLOR[p.cluster] : 'rgba(26,26,26,0.32)',
                        transition:    'color 0.3s',
                      }}>
                        {p.index}
                      </span>
                      <h3 style={{
                        fontFamily:    "Inter,system-ui,sans-serif",
                        fontSize:      13,
                        fontWeight:    700,
                        letterSpacing: '-0.01em',
                        color:         isActive ? '#1A1A1A' : 'rgba(26,26,26,0.75)',
                        margin:        0,
                        lineHeight:    1.25,
                        transition:    'color 0.3s',
                      }}>
                        {p.title}
                      </h3>
                    </div>

                    {/* Subtitle */}
                    <p style={{
                      fontFamily:    "'Roboto Mono',monospace",
                      fontSize:      8,
                      letterSpacing: '0.15em',
                      color:         isActive ? CLUSTER_COLOR[p.cluster] : 'rgba(26,26,26,0.30)',
                      textTransform: 'uppercase' as const,
                      marginBottom:  8,
                      transition:    'color 0.3s',
                    }}>
                      {p.subtitle}
                    </p>

                    {/* Description */}
                    <p style={{
                      fontFamily:    "Inter,system-ui,sans-serif",
                      fontSize:      11,
                      lineHeight:    1.65,
                      color:         'rgba(26,26,26,0.50)',
                      margin:        '0 0 10px',
                    }}>
                      {p.description}
                    </p>

                    {/* Expanded details on active */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0, transition: { duration: 0.18 } }}
                          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div style={{
                            borderTop:    '1px solid rgba(26,26,26,0.07)',
                            paddingTop:   10,
                            marginBottom: 10,
                          }}>
                            {p.bullets.map(b => (
                              <div key={b} style={{
                                display:     'flex',
                                alignItems:  'flex-start',
                                gap:         8,
                                marginBottom: 5,
                              }}>
                                <div style={{
                                  width:        4, height: 4, borderRadius: '50%',
                                  background:   CLUSTER_COLOR[p.cluster],
                                  flexShrink:   0, marginTop: 5,
                                }}/>
                                <span style={{
                                  fontFamily: "Inter,system-ui,sans-serif",
                                  fontSize:   10,
                                  color:      'rgba(26,26,26,0.60)',
                                  lineHeight: 1.6,
                                }}>
                                  {b}
                                </span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Stat row */}
                    <div style={{
                      display:    'flex',
                      alignItems: 'baseline',
                      gap:        8,
                      borderTop:  '1px solid rgba(26,26,26,0.06)',
                      paddingTop: 10,
                    }}>
                      <span style={{
                        fontFamily:    "'Roboto Mono',monospace",
                        fontSize:      20,
                        fontWeight:    800,
                        color:         isActive ? CLUSTER_COLOR[p.cluster] : 'rgba(26,26,26,0.60)',
                        letterSpacing: '-0.02em',
                        lineHeight:    1,
                        transition:    'color 0.3s',
                      }}>
                        {p.stat}
                      </span>
                      <span style={{
                        fontFamily:    "'Roboto Mono',monospace",
                        fontSize:      7.5,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase' as const,
                        color:         'rgba(26,26,26,0.28)',
                      }}>
                        {p.statLabel}
                      </span>
                    </div>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Node tooltip panel ── */}
      <AnimatePresence>
        {panel && (
          <motion.div
            key={`p-${panel.idx}`}
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97, transition: { duration: 0.14 } }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position:      'absolute',
              left:          `${panel.left + 48}px`,
              top:           `${panel.top}px`,
              width:         `${PANEL_W}px`,
              zIndex:        30,
              pointerEvents: 'none',
            }}
          >
            <div style={{
              background:           'rgba(252,252,250,0.82)',
              backdropFilter:       'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              borderRadius:         3,
              padding:              '13px 15px',
              border:               '1px solid rgba(255,255,255,0.90)',
              borderLeft:           `2px solid ${CLUSTER_COLOR[NODES[panel.idx].cluster]}`,
              boxShadow:            '0 4px 16px rgba(0,0,0,0.06)',
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 9 }}>
                <span style={{ fontFamily: "'Roboto Mono',monospace", fontSize: 9, fontWeight: 700,
                  letterSpacing: '0.14em', color: CLUSTER_COLOR[NODES[panel.idx].cluster] }}>
                  {NODES[panel.idx].id}
                </span>
                <span style={{ fontFamily: "Inter,system-ui,sans-serif", fontSize: 12, fontWeight: 600, color: '#1A1A1A' }}>
                  {NODES[panel.idx].label}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 9,
                paddingBottom: 9, borderBottom: '1px solid rgba(26,26,26,0.07)' }}>
                <span style={{ fontFamily: "'Roboto Mono',monospace", fontSize: 20, fontWeight: 700,
                  color: CLUSTER_COLOR[NODES[panel.idx].cluster], letterSpacing: '-0.02em' }}>
                  {NODES[panel.idx].metric}
                </span>
                <span style={{ fontFamily: "'Roboto Mono',monospace", fontSize: 8,
                  color: 'rgba(26,26,26,0.35)', letterSpacing: '0.10em', textTransform: 'uppercase' as const }}>
                  {NODES[panel.idx].metricLabel}
                </span>
              </div>
              <p style={{ fontFamily: "Inter,system-ui,sans-serif", fontSize: 10,
                lineHeight: 1.75, color: 'rgba(26,26,26,0.50)', margin: 0 }}>
                {NODES[panel.idx].detail}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
        background: 'linear-gradient(to bottom, transparent, #F7F7F2)',
        pointerEvents: 'none', zIndex: 3,
      }}/>

      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 40, position: 'relative', zIndex: 10 }}>
        <SectionArrow href="#companies" color="rgba(26,26,26,0.25)" />
      </div>
    </section>
  )
}
