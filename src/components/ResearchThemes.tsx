import { motion } from 'framer-motion'
import { useState } from 'react'

const THEMES = [
  {
    id: 'autolabel',
    index: '01',
    title: 'Auto-Labeling Pipeline',
    subtitle: 'Robot Manipulation Data',
    description: 'VLM-powered annotation of robot data — reducing manual labeling costs by 80%.',
    bullets: [
      'Goal arrow + action verb',
      'Trajectory captions',
      'Grasp point detection',
    ],
    stat: '80%',
    statLabel: 'Cost Reduction',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <rect x="4" y="8" width="22" height="16" rx="2"
          stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.5"/>
        <circle cx="28" cy="28" r="7" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M24 28l3 3 5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 14h10M8 18h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
      </svg>
    ),
  },
  {
    id: 'worldmodel',
    index: '02',
    title: 'Action-Conditioned World Models',
    subtitle: 'Latent Dynamics & Evaluation',
    description: 'Predict future states from trajectory captions — a pre-deployment evaluation proxy.',
    bullets: [
      'N-step future rollout',
      'Risk filtering before execution',
      'Language-conditioned dynamics',
    ],
    stat: 'N-step',
    statLabel: 'Future Rollout',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <circle cx="20" cy="20" r="12" stroke="currentColor" strokeWidth="1.2" opacity="0.4"/>
        <circle cx="20" cy="20" r="6" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M20 8v4M20 28v4M8 20h4M28 20h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
        <circle cx="20" cy="20" r="2" fill="currentColor"/>
      </svg>
    ),
  },
  {
    id: 'benchmark',
    index: '03',
    title: 'Real-World Benchmarking',
    subtitle: 'Unitree G1 Deployment',
    description: 'End-to-end validation on Unitree G1 — linking annotation quality to real success rate.',
    bullets: [
      '23–43 DoF humanoid platform',
      'Dual-track: sim + physical',
      'Full-chain success measurement',
    ],
    stat: 'G1',
    statLabel: 'Unitree Platform',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <rect x="14" y="4" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M20 14v6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M10 20h20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M10 20v10a2 2 0 002 2h4v-6h8v6h4a2 2 0 002-2V20"
          stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M6 20l4 0M30 20l4 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
      </svg>
    ),
  },
] as const

export default function ResearchThemes() {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <section className="relative py-32 px-8 overflow-hidden">

      {/* Section header */}
      <div className="max-w-7xl mx-auto mb-20 text-center">
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase mb-4"
          style={{ color: 'rgba(59,130,246,0.6)' }}>
          [ 02 / RESEARCH_THEMES ]
        </p>
        <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-5">
          Three Interconnected Research Pillars
        </h2>
        <p className="text-base max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Each theme feeds the next — annotation unlocks training,
          training unlocks evaluation, evaluation closes the loop.
        </p>
      </div>

      {/* Card flow */}
      <div className="max-w-7xl mx-auto relative">

        {/* Connector line — behind cards */}
        <div className="hidden lg:block absolute top-[88px] left-[calc(33.33%-20px)] right-[calc(33.33%-20px)] h-px"
          style={{
            background: 'repeating-linear-gradient(90deg, rgba(59,130,246,0.35) 0px, rgba(59,130,246,0.35) 6px, transparent 6px, transparent 14px)',
          }}
        />
        {/* Arrow dots on connector */}
        {[33.5, 66.5].map((pct) => (
          <div key={pct}
            className="hidden lg:block absolute top-[82px] w-3 h-3 rounded-full"
            style={{
              left: `${pct}%`,
              background: '#3B82F6',
              boxShadow: '0 0 8px 2px rgba(59,130,246,0.6)',
            }}
          />
        ))}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {THEMES.map((theme, i) => {
            const isHovered = hovered === theme.id
            return (
              <motion.div
                key={theme.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                onMouseEnter={() => setHovered(theme.id)}
                onMouseLeave={() => setHovered(null)}
                className="relative rounded-xl p-6 flex flex-col gap-5 cursor-default transition-all duration-300"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: isHovered
                    ? '1px solid rgba(59,130,246,0.5)'
                    : '1px solid rgba(255,255,255,0.07)',
                  boxShadow: isHovered
                    ? '0 0 24px rgba(59,130,246,0.12), 0 0 60px rgba(59,130,246,0.06)'
                    : 'none',
                }}
              >
                {/* Index tag */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-[0.25em]"
                    style={{ color: 'rgba(59,130,246,0.5)' }}>
                    {theme.index} / 03
                  </span>
                  <motion.div
                    animate={{ color: isHovered ? '#3B82F6' : 'rgba(255,255,255,0.3)' }}
                    transition={{ duration: 0.25 }}
                  >
                    {theme.icon}
                  </motion.div>
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-lg font-bold text-white leading-snug mb-1">
                    {theme.title}
                  </h3>
                  <p className="font-mono text-[10px] tracking-widest uppercase"
                    style={{ color: 'rgba(59,130,246,0.55)' }}>
                    {theme.subtitle}
                  </p>
                </div>

                {/* Description */}
                <p className="text-sm leading-relaxed"
                  style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {theme.description}
                </p>

                {/* Bullets */}
                <ul className="flex flex-col gap-2">
                  {theme.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-xs"
                      style={{ color: 'rgba(255,255,255,0.45)' }}>
                      <span className="mt-[5px] w-1 h-1 rounded-full shrink-0"
                        style={{ background: 'rgba(59,130,246,0.6)' }} />
                      {b}
                    </li>
                  ))}
                </ul>

                {/* Stat */}
                <div className="mt-auto pt-4 border-t flex items-end gap-3"
                  style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                  <span className="text-2xl font-extrabold text-white">{theme.stat}</span>
                  <span className="font-mono text-[9px] tracking-[0.2em] uppercase mb-1"
                    style={{ color: 'rgba(255,255,255,0.3)' }}>
                    {theme.statLabel}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
