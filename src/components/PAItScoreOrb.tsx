import React from 'react'
import { motion } from 'framer-motion'

interface PAItScoreOrbProps {
  score: number
  size?: 'small' | 'medium' | 'large'
  animated?: boolean
  className?: string
}

export function PAItScoreOrb({ 
  score, 
  size = 'medium', 
  animated = true, 
  className = '' 
}: PAItScoreOrbProps) {
  // Determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 2400) return { bg: 'from-purple-500 to-indigo-600', text: 'text-white', label: 'Framework' }
    if (score >= 2000) return { bg: 'from-green-500 to-emerald-600', text: 'text-white', label: 'Strategic' }
    if (score >= 1600) return { bg: 'from-yellow-500 to-orange-500', text: 'text-white', label: 'Working' }
    if (score >= 1200) return { bg: 'from-blue-500 to-cyan-500', text: 'text-white', label: 'Learning' }
    return { bg: 'from-gray-500 to-gray-600', text: 'text-white', label: 'Unrated' }
  }

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'small':
        return { orb: 'w-12 h-12', text: 'text-xs', label: 'text-[8px]' }
      case 'large':
        return { orb: 'w-24 h-24', text: 'text-lg', label: 'text-xs' }
      default:
        return { orb: 'w-16 h-16', text: 'text-sm', label: 'text-[10px]' }
    }
  }

  const colors = getScoreColor(score)
  const sizes = getSizeClasses(size)

  return (
    <motion.div 
      className={`relative inline-flex items-center justify-center ${className}`}
      initial={animated ? { scale: 0, rotate: -180 } : {}}
      animate={animated ? { scale: 1, rotate: 0 } : {}}
      transition={animated ? { type: "spring", stiffness: 200, damping: 15 } : {}}
    >
      {/* Main Orb */}
      <motion.div
        className={`${sizes.orb} bg-gradient-to-br ${colors.bg} rounded-full flex flex-col items-center justify-center shadow-lg relative overflow-hidden`}
        animate={animated ? { 
          boxShadow: [
            "0 4px 20px rgba(139, 92, 246, 0.3)",
            "0 8px 30px rgba(139, 92, 246, 0.4)",
            "0 4px 20px rgba(139, 92, 246, 0.3)"
          ]
        } : {}}
        transition={animated ? { 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        } : {}}
      >
        {/* Animated Background Pattern */}
        {animated && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
        
        {/* Score Text */}
        <div className={`${colors.text} font-bold ${sizes.text} z-10 leading-none`}>
          {score.toLocaleString()}
        </div>
        
        {/* pAIt Label */}
        <div className={`${colors.text} ${sizes.label} font-medium opacity-90 z-10 leading-none mt-0.5`}>
          pAIt™
        </div>
      </motion.div>

      {/* Pulsing Ring */}
      {animated && (
        <motion.div
          className={`absolute ${sizes.orb} border-2 border-current rounded-full opacity-30`}
          style={{ color: colors.bg.includes('green') ? '#10b981' : colors.bg.includes('yellow') ? '#f59e0b' : '#8b5cf6' }}
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.3, 0, 0.3]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
      
      {/* Category Badge */}
      {size === 'large' && (
        <motion.div 
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-black/50 backdrop-blur-sm text-white text-xs font-medium rounded-full border border-white/20"
          initial={animated ? { opacity: 0, y: 10 } : {}}
          animate={animated ? { opacity: 1, y: 0 } : {}}
          transition={animated ? { delay: 0.5 } : {}}
        >
          {colors.label}
        </motion.div>
      )}
    </motion.div>
  )
}

export default PAItScoreOrb