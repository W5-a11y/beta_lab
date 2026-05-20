import { useEffect, useRef, useState, useCallback } from 'react'

// ── Terminal typewriter title ─────────────────────────────────────────────────
//
//  Segments (rendered left-to-right, line-break after seg 0):
//   0  "Building the "        — dark grey
//   1  "Data-to-Deployment"   — blue, mono
//   2  " Loop"                — dark grey
//   3  "\n"                   — line break (virtual)
//   4  "for "                 — dark grey
//   5  "Embodied AI"          — dark grey + squiggle underline
//
//  Typing logic:
//   - Each char in each segment is revealed one at a time
//   - Random jitter ±18 ms around a base interval
//   - 220 ms pause after segment 2 (end of line 1) before line 2 begins

const SEGMENTS = [
  { text: 'Building the ',     color: '#1A1A1A', mono: false, squiggle: false },
  { text: 'Data-to-Deployment',color: '#2563EB', mono: true,  squiggle: false },
  { text: ' Loop',             color: '#1A1A1A', mono: false, squiggle: false },
  { text: '\n',                color: '',        mono: false, squiggle: false }, // line-break sentinel
  { text: 'for ',              color: '#1A1A1A', mono: false, squiggle: false },
  { text: 'Embodied AI',       color: '#1A1A1A', mono: true,  squiggle: true  },
] as const

// Flatten into { char, segIdx }
const CHARS = SEGMENTS.flatMap((seg, si) =>
  seg.text === '\n'
    ? [{ char: '\n', si }]
    : [...seg.text].map(char => ({ char, si }))
)

// Total typed chars (excluding the newline sentinel)
const TOTAL = CHARS.filter(c => c.char !== '\n').length

// Pause after which typed-index (= end of " Loop" on line 1)
const LINE1_END = SEGMENTS.slice(0, 3).reduce((s, g) => s + g.text.length, 0)

function TerminalTitle({ started }: { started: boolean }) {
  const [typed, setTyped] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const scheduleNext = useCallback((current: number) => {
    // How many real chars typed so far (newline doesn't count)
    const realSoFar = CHARS.slice(0, current).filter(c => c.char !== '\n').length
    const pauseHere = realSoFar === LINE1_END
    const base       = pauseHere ? 220 : 42
    const jitter     = pauseHere ? 0   : Math.random() * 36 - 18
    timerRef.current = setTimeout(() => {
      setTyped(t => {
        const next = t + 1
        if (next < CHARS.length) scheduleNext(next)
        return next
      })
    }, base + jitter)
  }, [])

  useEffect(() => {
    if (!started) return
    scheduleNext(0)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [started, scheduleNext])

  // Build rendered spans from CHARS[0..typed)
  // Group consecutive chars in the same segment
  const visible = CHARS.slice(0, typed)
  const isDone  = typed >= CHARS.length

  // Split at newline into two lines
  const nlIdx = visible.findIndex(c => c.char === '\n')
  const line1Chars = nlIdx === -1 ? visible : visible.slice(0, nlIdx)
  const line2Chars = nlIdx === -1 ? []       : visible.slice(nlIdx + 1)

  const renderLine = (chars: typeof visible) => {
    const groups: { si: number; text: string }[] = []
    for (const { char, si } of chars) {
      if (groups.length && groups[groups.length - 1].si === si) {
        groups[groups.length - 1].text += char
      } else {
        groups.push({ si, text: char })
      }
    }
    return groups.map(({ si, text }, gi) => {
      const seg = SEGMENTS[si]
      return (
        <span key={`${si}-${gi}`} style={{
          color:      seg.color || '#1A1A1A',
          fontFamily: seg.mono
            ? "'JetBrains Mono','Roboto Mono',monospace"
            : 'inherit',
          fontWeight: seg.mono ? 700 : 'inherit',
          position:   'relative',
          display:    'inline',
        }}>
          {text}
          {seg.squiggle && text.length > 0 && (
            <span style={{
              position:   'absolute',
              left: 0, right: 0, bottom: -3,
              height: 2,
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='6' height='2'%3E%3Cpath d='M0 1.5 C1 0.5 2 0.5 3 1.5 S5 2.5 6 1.5' stroke='%232563EB' stroke-width='0.7' fill='none' opacity='0.55'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat-x',
              backgroundSize:   '6px 2px',
              pointerEvents:    'none',
            }}/>
          )}
        </span>
      )
    })
  }

  return (
    <h1 style={{
      fontSize:      'clamp(36px, 5vw, 58px)',
      fontWeight:    800,
      lineHeight:    1.15,
      letterSpacing: '-0.03em',
      color:         '#1A1A1A',
      margin:        0,
      fontFamily:    'Inter,system-ui,sans-serif',
    }}>
      {/* Prompt prefix — always visible */}
      <span style={{
        fontFamily:    "'JetBrains Mono','Roboto Mono',monospace",
        fontSize:      '0.72em',
        color:         '#2563EB',
        fontWeight:    700,
        userSelect:    'none',
        marginRight:   '0.25em',
        verticalAlign: 'baseline',
        opacity:       started ? 1 : 0,
        transition:    'opacity 0.3s',
      }}>
        &gt;
      </span>

      {/* Line 1 */}
      {renderLine(line1Chars)}

      {/* Line break — only rendered once newline sentinel reached */}
      {nlIdx !== -1 && <br/>}

      {/* Indent to align line 2 under line 1 (account for "> " prefix) */}
      {nlIdx !== -1 && (
        <span style={{
          display:    'inline-block',
          width:      '1.82em',   // matches "> " prefix width
          userSelect: 'none',
          color:      'transparent',
        }}>
          &gt;&nbsp;
        </span>
      )}

      {/* Line 2 */}
      {renderLine(line2Chars)}

      {/* Block cursor */}
      <span style={{
        display:         'inline-block',
        width:           '0.55em',
        height:          '0.9em',
        background:      '#2563EB',
        marginLeft:      3,
        verticalAlign:   'text-bottom',
        borderRadius:    1,
        opacity:         isDone ? undefined : 1,
        animation:       isDone ? 'cursor-blink 1s step-start infinite' : 'none',
        transition:      'opacity 0.1s',
      }}/>

      <style>{`
        @keyframes cursor-blink {
          0%, 100% { opacity: 1 }
          50%       { opacity: 0 }
        }
      `}</style>
    </h1>
  )
}

// ── KPI counter hook ──────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1200, started: boolean) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!started) return
    let start: number | null = null
    const step = (ts: number) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setVal(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [started, target, duration])
  return val
}

interface KpiProps {
  val: string; label: string; delay: number; started: boolean
  numericTarget?: number; suffix?: string
}
function KpiItem({ val, label, delay, started, numericTarget, suffix = '' }: KpiProps) {
  const counted = useCountUp(numericTarget ?? 0, 1400, started && !!numericTarget)
  const display = numericTarget
    ? (numericTarget >= 1000 ? counted.toLocaleString() + suffix : counted + suffix)
    : val
  return (
    <div style={{
      opacity: started ? 1 : 0,
      transform: started ? 'translateY(0)' : 'translateY(10px)',
      transition: `opacity 0.5s ${delay}ms ease-out, transform 0.5s ${delay}ms ease-out`,
      display: 'flex', flexDirection: 'column', gap: 4,
    }}>
      <span style={{ fontSize: 20, fontWeight: 700, color: '#1A1A1A', fontVariantNumeric: 'tabular-nums' }}>
        {display}
      </span>
      <span style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', fontFamily: 'monospace', color: 'rgba(26,26,26,0.4)' }}>
        {label}
      </span>
    </div>
  )
}

// ── Hero ──────────────────────────────────────────────────────────────────────
export default function Hero() {
  const [kpiStarted, setKpiStarted] = useState(false)
  const kpiRef   = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // KPI trigger
  useEffect(() => {
    const el = kpiRef.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setKpiStarted(true); obs.disconnect() }
    }, { threshold: 0.4 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: '#F7F7F2',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        paddingTop: 56,
      }}
    >
      {/* Subtle paper texture vignette */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 90% 80% at 62% 50%, transparent 40%, rgba(240,239,232,0.6) 100%)',
      }}/>

      <div style={{
        position: 'relative', zIndex: 2,
        maxWidth: 1200, margin: '0 auto', padding: '80px 40px',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 40,
        alignItems: 'center',
      }}
      className="grid-cols-1 lg:grid-cols-2"
      >

        {/* ── LEFT: Text ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

          {/* Status badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#2563EB', flexShrink: 0,
              boxShadow: '0 0 0 3px rgba(37,99,235,0.15)',
            }}/>
            <span style={{
              fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase',
              fontFamily: 'monospace', color: '#2563EB', fontWeight: 600,
            }}>
              EST. 2024 · Berkeley, CA
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(36px, 5vw, 58px)',
            fontWeight: 800, lineHeight: 1.1,
            letterSpacing: '-0.03em', color: '#1A1A1A', margin: 0,
          }}>
            Building the{' '}
            <span style={{ color: '#2563EB' }}>Data-to-Deployment</span>
            <br />Loop for Embodied AI
          </h1>

          {/* Sub */}
          <p style={{
            fontSize: 16, lineHeight: 1.75, maxWidth: 440,
            color: 'rgba(26,26,26,0.6)', margin: 0,
          }}>
            BETA Robotics Lab connects industry-grade robot data,{' '}
            <strong style={{ color: '#1A1A1A', fontWeight: 600 }}>automated annotation</strong>,{' '}
            world model training, VLA policy evaluation, and{' '}
            <strong style={{ color: '#1A1A1A', fontWeight: 600 }}>real-world humanoid deployment</strong>.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, paddingTop: 4 }}>
            {/* Primary — solid dark */}
            <a
              href="https://betaucb.org/"
              target="_blank" rel="noopener noreferrer"
              style={{
                padding: '12px 26px', fontSize: 13, fontFamily: 'monospace',
                fontWeight: 600, letterSpacing: '0.08em',
                color: '#F7F7F2', background: '#1A1A1A',
                border: 'none', borderRadius: 3, textDecoration: 'none',
                display: 'inline-block',
                transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                boxShadow: '0 2px 12px rgba(26,26,26,0.18)',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.transform = 'translateY(-2px) scale(1.02)'
                el.style.boxShadow = '0 6px 24px rgba(26,26,26,0.22)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.transform = 'translateY(0) scale(1)'
                el.style.boxShadow = '0 2px 12px rgba(26,26,26,0.18)'
              }}
            >
              Check BETA →
            </a>

            {/* Secondary — outline */}
            <a
              href="#contact"
              style={{
                padding: '12px 26px', fontSize: 13, fontFamily: 'monospace',
                fontWeight: 600, letterSpacing: '0.08em',
                color: '#1A1A1A', background: 'transparent',
                border: '1px solid rgba(26,26,26,0.25)', borderRadius: 3,
                textDecoration: 'none', display: 'inline-block',
                transition: 'border-color 0.18s, transform 0.18s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'rgba(26,26,26,0.6)'
                el.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'rgba(26,26,26,0.25)'
                el.style.transform = 'translateY(0)'
              }}
            >
              Contact Us →
            </a>
          </div>

          {/* KPI strip */}
          <div ref={kpiRef} style={{
            display: 'flex', gap: 32, paddingTop: 20,
            borderTop: '1px solid rgba(26,26,26,0.08)', marginTop: 4,
          }}>
            <KpiItem val="1,000h+" label="12-Month Dataset Target"   delay={0}   started={kpiStarted} numericTarget={1000} suffix="h+" />
            <KpiItem val="80%↓"   label="Annotation Cost Reduction" delay={120} started={kpiStarted} numericTarget={80}   suffix="%↓" />
            <KpiItem val="G1"     label="Real-World Deployment"      delay={240} started={kpiStarted} />
            <KpiItem val="H100"   label="Training Cluster"           delay={360} started={kpiStarted} />
          </div>
        </div>

        {/* ── RIGHT: Particle video sphere ── */}
        <div style={{
          position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          minHeight: 520,
        }}>
          {/* Video container — bleeds right on desktop */}
          <div style={{
            position: 'relative',
            width: '195%',
            maxWidth: 1100,
            marginRight: '-45%',
            borderRadius: 8,
            overflow: 'hidden',
          }}>
            <video
              ref={videoRef}
              src="/planet_remix_scene.mp4"
              autoPlay muted loop playsInline
              style={{
                width: '100%',
                display: 'block',
                // mix-blend-mode multiply makes black bg invisible on cream
                mixBlendMode: 'multiply',
                // Slight contrast boost so particles stay vivid
                filter: 'contrast(1.1) brightness(0.92)',
              }}
            />

            {/* Bottom fade — cream gradient mask */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: '38%',
              background: 'linear-gradient(to bottom, transparent, #F7F7F2)',
              pointerEvents: 'none',
            }}/>
            {/* Right fade */}
            <div style={{
              position: 'absolute', top: 0, right: 0, bottom: 0, width: '25%',
              background: 'linear-gradient(to right, transparent, #F7F7F2)',
              pointerEvents: 'none',
            }}/>
            {/* Left fade */}
            <div style={{
              position: 'absolute', top: 0, left: 0, bottom: 0, width: '12%',
              background: 'linear-gradient(to left, transparent, #F7F7F2)',
              pointerEvents: 'none',
            }}/>
            {/* Top fade */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '20%',
              background: 'linear-gradient(to top, transparent, #F7F7F2)',
              pointerEvents: 'none',
            }}/>
          </div>

        </div>
      </div>

      {/* Bottom fade to next section */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 120,
        background: 'linear-gradient(to bottom, transparent, #F7F7F2)',
        pointerEvents: 'none', zIndex: 3,
      }}/>
    </section>
  )
}
