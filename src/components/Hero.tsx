import { useEffect, useRef, useState } from 'react'

// ── Typing headline segments ──────────────────────────────────────────────────
const HEADLINE_SEGMENTS = [
  { text: 'Building the ',        color: '#1A1A1A',  blue: false },
  { text: 'Data-to-Deployment',   color: '#2563EB',  blue: true  },
  { text: '\nLoop for Embodied AI', color: '#1A1A1A', blue: false },
]
const FULL_TEXT = HEADLINE_SEGMENTS.map(s => s.text).join('')

function useTyping(started: boolean, speed = 38) {
  const [count, setCount] = useState(0)
  const [done, setDone] = useState(false)
  useEffect(() => {
    if (!started) return
    if (count >= FULL_TEXT.length) { setDone(true); return }
    const t = setTimeout(() => setCount(c => c + 1), speed)
    return () => clearTimeout(t)
  }, [started, count, speed])
  return { count, done }
}

function TypingHeadline({ started }: { started: boolean }) {
  const { count, done } = useTyping(started)
  let rendered = 0
  const parts = HEADLINE_SEGMENTS.map((seg, i) => {
    const segStart = rendered
    const segEnd   = rendered + seg.text.length
    rendered       = segEnd
    const visible  = seg.text.slice(0, Math.max(0, count - segStart))
    if (!visible) return null
    const lines = visible.split('\n')
    return lines.map((line, li) => (
      <span key={`${i}-${li}`}>
        {li > 0 && <br />}
        <span style={{ color: seg.color }}>{line}</span>
      </span>
    ))
  })
  return (
    <>
      {parts}
      {/* Blinking cursor */}
      <span style={{
        display: 'inline-block',
        width: 3, height: '0.85em',
        background: '#2563EB',
        marginLeft: 4,
        verticalAlign: 'middle',
        borderRadius: 1,
        animation: done ? 'betaCursorBlink 1.1s step-start infinite' : 'none',
        opacity: done ? 1 : 1,
      }} />
    </>
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
  const [kpiStarted,    setKpiStarted]    = useState(false)
  const [typingStarted, setTypingStarted] = useState(false)
  const [isMobile,      setIsMobile]      = useState(false)
  const kpiRef    = useRef<HTMLDivElement>(null)
  const heroRef   = useRef<HTMLDivElement>(null)
  const videoRef  = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Start typing when hero enters view
  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTypingStarted(true); obs.disconnect() }
    }, { threshold: 0.2 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

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
      ref={heroRef}
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

      {/* Mobile: full-screen background video */}
      {isMobile && (
        <>
          <video
            src="/planet_remix_scene.mp4"
            autoPlay muted loop playsInline
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 60%',
              mixBlendMode: 'multiply',
              filter: 'contrast(1.2) brightness(0.85) saturate(1.1)',
              zIndex: 0,
            }}
          />
          {/* Gradient overlay: opaque cream at top for text, open in center for sphere */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
            background: `
              linear-gradient(
                to bottom,
                rgba(247,247,242,0.72) 0%,
                rgba(247,247,242,0.20) 45%,
                rgba(247,247,242,0.20) 68%,
                rgba(247,247,242,0.80) 100%
              )
            `,
          }}/>
        </>
      )}

      <div style={{
        position: 'relative', zIndex: 2,
        maxWidth: 1200, margin: '0 auto',
        padding: isMobile ? '48px 28px 56px' : '80px 40px',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? 0 : 40,
        alignItems: 'center',
      }}>

        {/* ── LEFT: Text ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

          {/* Status badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#2563EB', flexShrink: 0,
              boxShadow: '0 0 0 3px rgba(37,99,235,0.15)',
              animation: 'betaDotPulse 2.4s ease-in-out infinite',
            }}/>
            <span style={{
              fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase',
              fontFamily: 'monospace', color: '#2563EB', fontWeight: 600,
            }}>
              EST. 2024 · Berkeley, CA
            </span>
          </div>

          {/* Headline — typing effect */}
          <h1 style={{
            fontSize: isMobile ? 'clamp(30px, 8vw, 42px)' : 'clamp(36px, 5vw, 58px)',
            fontWeight: 800, lineHeight: 1.1,
            letterSpacing: '-0.03em', color: '#1A1A1A', margin: 0,
            minHeight: isMobile ? undefined : '2.3em',
          }}>
            <TypingHeadline started={typingStarted} />
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
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, auto)',
            gap: isMobile ? '20px 0' : undefined,
            columnGap: isMobile ? 0 : 32,
            rowGap: isMobile ? 20 : 0,
            paddingTop: 20,
            borderTop: '1px solid rgba(26,26,26,0.08)',
            marginTop: 4,
          }}>
            <KpiItem val="1,000h+" label="12-Month Dataset Target"   delay={0}   started={kpiStarted} numericTarget={1000} suffix="h+" />
            <KpiItem val="80%↓"   label="Annotation Cost Reduction" delay={120} started={kpiStarted} numericTarget={80}   suffix="%↓" />
            <KpiItem val="G1"     label="Real-World Deployment"      delay={240} started={kpiStarted} />
            <KpiItem val="H100"   label="Training Cluster"           delay={360} started={kpiStarted} />
          </div>
        </div>

        {/* ── RIGHT: Particle video sphere (desktop only) ── */}
        {!isMobile && (
          /* Desktop: bleeds right */
          <div style={{
            position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
            minHeight: 520,
          }}>
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
                  mixBlendMode: 'multiply',
                  filter: 'contrast(1.1) brightness(0.92)',
                }}
              />
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '38%',
                background: 'linear-gradient(to bottom, transparent, #F7F7F2)',
                pointerEvents: 'none',
              }}/>
              <div style={{
                position: 'absolute', top: 0, right: 0, bottom: 0, width: '25%',
                background: 'linear-gradient(to right, transparent, #F7F7F2)',
                pointerEvents: 'none',
              }}/>
              <div style={{
                position: 'absolute', top: 0, left: 0, bottom: 0, width: '12%',
                background: 'linear-gradient(to left, transparent, #F7F7F2)',
                pointerEvents: 'none',
              }}/>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '20%',
                background: 'linear-gradient(to top, transparent, #F7F7F2)',
                pointerEvents: 'none',
              }}/>
            </div>
          </div>
        )}
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
