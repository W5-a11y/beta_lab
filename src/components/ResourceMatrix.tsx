import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

// ── Resource data ─────────────────────────────────────────────────────────────

type BetaCluster = 'autolabel' | 'benchmark' | null

interface Resource {
  ref:       string
  icon:      string
  title:     string
  metric:    string
  sub:       string
  detail:    string
  colSpan?:  number
  rowSpan?:  number
  highlight: BetaCluster   // triggers BetaLoop cluster highlight
}

const RESOURCES: Resource[] = [
  {
    ref:       'REF-RES-001',
    icon:      '◈',
    title:     'Industrial Partnerships',
    metric:    'Eastworld',
    sub:       'Strategic anchor partner',
    detail:    'Exclusive access to proprietary humanoid locomotion datasets via Eastworld collaboration.',
    colSpan:   2,
    highlight: 'autolabel',
  },
  {
    ref:       'REF-RES-002',
    icon:      '⬡',
    title:     'Computing Power',
    metric:    'H100 · 1 000h+',
    sub:       'GPU cluster allocation',
    detail:    'Dedicated H100 cluster capacity supporting large-scale VLM fine-tuning and world model training.',
    highlight: null,
  },
  {
    ref:       'REF-RES-003',
    icon:      '◎',
    title:     'Global Connections',
    metric:    'PhDs · Founders · Events',
    sub:       'Elite advisory network',
    detail:    'Access to top-tier ML PhDs, robotics entrepreneurs, and curated panel events bridging research and industry.',
    highlight: null,
  },
  {
    ref:       'REF-RES-004',
    icon:      '▣',
    title:     'Data Infrastructure',
    metric:    'In-house Pipeline',
    sub:       'Proprietary annotation stack',
    detail:    'End-to-end VLM-automated data processing pipeline — from raw trajectory to benchmark-ready labels.',
    highlight: 'autolabel',
  },
  {
    ref:       'REF-RES-005',
    icon:      '⬟',
    title:     'Hardware Fleet',
    metric:    'Unitree G1',
    sub:       '43-DoF humanoid platform',
    detail:    'High-frequency real-world deployment on Unitree G1 — closing the sim-to-real gap at scale.',
    highlight: 'benchmark',
  },
  {
    ref:       'REF-RES-006',
    icon:      '□',
    title:     'Physical Space',
    metric:    'Incoming Lab Space',
    sub:       'Expanding infrastructure',
    detail:    'Dedicated lab facility in active build-out — enabling collocated hardware, compute, and research operations.',
    highlight: null,
  },
]

// ── Component ─────────────────────────────────────────────────────────────────

export default function ResourceMatrix() {
  const [hovered, setHovered] = useState<number | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const isInView   = useInView(sectionRef, { once: true, margin: '-10%' })

  const handleEnter = (i: number, cluster: BetaCluster) => {
    setHovered(i)
    if (cluster) {
      window.dispatchEvent(new CustomEvent('betaloop:highlight', { detail: { cluster } }))
    }
  }

  const handleLeave = () => {
    setHovered(null)
    window.dispatchEvent(new CustomEvent('betaloop:highlight', { detail: { cluster: null } }))
  }

  return (
    <section
      ref={sectionRef}
      id="resources"
      className="relative w-full overflow-hidden"
      style={{ background: '#F7F7F2', paddingTop: 88, paddingBottom: 96 }}
    >
      {/* Dot texture */}
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 w-full h-full" style={{ opacity: 0.03 }}>
        <defs>
          <pattern id="rm-dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="#1A1A1A"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#rm-dots)"/>
      </svg>

      <div className="max-w-6xl mx-auto px-8 relative">

        {/* ── Header ── */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-mono text-[10px] tracking-[0.35em] uppercase mb-4"
            style={{ color: 'rgba(26,26,26,0.30)' }}>
            [ 03 / RESOURCE_MATRIX ]
          </p>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight"
              style={{ color: '#1A1A1A', lineHeight: 1.1 }}>
              Research Assets &<br/>Infrastructure
            </h2>
            <p style={{
              fontFamily: 'Inter,system-ui,sans-serif',
              fontSize: 11, color: 'rgba(26,26,26,0.38)',
              maxWidth: 260, lineHeight: 1.7,
            }}>
              Core resources enabling end-to-end robotics intelligence research at BETA Lab.
            </p>
          </div>
        </motion.div>

        {/* ── Grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gridTemplateRows: 'auto auto auto',
          gap: 12,
        }}>
          {RESOURCES.map((res, i) => {
            const isHovered = hovered === i
            const isDimmed  = hovered !== null && !isHovered

            return (
              <motion.div
                key={res.ref}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: isDimmed ? 0.4 : 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{
                  opacity: { duration: 0.5, delay: 0.1 + i * 0.07, ease: [0.22, 1, 0.36, 1] },
                  y:       { duration: 0.55, delay: 0.1 + i * 0.07, ease: [0.22, 1, 0.36, 1] },
                }}
                style={{
                  gridColumn: res.colSpan ? `span ${res.colSpan}` : 'span 1',
                  background:  isHovered ? '#FFFFFF' : 'rgba(255,255,255,0.72)',
                  border:      `1px solid ${isHovered ? 'rgba(59,130,246,0.28)' : 'rgba(26,26,26,0.09)'}`,
                  borderRadius: 6,
                  padding:      '22px 24px 20px',
                  cursor:       'default',
                  position:     'relative',
                  transform:    isHovered ? 'translateY(-3px)' : 'translateY(0)',
                  boxShadow:    isHovered
                    ? '0 8px 32px rgba(59,130,246,0.08), 0 2px 8px rgba(0,0,0,0.05)'
                    : '0 1px 4px rgba(0,0,0,0.04)',
                  transition:   'background 0.25s, border-color 0.25s, transform 0.25s, box-shadow 0.25s',
                  backdropFilter:       'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
                onMouseEnter={() => handleEnter(i, res.highlight)}
                onMouseLeave={handleLeave}
              >
                {/* Ref index */}
                <span style={{
                  position:    'absolute',
                  top:         10,
                  right:       14,
                  fontFamily:  "'Roboto Mono',monospace",
                  fontSize:    7.5,
                  letterSpacing:'0.12em',
                  color:       'rgba(26,26,26,0.18)',
                  transition:  'color 0.25s',
                  ...(isHovered ? { color: 'rgba(59,130,246,0.45)' } : {}),
                }}>
                  {res.ref}
                </span>

                {/* Icon */}
                <div style={{
                  width:        32,
                  height:       32,
                  display:      'flex',
                  alignItems:   'center',
                  justifyContent:'center',
                  marginBottom: 14,
                  fontSize:     16,
                  color:        isHovered ? '#3B82F6' : 'rgba(26,26,26,0.30)',
                  transition:   'color 0.25s',
                  border:       `1px solid ${isHovered ? 'rgba(59,130,246,0.3)' : 'rgba(26,26,26,0.10)'}`,
                  borderRadius: 4,
                }}>
                  {res.icon}
                </div>

                {/* Title */}
                <p style={{
                  fontFamily:    "'Roboto Mono',monospace",
                  fontSize:      9,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase' as const,
                  color:         'rgba(26,26,26,0.38)',
                  marginBottom:  6,
                }}>
                  {res.title}
                </p>

                {/* Metric */}
                <h3 style={{
                  fontFamily:   'Inter,system-ui,sans-serif',
                  fontSize:     res.colSpan === 2 ? 22 : 18,
                  fontWeight:   700,
                  letterSpacing:'-0.02em',
                  color:        isHovered ? '#1A1A1A' : 'rgba(26,26,26,0.80)',
                  marginBottom: 4,
                  lineHeight:   1.2,
                  transition:   'color 0.25s',
                }}>
                  {res.metric}
                </h3>

                {/* Sub label */}
                <p style={{
                  fontFamily: 'Inter,system-ui,sans-serif',
                  fontSize:   11,
                  color:      'rgba(26,26,26,0.40)',
                  margin:     0,
                  lineHeight: 1.5,
                }}>
                  {res.sub}
                </p>

                {/* Hover detail */}
                <div style={{
                  overflow:   'hidden',
                  maxHeight:  isHovered ? 80 : 0,
                  opacity:    isHovered ? 1 : 0,
                  marginTop:  isHovered ? 12 : 0,
                  transition: 'max-height 0.3s ease, opacity 0.25s ease, margin-top 0.3s ease',
                }}>
                  <div style={{
                    borderTop:  '1px solid rgba(59,130,246,0.14)',
                    paddingTop: 10,
                  }}>
                    <p style={{
                      fontFamily: 'Inter,system-ui,sans-serif',
                      fontSize:   11,
                      lineHeight: 1.65,
                      color:      'rgba(26,26,26,0.55)',
                      margin:     0,
                    }}>
                      {res.detail}
                    </p>
                  </div>
                </div>

                {/* Loop link indicator */}
                {res.highlight && (
                  <div style={{
                    position:  'absolute',
                    bottom:    12,
                    right:     14,
                    display:   'flex',
                    alignItems:'center',
                    gap:       5,
                    opacity:   isHovered ? 0.7 : 0.2,
                    transition:'opacity 0.25s',
                  }}>
                    <div style={{
                      width: 14, height: 1,
                      background: 'rgba(59,130,246,0.6)',
                      borderRadius: 1,
                    }}/>
                    <span style={{
                      fontFamily:    "'Roboto Mono',monospace",
                      fontSize:      7,
                      letterSpacing: '0.12em',
                      color:         '#3B82F6',
                    }}>
                      LOOP ↑
                    </span>
                  </div>
                )}
              </motion.div>
            )
          })}

          {/* ── Technical Index Decoration Panel ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{
              gridColumn:  'span 2',
              background:  'transparent',
              border:      '1px solid rgba(26,26,26,0.07)',
              borderRadius: 6,
              padding:     '18px 24px',
              display:     'flex',
              alignItems:  'center',
              gap:         40,
            }}
          >
            <div style={{ flexShrink: 0 }}>
              <p style={{
                fontFamily:    "'Roboto Mono',monospace",
                fontSize:      7.5,
                letterSpacing: '0.20em',
                color:         'rgba(26,26,26,0.22)',
                margin:        '0 0 6px',
              }}>
                ASSET INDEX · BETA ROBOTICS LAB
              </p>
              <p style={{
                fontFamily: "'Roboto Mono',monospace",
                fontSize:   9,
                color:      'rgba(26,26,26,0.18)',
                margin:     0,
              }}>
                REF-RES-001 → REF-RES-006 &nbsp;·&nbsp; v2026.05 &nbsp;·&nbsp; CONFIDENTIAL
              </p>
            </div>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' as const }}>
              {[
                { label: 'TOTAL ASSETS', val: '6' },
                { label: 'LOOP LINKED', val: '3' },
                { label: 'STATUS', val: 'ACTIVE' },
              ].map(({ label, val }) => (
                <div key={label} style={{ flexShrink: 0 }}>
                  <p style={{
                    fontFamily:    "'Roboto Mono',monospace",
                    fontSize:      7,
                    letterSpacing: '0.16em',
                    color:         'rgba(26,26,26,0.20)',
                    margin:        '0 0 3px',
                  }}>
                    {label}
                  </p>
                  <p style={{
                    fontFamily:    "'Roboto Mono',monospace",
                    fontSize:      13,
                    fontWeight:    700,
                    color:         'rgba(26,26,26,0.28)',
                    margin:        0,
                    letterSpacing: '0.06em',
                  }}>
                    {val}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
