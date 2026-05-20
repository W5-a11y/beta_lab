import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Types ──────────────────────────────────────────────────────────────────────

type Phase = 'loading' | 'lines' | 'slogan' | 'idle' | 'exiting'

// ── Slogan words for staggered blur animation ─────────────────────────────────

const SLOGAN_LINES = [
  'Building the Data-to-Deployment',
  'Pipeline for Embodied Intelligence.',
]

// ── Custom cursor ─────────────────────────────────────────────────────────────

function CrosshairCursor({ visible }: { visible: boolean }) {
  const [pos, setPos] = useState({ x: -999, y: -999 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.4 }}
          style={{
            position:      'fixed',
            left:          pos.x,
            top:           pos.y,
            pointerEvents: 'none',
            zIndex:        200,
            transform:     'translate(-50%, -50%)',
          }}
        >
          {/* Outer ring */}
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="16" stroke="#1E3A8A" strokeWidth="0.8" strokeOpacity="0.6"/>
            {/* Crosshair lines */}
            <line x1="20" y1="2"  x2="20" y2="10" stroke="#1E3A8A" strokeWidth="0.8" strokeOpacity="0.6"/>
            <line x1="20" y1="30" x2="20" y2="38" stroke="#1E3A8A" strokeWidth="0.8" strokeOpacity="0.6"/>
            <line x1="2"  y1="20" x2="10" y2="20" stroke="#1E3A8A" strokeWidth="0.8" strokeOpacity="0.6"/>
            <line x1="30" y1="20" x2="38" y2="20" stroke="#1E3A8A" strokeWidth="0.8" strokeOpacity="0.6"/>
            {/* Center dot */}
            <circle cx="20" cy="20" r="1.5" fill="#1E3A8A" fillOpacity="0.7"/>
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ── Guide lines burst ─────────────────────────────────────────────────────────

function GuideLines({ visible }: { visible: boolean }) {
  const LINE_LEN = Math.max(window.innerWidth, window.innerHeight) * 0.6

  const lines = [
    // horizontal left
    { x1: 0, y1: 0, x2: -LINE_LEN, y2: 0, label: 'X: −0.60', labelX: -LINE_LEN + 8, labelY: -8 },
    // horizontal right
    { x1: 0, y1: 0, x2: LINE_LEN,  y2: 0, label: 'X: +0.60', labelX: LINE_LEN - 58,  labelY: -8 },
    // vertical up
    { x1: 0, y1: 0, x2: 0, y2: -LINE_LEN, label: 'Y: −0.60', labelX: 6, labelY: -LINE_LEN + 20 },
    // vertical down
    { x1: 0, y1: 0, x2: 0, y2: LINE_LEN,  label: 'Y: +0.60', labelX: 6, labelY: LINE_LEN - 8 },
  ]

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, delay: 0.3 } }}
          transition={{ duration: 0.1 }}
        >
          <svg
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}
            viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`}
            preserveAspectRatio="none"
          >
            <g transform={`translate(${window.innerWidth / 2}, ${window.innerHeight / 2})`}>
              {lines.map((l, i) => (
                <g key={i}>
                  <motion.line
                    x1={0} y1={0}
                    x2={l.x2} y2={l.y2}
                    stroke="#1A1A1A"
                    strokeWidth="0.6"
                    strokeOpacity="0.22"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    exit={{ pathLength: 0, transition: { duration: 0.3 } }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <motion.text
                    x={l.labelX} y={l.labelY}
                    fontFamily="'Roboto Mono',monospace"
                    fontSize="8"
                    fill="#1A1A1A"
                    fillOpacity="0.35"
                    letterSpacing="0.08em"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, delay: 0.45 }}
                  >
                    {l.label}
                  </motion.text>
                </g>
              ))}
              {/* Center tick */}
              <line x1="-12" y1="0" x2="12" y2="0" stroke="#1E3A8A" strokeWidth="0.8" strokeOpacity="0.4"/>
              <line x1="0" y1="-12" x2="0" y2="12" stroke="#1E3A8A" strokeWidth="0.8" strokeOpacity="0.4"/>
            </g>
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

interface OpeningProps { onEnter: () => void }

export default function Opening({ onEnter }: OpeningProps) {
  const [phase,   setPhase]   = useState<Phase>('loading')
  const [pct,     setPct]     = useState(0)
  const [exiting, setExiting] = useState(false)
  const didEnter = useRef(false)

  // Phase sequence — auto-driven by timers
  useEffect(() => {
    // Phase 1: count 0→100 over 1100ms
    let frame: number
    const start = performance.now()
    const duration = 1100

    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      setPct(Math.round(progress * 100))
      if (progress < 1) {
        frame = requestAnimationFrame(tick)
      } else {
        // Phase 2: guide lines
        setPhase('lines')
        setTimeout(() => {
          // Phase 3: slogan
          setPhase('slogan')
          setTimeout(() => {
            // Phase idle: wait for user
            setPhase('idle')
          }, 1600)
        }, 800)
      }
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  const enter = useCallback(() => {
    if (didEnter.current) return
    didEnter.current = true
    setExiting(true)
    setPhase('exiting')
    setTimeout(onEnter, 650)
  }, [onEnter])

  // Scroll / key listeners active during idle
  useEffect(() => {
    if (phase !== 'idle') return
    const onScroll = () => enter()
    const onKey    = (e: KeyboardEvent) => { if (e.key === ' ' || e.key === 'Enter') enter() }
    window.addEventListener('wheel',     onScroll, { passive: true, once: true })
    window.addEventListener('touchmove', onScroll, { passive: true, once: true })
    window.addEventListener('keydown',   onKey,    { once: true })
    return () => {
      window.removeEventListener('wheel',     onScroll)
      window.removeEventListener('touchmove', onScroll)
      window.removeEventListener('keydown',   onKey)
    }
  }, [phase, enter])

  return (
    <>
      {/* Custom crosshair cursor — only during idle */}
      <CrosshairCursor visible={phase === 'idle' && !exiting} />

      <motion.div
        onClick={phase === 'idle' ? enter : undefined}
        style={{
          position:       'fixed',
          inset:          0,
          zIndex:         100,
          background:     '#F7F7F2',
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          justifyContent: 'center',
          userSelect:     'none',
          cursor:         phase === 'idle' ? 'none' : 'default',
        }}
        animate={exiting ? { opacity: 0, scale: 1.04 } : { opacity: 1 }}
        transition={{ duration: 0.65, ease: [0.4, 0, 1, 1] }}
      >
        {/* Very faint dot grid */}
        <div style={{
          position:        'absolute',
          inset:           0,
          pointerEvents:   'none',
          backgroundImage: 'radial-gradient(circle, rgba(26,26,26,0.07) 1px, transparent 1px)',
          backgroundSize:  '36px 36px',
        }}/>

        {/* Guide lines (phase 2) */}
        <GuideLines visible={phase === 'lines'} />

        {/* ── Center content ── */}
        <div style={{
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          gap:            0,
          position:       'relative',
          zIndex:         10,
        }}>

          {/* Phase 1: Loading dot + percentage */}
          <AnimatePresence>
            {(phase === 'loading' || phase === 'lines') && (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -8, transition: { duration: 0.3 } }}
                transition={{ duration: 0.3 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}
              >
                {/* Pulsing dot */}
                <motion.div
                  animate={{
                    scale:   [1, 1.35, 1],
                    opacity: [0.7, 1, 0.7],
                    boxShadow: [
                      '0 0 0px 0px rgba(59,130,246,0)',
                      '0 0 18px 6px rgba(59,130,246,0.28)',
                      '0 0 0px 0px rgba(59,130,246,0)',
                    ],
                  }}
                  transition={{ duration: 0.85, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    width:        10,
                    height:       10,
                    borderRadius: '50%',
                    background:   '#3B82F6',
                  }}
                />

                {/* Percentage */}
                <motion.span
                  style={{
                    fontFamily:    "'Roboto Mono','JetBrains Mono',monospace",
                    fontSize:      13,
                    fontWeight:    600,
                    letterSpacing: '0.22em',
                    color:         'rgba(26,26,26,0.55)',
                    display:       'block',
                    width:         52,
                    textAlign:     'center' as const,
                  }}
                >
                  {String(pct).padStart(2, '0')}%
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Phase 3+: Slogan — word-by-word blur-in */}
          <AnimatePresence>
            {(phase === 'slogan' || phase === 'idle' || phase === 'exiting') && (
              <motion.div
                key="slogan"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  display:       'flex',
                  flexDirection: 'column',
                  alignItems:    'center',
                  gap:           6,
                  textAlign:     'center' as const,
                }}
              >
                {SLOGAN_LINES.map((line, li) => {
                  const words = line.split(' ')
                  return (
                    <div key={li} style={{ display: 'flex', gap: '0.28em', flexWrap: 'wrap', justifyContent: 'center' }}>
                      {words.map((word, wi) => (
                        <motion.span
                          key={wi}
                          initial={{ opacity: 0, filter: 'blur(10px)', y: 10 }}
                          animate={{ opacity: 1, filter: 'blur(0px)',  y: 0  }}
                          transition={{
                            duration: 0.55,
                            delay:    li * 0.22 + wi * 0.07,
                            ease:     [0.22, 1, 0.36, 1],
                          }}
                          style={{
                            fontFamily:    "Inter,'Helvetica Neue',system-ui,sans-serif",
                            fontSize:      'clamp(18px, 3vw, 28px)',
                            fontWeight:    700,
                            letterSpacing: '-0.01em',
                            color:         '#1A1A1A',
                            lineHeight:    1.3,
                            display:       'inline-block',
                          }}
                        >
                          {word}
                        </motion.span>
                      ))}
                    </div>
                  )
                })}

                {/* Sub-label */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                  style={{
                    fontFamily:    "'Roboto Mono',monospace",
                    fontSize:      10,
                    letterSpacing: '0.20em',
                    color:         'rgba(26,26,26,0.32)',
                    marginTop:     14,
                    textTransform: 'uppercase' as const,
                  }}
                >
                  BETA Robotics Lab · Berkeley &amp; Stanford
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Bottom prompt (idle only) ── */}
        <AnimatePresence>
          {phase === 'idle' && (
            <motion.div
              key="prompt"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position:       'absolute',
                bottom:         56,
                display:        'flex',
                flexDirection:  'column',
                alignItems:     'center',
                gap:            14,
              }}
            >
              <p style={{
                fontFamily:    "'Roboto Mono',monospace",
                fontSize:      8,
                letterSpacing: '0.30em',
                color:         'rgba(26,26,26,0.28)',
                textTransform: 'uppercase' as const,
                margin:        0,
              }}>
                Check BETA — Click or Scroll
              </p>

              {/* Animated chevron */}
              <motion.svg
                width="16" height="10" viewBox="0 0 16 10" fill="none"
                animate={{ y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
              >
                <path d="M1 1L8 9L15 1"
                  stroke="rgba(26,26,26,0.22)" strokeWidth="1"
                  strokeLinecap="round" strokeLinejoin="round"
                />
              </motion.svg>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Corner engineering marks */}
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.12 }}
          viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`}
          preserveAspectRatio="none"
        >
          {/* Four corner marks */}
          {([
            [32, 32],
            [window.innerWidth - 32, 32],
            [32, window.innerHeight - 32],
            [window.innerWidth - 32, window.innerHeight - 32],
          ] as [number, number][]).map(([x, y], i) => (
            <g key={i}>
              <line x1={x - 8} y1={y} x2={x + 8} y2={y} stroke="#1A1A1A" strokeWidth="0.8"/>
              <line x1={x} y1={y - 8} x2={x} y2={y + 8} stroke="#1A1A1A" strokeWidth="0.8"/>
            </g>
          ))}
        </svg>
      </motion.div>
    </>
  )
}
