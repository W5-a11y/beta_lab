import { useState } from 'react'

// ── Data ──────────────────────────────────────────────────────────────────────

const GROUPS = [
  {
    id: '01_CORE',
    members: [
      {
        id: 'rl',
        title: 'Research Lead',
        accent: 'gold',
        specs: [
          { tag: 'DIRECTION', desc: 'Technical Strategy & Exp. Design' },
          { tag: 'OUTPUT',    desc: 'Paper Writing' },
        ],
      },
      {
        id: 'die',
        title: 'Data Infra Engineer',
        accent: null,
        specs: [
          { tag: 'SYSTEM', desc: 'Data Pipeline & Tooling' },
          { tag: 'EVAL',   desc: 'Automated Benchmarks' },
        ],
      },
      {
        id: 'mle',
        title: 'ML Research Engineer',
        accent: 'blue',
        specs: [
          { tag: 'CORE', desc: 'Fine-tuning & Ablation' },
          { tag: 'EVAL', desc: 'Model Evaluation' },
        ],
      },
      {
        id: 'wms',
        title: 'World Model Specialist',
        accent: null,
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
        id: 'ld',
        title: 'Lab Director',
        accent: 'gold',
        specs: [
          { tag: 'LEAD', desc: 'Partnership & Resource Allocation' },
        ],
      },
      {
        id: 'adv',
        title: 'Advisors',
        accent: null,
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
        id: 'ops',
        title: 'Operations & Fellows',
        accent: null,
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
  title: string
  accent: string | null
  specs: { tag: string; desc: string }[]
}

// Random-looking background coordinate labels
const BG_COORDS = [
  { x: '7%',  y: '12%', label: '45.2°' },
  { x: '88%', y: '8%',  label: 'SYS_ACTIVE' },
  { x: '3%',  y: '55%', label: '0xF3A' },
  { x: '91%', y: '44%', label: '12.0ms' },
  { x: '15%', y: '88%', label: 'LAT_OK' },
  { x: '75%', y: '78%', label: '∂v/∂t' },
  { x: '50%', y: '5%',  label: 'NODE_03' },
  { x: '62%', y: '93%', label: '—0.91' },
]

const ACCENT_COLORS: Record<string, string> = {
  gold: 'rgba(212,175,55,0.9)',
  blue: 'rgba(96,165,250,0.9)',
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function TeamMatrix() {
  const [active, setActive] = useState<MemberId | null>(null)

  const allMembers: Member[] = GROUPS.flatMap(g => g.members)
  const activeSpecs = allMembers.find(m => m.id === active)?.specs ?? null
  const activeMember = allMembers.find(m => m.id === active) ?? null

  return (
    <section className="relative w-full bg-black py-32 overflow-hidden">

      {/* Background coordinate ghost labels */}
      {BG_COORDS.map(({ x, y, label }) => (
        <span key={label} style={{
          position: 'absolute', left: x, top: y,
          fontFamily: 'monospace', fontSize: 9,
          color: 'rgba(255,255,255,0.04)',
          letterSpacing: '0.1em',
          pointerEvents: 'none', userSelect: 'none',
          whiteSpace: 'nowrap',
        }}>
          {label}
        </span>
      ))}

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
        <div style={{ display: 'flex', gap: 0, position: 'relative' }}>

          {/* ── Left: post list ── */}
          <div style={{ width: '44%', flexShrink: 0 }}>
            {GROUPS.map((group, gi) => (
              <div key={group.id} style={{ marginBottom: gi < GROUPS.length - 1 ? 40 : 0 }}>
                {/* Group label */}
                <p style={{
                  fontFamily: 'monospace', fontSize: 9, fontWeight: 700,
                  letterSpacing: '0.25em', color: 'rgba(255,255,255,0.2)',
                  marginBottom: 14,
                }}>
                  {group.id}
                </p>

                {group.members.map((member) => {
                  const isActive = active === member.id
                  const accentColor = member.accent ? ACCENT_COLORS[member.accent] : null
                  return (
                    <div
                      key={member.id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '9px 0',
                        cursor: 'default',
                      }}
                      onMouseEnter={() => setActive(member.id as MemberId)}
                      onMouseLeave={() => setActive(null)}
                    >
                      {/* Cursor indicator */}
                      <span style={{
                        fontFamily: 'monospace', fontSize: 13,
                        color: accentColor ?? 'rgba(255,255,255,0.7)',
                        width: 14, flexShrink: 0,
                        opacity: isActive ? 1 : 0,
                        animation: isActive ? 'cursor-blink 0.9s step-end infinite' : 'none',
                        transition: 'opacity 0.05s',
                      }}>
                        ▮
                      </span>

                      {/* Title */}
                      <span style={{
                        fontFamily: 'monospace',
                        fontSize: 13,
                        fontWeight: isActive ? 700 : 500,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase' as const,
                        color: isActive
                          ? (accentColor ?? 'rgba(255,255,255,0.95)')
                          : 'rgba(255,255,255,0.38)',
                        transition: 'color 0.05s, font-weight 0.05s',
                      }}>
                        {member.title}
                      </span>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>

          {/* ── Center divider line ── */}
          <div style={{ width: 1, flexShrink: 0, position: 'relative', marginRight: 0 }}>
            {/* Full-height line */}
            <div style={{
              position: 'absolute', top: 0, bottom: 0, left: 0, width: 1,
              background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.12) 10%, rgba(255,255,255,0.12) 90%, transparent)',
            }}/>
            {/* Tick marks */}
            {[20, 40, 60, 80].map(pct => (
              <div key={pct} style={{
                position: 'absolute', top: `${pct}%`, left: -3,
                fontFamily: 'monospace', fontSize: 8,
                color: 'rgba(255,255,255,0.2)',
                userSelect: 'none',
              }}>
                +
              </div>
            ))}
          </div>

          {/* ── Right: spec panel ── */}
          <div style={{ flex: 1, paddingLeft: 48, paddingTop: 2 }}>
            {activeSpecs ? (
              <div>
                {/* Member title echo */}
                <p style={{
                  fontFamily: 'monospace', fontSize: 10, fontWeight: 700,
                  letterSpacing: '0.2em',
                  color: activeMember?.accent
                    ? ACCENT_COLORS[activeMember.accent]
                    : 'rgba(255,255,255,0.3)',
                  marginBottom: 20,
                  textTransform: 'uppercase',
                }}>
                  {activeMember?.title}
                </p>

                {/* Spec rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {activeSpecs.map(({ tag, desc }) => (
                    <div key={tag} style={{ display: 'flex', gap: 0, alignItems: 'flex-start' }}>
                      <span style={{
                        fontFamily: 'monospace', fontSize: 10, fontWeight: 700,
                        letterSpacing: '0.12em',
                        color: activeMember?.accent
                          ? ACCENT_COLORS[activeMember.accent]
                          : 'rgba(255,255,255,0.35)',
                        flexShrink: 0,
                        marginRight: 14,
                        marginTop: 1,
                      }}>
                        [ {tag} ]
                      </span>
                      <span style={{
                        fontFamily: 'monospace', fontSize: 14,
                        color: 'rgba(255,255,255,0.88)',
                        letterSpacing: '0.01em',
                        lineHeight: 1.5,
                      }}>
                        {desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p style={{
                fontFamily: 'monospace', fontSize: 10,
                color: 'rgba(255,255,255,0.1)',
                letterSpacing: '0.15em',
              }}>
                HOVER_TO_INSPECT →
              </p>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </section>
  )
}
