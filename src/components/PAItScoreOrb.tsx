import React from 'react'

interface PAItScoreOrbProps {
  score: number | 'UNR'
  size?: 'small' | 'medium' | 'large'
}

export default function PAItScoreOrb({ score, size = 'medium' }: PAItScoreOrbProps) {
  // Get the appropriate pAIt orb image based on score
  const getPAItImage = (score: number | 'UNR') => {
    if (score === 'UNR' || score === 0 || score === -1) return '/pAIt/pAIt_logoGrey.png' // UNR - Unrated
    if (typeof score === 'number' && score >= 800) return '/pAIt/pAIt-logoGreen.png' // Green uses dash
    if (typeof score === 'number' && score >= 600) return '/pAIt/pAIt_logoYellow.png' // Yellow uses underscore
    return '/pAIt/pAIt_logoRed.png' // Red uses underscore
  }

  // Get size classes for different orb sizes
  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'small':
        return {
          container: 'w-16 h-16',
          score: 'text-sm font-bold',
        }
      case 'large':
        return {
          container: 'w-32 h-32',
          score: 'text-3xl font-bold',
        }
      default: // medium
        return {
          container: 'w-24 h-24',
          score: 'text-xl font-bold',
        }
    }
  }

  const imageSrc = getPAItImage(score)
  const sizeClasses = getSizeClasses(size)

  return (
    <div className={`relative ${sizeClasses.container} mx-auto`}>
      {/* pAIt Orb Image */}
      <img 
        src={imageSrc} 
        alt={`pAIt™ Rating ${score}`}
        className="w-full h-full object-contain"
        style={{
          filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3))'
        }}
      />
      
      {/* Score Overlay - Centered */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className={`text-white ${sizeClasses.score}`}
          style={{ 
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.8), 0 0 8px rgba(0, 0, 0, 0.6)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontWeight: 900,
            letterSpacing: score === 'UNR' ? '0.05em' : '-0.05em'
          }}
        >
          {score === 'UNR' ? 'UNR' : score}
        </div>
      </div>

      {/* Subtle Glow Animation */}
      <div 
        className="absolute inset-0 rounded-full animate-pulse opacity-30 pointer-events-none"
        style={{
          background: score === 'UNR' || score === 0 || score === -1
            ? 'radial-gradient(circle, transparent 60%, rgba(156, 163, 175, 0.2) 100%)' // grey glow
            : typeof score === 'number' && score >= 800 
            ? 'radial-gradient(circle, transparent 60%, rgba(34, 197, 94, 0.2) 100%)'
            : typeof score === 'number' && score >= 600 
            ? 'radial-gradient(circle, transparent 60%, rgba(234, 179, 8, 0.2) 100%)'
            : 'radial-gradient(circle, transparent 60%, rgba(239, 68, 68, 0.2) 100%)'
        }}
      />
    </div>
  )
}

// Additional variant for inline scores
export function PAItScoreInline({ score }: { score: number }) {
  const colors = score >= 800 ? 'text-green-400' : score >= 600 ? 'text-yellow-400' : 'text-red-400'
  
  return (
    <span className={`inline-flex items-center space-x-1 ${colors} font-bold`}>
      <span className="text-xs">pAIt™</span>
      <span>{score}</span>
    </span>
  )
}
