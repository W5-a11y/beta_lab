import { useEffect, useRef, useState } from 'react'

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
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          minHeight: 420,
        }}>
          {/* Video container — bleeds right on desktop */}
          <div style={{
            position: 'relative',
            width: '120%',
            maxWidth: 680,
            marginRight: '-15%',
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

          {/* Floating label */}
          <div style={{
            position: 'absolute', bottom: 24, left: 0,
            fontFamily: 'monospace', fontSize: 9,
            letterSpacing: '0.2em', color: 'rgba(26,26,26,0.3)',
            textTransform: 'uppercase',
          }}>
            EMBODIED_INTELLIGENCE · NEURAL CORE
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
