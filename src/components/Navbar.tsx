export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 border-b border-white/10 backdrop-blur-md bg-black/60">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <img src="/beta.svg" alt="BETA" className="w-8 h-8" />
        <span className="text-white font-semibold text-sm tracking-widest uppercase">
          BETA Robotics Lab
        </span>
      </div>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-8">
        {['Data Hub', 'Research', 'Team'].map((item) => (
          <a
            key={item}
            href="#"
            className="text-sm text-white/60 hover:text-white transition-colors duration-200 tracking-wide"
          >
            {item}
          </a>
        ))}
      </div>

      {/* CTA */}
      <button
        className="px-4 py-2 text-sm font-semibold tracking-wide rounded-sm transition-all duration-200 hover:brightness-110"
        style={{ background: '#003262', color: '#ffffff' }}
      >
        [ Book a Demo ]
      </button>
    </nav>
  )
}
