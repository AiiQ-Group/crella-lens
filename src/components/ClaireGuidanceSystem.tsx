import React, { useState, useEffect } from 'react'
import { Lightbulb, Target, TrendingUp, Shield, Zap, ChevronRight, X } from 'lucide-react'

interface GuidanceStep {
  id: string
  title: string
  description: string
  action?: string
  priority: 'high' | 'medium' | 'low'
  icon: React.ReactNode
  trigger: 'upload' | 'analyze' | 'compare' | 'vault' | 'monetize' | 'idle'
}

interface ClaireGuidanceSystemProps {
  userType: 'guest' | 'member' | 'staff'
  currentAction?: string
  hasUploadedImage?: boolean
  hasAnalysis?: boolean
  isVisible?: boolean
  onClose?: () => void
}

export function ClaireGuidanceSystem({ 
  userType, 
  currentAction = 'idle',
  hasUploadedImage = false,
  hasAnalysis = false,
  isVisible = true,
  onClose 
}: ClaireGuidanceSystemProps) {
  const [currentGuidance, setCurrentGuidance] = useState<GuidanceStep | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  // Define intelligent guidance based on context and user type
  const getContextualGuidance = (): GuidanceStep[] => {
    const baseGuidance: GuidanceStep[] = []

    // Upload guidance
    if (!hasUploadedImage) {
      baseGuidance.push({
        id: 'initial-upload',
        title: 'Start with Visual Intelligence',
        description: 'Drop any image to get instant AI-powered analysis of authenticity, digital fingerprints, and content intelligence.',
        action: 'Upload your first image',
        priority: 'high',
        icon: <Target className="w-4 h-4" />,
        trigger: 'upload'
      })
    }

    // Analysis guidance
    if (hasUploadedImage && !hasAnalysis) {
      baseGuidance.push({
        id: 'analyze-image',
        title: 'Discover Hidden Insights',
        description: 'Your image contains layers of information. Let me analyze authenticity, detect AI generation, and extract digital forensics.',
        action: 'Get instant analysis',
        priority: 'high',
        icon: <Zap className="w-4 h-4" />,
        trigger: 'analyze'
      })
    }

    // Comparison guidance
    if (hasAnalysis) {
      baseGuidance.push({
        id: 'compare-images',
        title: 'Compare for Deeper Truth',
        description: 'Upload multiple images to compare authenticity, detect patterns, and verify consistency across sources.',
        action: 'Add comparison image',
        priority: 'medium',
        icon: <Shield className="w-4 h-4" />,
        trigger: 'compare'
      })
    }

    // VIP-specific guidance
    if (userType === 'guest' && hasAnalysis) {
      baseGuidance.push({
        id: 'upgrade-vip',
        title: 'Unlock Premium Intelligence',
        description: 'VIP members get advanced multi-agent analysis, secure vault storage, and trading intelligence insights.',
        action: 'Upgrade to VIP',
        priority: 'medium',
        icon: <TrendingUp className="w-4 h-4" />,
        trigger: 'monetize'
      })
    }

    // Vault guidance for members
    if ((userType === 'member' || userType === 'staff') && hasAnalysis) {
      baseGuidance.push({
        id: 'save-vault',
        title: 'Secure Your Intelligence',
        description: 'Save analyses to your private vault with cryptographic proof and complete data sovereignty.',
        action: 'Save to Private Vault',
        priority: 'medium',
        icon: <Shield className="w-4 h-4" />,
        trigger: 'vault'
      })
    }

    return baseGuidance.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  }

  // Update guidance based on context
  useEffect(() => {
    const guidance = getContextualGuidance()
    if (guidance.length > 0) {
      setCurrentGuidance(guidance[0]) // Show highest priority guidance
    }
  }, [userType, hasUploadedImage, hasAnalysis, currentAction])

  // Don't show if not visible or no guidance
  if (!isVisible || !currentGuidance) return null

  const handleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="fixed bottom-24 right-6 z-30 max-w-sm">
      {/* Claire's Guidance Card */}
      <div className="bg-gradient-to-br from-blue-900/95 via-blue-800/95 to-purple-900/95 backdrop-blur-sm rounded-2xl border border-blue-500/30 shadow-2xl overflow-hidden">
        {/* Header with Claire's Avatar */}
        <div className="flex items-center p-4 pb-2">
          <div className="relative">
            <img
              src="/claire_profile.png"
              alt="Claire"
              className="w-8 h-8 rounded-full border border-blue-400/50"
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-blue-900 animate-pulse"></div>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-white text-sm font-medium">Claire's Guidance</p>
            <div className="flex items-center">
              <Lightbulb className="w-3 h-3 text-yellow-400 mr-1" />
              <span className="text-yellow-300 text-xs">{currentGuidance.priority.toUpperCase()} PRIORITY</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Guidance Content */}
        <div className="px-4 pb-4">
          <div className="flex items-start mb-3">
            <div className="p-1 bg-blue-500/20 rounded-lg mr-3 mt-1">
              {currentGuidance.icon}
            </div>
            <div className="flex-1">
              <h4 className="text-white font-medium text-sm mb-1">
                {currentGuidance.title}
              </h4>
              <p className="text-blue-200 text-xs leading-relaxed">
                {isExpanded ? currentGuidance.description : 
                 currentGuidance.description.substring(0, 80) + (currentGuidance.description.length > 80 ? '...' : '')
                }
              </p>
            </div>
          </div>

          {/* Action Button */}
          {currentGuidance.action && (
            <div className="flex items-center space-x-2">
              <button
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-xs px-3 py-2 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {currentGuidance.action}
                <ChevronRight className="w-3 h-3 inline ml-1" />
              </button>
              <button
                onClick={handleExpand}
                className="text-blue-300 hover:text-white text-xs transition-colors"
              >
                {isExpanded ? 'Less' : 'More'}
              </button>
            </div>
          )}

          {/* User Type Context */}
          <div className="mt-3 pt-2 border-t border-blue-500/20">
            <div className="flex items-center justify-between">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                userType === 'guest' 
                  ? 'bg-gray-500/20 text-gray-400'
                  : userType === 'staff'
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {userType.toUpperCase()} Mode
              </span>
              <span className="text-blue-300 text-xs">
                Step {hasUploadedImage ? hasAnalysis ? '3' : '2' : '1'} of 5
              </span>
            </div>
          </div>
        </div>

        {/* Breathing Animation */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 to-purple-400/5 animate-pulse"></div>
        </div>
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center mt-2 space-x-1">
        {[1, 2, 3, 4, 5].map((step) => (
          <div
            key={step}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              step <= (hasUploadedImage ? hasAnalysis ? 3 : 2 : 1)
                ? 'bg-blue-400'
                : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

// Hook to manage guidance visibility and state
export function useClaireGuidance() {
  const [showGuidance, setShowGuidance] = useState(true)
  const [hasSeenGuidance, setHasSeenGuidance] = useState(false)

  useEffect(() => {
    // Check if user has dismissed guidance before
    const dismissed = localStorage.getItem('claire-guidance-dismissed')
    if (dismissed) {
      setShowGuidance(false)
      setHasSeenGuidance(true)
    }
  }, [])

  const dismissGuidance = () => {
    setShowGuidance(false)
    localStorage.setItem('claire-guidance-dismissed', 'true')
    setHasSeenGuidance(true)
  }

  const showGuidanceAgain = () => {
    setShowGuidance(true)
    localStorage.removeItem('claire-guidance-dismissed')
  }

  return {
    showGuidance,
    hasSeenGuidance,
    dismissGuidance,
    showGuidanceAgain
  }
}

// Context-aware guidance suggestions
export const GuidanceContexts = {
  UPLOAD: 'upload',
  ANALYZE: 'analyze', 
  COMPARE: 'compare',
  VAULT: 'vault',
  MONETIZE: 'monetize',
  IDLE: 'idle'
} as const
