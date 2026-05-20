import { useState, useEffect } from 'react'

const NAV_ITEMS = [
  { label: 'HOME',      href: '#hero' },
  { label: 'LOOP',      href: '#loop' },
  { label: 'PILLARS',   href: '#pillars' },
  { label: 'COMPANIES', href: '#companies' },
  { label: 'CONTACT',   href: '#contact' },
]

export default function Navbar() {
  const [active, setActive] = useState('HOME')

  // Highlight nav item on scroll
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      if (y < 100) setActive('HOME')
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 32px',
      height: 56,
      background: 'rgba(0,0,0,0.82)',
      backdropFilter: 'blur(12px)',
      borderRadius: 0,
    }}>

      {/* Bottom scan line */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
        background: 'rgba(59,130,246,0.10)',
        pointerEvents: 'none',
      }}/>

      {/* Logo */}
      <a href="#hero" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, textDecoration: 'none' }}>
        <img src="/beta.svg" alt="BETA" style={{ width: 28, height: 28 }} />
        <span style={{
          fontFamily: 'monospace', fontSize: 11, fontWeight: 700,
          letterSpacing: '0.22em', color: 'rgba(255,255,255,0.7)',
          textTransform: 'uppercase',
        }}>
          BETA Robotics Lab
        </span>
      </a>

      {/* Nav items */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
        {NAV_ITEMS.map(({ label, href }) => {
          const isActive = active === label
          return (
            <a
              key={label}
              href={href}
              onClick={() => setActive(label)}
              style={{
                position: 'relative',
                fontFamily: 'sans-serif',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.14em',
                textDecoration: 'none',
                color: isActive ? '#ffffff' : 'rgba(255,255,255,0.45)',
                transition: 'color 0.15s',
                paddingBottom: 4,
              }}
              onMouseEnter={e => {
                if (!isActive) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.75)'
              }}
              onMouseLeave={e => {
                if (!isActive) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)'
              }}
            >
              {label}
              {/* Active indicator — inverted triangle */}
              {isActive && (
                <span style={{
                  position: 'absolute',
                  bottom: -8, left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0, height: 0,
                  borderLeft: '3px solid transparent',
                  borderRight: '3px solid transparent',
                  borderTop: '4px solid rgba(59,130,246,0.85)',
                }}/>
              )}
            </a>
          )
        })}
      </div>

    </nav>
  )
}
