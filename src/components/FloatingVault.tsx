import { useState } from 'react'
import { Shield, Lock, Sparkles } from 'lucide-react'

interface FloatingVaultProps {
  isAuthenticated: boolean
  userType: 'staff' | 'member' | null
  onVaultClick: () => void
}

export default function FloatingVault({ isAuthenticated, userType, onVaultClick }: FloatingVaultProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <>
      {/* Clean Floating Private Vault Button */}
      <button
        onClick={onVaultClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 transition-all duration-500 z-40 group"
      >
        {/* Large Clean Vault Image */}
        <div className="relative">
          <img 
            src="/lens_vault.png" 
            alt="Private Vault"
            className="w-20 h-20 sm:w-24 sm:h-24 object-contain filter drop-shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_20px_rgba(99,102,241,0.5)]"
          />
          
          {/* Status indicator - positioned for larger image */}
          <div 
            className={`absolute -top-2 -right-2 w-6 h-6 border-2 border-white rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
              isAuthenticated 
                ? 'bg-gradient-to-r from-emerald-400 to-teal-500 animate-pulse' 
                : 'bg-gradient-to-r from-amber-400 to-orange-500'
            }`}
          >
            {isAuthenticated ? (
              <Lock className="w-3 h-3 text-white" />
            ) : (
              <Shield className="w-3 h-3 text-white" />
            )}
          </div>
        </div>

        {/* Hover Text - Positioned for larger vault */}
        <div 
          className="absolute -top-20 left-1/2 transform -translate-x-1/2 text-white text-sm px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-lg z-50"
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
      </button>


    </>
  )
}
