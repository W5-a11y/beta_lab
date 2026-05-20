import { useEffect, useState } from 'react'
function IconDiscord({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  )
}

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
    <footer id="contact" style={{ background: '#050505', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
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
            {/* Brand logo */}
            <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src="/beta-logo.svg" alt="BETA" style={{ height: 36, width: 'auto' }} />
              <span style={{
                fontFamily: 'monospace',
                fontSize: 9,
                letterSpacing: '0.18em',
                color: 'rgba(255,255,255,0.2)',
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
              <SocialLink href="https://x.com/Beta_ucb" label="X / Twitter">
                <IconX size={18} />
              </SocialLink>
              <SocialLink href="https://www.instagram.com/beta.ucb/" label="Instagram">
                <IconInstagram size={18} />
              </SocialLink>
              <SocialLink href="https://discord.com/invite/u4sFaSkMBZ" label="Discord">
                <IconDiscord size={18} />
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
