import React, { useState, useEffect } from 'react'
import { X, Upload, Eye, BarChart3, Shield, DollarSign, Sparkles, Crown, Users } from 'lucide-react'

interface SmartOnboardingModalProps {
  isOpen: boolean
  onClose: () => void
  userType: 'guest' | 'member' | 'staff'
}

export function SmartOnboardingModal({ isOpen, onClose, userType }: SmartOnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [showClaireIntro, setShowClaireIntro] = useState(false)

  // Don't show if not open
  if (!isOpen) return null

  // Define onboarding steps based on user type
  const getOnboardingSteps = () => {
    const baseSteps = [
      {
        icon: <Upload className="w-8 h-8 text-blue-400" />,
        title: "Upload Your Images",
        description: "Drop any image for instant AI-powered visual intelligence analysis",
        highlight: "Drag & drop, paste, or browse"
      },
      {
        icon: <Eye className="w-8 h-8 text-purple-400" />,
        title: "Instant Analysis",
        description: "Get immediate insights on authenticity, digital fingerprints, and content intelligence",
        highlight: "Powered by pAIt™ scoring system"
      },
      {
        icon: <BarChart3 className="w-8 h-8 text-green-400" />,
        title: "Compare & Verify",
        description: "Upload multiple images to compare authenticity, detect AI generation, and analyze patterns",
        highlight: "Side-by-side comparison tools"
      },
    ]

    if (userType === 'guest') {
      return [
        ...baseSteps,
        {
          icon: <Crown className="w-8 h-8 text-yellow-400" />,
          title: "Upgrade for More",
          description: "VIP members get advanced analysis, vault storage, trading insights, and Claire's premium guidance",
          highlight: "Unlock the full Crella ecosystem"
        }
      ]
    }

    return [
      ...baseSteps,
      {
        icon: <Shield className="w-8 h-8 text-indigo-400" />,
        title: "Private Vault",
        description: "Securely store your analyses with cryptographic proof and complete privacy sovereignty",
        highlight: "Your data, your control"
      },
      {
        icon: <DollarSign className="w-8 h-8 text-teal-400" />,
        title: "Trading Intelligence",
        description: "Transform visual insights into actionable trading signals through pAIt™ strategic scoring",
        highlight: "Connect to AiiQ trading platform"
      }
    ]
  }

  const steps = getOnboardingSteps()

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Show Claire's intro after main onboarding
      setShowClaireIntro(true)
    }
  }

  const handleSkip = () => {
    // Mark as seen and close
    localStorage.setItem('crella-onboarding-seen', 'true')
    onClose()
  }

  const handleClaireIntroComplete = () => {
    // Mark both onboarding and Claire intro as seen
    localStorage.setItem('crella-onboarding-seen', 'true')
    localStorage.setItem('claire-intro-seen', 'true')
    onClose()
  }

  // Claire's Intro Dialog
  if (showClaireIntro) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-2xl max-w-lg w-full">
          {/* Close Button */}
          <button
            onClick={handleClaireIntroComplete}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
          >
            <X size={20} />
          </button>

          {/* Claire's Introduction */}
          <div className="p-8 text-center">
            {/* Claire's Avatar */}
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <img
                  src="/claire_profile.png"
                  alt="Claire - AiiQ Concierge"
                  className="w-20 h-20 rounded-full border-2 border-blue-400 shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-2 border-slate-900 animate-pulse"></div>
              </div>
            </div>

            {/* Claire's Message */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                Hi, welcome! 👋
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                I'm <strong className="text-blue-400">Claire</strong>, your AiiQ Concierge & Orchestration Assistant! 
                I'm here to guide you through visual intelligence analysis and help you discover insights you never knew existed.
              </p>
              
              {userType === 'guest' ? (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
                  <p className="text-yellow-300 text-sm">
                    ✨ <strong>Guest Preview Mode</strong> - You'll get basic analysis to start. 
                    Ready to unlock premium AI orchestration and advanced insights?
                  </p>
                </div>
              ) : (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
                  <p className="text-blue-300 text-sm">
                    🚀 <strong>{userType === 'staff' ? 'Staff Access' : 'VIP Member'}</strong> - You have access to advanced analysis, 
                    multi-agent orchestration, and premium vault features!
                  </p>
                </div>
              )}

              <p className="text-gray-400 text-xs">
                Upload any image and I'll help you uncover its secrets, verify authenticity, 
                and provide strategic insights you can trust.
              </p>
            </div>

            {/* Action Button */}
            <button
              onClick={handleClaireIntroComplete}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Let's Get Started! 🎯
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Main Onboarding Modal
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-2xl max-w-2xl w-full">
        {/* Close Button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="p-8 pb-0 text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Sparkles className="w-12 h-12 text-blue-400 animate-pulse" />
              <div className="absolute inset-0 w-12 h-12 bg-blue-400/20 rounded-full animate-ping"></div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Welcome to <span className="crella-font">Crella</span> Lens
          </h2>
          <p className="text-gray-400 text-sm">
            Your AI-Powered Visual Intelligence Platform
          </p>
        </div>

        {/* Progress Bar */}
        <div className="px-8 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">Progress</span>
            <span className="text-xs text-gray-500">{currentStep + 1} of {steps.length}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Current Step Content */}
        <div className="p-8 pt-4">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-slate-800 rounded-full border border-slate-600">
                {steps[currentStep].icon}
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              {steps[currentStep].title}
            </h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              {steps[currentStep].description}
            </p>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
              <p className="text-blue-300 text-sm font-medium">
                💡 {steps[currentStep].highlight}
              </p>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={handleSkip}
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Skip Tour
            </button>
            
            <div className="flex items-center space-x-3">
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {currentStep === steps.length - 1 ? 'Meet Claire' : 'Next'}
              </button>
            </div>
          </div>
        </div>

        {/* User Type Badge */}
        <div className="absolute top-4 left-4">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            userType === 'guest' 
              ? 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
              : userType === 'staff'
              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
              : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
          }`}>
            {userType === 'guest' ? (
              <><Users className="w-3 h-3 inline mr-1" />Guest</>
            ) : userType === 'staff' ? (
              <><Sparkles className="w-3 h-3 inline mr-1" />Staff</>
            ) : (
              <><Crown className="w-3 h-3 inline mr-1" />VIP</>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Hook to manage onboarding state
export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    // Check if user has seen onboarding before
    const hasSeenOnboarding = localStorage.getItem('crella-onboarding-seen')
    const hasSeenClaireIntro = localStorage.getItem('claire-intro-seen')
    
    // Show onboarding if user hasn't seen it before
    if (!hasSeenOnboarding || !hasSeenClaireIntro) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setShowOnboarding(true)
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [])

  const closeOnboarding = () => {
    setShowOnboarding(false)
  }

  return {
    showOnboarding,
    closeOnboarding
  }
}
