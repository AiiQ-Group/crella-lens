import React, { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  Shield, 
  Camera, 
  FileText, 
  BarChart3, 
  Eye, 
  Zap, 
  Target,
  Brain,
  ChevronRight,
  Sparkles 
} from 'lucide-react'

interface FlowSuggestion {
  id: string
  title: string
  description: string
  confidence: number
  priority: 'critical' | 'high' | 'medium' | 'low'
  action: string
  icon: React.ReactNode
  category: 'authenticity' | 'trading' | 'forensics' | 'comparison' | 'vault'
  userTypes: ('guest' | 'member' | 'staff')[]
}

interface IntelligentFlowGuideProps {
  uploadedImage?: File | null
  analysisResult?: any
  userType: 'guest' | 'member' | 'staff'
  onActionClick?: (actionId: string) => void
  className?: string
}

export function IntelligentFlowGuide({ 
  uploadedImage, 
  analysisResult, 
  userType,
  onActionClick,
  className = "" 
}: IntelligentFlowGuideProps) {
  const [suggestions, setSuggestions] = useState<FlowSuggestion[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Analyze image content and generate intelligent suggestions
  const analyzeImageIntent = async (file: File): Promise<FlowSuggestion[]> => {
    setIsAnalyzing(true)
    
    // Simulate AI analysis of image content and generate contextual suggestions
    const suggestions: FlowSuggestion[] = []
    
    try {
      // Basic file analysis
      const fileSize = file.size
      const fileType = file.type
      const fileName = file.name.toLowerCase()

      // Content-based suggestions
      if (fileName.includes('chart') || fileName.includes('graph') || fileName.includes('trading')) {
        suggestions.push({
          id: 'trading-analysis',
          title: 'Trading Strategy Analysis',
          description: 'This appears to be financial content. Get strategic insights, pattern recognition, and market intelligence.',
          confidence: 85,
          priority: 'high',
          action: 'Analyze Trading Patterns',
          icon: <TrendingUp className="w-4 h-4" />,
          category: 'trading',
          userTypes: ['member', 'staff']
        })
      }

      if (fileName.includes('screenshot') || fileName.includes('screen')) {
        suggestions.push({
          id: 'authenticity-check',
          title: 'Screenshot Authenticity',
          description: 'Verify if this screenshot is genuine or manipulated. Check for digital tampering and source verification.',
          confidence: 90,
          priority: 'critical',
          action: 'Verify Authenticity',
          icon: <Shield className="w-4 h-4" />,
          category: 'authenticity',
          userTypes: ['guest', 'member', 'staff']
        })
      }

      if (fileSize > 5 * 1024 * 1024) { // > 5MB
        suggestions.push({
          id: 'high-quality-analysis',
          title: 'High-Resolution Deep Scan',
          description: 'Large image detected. Perform detailed forensic analysis for hidden metadata and embedded content.',
          confidence: 75,
          priority: 'medium',
          action: 'Deep Forensic Scan',
          icon: <Eye className="w-4 h-4" />,
          category: 'forensics',
          userTypes: ['member', 'staff']
        })
      }

      if (fileType.includes('png')) {
        suggestions.push({
          id: 'metadata-extraction',
          title: 'PNG Metadata Analysis',
          description: 'PNG files can contain extensive metadata. Extract creation details, software signatures, and hidden data.',
          confidence: 70,
          priority: 'medium',
          action: 'Extract Metadata',
          icon: <FileText className="w-4 h-4" />,
          category: 'forensics',
          userTypes: ['guest', 'member', 'staff']
        })
      }

      // Universal suggestions
      suggestions.push({
        id: 'comparison-ready',
        title: 'Prepare for Comparison',
        description: 'Upload additional images to compare authenticity, detect patterns, and verify consistency.',
        confidence: 60,
        priority: 'medium',
        action: 'Add Comparison Images',
        icon: <BarChart3 className="w-4 h-4" />,
        category: 'comparison',
        userTypes: ['guest', 'member', 'staff']
      })

      if (userType !== 'guest') {
        suggestions.push({
          id: 'vault-storage',
          title: 'Secure Vault Storage',
          description: 'Save this analysis to your private vault with cryptographic proof and complete data sovereignty.',
          confidence: 80,
          priority: 'high',
          action: 'Save to Vault',
          icon: <Shield className="w-4 h-4" />,
          category: 'vault',
          userTypes: ['member', 'staff']
        })
      }

    } catch (error) {
      console.error('Error analyzing image intent:', error)
    }

    setIsAnalyzing(false)
    return suggestions.filter(s => s.userTypes.includes(userType))
      .sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority] || b.confidence - a.confidence
      })
  }

  // Update suggestions when image changes
  useEffect(() => {
    if (uploadedImage) {
      analyzeImageIntent(uploadedImage).then(setSuggestions)
    } else {
      setSuggestions([])
    }
  }, [uploadedImage, userType])

  // Don't render if no image uploaded
  if (!uploadedImage || suggestions.length === 0) return null

  const handleActionClick = (suggestion: FlowSuggestion) => {
    onActionClick?.(suggestion.id)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-red-400 bg-red-500/10'
      case 'high': return 'border-yellow-400 bg-yellow-500/10'
      case 'medium': return 'border-blue-400 bg-blue-500/10'
      case 'low': return 'border-gray-400 bg-gray-500/10'
      default: return 'border-gray-400 bg-gray-500/10'
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-400'
    if (confidence >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Brain className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">Intelligent Flow Suggestions</h3>
        {isAnalyzing && (
          <div className="animate-spin">
            <Sparkles className="w-4 h-4 text-blue-400" />
          </div>
        )}
      </div>

      {/* Suggestions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suggestions.slice(0, 6).map((suggestion) => (
          <div
            key={suggestion.id}
            className={`p-4 rounded-lg border backdrop-blur-sm transition-all duration-300 hover:scale-105 cursor-pointer ${getPriorityColor(suggestion.priority)}`}
            onClick={() => handleActionClick(suggestion)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-white/10 rounded-lg">
                  {suggestion.icon}
                </div>
                <div>
                  <h4 className="font-medium text-white text-sm">{suggestion.title}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`text-xs font-bold ${getConfidenceColor(suggestion.confidence)}`}>
                      {suggestion.confidence}% confidence
                    </span>
                    <span className="text-xs text-gray-400 uppercase">
                      {suggestion.priority}
                    </span>
                  </div>
                </div>
              </div>
              <Target className="w-4 h-4 text-gray-400" />
            </div>

            {/* Description */}
            <p className="text-gray-300 text-sm leading-relaxed mb-3">
              {suggestion.description}
            </p>

            {/* Action Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleActionClick(suggestion)
              }}
              className="w-full bg-gradient-to-r from-blue-500/20 to-purple-600/20 hover:from-blue-500/30 hover:to-purple-600/30 text-white text-sm px-3 py-2 rounded-lg font-medium transition-all duration-300 border border-white/10 hover:border-white/20 flex items-center justify-center"
            >
              {suggestion.action}
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>

            {/* Category Badge */}
            <div className="absolute top-2 right-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                suggestion.category === 'trading' ? 'bg-green-500/20 text-green-400' :
                suggestion.category === 'authenticity' ? 'bg-red-500/20 text-red-400' :
                suggestion.category === 'forensics' ? 'bg-purple-500/20 text-purple-400' :
                suggestion.category === 'comparison' ? 'bg-blue-500/20 text-blue-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {suggestion.category}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* User Type Notice */}
      {userType === 'guest' && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <p className="text-yellow-300 text-sm">
              <strong>Guest Preview:</strong> You're seeing basic suggestions. VIP members get advanced AI orchestration and premium analysis options!
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// Hook for managing flow guidance state
export function useIntelligentFlow() {
  const [currentStep, setCurrentStep] = useState<string>('upload')
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  
  const markStepComplete = (step: string) => {
    setCompletedSteps(prev => [...prev, step])
  }
  
  const moveToStep = (step: string) => {
    setCurrentStep(step)
  }
  
  const resetFlow = () => {
    setCurrentStep('upload')
    setCompletedSteps([])
  }
  
  return {
    currentStep,
    completedSteps,
    markStepComplete,
    moveToStep,
    resetFlow
  }
}
