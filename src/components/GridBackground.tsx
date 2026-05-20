import { useEffect, useRef } from 'react'

// Grid cell size in px
const CELL = 44
// Parallax max offset in px (inverse mouse movement)
const PARALLAX_STRENGTH = 14
// Parallax lerp factor — lower = smoother/slower
const LERP = 0.055

interface Dot {
  gx: number
  gy: number
  phase: number   // radians, for sin oscillation
  speed: number   // oscillation frequency multiplier
  baseAlpha: number
}

function buildDots(cols: number, rows: number): Dot[] {
  const list: Dot[] = []
  // ~1.8% of intersections get a dot
  for (let gx = 0; gx <= cols; gx++) {
    for (let gy = 0; gy <= rows; gy++) {
      if (Math.random() < 0.018) {
        list.push({
          gx,
          gy,
          phase:     Math.random() * Math.PI * 2,
          speed:     0.25 + Math.random() * 0.6,
          baseAlpha: 0.35 + Math.random() * 0.45,
        })
      }
    }
  }
  return list
}

export default function GridBackground() {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const mouseRef   = useRef({ x: 0.5, y: 0.5 })  // normalised [0,1]
  const offsetRef  = useRef({ x: 0, y: 0 })        // current smoothed offset
  const dotsRef    = useRef<Dot[]>([])
  const rafRef     = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })!

    // ── Resize ──────────────────────────────────────────────────────────────
    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      const cols = Math.ceil(canvas.width  / CELL) + 2
      const rows = Math.ceil(canvas.height / CELL) + 2
      dotsRef.current = buildDots(cols, rows)
    }
    resize()
    window.addEventListener('resize', resize)

    // ── Mouse tracking (normalised) ────────────────────────────────────────
    const onMouse = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      }
    }
    window.addEventListener('mousemove', onMouse, { passive: true })

    // ── Render loop ────────────────────────────────────────────────────────
    const draw = (time: number) => {
      const w = canvas.width
      const h = canvas.height

      // Smooth parallax target
      const targetX = (mouseRef.current.x - 0.5) * -PARALLAX_STRENGTH
      const targetY = (mouseRef.current.y - 0.5) * -PARALLAX_STRENGTH
      offsetRef.current.x += (targetX - offsetRef.current.x) * LERP
      offsetRef.current.y += (targetY - offsetRef.current.y) * LERP

      const ox = offsetRef.current.x
      const oy = offsetRef.current.y

      ctx.clearRect(0, 0, w, h)

      // ── Grid lines ────────────────────────────────────────────────────────
      // startX/Y: first line position (with parallax + tiling)
      const startX = ((ox % CELL) + CELL) % CELL - CELL
      const startY = ((oy % CELL) + CELL) % CELL - CELL

      ctx.beginPath()
      ctx.strokeStyle = 'rgba(255,255,255,0.048)'
      ctx.lineWidth = 0.5

      for (let x = startX; x < w + CELL; x += CELL) {
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
      }
      for (let y = startY; y < h + CELL; y += CELL) {
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
      }
      ctx.stroke()

      // ── Blinking intersection dots ────────────────────────────────────────
      const t = time * 0.001
      for (const dot of dotsRef.current) {
        const px = dot.gx * CELL + startX
        const py = dot.gy * CELL + startY

        // Cull off-screen
        if (px < -CELL || px > w + CELL || py < -CELL || py > h + CELL) continue

        // Oscillate alpha with sine — goes full dark → bright and back
        const sine   = (Math.sin(t * dot.speed + dot.phase) + 1) / 2  // [0, 1]
        const alpha  = sine * sine * dot.baseAlpha  // squared for snappier pulse

        if (alpha < 0.02) continue

        // Slight glow: two circles, outer faint halo
        ctx.beginPath()
        ctx.arc(px, py, 2.2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(59,130,246,${alpha * 0.25})`
        ctx.fill()

        ctx.beginPath()
        ctx.arc(px, py, 1.1, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(130,190,255,${alpha})`
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        // Vignette: grid visible in centre, fades at edges
        maskImage:
          'radial-gradient(ellipse 80% 80% at 50% 42%, black 20%, rgba(0,0,0,0.6) 55%, transparent 100%)',
        WebkitMaskImage:
          'radial-gradient(ellipse 80% 80% at 50% 42%, black 20%, rgba(0,0,0,0.6) 55%, transparent 100%)',
      }}
    />
  )
}
