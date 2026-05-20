import { useState, useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

// ── SVG watermarks ────────────────────────────────────────────────────────────

const WM_CHIP = (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"
    className="absolute right-0 bottom-0 w-40 h-40 pointer-events-none">
    <rect x="40" y="40" width="120" height="120" stroke="currentColor" strokeWidth="0.5"/>
    <path d="M40 70H160M40 100H160M40 130H160M70 40V160M100 40V160M130 40V160"
      stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2"/>
    <circle cx="100" cy="100" r="15" stroke="currentColor" strokeWidth="0.5"/>
    <path d="M100 80V120M80 100H120" stroke="currentColor" strokeWidth="0.5"/>
  </svg>
)

const WM_JOINT = (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"
    className="absolute right-0 bottom-0 w-40 h-40 pointer-events-none">
    <circle cx="100" cy="80" r="30" stroke="currentColor" strokeWidth="0.5"/>
    <circle cx="100" cy="80" r="5" stroke="currentColor" strokeWidth="0.5"/>
    <path d="M70 80L30 150M130 80L170 150" stroke="currentColor" strokeWidth="0.5"/>
    <path d="M40 160H160" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4"/>
    <path d="M100 110V180" stroke="currentColor" strokeWidth="0.5"/>
  </svg>
)

const WM_CONN = (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"
    className="absolute right-0 bottom-0 w-40 h-40 pointer-events-none">
    <circle cx="150" cy="50" r="3" fill="currentColor"/>
    <circle cx="50" cy="150" r="3" fill="currentColor"/>
    <circle cx="180" cy="120" r="2" fill="currentColor"/>
    <path d="M50 150Q100 100 150 50M150 50Q165 85 180 120"
      stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3"/>
    <path d="M30 30L180 180" stroke="currentColor" strokeWidth="0.1"/>
  </svg>
)

// ── Data stream ───────────────────────────────────────────────────────────────

const HEX = '0123456789ABCDEF'
function DataStream({ active }: { active: boolean }) {
  const [line, setLine] = useState('3F A2 00 B1 7E C4 11 D9 08 5A 2C F0 44 8B 17 E3')
  useEffect(() => {
    if (!active) return
    const id = setInterval(() => {
      setLine(
        Array.from({ length: 16 }, () =>
          HEX[Math.floor(Math.random() * 16)] + HEX[Math.floor(Math.random() * 16)]
        ).join(' ')
      )
    }, 110)
    return () => clearInterval(id)
  }, [active])

  return (
    <div style={{
      overflow: 'hidden',
      maxHeight: active ? 18 : 0,
      opacity:   active ? 1 : 0,
      marginTop: active ? 10 : 0,
      transition: 'max-height 0.28s ease, opacity 0.22s ease, margin-top 0.28s ease',
    }}>
      <p className="font-mono text-[7px] tracking-widest truncate"
        style={{ color: 'rgba(59,130,246,0.55)', margin: 0 }}>
        SYS.READ → {line}
      </p>
    </div>
  )
}

// ── Corner markers ────────────────────────────────────────────────────────────

function Corners({ active }: { active: boolean }) {
  const size = active ? 8 : 10
  const col  = active ? 'rgba(59,130,246,0.60)' : '#D1D1CB'
  const sh   = active ? '0 0 6px rgba(59,130,246,0.20)' : 'none'
  const base: React.CSSProperties = { position: 'absolute', width: size, height: size, transition: 'all 0.20s ease', boxShadow: sh }
  return (
    <>
      <div style={{ ...base, top: 0, left: 0, borderTop: `1px solid ${col}`, borderLeft: `1px solid ${col}` }}/>
      <div style={{ ...base, bottom: 0, right: 0, borderBottom: `1px solid ${col}`, borderRight: `1px solid ${col}` }}/>
    </>
  )
}

// ── Card data ─────────────────────────────────────────────────────────────────

type BetaCluster = 'autolabel' | 'benchmark' | null

interface Res {
  ref:       string
  title:     string
  metric:    string
  desc:      string
  colSpan:   2 | 3
  glass:     boolean
  wm:        React.ReactNode | null
  highlight: BetaCluster
  minH:      number
}

const CARDS: Res[] = [
  {
    ref: 'REF-RES-001', title: 'Industrial Partnership', metric: 'Eastworld',
    desc: 'Strategic anchor partner for humanoid locomotion data.',
    colSpan: 3, glass: false, wm: WM_CONN, highlight: 'autolabel', minH: 210,
  },
  {
    ref: 'REF-RES-002', title: 'Computing Power', metric: 'H100 · 1 000h+',
    desc: 'GPU cluster allocation for large-scale model training.',
    colSpan: 3, glass: true, wm: WM_CHIP, highlight: null, minH: 210,
  },
  {
    ref: 'REF-RES-003', title: 'Global Connections', metric: 'PhD Network',
    desc: 'PhDs, founders, and curated panel events.',
    colSpan: 2, glass: false, wm: WM_CONN, highlight: null, minH: 172,
  },
  {
    ref: 'REF-RES-004', title: 'Data Infrastructure', metric: 'In-house Pipeline',
    desc: 'VLM-automated annotation — end-to-end.',
    colSpan: 2, glass: false, wm: WM_CHIP, highlight: 'autolabel', minH: 172,
  },
  {
    ref: 'REF-RES-005', title: 'Hardware Fleet', metric: 'Unitree G1',
    desc: '43-DoF humanoid deployment platform.',
    colSpan: 2, glass: false, wm: WM_JOINT, highlight: 'benchmark', minH: 172,
  },
  {
    ref: 'REF-RES-006', title: 'Physical Space', metric: 'Incoming Lab',
    desc: 'Dedicated lab facility in active build-out.',
    colSpan: 2, glass: false, wm: null, highlight: null, minH: 148,
  },
]

// ── Main ──────────────────────────────────────────────────────────────────────

export default function ResourceMatrix() {
  const [hovered, setHovered] = useState<number | null>(null)
  const [wmOpacity, setWmOpacity] = useState<number[]>(CARDS.map(() => 0.05))
  const sectionRef = useRef<HTMLElement>(null)
  const isInView   = useInView(sectionRef, { once: true, margin: '-10%' })

  const enter = (i: number, cluster: BetaCluster) => {
    setHovered(i)
    setWmOpacity(prev => prev.map((v, j) => j === i ? 0.12 : v))
    if (cluster) window.dispatchEvent(new CustomEvent('betaloop:highlight', { detail: { cluster } }))
  }
  const leave = (i: number) => {
    setHovered(null)
    setWmOpacity(prev => prev.map((v, j) => j === i ? 0.05 : v))
    window.dispatchEvent(new CustomEvent('betaloop:highlight', { detail: { cluster: null } }))
  }

  const colClass = (n: 2 | 3) => n === 3 ? 'col-span-3' : 'col-span-2'

  return (
    <section
      ref={sectionRef}
      id="resources"
      className="relative w-full overflow-hidden"
      style={{ background: '#F7F7F2', paddingTop: 88, paddingBottom: 96 }}
    >
      {/* Dot texture */}
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 w-full h-full opacity-[0.03]">
        <defs>
          <pattern id="rm-dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="#1A1A1A"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#rm-dots)"/>
      </svg>

      <div className="max-w-6xl mx-auto px-8 relative">

        {/* ── Header ── */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-mono text-[10px] tracking-[0.35em] uppercase mb-4"
            style={{ color: 'rgba(26,26,26,0.30)' }}>
            [ 03 / RESOURCE_MATRIX ]
          </p>
          <div className="flex items-end justify-between flex-wrap gap-4">
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1]"
              style={{ color: '#1A1A1A' }}>
              Research Assets &<br/>Infrastructure
            </h2>
            <p className="text-sm font-light max-w-[240px] leading-relaxed"
              style={{ color: 'rgba(26,26,26,0.38)' }}>
              Core resources enabling end-to-end robotics intelligence research.
            </p>
          </div>
        </motion.div>

        {/* ── Row 1: Eastworld + H100 (col-span-3 each) ── */}
        <div className="grid grid-cols-6 gap-2.5 mb-2.5">
          {CARDS.slice(0, 2).map((card, idx) => (
            <Card key={card.ref} card={card} i={idx}
              isHovered={hovered === idx}
              wmOp={wmOpacity[idx]}
              onEnter={() => enter(idx, card.highlight)}
              onLeave={() => leave(idx)}
              isInView={isInView}
            />
          ))}
        </div>

        {/* ── Row 2: PhD(2) + Pipeline(2) + G1(2) ── */}
        <div className="grid grid-cols-6 gap-2.5 mb-2.5">
          {CARDS.slice(2, 5).map((card, idx) => {
            const i = idx + 2
            return (
              <Card key={card.ref} card={card} i={i}
                isHovered={hovered === i}
                wmOp={wmOpacity[i]}
                onEnter={() => enter(i, card.highlight)}
                onLeave={() => leave(i)}
                isInView={isInView}
              />
            )
          })}
        </div>

        {/* ── Row 3: Lab Space(2) + Index panel(4) ── */}
        <div className="grid grid-cols-6 gap-2.5">
          {/* Lab Space */}
          <Card card={CARDS[5]} i={5}
            isHovered={hovered === 5}
            wmOp={wmOpacity[5]}
            onEnter={() => enter(5, CARDS[5].highlight)}
            onLeave={() => leave(5)}
            isInView={isInView}
          />

        </div>

      </div>
    </section>
  )
}

// ── Individual card ───────────────────────────────────────────────────────────

interface CardProps {
  card:      Res
  i:         number
  isHovered: boolean
  wmOp:      number
  onEnter:   () => void
  onLeave:   () => void
  isInView:  boolean
}

function Card({ card, i, isHovered, wmOp, onEnter, onLeave, isInView }: CardProps) {
  return (
    <motion.div
      className={`${card.colSpan === 3 ? 'col-span-3' : 'col-span-2'} relative overflow-hidden`}
      initial={{ opacity: 0, scale: 0.88 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.88 }}
      transition={{
        opacity: { duration: 0.52, delay: 0.06 + i * 0.07, ease: [0.22, 1, 0.36, 1] },
        scale:   { duration: 0.58, delay: 0.06 + i * 0.07, ease: [0.22, 1, 0.36, 1] },
      }}
      style={{
        minHeight:            card.minH,
        padding:              '22px 20px 18px',
        cursor:               'default',
        background:           card.glass
          ? isHovered ? 'rgba(255,255,255,0.72)' : 'rgba(255,255,255,0.40)'
          : isHovered ? 'rgba(255,255,255,0.38)' : 'rgba(255,255,255,0.10)',
        backdropFilter:       card.glass ? 'blur(14px)' : 'none',
        WebkitBackdropFilter: card.glass ? 'blur(14px)' : 'none',
        boxShadow:            isHovered
          ? '0 6px 24px rgba(59,130,246,0.07), 0 2px 8px rgba(0,0,0,0.04)'
          : card.glass ? '0 2px 10px rgba(0,0,0,0.04)' : 'none',
        transform:   isHovered ? 'translateY(-2px)' : 'translateY(0)',
        transition:  'background 0.24s, box-shadow 0.24s, transform 0.20s',
        display:     'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        color:       '#1A1A1A',
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {/* Corner markers */}
      <Corners active={isHovered}/>

      {/* SVG watermark */}
      {card.wm && (
        <div style={{ opacity: wmOp, transition: 'opacity 0.4s ease', position: 'absolute', inset: 0, overflow: 'hidden' }}>
          {card.wm}
        </div>
      )}

      {/* Top row: ref index */}
      <div className="flex justify-between items-start mb-5 relative z-10">
        <div/>
        <div className="text-right">
          <span className="font-mono text-[10px] tracking-wider"
            style={{ color: isHovered ? 'rgba(59,130,246,0.48)' : 'rgba(26,26,26,0.20)', transition: 'color 0.22s' }}>
            {card.ref}
          </span>
          <span className="font-mono text-[7px] block mt-0.5 tracking-wider"
            style={{ color: '#3B82F6', opacity: isHovered ? 0.75 : 0, transition: 'opacity 0.20s' }}>
            ● ACTIVE
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="relative z-10 flex-1 flex flex-col justify-end">
        <p className="font-mono text-[8px] tracking-[0.16em] uppercase mb-2"
          style={{ color: 'rgba(26,26,26,0.32)' }}>
          {card.title}
        </p>

        <h3 className="text-xl font-bold leading-tight mb-1.5"
          style={{ color: '#1A1A1A', letterSpacing: '-0.02em' }}>
          {card.metric}
        </h3>

        <p className="text-sm font-light leading-relaxed"
          style={{ color: 'rgba(26,26,26,0.60)' }}>
          {card.desc}
        </p>

        {/* Data stream */}
        <DataStream active={isHovered}/>
      </div>

      {/* LOOP link */}
      {card.highlight && (
        <div className="relative z-10 flex items-center gap-1 mt-3"
          style={{ opacity: isHovered ? 0.60 : 0.18, transition: 'opacity 0.22s' }}>
          <div style={{ width: 10, height: 1, background: '#3B82F6', borderRadius: 1 }}/>
          <span className="font-mono text-[7px] tracking-wider" style={{ color: '#3B82F6' }}>
            LOOP ↑
          </span>
        </div>
      )}
    </motion.div>
  )
}

