import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import SectionArrow from './SectionArrow'

// ── Geometry ──────────────────────────────────────────────────────────────────
//
//  SVG viewBox: 0 0 560 480  (center-x = 280)
//
//  Stepped pyramid: 3 tiers, each tier has front face + top face (ledge).
//  Front face bottom-edge of tier N+1 = top face back-edge of tier N
//  → creates seamless interlocking staircase.
//
//  Y positions:
//    L01 base:           y = 470
//    L01 top / L02 bot:  y = 350  (front edge of L01 ledge)
//    L01 ledge back:     y = 320  (= L02 face bottom)
//    L02 top / L03 bot:  y = 220
//    L02 ledge back:     y = 190  (= L03 face bottom)
//    L03 top:            y = 110
//    L03 ledge back:     y = 90
//
//  Half-widths follow pyramid slope hw(y) = 60 + 160*(y-100)/370
//    y=470 → 220   y=350 → 168   y=320 → 155
//    y=220 → 112   y=190 → 99    y=110 → 64
//    y=90  → 55
//
//  L01 front face:  "60,470 500,470 448,350 112,350"
//  L01 top face:    "112,350 448,350 435,320 125,320"
//  L02 front face:  "125,320 435,320 392,220 168,220"
//  L02 top face:    "168,220 392,220 379,190 181,190"
//  L03 front face:  "181,190 379,190 344,110 216,110"
//  L03 top face:    "216,110 344,110 336,90 224,90"

const SVG_W = 560
const SVG_H = 480

// Index 0 = L03 (top/front), 1 = L02, 2 = L01 (bottom/back)
const LAYERS = [
  {
    rank:    'L03',
    type:    'INTEGRATED INTELLIGENCE STACK',
    label:   'BETA Robotics Lab',
    caption: 'The only entity combining real-world humanoid data, VLM-automated annotation, and closed-loop world model training.',
    details: [
      { key: 'Primary Output', val: 'Models / Benchmarks'   },
      { key: 'Data Source',    val: 'Eastworld Partnership' },
      { key: 'Validation',     val: 'G1 Humanoid Loop'      },
    ],
    face:      '181,190 379,190 344,110 216,110',
    shelf:     '216,110 344,110 336,90 224,90',
    faceFill:  'rgba(186,230,253,0.62)',
    shelfFill: 'rgba(215,242,255,0.82)',
    stroke:    'rgba(59,130,246,0.55)',
    glowFilter:'url(#glow-l03)',
    rankColor: '#1E40AF',
    accentColor:'#1E3A8A',
    textH:     130,
    exitX:     362,
    exitY:     150,
  },
  {
    rank:    'L02',
    type:    'DATA SCALING VENDORS',
    label:   'Data Service Providers',
    caption: 'Human-in-the-loop annotation pipelines. Proprietary data services without integrated model intelligence.',
    details: [
      { key: 'Method',     val: 'Human-in-the-loop annotation' },
      { key: 'Capability', val: 'Proprietary data services'    },
      { key: 'Limitation', val: 'No model intelligence'        },
    ],
    face:      '125,320 435,320 392,220 168,220',
    shelf:     '168,220 392,220 379,190 181,190',
    faceFill:  'rgba(245,245,220,0.60)',
    shelfFill: 'rgba(252,252,236,0.80)',
    stroke:    'rgba(180,160,80,0.35)',
    glowFilter:'none',
    rankColor: '#92400E',
    accentColor:'#78350F',
    textH:     165,
    exitX:     414,
    exitY:     270,
  },
  {
    rank:    'L01',
    type:    'THEORETICAL FOUNDATION',
    label:   'Conventional Academic Labs',
    caption: 'Simulation-heavy experimentation. Fragmented data sources. Academic publication focus without deployment loop.',
    details: [
      { key: 'Output',     val: 'Academic papers'              },
      { key: 'Method',     val: 'Simulation-heavy experiments' },
      { key: 'Limitation', val: 'Fragmented data sources'      },
    ],
    face:      '60,470 500,470 448,350 112,350',
    shelf:     '112,350 448,350 435,320 125,320',
    faceFill:  'rgba(240,240,238,0.60)',
    shelfFill: 'rgba(250,250,248,0.80)',
    stroke:    'rgba(100,100,95,0.25)',
    glowFilter:'none',
    rankColor: '#78716C',
    accentColor:'#57534E',
    textH:     165,
    exitX:     474,
    exitY:     410,
  },
] as const

// ── Connector ─────────────────────────────────────────────────────────────────

interface ConnLine { x1:number; y1:number; x2:number; y2:number; active:boolean; dimmed:boolean; color:string }

function ConnPath({ x1, y1, x2, y2, active, dimmed, color }: ConnLine) {
  const mx = x1 + (x2 - x1) * 0.5
  const d  = `M ${x1},${y1} C ${mx},${y1} ${mx},${y2} ${x2},${y2}`
  return (
    <g style={{ opacity: dimmed ? 0.12 : 1, transition: 'opacity 0.3s' }}>
      <path d={d} fill="none" stroke="rgba(26,26,26,0.12)" strokeWidth="1" strokeDasharray="5 6"/>
      {active && (
        <path d={d} fill="none"
          stroke={color} strokeWidth="1.2" strokeOpacity="0.7"
          strokeDasharray="5 5"
          style={{ animation: 'conn-flow 1.1s linear infinite' }}
        />
      )}
    </g>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function MoatStack() {
  const [active, setActive] = useState<number | null>(null)
  const [ripple, setRipple] = useState<{ i:number; cx:number; cy:number } | null>(null)

  const sectionRef   = useRef<HTMLElement>(null)
  const svgRef       = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const textRefs     = useRef<(HTMLDivElement | null)[]>([])
  const isInView     = useInView(sectionRef, { once: true, margin: '-12%' })

  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // ── Connector coordinates ──────────────────────────────────────────────────

  const [connectors, setConnectors] = useState<Array<{ x1:number; y1:number; x2:number; y2:number }>>([])

  const recalc = useCallback(() => {
    const svgEl  = svgRef.current
    const contEl = containerRef.current
    if (!svgEl || !contEl || isMobile) return
    const svgRect  = svgEl.getBoundingClientRect()
    const contRect = contEl.getBoundingClientRect()
    const scaleX   = svgRect.width  / SVG_W
    const scaleY   = svgRect.height / SVG_H
    const result = LAYERS.map((layer, i) => {
      const x1 = svgRect.left - contRect.left + layer.exitX * scaleX
      const y1 = svgRect.top  - contRect.top  + layer.exitY * scaleY
      const textEl = textRefs.current[i]
      let x2 = contRect.width * 0.58
      let y2 = y1
      if (textEl) {
        const tr = textEl.getBoundingClientRect()
        x2 = tr.left - contRect.left
        y2 = tr.top  - contRect.top + tr.height * 0.5
      }
      return { x1, y1, x2, y2 }
    })
    setConnectors(result)
  }, [isMobile])

  useEffect(() => {
    if (!isInView) return
    const t   = setTimeout(recalc, 140)
    const obs = new ResizeObserver(recalc)
    if (containerRef.current) obs.observe(containerRef.current)
    window.addEventListener('resize', recalc)
    return () => { clearTimeout(t); obs.disconnect(); window.removeEventListener('resize', recalc) }
  }, [isInView, recalc])

  // ── Ripple ────────────────────────────────────────────────────────────────

  const handlePolyEnter = (e: React.MouseEvent<SVGPolygonElement>, i: number) => {
    setActive(i)
    const svgEl = svgRef.current
    if (!svgEl) return
    const svgRect = svgEl.getBoundingClientRect()
    const cx = (e.clientX - svgRect.left) * (SVG_W / svgRect.width)
    const cy = (e.clientY - svgRect.top)  * (SVG_H / svgRect.height)
    setRipple({ i, cx, cy })
    setTimeout(() => setRipple(null), 900)
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <section
      ref={sectionRef}
      id="companies"
      className="relative w-full overflow-hidden"
      style={{ background: '#F7F7F2', paddingTop: 88, paddingBottom: 88 }}
    >
      <style>{`
        @keyframes conn-flow { from { stroke-dashoffset: 20 } to { stroke-dashoffset: 0 } }
        @keyframes ripple-out {
          from { r: 4;   opacity: .55 }
          to   { r: 120; opacity: 0   }
        }
      `}</style>

      {/* Dot texture */}
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 w-full h-full" style={{ opacity: 0.03 }}>
        <defs>
          <pattern id="ms-dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="#1A1A1A"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ms-dots)"/>
      </svg>

      {/* ── Header ── */}
      <motion.div
        className="max-w-6xl mx-auto px-8 mb-16 text-center"
        initial={{ opacity: 0, y: -16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="font-mono text-[10px] tracking-[0.35em] uppercase mb-4"
          style={{ color: 'rgba(26,26,26,0.30)' }}>
          [ 02 / RESEARCH_MOAT ]
        </p>
        <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4"
          style={{ color: '#1A1A1A' }}>
          A New Category Between<br/>Research Labs and Data Companies
        </h2>
        <p className="text-sm max-w-lg mx-auto"
          style={{ color: 'rgba(26,26,26,0.40)', fontFamily: 'Inter,system-ui,sans-serif' }}>
          One integrated infrastructure stack that others cannot replicate.
        </p>
      </motion.div>

      {/* ── Main layout ── */}
      <div className="max-w-6xl mx-auto px-8">
        {isMobile ? (
          // ── Mobile ──────────────────────────────────────────────────────
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {LAYERS.map((layer, i) => (
              <motion.div
                key={layer.rank}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  background: layer.faceFill,
                  border: `1px solid ${layer.stroke}`,
                  borderLeft: `3px solid ${layer.accentColor}`,
                  borderRadius: 4,
                  padding: '16px 18px',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ fontFamily: "'Roboto Mono',monospace", fontSize: 10, fontWeight: 800,
                    letterSpacing: '0.14em', color: layer.rankColor }}>{layer.rank}</span>
                  <span style={{ fontFamily: "'Roboto Mono',monospace", fontSize: 7.5,
                    letterSpacing: '0.16em', color: 'rgba(26,26,26,0.32)', textTransform: 'uppercase' as const }}>
                    {layer.type}
                  </span>
                </div>
                <h3 style={{ fontFamily: 'Inter,system-ui,sans-serif', fontSize: 16, fontWeight: 700,
                  color: '#1A1A1A', marginBottom: 6 }}>{layer.label}</h3>
                <p style={{ fontFamily: 'Inter,system-ui,sans-serif', fontSize: 11, lineHeight: 1.65,
                  color: 'rgba(26,26,26,0.50)', margin: 0 }}>{layer.caption}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          // ── Desktop: pyramid + annotations ──────────────────────────────
          <div ref={containerRef} style={{ display: 'flex', alignItems: 'flex-start', gap: 0, position: 'relative' }}>

            {/* Connector overlay */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
              pointerEvents: 'none', overflow: 'visible', zIndex: 4 }}>
              {connectors.map((c, i) => (
                <ConnPath key={i}
                  x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2}
                  active={active === i}
                  dimmed={active !== null && active !== i}
                  color={LAYERS[i].accentColor}
                />
              ))}
            </svg>

            {/* ── LEFT: Stepped pyramid SVG ── */}
            <motion.div
              style={{ flex: '0 0 55%' }}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <svg
                ref={svgRef}
                viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                style={{ width: '100%', height: 'auto', overflow: 'visible', display: 'block' }}
              >
                <defs>
                  <filter id="glow-l03" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="5" result="b"/>
                    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>

                  {/* Clip paths for ripple */}
                  {LAYERS.map(layer => (
                    <clipPath key={layer.rank} id={`clip-${layer.rank}`}>
                      <polygon points={layer.face}/>
                    </clipPath>
                  ))}

                  {/* Face gradients (front-lit: darker at top, lighter at bottom) */}
                  <linearGradient id="face-l03" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="rgba(150,210,248,0.60)"/>
                    <stop offset="100%" stopColor="rgba(186,230,253,0.72)"/>
                  </linearGradient>
                  <linearGradient id="face-l02" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="rgba(232,228,190,0.55)"/>
                    <stop offset="100%" stopColor="rgba(245,245,220,0.68)"/>
                  </linearGradient>
                  <linearGradient id="face-l01" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="rgba(226,224,220,0.55)"/>
                    <stop offset="100%" stopColor="rgba(240,240,238,0.68)"/>
                  </linearGradient>

                  {/* Top-face gradients (top-lit: brighter) */}
                  <linearGradient id="shelf-l03" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="rgba(225,245,255,0.90)"/>
                    <stop offset="100%" stopColor="rgba(200,238,255,0.75)"/>
                  </linearGradient>
                  <linearGradient id="shelf-l02" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="rgba(255,255,242,0.90)"/>
                    <stop offset="100%" stopColor="rgba(248,248,228,0.75)"/>
                  </linearGradient>
                  <linearGradient id="shelf-l01" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="rgba(255,255,255,0.90)"/>
                    <stop offset="100%" stopColor="rgba(248,248,244,0.75)"/>
                  </linearGradient>
                </defs>

                {/* Render bottom → top for correct z-ordering */}
                {[...LAYERS].reverse().map((layer, ri) => {
                  const i        = LAYERS.length - 1 - ri   // 0=L03, 1=L02, 2=L01
                  const isActive = active === i
                  const isDimmed = active !== null && !isActive
                  const rank     = layer.rank.toLowerCase()

                  // Stagger: L01 (ri=0) enters first, L03 (ri=2) last
                  const delay = 0.15 + ri * 0.18

                  return (
                    <motion.g
                      key={layer.rank}
                      initial={{ opacity: 0, y: 36 }}
                      animate={isInView
                        ? { opacity: isDimmed ? 0.42 : 1, y: 0 }
                        : { opacity: 0, y: 36 }}
                      transition={{
                        opacity: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
                        y:       { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
                      }}
                    >
                      {/* Top face (ledge) — lighter, top-lit */}
                      <polygon
                        points={layer.shelf}
                        fill={`url(#shelf-${rank})`}
                        stroke={layer.stroke}
                        strokeWidth="0.6"
                        style={{ pointerEvents: 'none' }}
                      />

                      {/* Front face */}
                      <motion.polygon
                        points={layer.face}
                        fill={`url(#face-${rank})`}
                        stroke={layer.stroke}
                        strokeWidth={isActive ? 1.4 : 0.7}
                        filter={isActive && i === 0 ? layer.glowFilter : 'none'}
                        animate={{ fillOpacity: isActive ? 1 : 0.88 }}
                        transition={{ duration: 0.25 }}
                        style={{ cursor: 'default', transition: 'filter 0.3s' }}
                        onMouseEnter={e => handlePolyEnter(e as unknown as React.MouseEvent<SVGPolygonElement>, i)}
                        onMouseLeave={() => setActive(null)}
                      />

                      {/* Highlight at top edge of front face */}
                      <line
                        x1={parseFloat(layer.face.split(' ')[3].split(',')[0]) + 6}
                        y1={parseFloat(layer.face.split(' ')[3].split(',')[1]) + 4}
                        x2={parseFloat(layer.face.split(' ')[2].split(',')[0]) - 6}
                        y2={parseFloat(layer.face.split(' ')[2].split(',')[1]) + 4}
                        stroke="rgba(255,255,255,0.70)"
                        strokeWidth="1"
                        opacity={isActive ? 0.95 : 0.50}
                        style={{ pointerEvents: 'none', transition: 'opacity 0.25s' }}
                      />

                      {/* Ripple on hover */}
                      {ripple && ripple.i === i && (
                        <circle
                          cx={ripple.cx} cy={ripple.cy}
                          fill="none"
                          stroke={layer.accentColor}
                          strokeWidth="1"
                          strokeOpacity="0.4"
                          clipPath={`url(#clip-${layer.rank})`}
                          style={{ animation: 'ripple-out 0.9s ease-out forwards' }}
                        />
                      )}

                      {/* Rank label */}
                      <text
                        x={SVG_W / 2}
                        y={layer.exitY + 4}
                        textAnchor="middle"
                        fontFamily="'Roboto Mono','JetBrains Mono',monospace"
                        fontSize={i === 0 ? 13 : i === 1 ? 11 : 11}
                        fontWeight="800"
                        letterSpacing="0.18em"
                        fill={layer.rankColor}
                        style={{ pointerEvents: 'none' }}
                      >
                        {layer.rank}
                      </text>

                      {/* Label inside face */}
                      <text
                        x={SVG_W / 2}
                        y={layer.exitY + 22}
                        textAnchor="middle"
                        fontFamily="Inter,'Helvetica Neue',system-ui,sans-serif"
                        fontSize={i === 0 ? 11 : 9.5}
                        fontWeight="600"
                        fill="rgba(26,26,26,0.62)"
                        style={{ pointerEvents: 'none' }}
                      >
                        {layer.label}
                      </text>
                    </motion.g>
                  )
                })}
              </svg>
            </motion.div>

            {/* ── RIGHT: Annotation column ── */}
            <div style={{ flex: '1 1 0%', display: 'flex', flexDirection: 'column', paddingLeft: 32, zIndex: 5 }}>
              {LAYERS.map((layer, i) => {
                const isActive = active === i
                const isDimmed = active !== null && !isActive

                return (
                  <motion.div
                    key={layer.rank}
                    ref={el => { textRefs.current[i] = el }}
                    initial={{ opacity: 0, x: 18 }}
                    animate={isInView
                      ? { opacity: isDimmed ? 0.28 : 1, x: 0 }
                      : { opacity: 0, x: 18 }}
                    transition={{ duration: 0.6, delay: 0.30 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                    onMouseEnter={() => setActive(i)}
                    onMouseLeave={() => setActive(null)}
                    style={{
                      height:         layer.textH,
                      display:        'flex',
                      flexDirection:  'column',
                      justifyContent: 'center',
                      paddingLeft:    20,
                      borderLeft:     `2px solid ${isActive ? layer.accentColor : 'rgba(26,26,26,0.08)'}`,
                      cursor:         'default',
                      transition:     'border-color 0.3s',
                    }}
                  >
                    {/* Rank + type */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{
                        fontFamily: "'Roboto Mono',monospace",
                        fontSize: 10, fontWeight: 800, letterSpacing: '0.14em',
                        color: isActive ? layer.rankColor : 'rgba(26,26,26,0.35)',
                        transition: 'color 0.25s',
                      }}>
                        {layer.rank}
                      </span>
                      <span style={{ width: 12, height: 1, background: 'rgba(26,26,26,0.18)', flexShrink: 0 }}/>
                      <span style={{
                        fontFamily: "'Roboto Mono',monospace",
                        fontSize: 7.5, letterSpacing: '0.16em',
                        color: 'rgba(26,26,26,0.28)', textTransform: 'uppercase' as const,
                      }}>
                        {layer.type}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 style={{
                      fontFamily: 'Inter,system-ui,sans-serif',
                      fontSize: i === 0 ? 18 : i === 1 ? 15 : 14,
                      fontWeight: 700, letterSpacing: '-0.01em',
                      color: isActive ? '#1A1A1A' : 'rgba(26,26,26,0.68)',
                      marginBottom: 6, lineHeight: 1.25,
                      transition: 'color 0.25s',
                    }}>
                      {layer.label}
                    </h3>

                    {/* Caption */}
                    <p style={{
                      fontFamily: 'Inter,system-ui,sans-serif',
                      fontSize: 11, lineHeight: 1.65,
                      color: 'rgba(26,26,26,0.42)',
                      margin: '0 0 8px',
                    }}>
                      {layer.caption}
                    </p>

                    {/* Expanded detail on hover */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0, transition: { duration: 0.16 } }}
                          transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 4 }}>
                            {layer.details.map(({ key, val }) => (
                              <div key={key} style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
                                <span style={{
                                  fontFamily: "'Roboto Mono',monospace",
                                  fontSize: 8, fontWeight: 700, letterSpacing: '0.10em',
                                  color: layer.accentColor, textTransform: 'uppercase' as const, flexShrink: 0,
                                }}>
                                  {key}
                                </span>
                                <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(26,26,26,0.28)' }}>→</span>
                                <span style={{
                                  fontFamily: "'Roboto Mono',monospace",
                                  fontSize: 10, color: '#1A1A1A', letterSpacing: '0.02em',
                                }}>
                                  {val}
                                </span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}

              {/* Axis label */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10,
                marginTop: 12, opacity: 0.22, paddingLeft: 20 }}>
                <div style={{ height: 1, width: 24, background: '#1A1A1A' }}/>
                <span style={{
                  fontFamily: "'Roboto Mono',monospace",
                  fontSize: 7, letterSpacing: '0.22em',
                  color: '#1A1A1A', textTransform: 'uppercase' as const,
                }}>
                  CAPABILITY DEPTH ↑
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
        background: 'linear-gradient(to bottom, transparent, #F7F7F2)',
        pointerEvents: 'none', zIndex: 3,
      }}/>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 56, position: 'relative', zIndex: 10 }}>
        <SectionArrow href="#contact" color="rgba(26,26,26,0.25)" />
      </div>
    </section>
  )
}
