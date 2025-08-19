import { useState } from 'react'
import { Shield, Lock, Sparkles } from 'lucide-react'
import '../styles/floating-vault.css'

interface FloatingVaultProps {
  isAuthenticated: boolean
  userType: 'staff' | 'member' | null
  onVaultClick: () => void
}

export default function FloatingVault({ isAuthenticated, userType, onVaultClick }: FloatingVaultProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <>
      {/* Floating Private Vault Button with Orb Motifs */}
      <button
        onClick={onVaultClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500 via-purple-600 to-teal-500 text-white rounded-full shadow-2xl transition-all duration-500 flex items-center justify-center z-40 group breathe-animation"
      >
        {/* Breathing Orb Background Effects */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400/30 via-purple-500/30 to-teal-400/30 animate-pulse"></div>
        
        {/* Floating Orb Motifs */}
        <div className="absolute inset-0 rounded-full">
          {/* Primary orbiting elements */}
          <div 
            className="absolute w-2 h-2 bg-white/40 rounded-full animate-ping"
            style={{
              top: '15%',
              left: '20%',
              animationDelay: '0s',
              animationDuration: '3s'
            }}
          ></div>
          <div 
            className="absolute w-3 h-3 bg-teal-300/50 rounded-full animate-bounce"
            style={{
              top: '25%',
              right: '15%',
              animationDelay: '1s',
              animationDuration: '4s'
            }}
          ></div>
          <div 
            className="absolute w-1.5 h-1.5 bg-purple-300/60 rounded-full animate-pulse"
            style={{
              bottom: '20%',
              left: '25%',
              animationDelay: '2s',
              animationDuration: '3.5s'
            }}
          ></div>
          <div 
            className="absolute w-2.5 h-2.5 bg-indigo-300/40 rounded-full animate-pulse"
            style={{
              bottom: '30%',
              right: '20%',
              animationDelay: '0.5s'
            }}
          ></div>
        </div>

        {/* Central Vault Icon/Image */}
        <div className="relative z-10">
          <img 
            src="/lens_vault.png" 
            alt="Private Vault"
            className="w-10 h-10 sm:w-12 sm:h-12 object-contain filter drop-shadow-lg transition-all duration-300 group-hover:scale-110"
          />
          
          {/* Status indicator orb */}
          <div 
            className={`absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 border-2 border-white rounded-full flex items-center justify-center transition-all duration-300 ${
              isAuthenticated 
                ? 'bg-gradient-to-r from-emerald-400 to-teal-500 animate-pulse' 
                : 'bg-gradient-to-r from-amber-400 to-orange-500'
            }`}
          >
            {isAuthenticated ? (
              <Lock className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" />
            ) : (
              <Shield className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" />
            )}
          </div>
        </div>

        {/* Hover Text - Elegant Style like Claire */}
        <div 
          className="absolute -top-16 left-1/2 transform -translate-x-1/2 translate-x-4 text-white text-sm px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-lg z-50"
          style={{ 
            background: 'linear-gradient(to right, #4f46e5, #7c3aed)'
          }}
        >
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4" />
            <span>Private Vault</span>
            <Shield className="w-4 h-4" />
          </div>
        </div>

        {/* Ripple effect on hover */}
        {isHovered && (
          <div className="absolute inset-0 rounded-full bg-white/10 animate-ping"></div>
        )}
      </button>


    </>
  )
}
