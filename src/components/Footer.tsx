import { useEffect, useState } from 'react'
import { MessageCircle } from 'lucide-react'

function IconX({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4l16 16M20 4L4 20" />
    </svg>
  )
}

function IconInstagram({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
    </svg>
  )
}

// ── Simulated system stats ────────────────────────────────────────────────────

function useLiveStats() {
  const [latency, setLatency]   = useState(24)
  const [uptime,  setUptime]    = useState('99.97%')
  const [ts,      setTs]        = useState('')

  useEffect(() => {
    const tick = () => {
      setLatency(Math.floor(18 + Math.random() * 14))
      setUptime(`${(99.9 + Math.random() * 0.09).toFixed(2)}%`)
      const d = new Date()
      setTs(
        d.toISOString().replace('T', ' ').slice(0, 19) + ' UTC'
      )
    }
    tick()
    const id = setInterval(tick, 4000)
    return () => clearInterval(id)
  }, [])

  return { latency, uptime, ts }
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SocialLink({
  href, label, children,
}: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-flex',
        color: 'rgba(255,255,255,0.4)',
        transition: 'color 0.18s, transform 0.18s',
      }}
      onMouseEnter={e => {
        ;(e.currentTarget as HTMLElement).style.color = 'rgba(212,175,55,0.9)'
        ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)'
        ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
      }}
    >
      {children}
    </a>
  )
}

function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      style={{
        fontFamily: 'monospace',
        fontSize: 12,
        color: 'rgba(255,255,255,0.55)',
        textDecoration: 'none',
        display: 'inline-block',
        transition: 'color 0.18s, transform 0.18s',
      }}
      onMouseEnter={e => {
        ;(e.currentTarget as HTMLElement).style.color = 'rgba(96,165,250,0.9)'
        ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)'
        ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
      }}
    >
      {children}
    </a>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function Footer() {
  const { latency, uptime, ts } = useLiveStats()

  return (
    <footer style={{ background: '#050505', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="max-w-6xl mx-auto px-8 pt-16 pb-8">

        {/* 3-column grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '0 48px',
          alignItems: 'start',
          marginBottom: 48,
        }}>

          {/* ── Left: Mission ── */}
          <div>
            {/* Monochrome wordmark */}
            <div style={{ marginBottom: 20 }}>
              <span style={{
                fontFamily: 'monospace',
                fontSize: 20,
                fontWeight: 900,
                letterSpacing: '0.12em',
                color: 'rgba(212,175,55,0.85)',
              }}>
                BETA
              </span>
              <span style={{
                fontFamily: 'monospace',
                fontSize: 9,
                letterSpacing: '0.18em',
                color: 'rgba(255,255,255,0.2)',
                marginLeft: 10,
                verticalAlign: 'middle',
              }}>
                ROBOTICS LAB
              </span>
            </div>

            <p style={{
              fontSize: 13,
              lineHeight: 1.75,
              color: 'rgba(255,255,255,0.4)',
              maxWidth: 280,
            }}>
              Bridging academic excellence and industry innovation for the next generation of
              builders in AI, Robotics, and Blockchain.
            </p>
          </div>

          {/* ── Middle: Contact ── */}
          <div>
            <p style={{
              fontFamily: 'monospace',
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.22em',
              color: 'rgba(255,255,255,0.25)',
              marginBottom: 18,
            }}>
              [ CONTACT_ACCESS ]
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <TextLink href="mailto:beta.ucberkeley@gmail.com">
                beta.ucberkeley@gmail.com
              </TextLink>

              <p style={{
                fontSize: 12,
                color: 'rgba(255,255,255,0.28)',
                lineHeight: 1.6,
              }}>
                Founded by students from<br />UC Berkeley and Stanford.
              </p>
            </div>
          </div>

          {/* ── Right: Social ── */}
          <div>
            <p style={{
              fontFamily: 'monospace',
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.22em',
              color: 'rgba(255,255,255,0.25)',
              marginBottom: 20,
            }}>
              [ CONNECT ]
            </p>

            <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
              <SocialLink href="https://x.com" label="X / Twitter">
                <IconX size={18} />
              </SocialLink>
              <SocialLink href="https://instagram.com" label="Instagram">
                <IconInstagram size={18} />
              </SocialLink>
              <SocialLink href="https://discord.com" label="Discord">
                <MessageCircle size={18} strokeWidth={1.5} />
              </SocialLink>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 20 }} />

        {/* Bottom bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}>
          {/* Copyright */}
          <p style={{
            fontFamily: 'monospace',
            fontSize: 10,
            letterSpacing: '0.18em',
            color: 'rgba(255,255,255,0.18)',
            flex: 1,
            textAlign: 'center',
          }}>
            © 2026 BETA | Berkeley Emerging Technology Association. All rights reserved.
          </p>

          {/* System stat chip — bottom-right */}
          <div style={{
            display: 'flex',
            gap: 20,
            flexShrink: 0,
          }}>
            {[
              { label: 'LATENCY', val: `${latency}ms` },
              { label: 'UPTIME',  val: uptime },
              { label: 'TS',      val: ts },
            ].map(({ label, val }) => (
              <span key={label} style={{
                fontFamily: 'monospace',
                fontSize: 9,
                color: 'rgba(255,255,255,0.15)',
                letterSpacing: '0.08em',
                whiteSpace: 'nowrap',
              }}>
                <span style={{ color: 'rgba(212,175,55,0.25)' }}>{label}:</span> {val}
              </span>
            ))}
          </div>
        </div>

      </div>
    </footer>
  )
}
