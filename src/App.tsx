import { useState } from 'react'
import ConnectiveLine from './components/ConnectiveLine'
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
    <div style={{ minHeight: '100vh', background: '#F7F7F2', color: '#1A1A1A' }}>
      {!entered && <Opening onEnter={() => setEntered(true)} />}
      <ConnectiveLine />
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
