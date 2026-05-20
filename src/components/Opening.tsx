import { useEffect, useRef, useState, useCallback } from 'react'

// ── Star dust canvas ──────────────────────────────────────────────────────────

interface Dust {
  x: number; y: number
  vx: number; vy: number
  r: number; opacity: number
}

function StarDust() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = window.innerWidth
    let h = window.innerHeight
    canvas.width = w; canvas.height = h

    const COUNT = 55
    const dust: Dust[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.10,
      r: Math.random() < 0.5 ? 0.8 : 1.2,
      opacity: Math.random() * 0.18 + 0.04,
    }))

    let raf: number
    const tick = () => {
      ctx.clearRect(0, 0, w, h)
      for (const d of dust) {
        d.x += d.vx; d.y += d.vy
        if (d.x < 0) d.x = w; if (d.x > w) d.x = 0
        if (d.y < 0) d.y = h; if (d.y > h) d.y = 0
        ctx.fillStyle = `rgba(60,130,220,${d.opacity})`
        ctx.fillRect(Math.round(d.x), Math.round(d.y), d.r, d.r)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const onResize = () => {
      w = window.innerWidth; h = window.innerHeight
      canvas.width = w; canvas.height = h
    }
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [])

  return <canvas ref={canvasRef} style={{
    position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none',
  }}/>
}

// ── Main ──────────────────────────────────────────────────────────────────────

interface OpeningProps { onEnter: () => void }

export default function Opening({ onEnter }: OpeningProps) {
  const [exiting, setExiting]   = useState(false)
  const [burst,   setBurst]     = useState(false)
  const didEnter                = useRef(false)

  const enter = useCallback(() => {
    if (didEnter.current) return
    didEnter.current = true
    setBurst(true)
    setExiting(true)
    setTimeout(onEnter, 700)
  }, [onEnter])

  useEffect(() => {
    const onScroll = () => enter()
    const onKey    = (e: KeyboardEvent) => { if (e.key === ' ' || e.key === 'Enter') enter() }
    window.addEventListener('wheel',     onScroll, { passive: true, once: true })
    window.addEventListener('touchmove', onScroll, { passive: true, once: true })
    window.addEventListener('keydown',   onKey,    { once: true })
    return () => {
      window.removeEventListener('wheel', onScroll)
      window.removeEventListener('touchmove', onScroll)
      window.removeEventListener('keydown', onKey)
    }
  }, [enter])

  return (
    <div
      onClick={enter}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: '#000000',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        cursor: 'default', userSelect: 'none',
        animation: exiting ? 'opening-exit 0.7s cubic-bezier(0.4,0,1,1) forwards' : 'opening-enter 0.9s ease-out both',
      }}
    >
      <style>{`
        @keyframes opening-enter {
          0%   { opacity: 0; filter: blur(12px); }
          100% { opacity: 1; filter: blur(0px); }
        }
        @keyframes opening-exit {
          0%   { opacity: 1; transform: scale(1);   filter: blur(0px); }
          60%  { opacity: 1; transform: scale(1.08); filter: blur(2px); }
          100% { opacity: 0; transform: scale(2.4); filter: blur(20px); }
        }
        @keyframes ring-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes ring-spin-rev {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes line-flow {
          0%   { transform: translateY(-100%); opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { transform: translateY(200%); opacity: 0; }
        }
        @keyframes burst-radial {
          0%   { opacity: 0; transform: scale(0.1); }
          40%  { opacity: 0.55; }
          100% { opacity: 0; transform: scale(3.5); }
        }
        @keyframes text-fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Dot grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}/>

      {/* Star dust */}
      <StarDust />

      {/* Stargate burst flash */}
      {burst && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(circle at 50% 50%, rgba(59,130,246,0.6) 0%, rgba(0,0,0,0) 60%)',
          animation: 'burst-radial 0.6s ease-out forwards',
          zIndex: 10,
        }}/>
      )}

      {/* ── Center identity block ── */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0,
        animation: 'text-fade-in 1.2s 0.3s ease-out both',
      }}>

        {/* Logo with glow rings */}
        <div style={{ position: 'relative', marginBottom: 40 }}>
          {/* Outer slow-rotating ring */}
          <div style={{
            position: 'absolute',
            inset: -20,
            borderRadius: '50%',
            border: '1px solid rgba(59,130,246,0.25)',
            animation: 'ring-spin 18s linear infinite',
          }}>
            {/* Bright tick on ring */}
            <div style={{
              position: 'absolute', top: -2, left: '50%',
              transform: 'translateX(-50%)',
              width: 4, height: 4, borderRadius: '50%',
              background: 'rgba(59,130,246,0.8)',
            }}/>
          </div>

          {/* Inner counter-rotating ring */}
          <div style={{
            position: 'absolute',
            inset: -8,
            borderRadius: '50%',
            border: '1px solid rgba(59,130,246,0.15)',
            animation: 'ring-spin-rev 28s linear infinite',
          }}/>

          {/* Blue backlight */}
          <div style={{
            position: 'absolute', inset: -30,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}/>

          <img
            src="/beta.svg"
            alt="BETA"
            style={{ width: 110, height: 110, display: 'block', position: 'relative', zIndex: 1 }}
          />
        </div>

        {/* BETA wordmark */}
        <h1 style={{
          fontSize: 88,
          fontWeight: 900,
          letterSpacing: '0.18em',
          color: '#ffffff',
          margin: 0,
          lineHeight: 1,
          fontFamily: 'sans-serif',
        }}>
          BETA
        </h1>

        {/* Full name */}
        <p style={{
          fontFamily: 'monospace',
          fontSize: 13,
          letterSpacing: '0.22em',
          color: '#666666',
          marginTop: 16,
          textTransform: 'uppercase',
        }}>
          Berkeley Emerging Technology Association
        </p>
      </div>

      {/* ── Bottom entry prompt ── */}
      <div style={{
        position: 'absolute', bottom: 60,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        animation: 'text-fade-in 1.2s 0.8s ease-out both',
      }}>
        <p style={{
          fontFamily: 'monospace', fontSize: 9,
          letterSpacing: '0.3em', color: 'rgba(255,255,255,0.3)',
          textTransform: 'uppercase', margin: 0,
        }}>
          Click or Scroll to Enter
        </p>

        {/* Flowing vertical line */}
        <div style={{
          position: 'relative',
          width: 1, height: 60,
          background: 'rgba(255,255,255,0.06)',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            height: '40%',
            background: 'linear-gradient(to bottom, transparent, #3B82F6)',
            animation: 'line-flow 1.6s ease-in-out infinite',
          }}/>
        </div>
      </div>
    </div>
  )
}
