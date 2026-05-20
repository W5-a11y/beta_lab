import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import type { Transition } from 'framer-motion'

// ── Particle canvas ───────────────────────────────────────────────────────────

const PARTICLE_COUNT = 38

interface Particle {
  x: number; y: number
  vx: number; vy: number
  size: number
  opacity: number
  opacityDir: number
}

function mkParticle(w: number, h: number): Particle {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.22,
    vy: (Math.random() - 0.5) * 0.18,
    size: Math.random() < 0.6 ? 1 : 1.5,
    opacity: Math.random() * 0.25 + 0.05,
    opacityDir: Math.random() < 0.5 ? 1 : -1,
  }
}

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = window.innerWidth
    let h = window.innerHeight
    canvas.width  = w
    canvas.height = h

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => mkParticle(w, h))

    let raf: number

    const tick = () => {
      ctx.clearRect(0, 0, w, h)

      for (const p of particles) {
        // drift
        p.x += p.vx
        p.y += p.vy

        // wrap edges
        if (p.x < -2)  p.x = w + 2
        if (p.x > w+2) p.x = -2
        if (p.y < -2)  p.y = h + 2
        if (p.y > h+2) p.y = -2

        // breathe opacity
        p.opacity += p.opacityDir * 0.0008
        if (p.opacity > 0.30) { p.opacity = 0.30; p.opacityDir = -1 }
        if (p.opacity < 0.03) { p.opacity = 0.03; p.opacityDir =  1 }

        ctx.fillStyle = `rgba(180,210,255,${p.opacity})`
        ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size)
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)

    const onResize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width  = w
      canvas.height = h
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}

// ── Breathe transition ────────────────────────────────────────────────────────

const breatheTransition: Transition = {
  duration: 9,
  ease: 'easeInOut',
  repeat: Infinity,
  repeatType: 'loop',
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function GlobalAtmosphere() {
  return (
    <>
      {/* ── Deep-blue centre glow — creates spatial depth ─────────────────── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          background: 'radial-gradient(ellipse 90% 70% at 50% 42%, rgba(0,30,80,0.55) 0%, transparent 70%)',
        }}
      />

      {/* ── Corner glow (breathing) ───────────────────────────────────────── */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          background: [
            'radial-gradient(ellipse 120% 120% at 0% 0%,   #003262 0%, transparent 55%)',
            'radial-gradient(ellipse 120% 120% at 100% 0%,  #003262 0%, transparent 55%)',
            'radial-gradient(ellipse 120% 120% at 0% 100%,  #003262 0%, transparent 55%)',
            'radial-gradient(ellipse 120% 120% at 100% 100%,#003262 0%, transparent 55%)',
          ].join(', '),
        }}
        animate={{ opacity: [0.10, 0.38, 0.10] }}
        transition={breatheTransition}
      />

      {/* ── Edge vignette ─────────────────────────────────────────────────── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          background:
            'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.60) 100%)',
        }}
      />

      {/* ── Noise texture overlay ─────────────────────────────────────────── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          opacity: 0.028,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
        }}
      />

      {/* ── Floating particles ────────────────────────────────────────────── */}
      <ParticleCanvas />
    </>
  )
}
