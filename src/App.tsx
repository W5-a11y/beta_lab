import { useState } from 'react'
import GlobalAtmosphere from './components/GlobalAtmosphere'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import BetaLoop from './components/BetaLoop'
import ResearchThemes from './components/ResearchThemes'
import MoatStack from './components/MoatStack'
import Footer from './components/Footer'
import Opening from './components/Opening'

export default function App() {
  const [entered, setEntered] = useState(false)

  return (
    <div className="relative min-h-screen bg-black text-white">
      {!entered && <Opening onEnter={() => setEntered(true)} />}
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
