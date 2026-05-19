import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

// ── Data ──────────────────────────────────────────────────────────────────────

const LAYERS = [
  {
    rank: 'L03',
    label: 'BETA Robotics Lab',
    sub: 'Full-Stack Research Infrastructure',
    type: 'INTEGRATED INTELLIGENCE STACK',
    terminal: [
      { key: 'primary_output',   val: 'Models + Datasets + Benchmarks + World Models' },
      { key: 'data_source',      val: 'Exclusive Eastworld Industry Partnership' },
      { key: 'validation',       val: 'End-to-end Real-world G1 Humanoid Loop' },
      { key: 'philosophy',       val: 'High-impact Open Source + Peer-reviewed Papers' },
    ],
    tag: 'EASTWORLD-DRIVEN WORLD MODELS',
    offset: 38,   // % from content area left
  },
  {
    rank: 'L02',
    label: 'Data Service Providers',
    sub: 'e.g. Scale AI',
    type: 'MANUAL DATA SCALING',
    items: ['Human-in-the-loop Labeling', 'Proprietary Data Services'],
    limitation: 'NO MODEL STACK & VENDOR-LOCK',
    offset: 20,
  },
  {
    rank: 'L01',
    label: 'Conventional Academic Labs',
    sub: 'e.g. BAIR',
    type: 'THEORETICAL FOUNDATIONS',
    items: ['Algorithmic Papers & Top-tier Publications', 'Simulation-heavy Experiments'],
    limitation: 'SIM-TO-REAL GAP & FRAGMENTED DATA',
    offset: 0,
  },
] as const

// ── Component ─────────────────────────────────────────────────────────────────

export default function MoatStack() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)

  // L03 parallax
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const px = useSpring(mx, { stiffness: 40, damping: 16 })
  const py = useSpring(my, { stiffness: 40, damping: 16 })

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      mx.set(((e.clientX - r.left) / r.width - 0.5) * 18)
      my.set(((e.clientY - r.top)  / r.height - 0.5) * 10)
    }
    const onLeave = () => { mx.set(0); my.set(0) }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <section ref={sectionRef} className="relative w-full bg-black py-32 overflow-hidden">
      <style>{`
        @keyframes dot-drift {
          0%   { background-position: 0 0; }
          100% { background-position: 48px 48px; }
        }
        @keyframes scan-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .scan-marquee { animation: scan-scroll 10s linear infinite; }
      `}</style>

      {/* Section header */}
      <div className="max-w-5xl mx-auto px-8 mb-24 text-center">
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase mb-4"
          style={{ color: 'rgba(59,130,246,0.55)' }}>
          [ 02 / RESEARCH_MOAT ]
        </p>
        <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
          The Research Moat Stack
        </h2>
        <p className="text-sm max-w-lg mx-auto" style={{ color: 'rgba(255,255,255,0.3)' }}>
          One integrated infrastructure that others cannot replicate.
        </p>
      </div>

      {/* Matrix */}
      <div className="max-w-5xl mx-auto px-8">
        <div style={{ display: 'grid', gridTemplateColumns: '52px 1fr', gap: '0 0' }}>

          {/* ── Left guide rail ── */}
          <div style={{ position: 'relative' }}>
            {/* Vertical line */}
            <div style={{
              position: 'absolute',
              left: 23, top: 16, bottom: 16,
              width: 1,
              background: 'linear-gradient(to bottom, rgba(212,175,55,0.5), rgba(59,130,246,0.2), rgba(255,255,255,0.06))',
            }}/>

            {/* Dots & labels per layer */}
            {[0, 1, 2].map((i) => {
              const layer = LAYERS[i]
              const isApex = i === 0
              return (
                <div key={layer.rank}
                  style={{
                    position: 'absolute',
                    left: 0, right: 0,
                    top: i === 0 ? 14 : i === 1 ? '37%' : '68%',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                  }}
                >
                  <span style={{
                    fontFamily: 'monospace', fontSize: 7, fontWeight: 700,
                    letterSpacing: '0.1em',
                    color: isApex ? 'rgba(212,175,55,0.8)' : 'rgba(255,255,255,0.2)',
                  }}>
                    {layer.rank}
                  </span>
                  <div style={{
                    width: isApex ? 8 : 5, height: isApex ? 8 : 5,
                    borderRadius: '50%',
                    border: isApex
                      ? '1px solid rgba(212,175,55,0.8)'
                      : '1px solid rgba(255,255,255,0.2)',
                    boxShadow: isApex ? '0 0 10px rgba(212,175,55,0.5)' : 'none',
                    background: isApex ? 'rgba(212,175,55,0.2)' : 'transparent',
                  }}/>
                </div>
              )
            })}
          </div>

          {/* ── Right content ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

            {/* ━━ L03 BETA ━━ */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{
                paddingLeft: `${LAYERS[0].offset}%`,
                paddingBottom: 56,
                translateX: px,
                translateY: py,
              }}
            >
              {/* Connector hairline */}
              <div style={{
                marginLeft: `-${LAYERS[0].offset}%`,
                marginBottom: 16,
                height: 1,
                width: `${LAYERS[0].offset}%`,
                background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.25))',
              }}/>

              {/* Content block — no box, just gold left bar */}
              <div
                style={{ position: 'relative' }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              >
                {/* Gold left anchor bar */}
                <div style={{
                  position: 'absolute', left: -16, top: 0, bottom: 0,
                  width: 2,
                  background: 'linear-gradient(to bottom, rgba(212,175,55,0.9), rgba(212,175,55,0.3))',
                  boxShadow: '0 0 12px rgba(212,175,55,0.4)',
                }}/>

                {/* Animated dot grid backdrop */}
                <div style={{
                  position: 'absolute', inset: '-12px -20px',
                  backgroundImage: 'radial-gradient(circle, rgba(212,175,55,0.1) 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                  animation: 'dot-drift 14s linear infinite',
                  opacity: hovered ? 0.9 : 0.45,
                  transition: 'opacity 0.4s ease',
                  pointerEvents: 'none',
                  borderRadius: 4,
                }}/>

                {/* Type */}
                <p style={{
                  fontFamily: 'monospace', fontSize: 9, fontWeight: 700,
                  letterSpacing: '0.2em', color: 'rgba(212,175,55,0.7)',
                  marginBottom: 10, position: 'relative',
                }}>
                  {LAYERS[0].type}
                </p>

                {/* Title */}
                <h3 style={{
                  fontSize: 26, fontWeight: 900, letterSpacing: '-0.02em',
                  color: 'rgba(255,255,255,1)',
                  marginBottom: 4, position: 'relative',
                }}>
                  {LAYERS[0].label}
                </h3>
                <p style={{
                  fontFamily: 'monospace', fontSize: 8, letterSpacing: '0.12em',
                  color: 'rgba(212,175,55,0.45)',
                  marginBottom: 20, position: 'relative',
                }}>
                  {LAYERS[0].sub}
                </p>

                {/* Terminal output */}
                <div style={{
                  display: 'flex', flexDirection: 'column', gap: 7,
                  position: 'relative',
                }}>
                  {LAYERS[0].terminal.map(({ key, val }) => (
                    <div key={key} style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                      <span style={{
                        fontFamily: 'monospace', fontSize: 9, fontWeight: 700,
                        color: 'rgba(212,175,55,0.75)', flexShrink: 0,
                      }}>
                        [✓]
                      </span>
                      <span style={{
                        fontFamily: 'monospace', fontSize: 8, letterSpacing: '0.04em',
                        color: hovered ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.55)',
                        transition: 'color 0.2s',
                      }}>
                        <span style={{ color: 'rgba(147,197,253,0.6)' }}>{key}</span>
                        <span style={{ color: 'rgba(212,175,55,0.4)', margin: '0 6px' }}>→</span>
                        {val}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Tag */}
                <p style={{
                  fontFamily: 'monospace', fontSize: 8, fontWeight: 700,
                  letterSpacing: '0.14em',
                  color: 'rgba(212,175,55,0.7)',
                  marginTop: 18, position: 'relative',
                }}>
                  [ UNIQUE EDGE: {LAYERS[0].tag} ]
                </p>

                {/* Hover marquee */}
                <div style={{
                  overflow: 'hidden',
                  height: hovered ? 16 : 0,
                  opacity: hovered ? 1 : 0,
                  transition: 'height 0.2s ease, opacity 0.18s ease',
                  marginTop: hovered ? 10 : 0,
                  position: 'relative',
                }}>
                  <div className="scan-marquee" style={{ display: 'flex', whiteSpace: 'nowrap' }}>
                    {Array(8).fill(null).map((_, k) => (
                      <span key={k} style={{
                        fontFamily: 'monospace', fontSize: 8,
                        letterSpacing: '0.15em',
                        color: 'rgba(212,175,55,0.55)',
                        paddingRight: 56,
                      }}>
                        SCANNING_CAPABILITY_MOAT... 100% COMPLETE
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ━━ L02 Data Providers ━━ */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={{ paddingLeft: `${LAYERS[1].offset}%`, paddingBottom: 52, opacity: 0.32 }}
            >
              <div style={{
                marginLeft: `-${LAYERS[1].offset}%`,
                marginBottom: 14,
                height: 1,
                width: `${LAYERS[1].offset}%`,
                background: 'linear-gradient(to right, transparent, rgba(59,130,246,0.18))',
              }}/>

              <p style={{
                fontFamily: 'monospace', fontSize: 8, fontWeight: 700,
                letterSpacing: '0.2em', color: 'rgba(59,130,246,0.5)',
                marginBottom: 8,
              }}>
                {LAYERS[1].type}
              </p>
              <h3 style={{
                fontSize: 18, fontWeight: 800, letterSpacing: '-0.01em',
                color: 'rgba(255,255,255,0.7)', marginBottom: 3,
              }}>
                {LAYERS[1].label}
              </h3>
              <p style={{
                fontFamily: 'monospace', fontSize: 8,
                color: 'rgba(255,255,255,0.2)', marginBottom: 14,
              }}>
                {LAYERS[1].sub}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {'items' in LAYERS[1] && LAYERS[1].items.map((item) => (
                  <p key={item} style={{
                    fontFamily: 'monospace', fontSize: 8,
                    color: 'rgba(255,255,255,0.38)', letterSpacing: '0.03em',
                  }}>
                    — {item}
                  </p>
                ))}
              </div>
              <p style={{
                fontFamily: 'monospace', fontSize: 7, fontWeight: 700,
                letterSpacing: '0.12em', color: 'rgba(239,68,68,0.55)',
                marginTop: 12,
              }}>
                [ LIMITATION: {'limitation' in LAYERS[1] ? LAYERS[1].limitation : ''} ]
              </p>
            </motion.div>

            {/* ━━ L01 Academic ━━ */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ paddingLeft: `${LAYERS[2].offset}%`, opacity: 0.26 }}
            >
              <p style={{
                fontFamily: 'monospace', fontSize: 8, fontWeight: 700,
                letterSpacing: '0.2em', color: 'rgba(255,255,255,0.25)',
                marginBottom: 8,
              }}>
                {LAYERS[2].type}
              </p>
              <h3 style={{
                fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em',
                color: 'rgba(255,255,255,0.55)', marginBottom: 3,
              }}>
                {LAYERS[2].label}
              </h3>
              <p style={{
                fontFamily: 'monospace', fontSize: 8,
                color: 'rgba(255,255,255,0.18)', marginBottom: 12,
              }}>
                {LAYERS[2].sub}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {'items' in LAYERS[2] && LAYERS[2].items.map((item) => (
                  <p key={item} style={{
                    fontFamily: 'monospace', fontSize: 8,
                    color: 'rgba(255,255,255,0.28)', letterSpacing: '0.03em',
                  }}>
                    — {item}
                  </p>
                ))}
              </div>
              <p style={{
                fontFamily: 'monospace', fontSize: 7, fontWeight: 700,
                letterSpacing: '0.12em', color: 'rgba(239,68,68,0.45)',
                marginTop: 12,
              }}>
                [ LIMITATION: {'limitation' in LAYERS[2] ? LAYERS[2].limitation : ''} ]
              </p>
            </motion.div>
          </div>
        </div>

        {/* Bottom axis */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          marginTop: 40, paddingLeft: 52, opacity: 0.22,
        }}>
          <div style={{ height: 1, flexGrow: 1, background: 'rgba(255,255,255,0.15)' }}/>
          <span style={{
            fontFamily: 'monospace', fontSize: 7,
            letterSpacing: '0.22em', color: 'rgba(255,255,255,0.5)',
          }}>
            CAPABILITY DEPTH →
          </span>
        </div>
      </div>
    </section>
  )
}
