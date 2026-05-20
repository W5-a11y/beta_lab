import { motion } from 'framer-motion'

interface Props {
  href: string
  color?: string
}

export default function SectionArrow({ href, color = 'rgba(255,255,255,0.28)' }: Props) {
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, margin: '-10%' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        textDecoration: 'none',
        cursor: 'pointer',
        position: 'relative',
        zIndex: 20,
      }}
    >
      {/* Animated chevron */}
      <motion.svg
        width="18"
        height="10"
        viewBox="0 0 18 10"
        fill="none"
        animate={{ y: [0, 5, 0] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
      >
        <path
          d="M1 1L9 9L17 1"
          stroke={color}
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.svg>
    </motion.a>
  )
}
