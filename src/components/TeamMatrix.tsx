import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Data ──────────────────────────────────────────────────────────────────────

const GROUPS = [
  {
    id: '01_CORE',
    members: [
      {
        id: 'rl',   index: '01',
        title: 'Research Lead',
        accent: 'gold',
        status: 'ACTIVE',
        specs: [
          { tag: 'DIRECTION', desc: 'Technical Strategy & Exp. Design' },
          { tag: 'OUTPUT',    desc: 'Paper Writing' },
        ],
      },
      {
        id: 'die',  index: '02',
        title: 'Data Infra Engineer',
        accent: null,
        status: 'ACTIVE',
        specs: [
          { tag: 'SYSTEM', desc: 'Data Pipeline & Tooling' },
          { tag: 'EVAL',   desc: 'Automated Benchmarks' },
        ],
      },
      {
        id: 'mle',  index: '03',
        title: 'ML Research Engineer',
        accent: 'blue',
        status: 'ACTIVE',
        specs: [
          { tag: 'CORE', desc: 'Fine-tuning & Ablation' },
          { tag: 'EVAL', desc: 'Model Evaluation' },
        ],
      },
      {
        id: 'wms',  index: '04',
        title: 'World Model Specialist',
        accent: null,
        status: 'OPEN',
        specs: [
          { tag: 'SCOPE', desc: 'VLA Models & Latent Dynamics' },
        ],
      },
    ],
  },
  {
    id: '02_ADVISORY',
    members: [
      {
        id: 'ld',   index: '05',
        title: 'Lab Director',
        accent: 'gold',
        status: 'ACTIVE',
        specs: [
          { tag: 'LEAD', desc: 'Partnership & Resource Allocation' },
        ],
      },
      {
        id: 'adv',  index: '06',
        title: 'Advisors',
        accent: null,
        status: 'ACTIVE',
        specs: [
          { tag: 'GUIDANCE', desc: 'Strategic Review & Academic Backing' },
        ],
      },
    ],
  },
  {
    id: '03_RESOURCE',
    members: [
      {
        id: 'ops',  index: '07',
        title: 'Operations & Fellows',
        accent: null,
        status: 'ACTIVE',
        specs: [
          { tag: 'HUB', desc: 'Community & Hardware Scheduling' },
        ],
      },
    ],
  },
]

type MemberId = 'rl' | 'die' | 'mle' | 'wms' | 'ld' | 'adv' | 'ops'

interface Member {
  id: string
  index: string
  title: string
  accent: string | null
  status: string
  specs: { tag: string; desc: string }[]
}

// Corner system labels (4 corners)
const CORNER_LABELS = [
  { corner: 'tl', lines: ['LOG_SYS: ACTIVE', 'BUILD: v_1_3'] },
  { corner: 'tr', lines: ['NODE_LATENCY: —ms', 'COORD_X: 124.5'] },
  { corner: 'bl', lines: ['MEM: 0x4FA2', 'PROC: NOMINAL'] },
  { corner: 'br', lines: ['UPLINK: OK', 'SYS_T: —'] },
]

const ACCENT_COLORS: Record<string, string> = {
  gold: 'rgba(212,175,55,0.9)',
  blue: 'rgba(96,165,250,0.9)',
}

const STATUS_COLOR: Record<string, string> = {
  ACTIVE: 'rgba(74,222,128,0.7)',
  OPEN:   'rgba(251,191,36,0.7)',
}

// Dots string: repeating periods to fill space between title and status
function dots(n = 28) { return '.'.repeat(n) }

// ── Live corner data ──────────────────────────────────────────────────────────

function useLiveCorner() {
  const [lat,  setLat]  = useState(12)
  const [time, setTime] = useState('')

  useEffect(() => {
    const tick = () => {
      setLat(Math.floor(8 + Math.random() * 18))
      const d = new Date()
      setTime(`${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`)
    }
    tick()
    const id = setInterval(tick, 1500)
    return () => clearInterval(id)
  }, [])

  return { lat, time }
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function TeamMatrix() {
  const [active, setActive]   = useState<MemberId | null>(null)
  const [scanY,  setScanY]    = useState<number | null>(null)
  const sectionRef            = useRef<HTMLElement>(null)
  const { lat, time }         = useLiveCorner()

  const allMembers: Member[] = GROUPS.flatMap(g => g.members)
  const activeSpecs   = allMembers.find(m => m.id === active)?.specs ?? null
  const activeMember  = allMembers.find(m => m.id === active) ?? null

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect()
    if (rect) setScanY(e.clientY - rect.top)
  }, [])

  const onMouseLeave = useCallback(() => setScanY(null), [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-black py-32 overflow-hidden"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <style>{`
        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes probe-focus {
          0%   { transform: scale(1.06) rotate(0.4deg); opacity: 0.4; }
          60%  { transform: scale(0.98) rotate(-0.2deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
      `}</style>

      {/* ── Dot grid background ── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}/>

      {/* ── Horizontal scan line (follows mouse) ── */}
      {scanY !== null && (
        <div style={{
          position: 'absolute',
          left: 0, right: 0,
          top: scanY,
          height: 1,
          background: 'linear-gradient(to right, transparent 5%, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.06) 80%, transparent 95%)',
          pointerEvents: 'none',
          transition: 'top 0.04s linear',
        }}/>
      )}

      {/* ── Corner system labels ── */}
      {/* Top-left */}
      <div style={{ position:'absolute', top:20, left:24, pointerEvents:'none' }}>
        <p style={cornerStyle}>LOG_SYS: ACTIVE</p>
        <p style={cornerStyle}>BUILD: v_1_3</p>
      </div>
      {/* Top-right */}
      <div style={{ position:'absolute', top:20, right:24, textAlign:'right', pointerEvents:'none' }}>
        <p style={cornerStyle}>NODE_LATENCY: {lat}ms</p>
        <p style={cornerStyle}>COORD_X: 124.5</p>
      </div>
      {/* Bottom-left */}
      <div style={{ position:'absolute', bottom:20, left:24, pointerEvents:'none' }}>
        <p style={cornerStyle}>MEM: 0x4FA2</p>
        <p style={cornerStyle}>PROC: NOMINAL</p>
      </div>
      {/* Bottom-right */}
      <div style={{ position:'absolute', bottom:20, right:24, textAlign:'right', pointerEvents:'none' }}>
        <p style={cornerStyle}>UPLINK: OK</p>
        <p style={cornerStyle}>SYS_T: {time}</p>
      </div>

      {/* ── Content ── */}
      <div className="max-w-6xl mx-auto px-8">

        {/* Section header */}
        <div className="mb-20">
          <p style={{
            fontFamily: 'monospace', fontSize: 10, fontWeight: 700,
            letterSpacing: '0.3em', color: 'rgba(59,130,246,0.5)',
            marginBottom: 14,
          }}>
            [ 03 / TEAM_MATRIX ]
          </p>
          <h2 style={{
            fontFamily: 'monospace', fontSize: 28, fontWeight: 800,
            letterSpacing: '-0.02em', color: 'rgba(255,255,255,0.95)',
          }}>
            PERSONNEL_STRUCTURE
          </h2>
        </div>

        {/* Matrix body */}
        <div style={{ display: 'flex', position: 'relative' }}>

          {/* ── Left: post list ── */}
          <div style={{ width: '52%', flexShrink: 0 }}>
            {GROUPS.map((group, gi) => (
              <div key={group.id} style={{ marginBottom: gi < GROUPS.length - 1 ? 36 : 0 }}>
                {/* Group label */}
                <p style={{
                  fontFamily: 'monospace', fontSize: 9, fontWeight: 700,
                  letterSpacing: '0.25em', color: 'rgba(255,255,255,0.18)',
                  marginBottom: 12,
                }}>
                  {group.id}
                </p>

                {group.members.map((member) => {
                  const isActive    = active === member.id
                  const accentColor = member.accent ? ACCENT_COLORS[member.accent] : null
                  const statusColor = STATUS_COLOR[member.status] ?? 'rgba(255,255,255,0.3)'

                  return (
                    <div
                      key={member.id}
                      style={{ padding: '8px 0', cursor: 'default' }}
                      onMouseEnter={() => setActive(member.id as MemberId)}
                      onMouseLeave={() => setActive(null)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>

                        {/* Index */}
                        <span style={{
                          fontFamily: 'monospace', fontSize: 10,
                          color: isActive
                            ? (accentColor ?? 'rgba(255,255,255,0.55)')
                            : 'rgba(255,255,255,0.18)',
                          marginRight: 10, flexShrink: 0,
                          transition: 'color 0.05s',
                        }}>
                          [{member.index}]
                        </span>

                        {/* Blink cursor */}
                        <span style={{
                          fontFamily: 'monospace', fontSize: 12,
                          color: accentColor ?? 'rgba(255,255,255,0.7)',
                          width: 12, flexShrink: 0, marginRight: 6,
                          opacity: isActive ? 1 : 0,
                          animation: isActive ? 'cursor-blink 0.9s step-end infinite' : 'none',
                        }}>
                          ▮
                        </span>

                        {/* Title */}
                        <span style={{
                          fontFamily: 'monospace', fontSize: 13, fontWeight: isActive ? 700 : 500,
                          letterSpacing: '0.06em', textTransform: 'uppercase',
                          color: isActive
                            ? (accentColor ?? 'rgba(255,255,255,0.95)')
                            : 'rgba(255,255,255,0.40)',
                          transition: 'color 0.05s',
                          flexShrink: 0,
                        }}>
                          {member.title}
                        </span>

                        {/* Dots fill */}
                        <span style={{
                          fontFamily: 'monospace', fontSize: 11,
                          color: isActive ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.07)',
                          flex: 1, overflow: 'hidden', whiteSpace: 'nowrap',
                          letterSpacing: '0.05em',
                          margin: '0 8px',
                          transition: 'color 0.05s',
                        }}>
                          {dots(40)}
                        </span>

                        {/* Status badge */}
                        <span style={{
                          fontFamily: 'monospace', fontSize: 9, fontWeight: 700,
                          letterSpacing: '0.15em',
                          color: isActive ? statusColor : 'rgba(255,255,255,0.15)',
                          flexShrink: 0,
                          transition: 'color 0.05s',
                        }}>
                          [{member.status}]
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>

          {/* ── Center divider ── */}
          <div style={{ width: 1, flexShrink: 0, position: 'relative' }}>
            <div style={{
              position: 'absolute', top: 0, bottom: 0, left: 0, width: 1,
              background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.1) 10%, rgba(255,255,255,0.1) 90%, transparent)',
            }}/>
            {[15, 35, 55, 75].map(pct => (
              <span key={pct} style={{
                position: 'absolute', top: `${pct}%`, left: -4,
                fontFamily: 'monospace', fontSize: 8,
                color: 'rgba(255,255,255,0.18)',
                userSelect: 'none', lineHeight: 1,
              }}>+</span>
            ))}
          </div>

          {/* ── Right: Detail Probe ── */}
          <div style={{ flex: 1, paddingLeft: 44, paddingTop: 0 }}>
            <DetailProbe member={activeMember} accentColors={ACCENT_COLORS} />
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Detail Probe sub-component ────────────────────────────────────────────────

// Deterministic binary string from seed char codes
function binCode(seed: string, len = 8) {
  let n = 0
  for (let i = 0; i < seed.length; i++) n = (n * 31 + seed.charCodeAt(i)) & 0xffff
  return (n >>> 0).toString(2).padStart(16, '0').slice(0, len)
}

// Waveform heights — sine-wave pattern seeded by string
function waveHeights(seed: string, count = 36) {
  const arr: number[] = []
  for (let i = 0; i < count; i++) {
    const v = Math.abs(Math.sin(i * 0.42 + seed.charCodeAt(0) * 0.1) * 0.7 +
                       Math.sin(i * 0.9  + seed.charCodeAt(1) * 0.07) * 0.3)
    arr.push(4 + Math.round(v * 20))
  }
  return arr
}

const LOREM_CODE = [
  '$ init_probe --mode=eval --strict',
  '> loading weight manifold ....  OK',
  '> cross_ref: world_model_v2.3   OK',
  '> assert latency < 20ms ......  12ms',
  '> checkpoint: ./runs/exp_014',
  '> sync upstream .................',
]

interface DetailProbeProps {
  member: Member | null
  accentColors: Record<string, string>
}

function DetailProbe({ member, accentColors }: DetailProbeProps) {
  const accentColor = member?.accent ? accentColors[member.accent] : 'rgba(255,255,255,0.25)'
  const waves = useMemo(() => waveHeights(member?.id ?? 'idle'), [member?.id])

  return (
    <div style={{
      position: 'relative',
      height: '100%', minHeight: 320,
      display: 'flex', flexDirection: 'column',
    }}>

      {/* ── Crosshair background ── */}
      <div
        key={member?.id ?? 'idle'}
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          animation: member ? 'probe-focus 0.35s ease-out' : 'none',
        }}
      >
        {/* Horizontal hair */}
        <div style={{
          position: 'absolute', top: '50%', left: 0, right: 0, height: 1,
          background: `linear-gradient(to right, transparent, ${accentColor.replace('0.9','0.06')} 20%, ${accentColor.replace('0.9','0.06')} 80%, transparent)`,
        }}/>
        {/* Vertical hair */}
        <div style={{
          position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1,
          background: `linear-gradient(to bottom, transparent, ${accentColor.replace('0.9','0.06')} 20%, ${accentColor.replace('0.9','0.06')} 80%, transparent)`,
        }}/>
        {/* Centre dot */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 4, height: 4, borderRadius: '50%',
          transform: 'translate(-50%,-50%)',
          background: accentColor.replace('0.9','0.08'),
        }}/>
      </div>

      {/* ── Corner L-brackets ── */}
      {[
        { t: 0,    l: 0,    bt: 'top',    bl: 'left',  coord: 'R-204 / SEC-9' },
        { t: 0,    r: 0,    bt: 'top',    bl: 'right', coord: 'R-204 / SEC-9' },
        { b: 0,    l: 0,    bt: 'bottom', bl: 'left',  coord: 'D-017 / NET-2' },
        { b: 0,    r: 0,    bt: 'bottom', bl: 'right', coord: 'D-017 / NET-2' },
      ].map((c, ci) => (
        <div key={ci} style={{
          position: 'absolute',
          ...(c.t !== undefined ? { top: c.t } : {}),
          ...(c.b !== undefined ? { bottom: c.b } : {}),
          ...(c.l !== undefined ? { left: c.l } : {}),
          ...(c.r !== undefined ? { right: c.r } : {}),
          pointerEvents: 'none',
        }}>
          {/* L-shape via two divs */}
          <div style={{ position: 'relative', width: 14, height: 14 }}>
            <div style={{
              position: 'absolute',
              [c.bt]: 0, [c.bl]: 0,
              width: 14, height: 1,
              background: accentColor.replace('0.9','0.3'),
            }}/>
            <div style={{
              position: 'absolute',
              [c.bt]: 0, [c.bl]: 0,
              width: 1, height: 14,
              background: accentColor.replace('0.9','0.3'),
            }}/>
          </div>
          <p style={{
            fontFamily: 'monospace', fontSize: 7,
            color: accentColor.replace('0.9','0.25'),
            letterSpacing: '0.08em',
            marginTop: c.bt === 'top' ? 3 : 0,
            marginBottom: c.bt === 'bottom' ? 3 : 0,
            whiteSpace: 'nowrap',
            position: 'absolute',
            [c.bt]: 16,
            [c.bl]: 0,
          }}>
            {c.coord}
          </p>
        </div>
      ))}

      {/* ── Content area ── */}
      <div style={{ position: 'relative', flex: 1, padding: '24px 20px 20px' }}>
        <AnimatePresence mode="wait">
          {member ? (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Classification label */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: accentColor.replace('0.9','0.08'),
                border: `1px solid ${accentColor.replace('0.9','0.18')}`,
                padding: '2px 8px',
                marginBottom: 14,
              }}>
                <span style={{
                  fontFamily: 'monospace', fontSize: 8, fontWeight: 700,
                  letterSpacing: '0.18em',
                  color: accentColor.replace('0.9','0.7'),
                }}>
                  [ CLASSIFICATION: CONFIDENTIAL ]
                </span>
              </div>

              {/* Title */}
              <h3 style={{
                fontFamily: 'monospace', fontSize: 15, fontWeight: 800,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.9)',
                marginBottom: 20,
              }}>
                {member.title}
              </h3>

              {/* Spec rows with status dot + binary */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 22 }}>
                {member.specs.map(({ tag, desc }, si) => (
                  <div key={tag}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      {/* Status dot */}
                      <span style={{
                        width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                        background: si === 0 ? accentColor : accentColor.replace('0.9','0.45'),
                        boxShadow: si === 0 ? `0 0 6px ${accentColor.replace('0.9','0.5')}` : 'none',
                        display: 'inline-block',
                      }}/>
                      {/* Binary prefix */}
                      <span style={{
                        fontFamily: 'monospace', fontSize: 9,
                        color: accentColor.replace('0.9','0.4'),
                        letterSpacing: '0.06em',
                      }}>
                        {binCode(tag + si)}_
                      </span>
                      {/* Tag */}
                      <span style={{
                        fontFamily: 'monospace', fontSize: 9, fontWeight: 700,
                        letterSpacing: '0.15em',
                        color: accentColor.replace('0.9','0.6'),
                      }}>
                        [{tag}]
                      </span>
                    </div>
                    <p style={{
                      fontFamily: 'monospace', fontSize: 13,
                      color: 'rgba(255,255,255,0.82)',
                      letterSpacing: '0.02em', lineHeight: 1.5,
                      paddingLeft: 14,
                    }}>
                      {desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Lorem code block */}
              <div style={{
                borderLeft: `1px solid ${accentColor.replace('0.9','0.12')}`,
                paddingLeft: 12, marginBottom: 24,
              }}>
                {LOREM_CODE.map((line, li) => (
                  <p key={li} style={{
                    fontFamily: 'monospace', fontSize: 9,
                    color: `rgba(255,255,255,${0.08 + li * 0.015})`,
                    letterSpacing: '0.05em', lineHeight: 1.9,
                  }}>
                    {line}
                  </p>
                ))}
              </div>

              {/* Waveform signature */}
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, marginBottom: 6, height: 28 }}>
                  {waves.map((h, wi) => (
                    <div key={wi} style={{
                      width: 2, height: h,
                      background: wi % 7 === 0
                        ? accentColor.replace('0.9','0.5')
                        : accentColor.replace('0.9','0.18'),
                      flexShrink: 0,
                    }}/>
                  ))}
                </div>
                <p style={{
                  fontFamily: 'monospace', fontSize: 8, fontWeight: 700,
                  letterSpacing: '0.18em',
                  color: accentColor.replace('0.9','0.3'),
                }}>
                  VALIDATED BY BETA_CORE_PROTOCOL
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                height: '100%', minHeight: 240,
              }}
            >
              <p style={{
                fontFamily: 'monospace', fontSize: 10,
                color: 'rgba(255,255,255,0.08)',
                letterSpacing: '0.2em',
              }}>
                AWAITING_TARGET →
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────

const cornerStyle: React.CSSProperties = {
  fontFamily: 'monospace',
  fontSize: 9,
  letterSpacing: '0.1em',
  color: 'rgba(255,255,255,0.1)',
  lineHeight: 1.8,
  userSelect: 'none',
}
