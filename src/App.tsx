import GlobalAtmosphere from './components/GlobalAtmosphere'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ResearchThemes from './components/ResearchThemes'

export default function App() {
  return (
    <div className="relative min-h-screen bg-black text-white">
      <GlobalAtmosphere />
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <ResearchThemes />
      </div>
    </div>
  )
}
