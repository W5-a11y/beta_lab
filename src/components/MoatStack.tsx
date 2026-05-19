import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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

// Pyramid slab widths (% of pyramid column), L03 narrowest at top
const SLAB_WIDTHS  = ['50%', '72%', '94%']
// Row heights shared between pyramid slabs and right text rows
const ROW_HEIGHTS  = [200, 160, 130]
// Front-face depth strip (px) — drawn outside slab so it doesn't eat height
const SLAB_DEPTH   = [16, 13, 10]

// ── Component ─────────────────────────────────────────────────────────────────

export default function MoatStack() {
  const [active, setActive] = useState<number | null>(null)

  return (
    <section className="relative w-full bg-black py-32 overflow-hidden">
      <style>{`
        .pyramid-slab {
          position: relative;
          transition: transform 0.35s cubic-bezier(0.22,1,0.36,1);
          cursor: default;
        }
        .pyramid-slab.lifted { transform: translateY(-10px); }
      `}</style>

      {/* Section header */}
      <div className="max-w-6xl mx-auto px-8 mb-20 text-center">
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase mb-4"
           style={{ color: 'rgba(59,130,246,0.5)' }}>
          [ 02 / RESEARCH_MOAT ]
        </p>
        <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
          A New Category Between Research Labs and Data Companies
        </h2>
        <p className="text-sm max-w-lg mx-auto" style={{ color: 'rgba(255,255,255,0.3)' }}>
          One integrated infrastructure that others cannot replicate.
        </p>
      </div>

      {/* Main layout: pyramid left + text right */}
      <div className="max-w-6xl mx-auto px-8">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>

          {/* ── Left: 3D Pyramid (40%) ── */}
          <div style={{ width: '40%', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {LAYERS.map((layer, i) => (
              <div
                key={layer.rank}
                style={{
                  width: '100%',
                  height: ROW_HEIGHTS[i],
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingBottom: 0,
                }}
              >
                {/* Slab wrapper — lifts on hover */}
                <div
                  className={`pyramid-slab${active === i ? ' lifted' : ''}`}
                  style={{ width: SLAB_WIDTHS[i] }}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                >
                  {/* Main face */}
                  <div style={{
                    height: ROW_HEIGHTS[i] - SLAB_DEPTH[i] - 8,
                    background: layer.topBg,
                    border: `1px solid ${layer.border}`,
                    borderBottom: 'none',
                    boxShadow: layer.topGlow,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}>
                    {/* Top highlight for L03 */}
                    {i === 0 && (
                      <div style={{
                        position: 'absolute',
                        top: 0, left: '8%', right: '8%', height: 1,
                        background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.7), transparent)',
                      }}/>
                    )}
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
                  {/* Front-face depth strip */}
                  <div style={{
                    height: SLAB_DEPTH[i],
                    background: layer.frontBg,
                    borderLeft: `1px solid ${layer.border}`,
                    borderRight: `1px solid ${layer.border}`,
                    borderBottom: `1px solid ${layer.border}`,
                  }}/>
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
      </div>
    </section>
  )
}
