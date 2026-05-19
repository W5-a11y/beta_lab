import RobotBlueprint from './RobotBlueprint'

export default function Hero() {
  return (
    <section className="relative min-h-screen grid-bg flex items-center overflow-hidden pt-20">

      {/* Ambient glow — top-left blue */}
      <div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0,50,98,0.35) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Ambient glow — right purple/blue */}
      <div
        className="absolute top-1/4 right-0 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(80,40,160,0.22) 0%, rgba(0,50,98,0.15) 40%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-20">

        {/* LEFT — Text */}
        <div className="flex flex-col gap-8">

          {/* Status badge */}
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: '#003262' }}
            />
            <span className="text-xs tracking-[0.2em] uppercase font-mono"
              style={{ color: '#003262' }}>
              EST. 2024 · Berkeley, CA · Seed Round Open
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-white">
            Building the{' '}
            <span style={{ color: '#003262' }}>Human Layer</span>
            <br />of Robotics.
          </h1>

          {/* Subheadline */}
          <p className="text-base lg:text-lg leading-relaxed max-w-md" style={{ color: 'rgba(255,255,255,0.55)' }}>
            A closed-loop lab spanning{' '}
            <span className="text-white/80">Data Annotation</span>,{' '}
            <span className="text-white/80">World Models</span>, and{' '}
            <span className="text-white/80">Physical Deployment</span>{' '}
            on Unitree G1.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              className="px-6 py-3 text-sm font-semibold tracking-wide rounded-sm text-white transition-all duration-200 hover:brightness-110"
              style={{ background: '#FDB515' }}
            >
              Earn on Data Hub →
            </button>
            <button
              className="px-6 py-3 text-sm font-semibold tracking-wide rounded-sm transition-all duration-200 hover:bg-white/10"
              style={{
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'rgba(255,255,255,0.85)',
              }}
            >
              Research Deck →
            </button>
          </div>

          {/* KPI strip */}
          <div className="flex gap-8 pt-4 border-t border-white/10 mt-2">
            {[
              { val: '300h+', label: 'Dataset' },
              { val: '80%', label: 'Cost↓' },
              { val: '24ms', label: 'Inference' },
              { val: 'H100', label: 'Cluster' },
            ].map(({ val, label }) => (
              <div key={label} className="flex flex-col gap-1">
                <span className="text-xl font-bold text-white">{val}</span>
                <span className="text-[10px] tracking-widest uppercase font-mono" style={{ color: '#003262' }}>
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
