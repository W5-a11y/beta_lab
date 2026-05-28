import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ConnectiveLine from './components/ConnectiveLine'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import BetaLoop from './components/BetaLoop'
import MoatStack from './components/MoatStack'
import ResourceMatrix from './components/ResourceMatrix'
import Footer from './components/Footer'
import Opening from './components/Opening'

export default function App() {
  const [entered, setEntered] = useState(false)

  return (
    <div style={{ minHeight: '100vh', background: '#F7F7F2', color: '#1A1A1A', overflow: 'hidden' }}>
      <AnimatePresence>
        {!entered && <Opening onEnter={() => setEntered(true)} />}
      </AnimatePresence>

      <ConnectiveLine />

      <AnimatePresence>
        {entered && (
          <motion.div
            key="main"
            className="relative z-10"
            initial={{ opacity: 0, y: 24, scale: 0.97, filter: 'blur(18px)' }}
            animate={{ opacity: 1, y: 0,  scale: 1,    filter: 'blur(0px)'  }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
          >
            <Navbar />
            <Hero />
            <BetaLoop />
            <MoatStack />
            <ResourceMatrix />
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
