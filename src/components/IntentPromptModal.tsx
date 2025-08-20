import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  TrendingUp, 
  Shield, 
  Gavel, 
  BarChart3, 
  Search, 
  Sparkles,
  ChevronRight,
  CheckCircle
} from 'lucide-react'

interface IntentOption {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  agents: string[]
  reasoning: string
}

interface IntentPromptModalProps {
  isOpen: boolean
  onClose: () => void
  uploadedImage?: { url: string; name: string }
  onIntentSelected: (intent: IntentOption) => void
  className?: string
}

export function IntentPromptModal({ 
  isOpen, 
  onClose, 
  uploadedImage, 
  onIntentSelected,
  className = '' 
}: IntentPromptModalProps) {
  const [selectedIntent, setSelectedIntent] = useState<IntentOption | null>(null)
  const [isConfirming, setIsConfirming] = useState(false)

  const intentOptions: IntentOption[] = [
    {
      id: 'strategy-evaluation',
      title: 'Strategy Evaluation',
      description: 'Analyze trading setup, risk/reward, and execution timing',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-600',
      agents: ['JBot', 'Claudia'],
      reasoning: 'User wants to evaluate trade setup seen in screenshot'
    },
    {
      id: 'data-accuracy',
      title: 'Data Accuracy Check',
      description: 'Verify information authenticity and detect manipulation',
      icon: <Shield className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-600',
      agents: ['Kathy', 'Claudia'],
      reasoning: 'User needs to verify the authenticity of data or documents'
    },
    {
      id: 'compliance-review',
      title: 'Compliance Review',
      description: 'Check legal requirements, disclosures, and regulations',
      icon: <Gavel className="w-6 h-6" />,
      color: 'from-orange-500 to-red-600',
      agents: ['Claudia', 'JBot'],
      reasoning: 'User requires compliance and legal analysis'
    },
    {
      id: 'compare-previous',
      title: 'Compare Against Previous',
      description: 'Benchmark against similar analyses from your vault',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'from-purple-500 to-indigo-600',
      agents: ['JBot', 'Kathy', 'Claudia'],
      reasoning: 'User wants comparative analysis against historical data'
    },
    {
      id: 'exploratory',
      title: "I'm Not Sure Yet",
      description: 'Exploratory mode - let Claire guide the analysis',
      icon: <Search className="w-6 h-6" />,
      color: 'from-gray-500 to-slate-600',
      agents: ['Claire', 'JBot', 'Kathy', 'Claudia'],
      reasoning: 'User wants comprehensive exploratory analysis with guidance'
    }
  ]

  const handleIntentSelect = (intent: IntentOption) => {
    setSelectedIntent(intent)
    
    // Track analytics (bonus feature)
    try {
      const analyticsData = JSON.parse(localStorage.getItem('crella-intent-analytics') || '{}')
      analyticsData[intent.id] = (analyticsData[intent.id] || 0) + 1
      localStorage.setItem('crella-intent-analytics', JSON.stringify(analyticsData))
    } catch (error) {
      console.warn('Could not track intent analytics:', error)
    }
  }

  const handleConfirm = () => {
    if (!selectedIntent) return
    
    setIsConfirming(true)
    
    // Simulate confirmation delay for smooth UX
    setTimeout(() => {
      onIntentSelected(selectedIntent)
      setIsConfirming(false)
      onClose()
    }, 800)
  }

  const resetModal = () => {
    setSelectedIntent(null)
    setIsConfirming(false)
  }

  useEffect(() => {
    if (!isOpen) {
      resetModal()
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          />
          
          {/* Modal Content - Mobile Bottom Drawer */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl z-50 max-h-[85vh] overflow-hidden ${className}`}
          >
            {/* Handle */}
            <div className="flex justify-center pt-4 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </div>

            {/* Header */}
            <div className="px-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* Claire Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Hi! I'm Claire 👋
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Your AI Concierge
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="px-6 py-4 overflow-y-auto max-h-[60vh]">
              {/* Claire's Speech Bubble */}
              <div className="mb-6">
                <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-2xl p-4 relative">
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                    {uploadedImage ? (
                      <>I can see you've uploaded <strong>"{uploadedImage.name}"</strong>. What would you like me to analyze in this image? 🤔</>
                    ) : (
                      <>What would you like me to analyze in this image? 🤔</>
                    )}
                  </p>
                  {/* Speech bubble tail */}
                  <div className="absolute -bottom-2 left-8 w-4 h-4 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rotate-45 border-r border-b border-gray-200 dark:border-gray-700"></div>
                </div>
              </div>

              {/* Image Preview */}
              {uploadedImage && (
                <div className="mb-6">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-3">
                    <img
                      src={uploadedImage.url}
                      alt="Uploaded content"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                      {uploadedImage.name}
                    </p>
                  </div>
                </div>
              )}

              {/* Intent Options */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Choose your analysis focus:
                </h3>
                
                {intentOptions.map((intent) => (
                  <motion.button
                    key={intent.id}
                    onClick={() => handleIntentSelect(intent)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      selectedIntent?.id === intent.id
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${intent.color} flex items-center justify-center text-white flex-shrink-0`}>
                        {intent.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {intent.title}
                          </h4>
                          {selectedIntent?.id === intent.id ? (
                            <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {intent.description}
                        </p>
                        <div className="flex items-center space-x-1 mt-2">
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            Agents:
                          </span>
                          {intent.agents.map((agent) => (
                            <span
                              key={agent}
                              className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded"
                            >
                              {agent}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              {selectedIntent ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium text-purple-600 dark:text-purple-400">Great choice!</span> 
                      {' '}I'll coordinate with {selectedIntent.agents.join(', ')} for your {selectedIntent.title.toLowerCase()}.
                    </p>
                  </div>
                  
                  <button
                    onClick={handleConfirm}
                    disabled={isConfirming}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 disabled:opacity-50 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                  >
                    {isConfirming ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Preparing Analysis...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span>Excellent! Let's Analyze</span>
                      </>
                    )}
                  </button>
                </motion.div>
              ) : (
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-2">
                  Select an analysis focus to continue
                </p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
