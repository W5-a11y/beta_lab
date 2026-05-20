import { useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import SectionArrow from './SectionArrow'

// ── Data ──────────────────────────────────────────────────────────────────────

const LAYERS = [
  {
    rank: 'L03',
    label: 'BETA Robotics Lab',
    type: 'INTEGRATED INTELLIGENCE STACK',
    details: [
      { key: 'Primary Output', val: 'Models / Benchmarks' },
      { key: 'Data Source',    val: 'Eastworld Partnership' },
      { key: 'Validation',     val: 'G1 Humanoid Loop' },
    ],
    // pyramid: top layer — brushed gold
    topBg:    'linear-gradient(135deg, rgba(212,175,55,0.22) 0%, rgba(212,175,55,0.10) 100%)',
    frontBg:  'rgba(212,175,55,0.32)',
    border:   'rgba(212,175,55,0.55)',
    topGlow:  '0 -1px 14px rgba(212,175,55,0.35)',
    rankColor:'rgba(212,175,55,0.9)',
    typeColor:'rgba(212,175,55,0.65)',
    guideColor:'rgba(212,175,55,0.2)',
  },
  {
    rank: 'L02',
    label: 'Data Service Providers',
    type: 'DATA SCALING VENDORS',
    details: [
      { key: 'Method',     val: 'Human-in-the-loop annotation' },
      { key: 'Capability', val: 'Proprietary data services' },
      { key: 'Limitation', val: 'No model intelligence' },
    ],
    // pyramid: mid — translucent deep blue
    topBg:    'linear-gradient(135deg, rgba(37,99,235,0.18) 0%, rgba(59,130,246,0.08) 100%)',
    frontBg:  'rgba(59,130,246,0.22)',
    border:   'rgba(59,130,246,0.35)',
    topGlow:  'none',
    rankColor:'rgba(147,197,253,1)',
    typeColor:'rgba(147,197,253,0.85)',
    guideColor:'rgba(59,130,246,0.15)',
  },
  {
    rank: 'L01',
    label: 'Conventional Academic Labs',
    type: 'THEORETICAL FOUNDATION',
    details: [
      { key: 'Output',     val: 'Academic papers' },
      { key: 'Method',     val: 'Simulation-heavy experiments' },
      { key: 'Limitation', val: 'Fragmented data sources' },
    ],
    // pyramid: base — matte dark gray
    topBg:    'linear-gradient(135deg, rgba(60,60,65,0.35) 0%, rgba(40,40,44,0.20) 100%)',
    frontBg:  'rgba(55,55,60,0.45)',
    border:   'rgba(255,255,255,0.08)',
    topGlow:  'none',
    rankColor:'rgba(255,255,255,0.70)',
    typeColor:'rgba(255,255,255,0.55)',
    guideColor:'rgba(255,255,255,0.07)',
  },
] as const

// Row heights shared between pyramid slabs and right text rows
const ROW_HEIGHTS = [200, 160, 130]
// Total pyramid height = 490px
// Taper: top edge 18% inset each side → bottom edge 1% inset each side
// Boundaries at cumulative h fractions: 0 / 0.408 / 0.735 / 1.0
// offset(h) = 18 - 17*h  →  insets: 18% / 11.1% / 5.5% / 1%
const PYRAMID_CLIPS = [
  'polygon(18% 0%, 82% 0%, 88.9% 100%, 11.1% 100%)',
  'polygon(11.1% 0%, 88.9% 0%, 94.5% 100%, 5.5% 100%)',
  'polygon(5.5% 0%, 94.5% 0%, 99% 100%, 1% 100%)',
]

// ── Component ─────────────────────────────────────────────────────────────────

export default function MoatStack() {
  const [active, setActive] = useState<number | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const isInView   = useInView(sectionRef, { once: true, margin: '-12%' })

  return (
    <section ref={sectionRef} id="companies" className="relative w-full bg-black py-32 overflow-hidden">
      {/* Corner glows — top-right */}
      <div className="pointer-events-none absolute -top-60 -right-60 w-[900px] h-[900px] rounded-full" style={{
        background: 'radial-gradient(circle, rgba(0,50,98,0.28) 0%, transparent 65%)',
        filter: 'blur(90px)',
      }}/>
      {/* Corner glows — bottom-left */}
      <div className="pointer-events-none absolute -bottom-60 -left-60 w-[800px] h-[800px] rounded-full" style={{
        background: 'radial-gradient(circle, rgba(0,50,98,0.22) 0%, transparent 65%)',
        filter: 'blur(100px)',
      }}/>
      <style>{`
        .pyramid-slab {
          position: relative;
          transition: transform 0.35s cubic-bezier(0.22,1,0.36,1);
          cursor: default;
        }
        .pyramid-slab.lifted { transform: translateY(-10px); }
      `}</style>

      {/* Section header */}
      <motion.div
        className="max-w-6xl mx-auto px-8 mb-20 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase mb-4"
           style={{ color: 'rgba(59,130,246,0.5)' }}>
          [ 02 / RESEARCH_MOAT ]
        </p>
        <motion.h2
          className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4"
          initial={{ opacity: 0, y: 14 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          A New Category Between Research Labs and Data Companies
        </motion.h2>
        <motion.p
          className="text-sm max-w-lg mx-auto"
          style={{ color: 'rgba(255,255,255,0.4)' }}
          initial={{ opacity: 0, y: 8 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          One integrated infrastructure that others cannot replicate.
        </motion.p>
      </motion.div>

      {/* Main layout: pyramid left + text right */}
      <motion.div
        className="max-w-6xl mx-auto px-8"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>

          {/* ── Left: True pyramid (40%) ── */}
          <div style={{ width: '40%', flexShrink: 0 }}>
            {LAYERS.map((layer, i) => (
              <div
                key={layer.rank}
                className={`pyramid-slab${active === i ? ' lifted' : ''}`}
                style={{
                  width: '100%',
                  height: ROW_HEIGHTS[i],
                  position: 'relative',
                  clipPath: PYRAMID_CLIPS[i],
                  cursor: 'default',
                }}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
              >
                {/* Fill face */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: layer.topBg,
                  boxShadow: layer.topGlow,
                }}/>

                {/* Bottom depth shadow */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%',
                  background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.45))',
                  pointerEvents: 'none',
                }}/>

                {/* Border outline — inset via box-shadow since clip-path hides border */}
                <div style={{
                  position: 'absolute', inset: 0,
                  boxShadow: `inset 0 0 0 1px ${layer.border}`,
                }}/>

                {/* Top highlight for L03 */}
                {i === 0 && (
                  <div style={{
                    position: 'absolute',
                    top: 8, left: '25%', right: '25%', height: 1,
                    background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.7), transparent)',
                  }}/>
                )}

                {/* Rank label */}
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{
                    fontFamily: 'monospace',
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: '0.2em',
                    color: layer.rankColor,
                  }}>
                    {layer.rank}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* ── Right: Text content (60%) ── */}
          <div style={{ width: '60%', display: 'flex', flexDirection: 'column' }}>
            {LAYERS.map((layer, i) => (
              <div
                key={layer.rank}
                style={{
                  height: ROW_HEIGHTS[i],
                  display: 'flex',
                  alignItems: 'center',
                  position: 'relative',
                  paddingLeft: 40,
                  paddingRight: 8,
                }}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
              >
                {/* Horizontal guide line connecting to pyramid */}
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  width: 36,
                  height: 1,
                  background: layer.guideColor,
                  pointerEvents: 'none',
                }}/>

                {/* Text block */}
                <div style={{ flex: 1 }}>
                  {/* Type label */}
                  <p style={{
                    fontFamily: 'monospace',
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: '0.18em',
                    color: layer.typeColor,
                    marginBottom: 12,
                  }}>
                    {layer.type}
                  </p>

                  {/* Label — always visible */}
                  <h3 style={{
                    fontSize: i === 0 ? 26 : i === 1 ? 21 : 17,
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    color: `rgba(255,255,255,${i === 0 ? 1 : i === 1 ? 0.85 : 0.65})`,
                    marginBottom: 0,
                    lineHeight: 1.15,
                  }}>
                    {layer.label}
                  </h3>

                  {/* Details — only on hover */}
                  <AnimatePresence>
                    {active === i && (
                      <motion.div
                        key="details"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.22, ease: 'easeOut' }}
                        style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}
                      >
                        {layer.details.map(({ key, val }) => (
                          <div key={key} style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                            <span style={{
                              fontFamily: 'monospace',
                              fontSize: 12,
                              fontWeight: 600,
                              color: layer.typeColor,
                              flexShrink: 0,
                              letterSpacing: '0.05em',
                            }}>
                              {key}
                            </span>
                            <span style={{
                              fontFamily: 'monospace',
                              fontSize: 12,
                              color: 'rgba(255,255,255,0.3)',
                            }}>
                              →
                            </span>
                            <span style={{
                              fontFamily: 'monospace',
                              fontSize: 12,
                              color: 'rgba(255,255,255,0.9)',
                              letterSpacing: '0.02em',
                            }}>
                              {val}
                            </span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom axis label */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          marginTop: 32, opacity: 0.18,
        }}>
          <div style={{ height: 1, flexGrow: 1, background: 'rgba(255,255,255,0.15)' }}/>
          <span style={{
            fontFamily: 'monospace', fontSize: 7,
            letterSpacing: '0.22em', color: 'rgba(255,255,255,0.6)',
          }}>
            CAPABILITY DEPTH →
          </span>
        </div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 120,
        background: 'linear-gradient(to bottom, transparent, #000)',
        pointerEvents: 'none', zIndex: 5,
      }}/>

      {/* Exit arrow */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40, position: 'relative', zIndex: 10 }}>
        <SectionArrow href="#contact" />
      </div>
    </section>
  )
}
