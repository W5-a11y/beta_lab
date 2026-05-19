import RobotBlueprint from './RobotBlueprint'

export default function Hero() {
  return (
    <section className="relative min-h-screen grid-bg flex items-center overflow-hidden pt-20">

      {/* Deep blue glow — top-right */}
      <div
        className="absolute -top-60 -right-60 w-[900px] h-[900px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0,50,98,0.28) 0%, transparent 65%)',
          filter: 'blur(90px)',
        }}
      />

      {/* Deep blue glow — bottom-left */}
      <div
        className="absolute -bottom-60 -left-60 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0,50,98,0.22) 0%, transparent 65%)',
          filter: 'blur(100px)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-20">

        {/* LEFT — Text */}
        <div className="flex flex-col gap-8">

          {/* Status badge */}
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: '#3B82F6' }}
            />
            <span className="text-xs tracking-[0.2em] uppercase font-mono glow-blue-text">
              EST. 2024 · Berkeley, CA · Seed Round Open
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-white">
            Building the{' '}
            <span className="glow-blue-text" style={{ color: '#3B82F6' }}>Human Layer</span>
            <br />
            <span style={{ textShadow: '0 0 20px rgba(59,130,246,0.25)' }}>of Robotics.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-base lg:text-lg leading-relaxed max-w-md" style={{ color: 'rgba(255,255,255,0.5)' }}>
            A closed-loop lab spanning{' '}
            <span className="text-white/75">Data Annotation</span>,{' '}
            <span className="text-white/75">World Models</span>, and{' '}
            <span className="text-white/75">Physical Deployment</span>{' '}
            on Unitree G1.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-6 pt-2">
            <button className="px-6 py-3 text-sm font-medium tracking-wide rounded-lg bg-white text-black transition-opacity duration-200 hover:opacity-90">
              Earn on Data Hub →
            </button>
            <button className="px-6 py-3 text-sm font-medium tracking-wide rounded-lg bg-transparent text-white border border-white/20 transition-all duration-200 hover:bg-white/10">
              Research Deck →
            </button>
          </div>

          {/* KPI strip */}
          <div className="flex gap-8 pt-4 border-t border-white/8 mt-2">
            {[
              { val: '300h+', label: 'Dataset' },
              { val: '80%', label: 'Cost↓' },
              { val: '24ms', label: 'Inference' },
              { val: 'H100', label: 'Cluster' },
            ].map(({ val, label }) => (
              <div key={label} className="flex flex-col gap-1.5">
                <span className="text-xl font-bold text-white">{val}</span>
                <span
                  className="text-[9px] tracking-[0.25em] uppercase font-mono"
                  style={{ color: 'rgba(255,255,255,0.3)' }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Robot Blueprint */}
        <RobotBlueprint />

      </div>
    </section>
  )
}
