import { useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import SectionArrow from './SectionArrow'

// ── Data ──────────────────────────────────────────────────────────────────────

const LAYERS = [
  {
    rank:     'L03',
    type:     'INTEGRATED INTELLIGENCE STACK',
    label:    'BETA Robotics Lab',
    caption:  'The only entity combining real-world humanoid data, VLM-automated annotation, and closed-loop world model training.',
    details: [
      { key: 'Primary Output', val: 'Models / Benchmarks'   },
      { key: 'Data Source',    val: 'Eastworld Partnership' },
      { key: 'Validation',     val: 'G1 Humanoid Loop'      },
    ],
    // Glassmorphism colors
    cardBg:       'rgba(186,230,253,0.52)',
    cardBorder:   'rgba(255,255,255,0.72)',
    cardShadow:   '0 8px 32px rgba(59,130,246,0.10), 0 2px 8px rgba(0,0,0,0.05)',
    accentColor:  '#1E3A8A',
    accentLight:  'rgba(30,58,138,0.12)',
    rankColor:    '#1E40AF',
    blurPx:       14,
    // Stack position: front (bottom-left)
    stackX: 0,
    stackY: 44,
    zIndex: 3,
  },
  {
    rank:     'L02',
    type:     'DATA SCALING VENDORS',
    label:    'Data Service Providers',
    caption:  'Human-in-the-loop annotation pipelines. Proprietary data services without model intelligence.',
    details: [
      { key: 'Method',     val: 'Human-in-the-loop annotation' },
      { key: 'Capability', val: 'Proprietary data services'    },
      { key: 'Limitation', val: 'No model intelligence'        },
    ],
    cardBg:       'rgba(245,245,220,0.58)',
    cardBorder:   'rgba(255,255,255,0.65)',
    cardShadow:   '0 6px 24px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.04)',
    accentColor:  '#78716C',
    accentLight:  'rgba(120,113,108,0.10)',
    rankColor:    '#92400E',
    blurPx:       10,
    stackX: 22,
    stackY: 22,
    zIndex: 2,
  },
  {
    rank:     'L01',
    type:     'THEORETICAL FOUNDATION',
    label:    'Conventional Academic Labs',
    caption:  'Simulation-heavy experimentation. Fragmented data sources. Academic publication focus.',
    details: [
      { key: 'Output',     val: 'Academic papers'              },
      { key: 'Method',     val: 'Simulation-heavy experiments' },
      { key: 'Limitation', val: 'Fragmented data sources'      },
    ],
    cardBg:       'rgba(240,240,238,0.58)',
    cardBorder:   'rgba(255,255,255,0.55)',
    cardShadow:   '0 4px 18px rgba(0,0,0,0.05), 0 1px 4px rgba(0,0,0,0.04)',
    accentColor:  '#57534E',
    accentLight:  'rgba(87,83,78,0.08)',
    rankColor:    '#78716C',
    blurPx:       8,
    // Stack position: back (top-right)
    stackX: 44,
    stackY: 0,
    zIndex: 1,
  },
] as const

// Card dimensions within the stack container
const CARD_W = 460
const CARD_H = 182
const STACK_PAD = 44   // extra container space for offsets

// ── Component ─────────────────────────────────────────────────────────────────

export default function MoatStack() {
  const [active, setActive] = useState<number | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const isInView   = useInView(sectionRef, { once: true, margin: '-12%' })

  return (
    <section
      ref={sectionRef}
      id="companies"
      className="relative w-full overflow-hidden"
      style={{ background: '#F7F7F2', paddingTop: 96, paddingBottom: 96 }}
    >
      {/* Subtle background texture so backdrop-filter has something to blur */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 w-full h-full"
        style={{ opacity: 0.035 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="dot-grid" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="#1A1A1A"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dot-grid)"/>
      </svg>

      {/* Warm center glow */}
      <div className="pointer-events-none absolute inset-0" style={{
        background: 'radial-gradient(ellipse 70% 50% at 65% 55%, rgba(186,230,253,0.14) 0%, transparent 70%)',
      }}/>

      {/* ── Section header ── */}
      <motion.div
        className="max-w-6xl mx-auto px-8 mb-18 text-center"
        style={{ marginBottom: 72 }}
        initial={{ opacity: 0, y: -16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="font-mono text-[10px] tracking-[0.35em] uppercase mb-4"
          style={{ color: 'rgba(26,26,26,0.32)' }}>
          [ 02 / RESEARCH_MOAT ]
        </p>
        <h2
          className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4"
          style={{ color: '#1A1A1A' }}
        >
          A New Category Between<br/>Research Labs and Data Companies
        </h2>
        <p className="text-sm max-w-lg mx-auto"
          style={{ color: 'rgba(26,26,26,0.42)', fontFamily: 'Inter, system-ui, sans-serif' }}>
          One integrated infrastructure that others cannot replicate.
        </p>
      </motion.div>

      {/* ── Main two-column layout ── */}
      <div className="max-w-6xl mx-auto px-8">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 56 }}>

          {/* ── LEFT: Text descriptions ── */}
          <div style={{ flex: '0 0 42%', minWidth: 0, paddingTop: 24 }}>
            {LAYERS.map((layer, i) => {
              const isActive = active === i
              return (
                <motion.div
                  key={layer.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  style={{
                    paddingTop: 22,
                    paddingBottom: 22,
                    paddingLeft: 16,
                    borderLeft: `2px solid ${isActive ? layer.accentColor : 'rgba(26,26,26,0.10)'}`,
                    marginBottom: i < LAYERS.length - 1 ? 8 : 0,
                    cursor: 'default',
                    transition: 'border-color 0.3s ease',
                  }}
                >
                  {/* Rank + type row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{
                      fontFamily:    "'Roboto Mono','JetBrains Mono',monospace",
                      fontSize:      11,
                      fontWeight:    800,
                      letterSpacing: '0.14em',
                      color:         layer.rankColor,
                    }}>
                      {layer.rank}
                    </span>
                    <span style={{
                      width: 16, height: 1,
                      background: 'rgba(26,26,26,0.18)',
                      flexShrink: 0,
                    }}/>
                    <span style={{
                      fontFamily:    "'Roboto Mono',monospace",
                      fontSize:      8,
                      fontWeight:    600,
                      letterSpacing: '0.18em',
                      color:         'rgba(26,26,26,0.35)',
                      textTransform: 'uppercase' as const,
                    }}>
                      {layer.type}
                    </span>
                  </div>

                  {/* Layer title */}
                  <h3 style={{
                    fontFamily:    "Inter,'Helvetica Neue',system-ui,sans-serif",
                    fontSize:      i === 0 ? 20 : i === 1 ? 17 : 15,
                    fontWeight:    700,
                    letterSpacing: '-0.01em',
                    color:         isActive ? '#1A1A1A' : 'rgba(26,26,26,0.72)',
                    marginBottom:  6,
                    lineHeight:    1.25,
                    transition:    'color 0.25s ease',
                  }}>
                    {layer.label}
                  </h3>

                  {/* Caption */}
                  <p style={{
                    fontFamily:    "Inter,system-ui,sans-serif",
                    fontSize:      11,
                    lineHeight:    1.65,
                    color:         'rgba(26,26,26,0.42)',
                    margin:        0,
                  }}>
                    {layer.caption}
                  </p>

                  {/* Details on hover */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4, transition: { duration: 0.14 } }}
                        transition={{ duration: 0.22, ease: 'easeOut' }}
                        style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 7 }}
                      >
                        {layer.details.map(({ key, val }) => (
                          <div key={key} style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                            <span style={{
                              fontFamily:    "'Roboto Mono',monospace",
                              fontSize:      9,
                              fontWeight:    700,
                              letterSpacing: '0.10em',
                              color:         layer.accentColor,
                              flexShrink:    0,
                              textTransform: 'uppercase' as const,
                            }}>
                              {key}
                            </span>
                            <span style={{
                              fontFamily: 'monospace',
                              fontSize:   9,
                              color:      'rgba(26,26,26,0.28)',
                            }}>
                              →
                            </span>
                            <span style={{
                              fontFamily:    "'Roboto Mono',monospace",
                              fontSize:      10,
                              color:         '#1A1A1A',
                              letterSpacing: '0.02em',
                            }}>
                              {val}
                            </span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}

            {/* Axis label */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              marginTop: 32, opacity: 0.28,
            }}>
              <div style={{ height: 1, width: 32, background: '#1A1A1A' }}/>
              <span style={{
                fontFamily:    "'Roboto Mono',monospace",
                fontSize:      7,
                letterSpacing: '0.22em',
                color:         '#1A1A1A',
                textTransform: 'uppercase' as const,
              }}>
                CAPABILITY DEPTH →
              </span>
            </div>
          </div>

          {/* ── RIGHT: Isometric stacked glass cards ── */}
          <div style={{ flex: '1 1 0%', display: 'flex', justifyContent: 'center', paddingTop: 0 }}>
            {/* Stack container */}
            <div style={{
              position:   'relative',
              width:      CARD_W + STACK_PAD,
              height:     CARD_H + STACK_PAD,
              flexShrink: 0,
            }}>
              {LAYERS.map((layer, i) => {
                const isActive = active === i
                const isDimmed = active !== null && !isActive

                return (
                  <motion.div
                    key={layer.rank}
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{
                      duration: 0.75,
                      delay:    0.35 + (LAYERS.length - 1 - i) * 0.15,
                      ease:     [0.22, 1, 0.36, 1],
                    }}
                    onMouseEnter={() => setActive(i)}
                    onMouseLeave={() => setActive(null)}
                    style={{
                      position:   'absolute',
                      left:       layer.stackX,
                      top:        layer.stackY,
                      width:      CARD_W,
                      height:     CARD_H,
                      zIndex:     layer.zIndex,
                      cursor:     'default',
                    }}
                  >
                    <motion.div
                      animate={{
                        y:       isActive ? -14 : 0,
                        opacity: isDimmed ? 0.52 : 1,
                        scale:   isActive ? 1.012 : 1,
                      }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        width:              '100%',
                        height:             '100%',
                        background:         layer.cardBg,
                        backdropFilter:     `blur(${layer.blurPx}px)`,
                        WebkitBackdropFilter: `blur(${layer.blurPx}px)`,
                        border:             `1px solid ${layer.cardBorder}`,
                        borderRadius:       6,
                        boxShadow:          isActive
                          ? `${layer.cardShadow}, 0 20px 60px rgba(0,0,0,0.10)`
                          : layer.cardShadow,
                        padding:            '22px 26px',
                        display:            'flex',
                        flexDirection:      'column',
                        justifyContent:     'space-between',
                        transition:         'box-shadow 0.35s ease',
                        // Inner top highlight
                        outline:            isActive
                          ? `1px solid ${layer.cardBorder}`
                          : '1px solid transparent',
                      }}
                    >
                      {/* Card top: rank + type */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{
                            fontFamily:    "'Roboto Mono','JetBrains Mono',monospace",
                            fontSize:      12,
                            fontWeight:    800,
                            letterSpacing: '0.14em',
                            color:         layer.rankColor,
                          }}>
                            {layer.rank}
                          </span>
                          <span style={{
                            fontFamily:    "'Roboto Mono',monospace",
                            fontSize:      8,
                            letterSpacing: '0.16em',
                            color:         'rgba(26,26,26,0.38)',
                            textTransform: 'uppercase' as const,
                          }}>
                            {layer.type}
                          </span>
                        </div>

                        {/* Accent dot */}
                        <div style={{
                          width:  8,
                          height: 8,
                          borderRadius: '50%',
                          background: layer.accentLight,
                          border: `1px solid ${layer.accentColor}`,
                          opacity: 0.7,
                        }}/>
                      </div>

                      {/* Card label */}
                      <div>
                        <h3 style={{
                          fontFamily:    "Inter,'Helvetica Neue',system-ui,sans-serif",
                          fontSize:      i === 0 ? 22 : i === 1 ? 18 : 15,
                          fontWeight:    700,
                          letterSpacing: '-0.015em',
                          color:         '#1A1A1A',
                          marginBottom:  8,
                          lineHeight:    1.2,
                        }}>
                          {layer.label}
                        </h3>

                        {/* Bottom rule */}
                        <div style={{
                          height:     1,
                          background: `linear-gradient(to right, ${layer.accentColor}28, transparent)`,
                          marginBottom: 10,
                        }}/>

                        {/* Key detail always visible */}
                        <div style={{ display: 'flex', gap: 16 }}>
                          {layer.details.slice(0, 2).map(({ key, val }) => (
                            <div key={key}>
                              <div style={{
                                fontFamily:    "'Roboto Mono',monospace",
                                fontSize:      7.5,
                                fontWeight:    700,
                                letterSpacing: '0.12em',
                                color:         layer.accentColor,
                                opacity:       0.65,
                                textTransform: 'uppercase' as const,
                                marginBottom:  2,
                              }}>
                                {key}
                              </div>
                              <div style={{
                                fontFamily:    "Inter,system-ui,sans-serif",
                                fontSize:      10,
                                color:         'rgba(26,26,26,0.70)',
                                letterSpacing: '0.01em',
                              }}>
                                {val}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
        background: 'linear-gradient(to bottom, transparent, #F7F7F2)',
        pointerEvents: 'none', zIndex: 5,
      }}/>

      {/* Exit arrow */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 64, position: 'relative', zIndex: 10 }}>
        <SectionArrow href="#contact" color="rgba(26,26,26,0.25)" />
      </div>
    </section>
  )
}
