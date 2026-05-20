import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconDiscord({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  )
}

function IconX({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4l16 16M20 4L4 20"/>
    </svg>
  )
}

function IconInstagram({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
    </svg>
  )
}

// ── Live stats ────────────────────────────────────────────────────────────────

function useLiveStats() {
  const [latency, setLatency] = useState(24)
  const [uptime,  setUptime]  = useState('99.97%')
  const [ts,      setTs]      = useState('')

  useEffect(() => {
    const tick = () => {
      setLatency(Math.floor(18 + Math.random() * 14))
      setUptime(`${(99.9 + Math.random() * 0.09).toFixed(2)}%`)
      const d = new Date()
      setTs(d.toISOString().replace('T', ' ').slice(0, 19) + ' UTC')
    }
    tick()
    const id = setInterval(tick, 4000)
    return () => clearInterval(id)
  }, [])

  return { latency, uptime, ts }
}

// ── Link components ───────────────────────────────────────────────────────────

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [hov, setHov] = useState(false)
  return (
    <a
      href={href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontFamily:     "Inter,'Helvetica Neue',system-ui,sans-serif",
        fontSize:       12,
        letterSpacing:  '0.06em',
        color:          hov ? '#1E3A8A' : 'rgba(26,26,26,0.50)',
        textDecoration: 'none',
        transition:     'color 0.22s ease',
        display:        'inline-block',
      }}
    >
      {children}
    </a>
  )
}

function SocialBtn({
  href, label, children,
}: { href: string; label: string; children: React.ReactNode }) {
  const [hov, setHov] = useState(false)
  return (
    <motion.a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      animate={{ y: hov ? -3 : 0, color: hov ? '#1E3A8A' : 'rgba(26,26,26,0.35)' }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display:    'inline-flex',
        padding:    '7px',
        background: hov ? 'rgba(30,58,138,0.06)' : 'transparent',
        border:     `1px solid ${hov ? 'rgba(30,58,138,0.20)' : 'rgba(26,26,26,0.10)'}`,
        borderRadius: 4,
        transition: 'background 0.22s, border-color 0.22s',
        color:      hov ? '#1E3A8A' : 'rgba(26,26,26,0.35)',
      }}
    >
      {children}
    </motion.a>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'About',    href: '#' },
  { label: 'Research', href: '#loop' },
  { label: 'Stack',    href: '#companies' },
  { label: 'Contact',  href: 'mailto:beta.ucberkeley@gmail.com' },
  { label: 'Careers',  href: '#' },
]

export default function Footer() {
  const { latency, uptime, ts } = useLiveStats()

  return (
    <footer
      id="contact"
      style={{
        background:  '#F7F7F2',
        borderTop:   '1px solid rgba(0,0,0,0.08)',
        position:    'relative',
        overflow:    'hidden',
      }}
    >
      {/* Very faint dot texture */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 w-full h-full"
        style={{ opacity: 0.025 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="footer-dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.8" fill="#1A1A1A"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#footer-dots)"/>
      </svg>

      <div className="max-w-6xl mx-auto px-8" style={{ paddingTop: 72, paddingBottom: 48 }}>

        {/* ── Main three-column layout ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 48, marginBottom: 56 }}>

          {/* Left: Brand */}
          <div style={{ minWidth: 220 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <img src="/beta-logo.svg" alt="BETA" style={{ height: 30, width: 'auto' }}/>
              <span style={{
                fontFamily:    "'Roboto Mono',monospace",
                fontSize:      8,
                letterSpacing: '0.20em',
                color:         'rgba(26,26,26,0.35)',
                textTransform: 'uppercase' as const,
              }}>
                ROBOTICS LAB
              </span>
            </div>
            <p style={{
              fontFamily:  "Inter,system-ui,sans-serif",
              fontSize:    12,
              lineHeight:  1.75,
              color:       'rgba(26,26,26,0.42)',
              maxWidth:    240,
              margin:      0,
            }}>
              Bridging academic excellence and industry innovation for the next generation of
              builders in AI, Robotics, and Embodied Intelligence.
            </p>
            <p style={{
              fontFamily:    "'Roboto Mono',monospace",
              fontSize:      9,
              letterSpacing: '0.06em',
              color:         'rgba(26,26,26,0.28)',
              marginTop:     14,
              margin:        '14px 0 0',
            }}>
              Rooted in Berkeley &amp; Stanford
            </p>
          </div>

          {/* Center: Navigation */}
          <div>
            <p style={{
              fontFamily:    "'Roboto Mono',monospace",
              fontSize:      8,
              fontWeight:    700,
              letterSpacing: '0.22em',
              color:         'rgba(26,26,26,0.28)',
              marginBottom:  18,
              textTransform: 'uppercase' as const,
            }}>
              Navigation
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {NAV_LINKS.map(({ label, href }) => (
                <NavLink key={label} href={href}>{label}</NavLink>
              ))}
            </div>
          </div>

          {/* Right: Contact + Social */}
          <div>
            <p style={{
              fontFamily:    "'Roboto Mono',monospace",
              fontSize:      8,
              fontWeight:    700,
              letterSpacing: '0.22em',
              color:         'rgba(26,26,26,0.28)',
              marginBottom:  18,
              textTransform: 'uppercase' as const,
            }}>
              Connect
            </p>
            <NavLink href="mailto:beta.ucberkeley@gmail.com">
              beta.ucberkeley@gmail.com
            </NavLink>
            <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
              <SocialBtn href="https://x.com/Beta_ucb" label="X / Twitter">
                <IconX size={15}/>
              </SocialBtn>
              <SocialBtn href="https://www.instagram.com/beta.ucb/" label="Instagram">
                <IconInstagram size={15}/>
              </SocialBtn>
              <SocialBtn href="https://discord.com/invite/u4sFaSkMBZ" label="Discord">
                <IconDiscord size={15}/>
              </SocialBtn>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '0.5px', background: 'rgba(0,0,0,0.08)', marginBottom: 20 }}/>

        {/* ── Bottom bar ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{
            fontFamily:    "'Roboto Mono',monospace",
            fontSize:      9,
            letterSpacing: '0.10em',
            color:         'rgba(26,26,26,0.35)',
            margin:        0,
          }}>
            © 2026 BETA — Berkeley Emerging Technology Association
          </p>

          {/* Live system metadata strip */}
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {[
              { label: 'LATENCY',       val: `${latency}ms` },
              { label: 'UPTIME',        val: uptime },
              { label: 'PROTOCOL',      val: 'Embodied-AI-v1.0' },
              { label: 'STATUS',        val: 'Active' },
            ].map(({ label, val }) => (
              <span key={label} style={{
                fontFamily:    "'Roboto Mono',monospace",
                fontSize:      8,
                letterSpacing: '0.08em',
                color:         'rgba(26,26,26,0.20)',
                whiteSpace:    'nowrap' as const,
              }}>
                <span style={{ color: 'rgba(26,26,26,0.30)' }}>{label}:</span>{' '}
                <span style={{ color: 'rgba(30,58,138,0.35)' }}>{val}</span>
              </span>
            ))}
            {ts && (
              <span style={{
                fontFamily:    "'Roboto Mono',monospace",
                fontSize:      8,
                letterSpacing: '0.06em',
                color:         'rgba(26,26,26,0.16)',
                whiteSpace:    'nowrap' as const,
              }}>
                {ts}
              </span>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
