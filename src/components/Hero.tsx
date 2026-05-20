import { useEffect, useRef, useState } from 'react'
import RobotBlueprint from './RobotBlueprint'

// ── KPI counter hook ──────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1200, started: boolean) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!started) return
    let start: number | null = null
    const step = (ts: number) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setVal(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [started, target, duration])
  return val
}

// ── Animated KPI item ─────────────────────────────────────────────────────────
interface KpiProps {
  val: string; label: string; delay: number; started: boolean
  numericTarget?: number; suffix?: string
}

function KpiItem({ val, label, delay, started, numericTarget, suffix = '' }: KpiProps) {
  const counted = useCountUp(numericTarget ?? 0, 1400, started && !!numericTarget)
  const display = numericTarget
    ? (numericTarget >= 1000
        ? counted.toLocaleString() + suffix
        : counted + suffix)
    : val

  return (
    <div
      className="flex flex-col gap-1.5"
      style={{
        opacity: started ? 1 : 0,
        transform: started ? 'translateY(0)' : 'translateY(12px)',
        transition: `opacity 0.5s ${delay}ms ease-out, transform 0.5s ${delay}ms ease-out`,
      }}
    >
      <span className="text-xl font-bold text-white" style={{
        fontVariantNumeric: 'tabular-nums',
        transition: 'color 0.2s',
      }}>
        {display}
      </span>
      <span
        className="text-[9px] tracking-[0.25em] uppercase font-mono"
        style={{ color: 'rgba(255,255,255,0.5)' }}
      >
        {label}
      </span>
    </div>
  )
}

export default function Hero() {
  const [kpiStarted, setKpiStarted] = useState(false)
  const kpiRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = kpiRef.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setKpiStarted(true); obs.disconnect() }
    }, { threshold: 0.4 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="hero" className="relative min-h-screen grid-bg flex items-center overflow-hidden pt-20">

      {/* Deep blue glow — top-right */}
      <div
        className="absolute -top-60 -right-60 w-[900px] h-[900px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0,50,98,0.28) 0%, transparent 65%)',
          filter: 'blur(90px)',
        }}
      />

      {/* Deep blue glow — bottom-left */}
      <div
        className="absolute -bottom-60 -left-60 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0,50,98,0.22) 0%, transparent 65%)',
          filter: 'blur(100px)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-20">

        {/* LEFT — Text */}
        <div className="flex flex-col gap-8">

          {/* Status badge */}
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: '#3B82F6' }}
            />
            <span className="text-xs tracking-[0.2em] uppercase font-mono glow-blue-text">
              EST. 2024 · Berkeley, CA
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-white">
            Building the{' '}
            <span style={{ color: '#3B82F6' }}>Data-to-Deployment</span>
            <br />
            Loop for Embodied AI
          </h1>

          {/* Subheadline */}
          <p className="text-base lg:text-lg leading-relaxed max-w-md" style={{ color: 'rgba(255,255,255,0.6)' }}>
            BETA Robotics Lab connects industry-grade robot data,{' '}
            <span className="text-white/80 font-medium">automated annotation</span>,{' '}
            world model training,{' '}
            VLA policy evaluation, and{' '}
            <span className="text-white/80 font-medium">real-world humanoid deployment</span>.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-5 pt-2">
            {/* Primary — blue glow */}
            <a
              href="https://betaucb.org/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                position: 'relative',
                padding: '11px 24px',
                fontSize: 13,
                fontFamily: 'monospace',
                fontWeight: 600,
                letterSpacing: '0.08em',
                color: '#3B82F6',
                background: 'rgba(59,130,246,0.08)',
                border: '1px solid rgba(59,130,246,0.5)',
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'box-shadow 0.2s, border-color 0.2s, background 0.2s',
                overflow: 'hidden',
                textDecoration: 'none',
                display: 'inline-block',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget
                el.style.boxShadow = '0 0 18px rgba(59,130,246,0.3), inset 0 0 18px rgba(59,130,246,0.06)'
                el.style.borderColor = 'rgba(59,130,246,0.9)'
                el.style.background = 'rgba(59,130,246,0.13)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget
                el.style.boxShadow = 'none'
                el.style.borderColor = 'rgba(59,130,246,0.5)'
                el.style.background = 'rgba(59,130,246,0.08)'
              }}
            >
              Check BETA →
            </a>

            {/* Secondary — white outline + gold hover glow */}
            <a
              href="#contact"
              style={{
                position: 'relative',
                padding: '11px 24px',
                fontSize: 13,
                fontFamily: 'monospace',
                fontWeight: 600,
                letterSpacing: '0.08em',
                color: 'rgba(255,255,255,0.6)',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'color 0.2s, border-color 0.2s, box-shadow 0.2s',
                overflow: 'hidden',
                textDecoration: 'none',
                display: 'inline-block',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget
                el.style.color = '#ffffff'
                el.style.borderColor = 'rgba(255,255,255,0.7)'
                el.style.boxShadow = '0 0 20px rgba(212,175,55,0.12), inset 0 0 24px rgba(212,175,55,0.06)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget
                el.style.color = 'rgba(255,255,255,0.6)'
                el.style.borderColor = 'rgba(255,255,255,0.2)'
                el.style.boxShadow = 'none'
              }}
            >
              Contact Us →
            </a>
          </div>

          {/* KPI strip */}
          <div ref={kpiRef} className="flex gap-8 pt-4 border-t border-white/8 mt-2">
            <KpiItem val="1,000h+" label="12-Month Dataset Target"     delay={0}   started={kpiStarted} numericTarget={1000} suffix="h+" />
            <KpiItem val="80%↓"   label="Annotation Cost Reduction"   delay={120} started={kpiStarted} numericTarget={80}   suffix="%↓" />
            <KpiItem val="G1"     label="Real-World Deployment"        delay={240} started={kpiStarted} />
            <KpiItem val="H100"   label="Training & Inference Cluster" delay={360} started={kpiStarted} />
          </div>
        </div>

        {/* RIGHT — Robot Blueprint */}
        <RobotBlueprint />

      </div>
      {/* Bottom gradient fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 160,
        background: 'linear-gradient(to bottom, transparent, #000)',
        pointerEvents: 'none', zIndex: 5,
      }}/>
    </section>
  )
}
