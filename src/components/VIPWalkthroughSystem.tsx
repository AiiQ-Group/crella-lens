import React, { useState, useEffect } from 'react'
import { Crown, Users, Shield, Zap, Target, TrendingUp, Eye, Lock, ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react'

interface WalkthroughStep {
  id: string
  title: string
  description: string
  features: string[]
  cta: string
  highlight?: string
  userTypes: ('guest' | 'member' | 'staff')[]
  isUpgrade?: boolean
}

interface VIPWalkthroughSystemProps {
  userType: 'guest' | 'member' | 'staff'
  isOpen: boolean
  onClose: () => void
  onUpgrade?: () => void
}

export function VIPWalkthroughSystem({ userType, isOpen, onClose, onUpgrade }: VIPWalkthroughSystemProps) {
  const [currentStep, setCurrentStep] = useState(0)
  
  if (!isOpen) return null

  // Define walkthrough steps based on user type
  const getWalkthroughSteps = (): WalkthroughStep[] => {
    if (userType === 'guest') {
      return [
        {
          id: 'guest-welcome',
          title: 'Welcome to Crella-Lens',
          description: 'Experience AI-powered visual intelligence with basic analysis capabilities.',
          features: [
            'Upload and analyze images instantly',
            'Basic authenticity checking',
            'Simple pAIt™ scoring',
            'Claire\'s basic guidance'
          ],
          cta: 'Start Analyzing',
          userTypes: ['guest']
        },
        {
          id: 'guest-limitations',
          title: 'Guest Preview Mode',
          description: 'You\'re seeing a preview of our capabilities. Full power requires VIP access.',
          features: [
            'Limited analysis depth',
            'Basic digital forensics only',
            'No vault storage',
            'No comparison tools'
          ],
          cta: 'See Limitations',
          highlight: 'Preview Mode Active',
          userTypes: ['guest']
        },
        {
          id: 'vip-upgrade',
          title: 'Unlock Full Intelligence',
          description: 'VIP membership gives you complete access to advanced AI orchestration.',
          features: [
            'Advanced multi-agent analysis',
            'Secure private vault storage',
            'Image comparison tools',
            'Trading intelligence insights',
            'Premium Claire guidance',
            'Cryptographic proof of ownership'
          ],
          cta: 'Upgrade to VIP',
          highlight: 'Transform Your Analysis',
          userTypes: ['guest'],
          isUpgrade: true
        }
      ]
    }

    if (userType === 'member') {
      return [
        {
          id: 'vip-welcome',
          title: 'VIP Member Access',
          description: 'Welcome to the full Crella-Lens experience with advanced AI capabilities.',
          features: [
            'Advanced visual intelligence',
            'Multi-agent AI orchestration',
            'Secure vault storage',
            'Image comparison tools',
            'Trading strategy insights'
          ],
          cta: 'Explore VIP Features',
          highlight: 'Full Access Granted',
          userTypes: ['member']
        },
        {
          id: 'vault-power',
          title: 'Private Vault Storage',
          description: 'Your analyses are securely stored with cryptographic proof and complete data sovereignty.',
          features: [
            'Encrypted storage',
            'Blockchain verification',
            'Export capabilities',
            'Audit trails',
            'Complete privacy'
          ],
          cta: 'Access Your Vault',
          userTypes: ['member']
        },
        {
          id: 'trading-intelligence',
          title: 'Trading Intelligence',
          description: 'Transform visual insights into actionable trading signals through pAIt™ strategic scoring.',
          features: [
            'Market pattern recognition',
            'Strategic risk assessment',
            'Portfolio analysis',
            'Real-time signals',
            'Historical correlation'
          ],
          cta: 'Analyze Trading Patterns',
          userTypes: ['member']
        }
      ]
    }

    // Staff access
    return [
      {
        id: 'staff-welcome',
        title: 'Staff Administrator Access',
        description: 'Complete platform access with development tools and advanced analytics.',
        features: [
          'All VIP features',
          'Admin panel access',
          'Development tools',
          'Analytics dashboard',
          'User management',
          'System monitoring'
        ],
        cta: 'Access Admin Panel',
        highlight: 'Administrator Privileges',
        userTypes: ['staff']
      },
      {
        id: 'system-control',
        title: 'System Orchestration',
        description: 'Direct access to AI models, system logs, and platform configuration.',
        features: [
          'Direct AI model access',
          'System configuration',
          'Performance monitoring',
          'User analytics',
          'Revenue tracking'
        ],
        cta: 'View System Status',
        userTypes: ['staff']
      }
    ]
  }

  const steps = getWalkthroughSteps()

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onClose()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleCTA = () => {
    const currentStepData = steps[currentStep]
    if (currentStepData.isUpgrade && onUpgrade) {
      onUpgrade()
    } else {
      // Handle other CTAs based on step
      console.log('CTA clicked for step:', currentStepData.id)
    }
  }

  const getUserTypeIcon = () => {
    switch (userType) {
      case 'guest': return <Users className="w-6 h-6 text-gray-400" />
      case 'member': return <Crown className="w-6 h-6 text-yellow-400" />
      case 'staff': return <Shield className="w-6 h-6 text-purple-400" />
    }
  }

  const getUserTypeColor = () => {
    switch (userType) {
      case 'guest': return 'from-gray-900 via-gray-800 to-gray-900 border-gray-700'
      case 'member': return 'from-yellow-900/20 via-yellow-800/20 to-orange-900/20 border-yellow-500/30'
      case 'staff': return 'from-purple-900/20 via-purple-800/20 to-indigo-900/20 border-purple-500/30'
    }
  }

  const current = steps[currentStep]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className={`relative bg-gradient-to-br ${getUserTypeColor()} rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="p-8 pb-0">
          <div className="flex items-center space-x-3 mb-6">
            {getUserTypeIcon()}
            <div>
              <h2 className="text-2xl font-bold text-white">
                {userType === 'guest' ? 'Guest Walkthrough' : 
                 userType === 'member' ? 'VIP Member Guide' : 
                 'Staff Administrator Guide'}
              </h2>
              <p className="text-gray-400 text-sm">
                {userType === 'guest' ? 'Preview Mode - Limited Features' :
                 userType === 'member' ? 'Full Access - Premium Features' :
                 'Administrator Access - All Features'}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">Progress</span>
              <span className="text-xs text-gray-500">{currentStep + 1} of {steps.length}</span>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  userType === 'guest' ? 'bg-gray-400' :
                  userType === 'member' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                  'bg-gradient-to-r from-purple-500 to-indigo-500'
                }`}
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 pt-0">
          {/* Step Content */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className={`p-4 rounded-full ${
                userType === 'guest' ? 'bg-gray-800 border border-gray-600' :
                userType === 'member' ? 'bg-yellow-500/10 border border-yellow-500/30' :
                'bg-purple-500/10 border border-purple-500/30'
              }`}>
                {current.isUpgrade ? <Crown className="w-8 h-8 text-yellow-400" /> :
                 userType === 'guest' ? <Target className="w-8 h-8 text-gray-400" /> :
                 userType === 'member' ? <Sparkles className="w-8 h-8 text-yellow-400" /> :
                 <Shield className="w-8 h-8 text-purple-400" />
                }
              </div>
            </div>

            <h3 className="text-xl font-semibold text-white mb-3">
              {current.title}
            </h3>

            {current.highlight && (
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${
                current.isUpgrade ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                userType === 'member' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                'bg-purple-500/20 text-purple-400 border border-purple-500/30'
              }`}>
                {current.highlight}
              </div>
            )}

            <p className="text-gray-300 mb-6 leading-relaxed">
              {current.description}
            </p>

            {/* Features List */}
            <div className="bg-gray-900/50 rounded-lg p-6 mb-6">
              <h4 className="font-medium text-white mb-4 flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                {current.isUpgrade ? 'Premium Features Include:' : 'Available Features:'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {current.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-300">
                    <div className={`w-2 h-2 rounded-full mr-3 ${
                      current.isUpgrade ? 'bg-yellow-400' :
                      userType === 'guest' ? 'bg-gray-400' :
                      userType === 'member' ? 'bg-green-400' :
                      'bg-purple-400'
                    }`}></div>
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleCTA}
              className={`w-full px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl ${
                current.isUpgrade 
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white'
                  : userType === 'guest'
                  ? 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white'
                  : userType === 'member'
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white'
                  : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white'
              }`}
            >
              {current.cta}
              {current.isUpgrade && <Crown className="w-4 h-4 inline ml-2" />}
            </button>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </button>

            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? userType === 'guest' ? 'bg-gray-400' :
                        userType === 'member' ? 'bg-yellow-400' : 'bg-purple-400'
                      : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="flex items-center text-gray-400 hover:text-white transition-colors"
            >
              {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>

        {/* Breathing Animation Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute inset-0 animate-pulse ${
            userType === 'guest' ? 'bg-gray-400/5' :
            userType === 'member' ? 'bg-yellow-400/5' :
            'bg-purple-400/5'
          }`}></div>
        </div>
      </div>
    </div>
  )
}

// Hook to manage VIP walkthrough state
export function useVIPWalkthrough() {
  const [showWalkthrough, setShowWalkthrough] = useState(false)
  
  const startWalkthrough = () => {
    setShowWalkthrough(true)
  }
  
  const closeWalkthrough = () => {
    setShowWalkthrough(false)
    localStorage.setItem('vip-walkthrough-seen', 'true')
  }
  
  const hasSeenWalkthrough = () => {
    return localStorage.getItem('vip-walkthrough-seen') === 'true'
  }
  
  return {
    showWalkthrough,
    startWalkthrough,
    closeWalkthrough,
    hasSeenWalkthrough
  }
}
