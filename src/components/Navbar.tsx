import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_ITEMS = [
  { label: 'HOME',      href: '#hero' },
  { label: 'LOOP',      href: '#loop' },
  { label: 'PILLARS',   href: '#pillars' },
  { label: 'COMPANIES', href: '#companies' },
  { label: 'CONTACT',   href: '#contact' },
]

export default function Navbar() {
  const [active, setActive]   = useState('HOME')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const SECTION_MAP: { label: string; id: string }[] = [
      { label: 'HOME',      id: 'hero' },
      { label: 'LOOP',      id: 'loop' },
      { label: 'PILLARS',   id: 'pillars' },
      { label: 'COMPANIES', id: 'companies' },
      { label: 'CONTACT',   id: 'contact' },
    ]
    const onScroll = () => {
      const scrollMid = window.scrollY + window.innerHeight * 0.35
      let current = 'HOME'
      for (const { label, id } of SECTION_MAP) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= scrollMid) current = label
      }
      setActive(current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const handleNav = (label: string) => {
    setActive(label)
    setMenuOpen(false)
  }

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px',
        height: 56,
        background: 'rgba(0,0,0,0.88)',
        backdropFilter: 'blur(12px)',
      }}>
        {/* Scan line */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
          background: 'rgba(59,130,246,0.10)', pointerEvents: 'none',
        }}/>

        {/* Logo */}
        <a href="#hero" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, textDecoration: 'none' }}>
          <img src="/beta.svg" alt="BETA" style={{ width: 28, height: 28 }} />
          <span style={{
            fontFamily: 'monospace', fontSize: 11, fontWeight: 700,
            letterSpacing: '0.22em', color: 'rgba(255,255,255,0.7)',
          }}>
            BETA Robotics Lab
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex" style={{ alignItems: 'center', gap: 36 }}>
          {NAV_ITEMS.map(({ label, href }) => {
            const isActive = active === label
            return (
              <a
                key={label}
                href={href}
                onClick={() => handleNav(label)}
                style={{
                  position: 'relative',
                  fontFamily: 'sans-serif', fontSize: 11, fontWeight: 600,
                  letterSpacing: '0.14em', textDecoration: 'none',
                  color: isActive ? '#ffffff' : 'rgba(255,255,255,0.45)',
                  transition: 'color 0.15s', paddingBottom: 4,
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.75)' }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)' }}
              >
                {label}
                {isActive && (
                  <span style={{
                    position: 'absolute', bottom: -8, left: '50%',
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

        {/* Hamburger button — mobile only */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(o => !o)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: 8, display: 'flex', flexDirection: 'column',
            gap: 5, alignItems: 'center', justifyContent: 'center',
          }}
          aria-label="Toggle menu"
        >
          <motion.span animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 7 : 0 }}
            style={{ display: 'block', width: 20, height: 1.5, background: 'rgba(255,255,255,0.75)', transformOrigin: 'center' }}
            transition={{ duration: 0.2 }}
          />
          <motion.span animate={{ opacity: menuOpen ? 0 : 1 }}
            style={{ display: 'block', width: 20, height: 1.5, background: 'rgba(255,255,255,0.75)' }}
            transition={{ duration: 0.15 }}
          />
          <motion.span animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -7 : 0 }}
            style={{ display: 'block', width: 20, height: 1.5, background: 'rgba(255,255,255,0.75)', transformOrigin: 'center' }}
            transition={{ duration: 0.2 }}
          />
        </button>
      </nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{
              position: 'fixed', top: 56, left: 0, right: 0, zIndex: 49,
              background: 'rgba(0,0,0,0.96)',
              backdropFilter: 'blur(16px)',
              borderBottom: '1px solid rgba(59,130,246,0.12)',
              display: 'flex', flexDirection: 'column',
            }}
          >
            {NAV_ITEMS.map(({ label, href }, i) => (
              <motion.a
                key={label}
                href={href}
                onClick={() => handleNav(label)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                style={{
                  fontFamily: 'monospace', fontSize: 12, fontWeight: 600,
                  letterSpacing: '0.2em', textDecoration: 'none',
                  color: active === label ? '#ffffff' : 'rgba(255,255,255,0.5)',
                  padding: '16px 28px',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex', alignItems: 'center', gap: 12,
                }}
              >
                {active === label && (
                  <span style={{
                    width: 4, height: 4, borderRadius: '50%',
                    background: 'rgba(59,130,246,0.9)', flexShrink: 0,
                  }}/>
                )}
                {label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
