import { motion } from 'framer-motion'
import type { Transition } from 'framer-motion'

const breatheTransition: Transition = {
  duration: 9,
  ease: 'easeInOut',
  repeat: Infinity,
  repeatType: 'loop',
}

export default function GlobalAtmosphere() {
  return (
    <>
      {/* ── Fixed vignette glow — edges only, center transparent ─────────── */}
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
        animate={{ opacity: [0.12, 0.42, 0.12] }}
        transition={breatheTransition}
      />

      {/* ── Subtle edge vignette (non-animated) ─────────────────────────── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          background:
            'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)',
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
    </>
  )
}
