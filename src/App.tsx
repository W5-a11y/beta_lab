import GlobalAtmosphere from './components/GlobalAtmosphere'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import BetaLoop from './components/BetaLoop'
import ResearchThemes from './components/ResearchThemes'
import MoatStack from './components/MoatStack'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="relative min-h-screen bg-black text-white">
      <GlobalAtmosphere />
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <BetaLoop />
        <ResearchThemes />
        <MoatStack />
        <Footer />
      </div>
    </div>
  )
}
