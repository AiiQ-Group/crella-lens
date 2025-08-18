import { useState } from 'react'
import { BarChart3, Shield, AlertTriangle, CheckCircle, TrendingUp, Clock, Play, Star } from 'lucide-react'
import { AnalysisResult } from '../types'

interface ComponentScore {
  component: string
  score: number
  confidence: number
  reasoning: string
  category: 'claims' | 'evidence' | 'methodology' | 'credibility' | 'risk'
}

interface EnhancedAnalysis extends AnalysisResult {
  isVIP: boolean
  encrypted: boolean
  componentScores?: ComponentScore[]
  overallRecommendation?: string
  estimatedWatchTime?: string
  riskLevel?: 'low' | 'medium' | 'high'
  contentType?: 'trading_strategy' | 'educational' | 'promotional' | 'analysis'
}

interface EnhancedAnalysisResultsProps {
  result: EnhancedAnalysis
  isVIP: boolean
}

export default function EnhancedAnalysisResults({ result, isVIP }: EnhancedAnalysisResultsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'components' | 'details'>('overview')

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'claims': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
      case 'evidence': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30'
      case 'methodology': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30'
      case 'credibility': return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30'
      case 'risk': return 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30'
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-green-600 dark:text-green-400'
    if (score >= 3) return 'text-yellow-600 dark:text-yellow-400'  
    if (score >= 2) return 'text-orange-600 dark:text-orange-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getRiskBadge = (level?: string) => {
    if (!level) return null
    
    const colors = {
      low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300', 
      high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    }
    
    const icons = {
      low: <CheckCircle className="h-4 w-4" />,
      medium: <AlertTriangle className="h-4 w-4" />,
      high: <Shield className="h-4 w-4" />
    }

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colors[level as keyof typeof colors]}`}>
        {icons[level as keyof typeof icons]}
        <span className="ml-1 capitalize">{level} Risk</span>
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* VIP Header */}
      {isVIP && (
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Star className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">VIP Analysis Complete</h2>
                <p className="text-purple-100">Enhanced component-level scoring & encryption applied</p>
              </div>
            </div>
            {result.encrypted && (
              <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full">
                <Shield className="h-4 w-4" />
                <span className="text-sm font-medium">Encrypted</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Enhanced pAIt Score */}
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-crella-600" />
            <span>Enhanced pAIt Analysis</span>
          </h3>
          {result.riskLevel && getRiskBadge(result.riskLevel)}
        </div>

        {/* Overall Score */}
        <div className="text-center mb-6">
          <div className={`text-5xl font-bold ${getScoreColor(result.paitScore)} mb-2`}>
            {result.paitScore.toFixed(1)}
          </div>
          <div className="text-gray-600 dark:text-gray-400 mb-4">
            Overall pAIt Score ({(result.confidence * 100).toFixed(0)}% confidence)
          </div>
          
          {result.overallRecommendation && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
              <p className="font-medium text-gray-800 dark:text-gray-200">
                {result.overallRecommendation}
              </p>
            </div>
          )}

          {result.estimatedWatchTime && (
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="h-4 w-4" />
              <span>Estimated watch time: {result.estimatedWatchTime}</span>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        {isVIP && result.componentScores && (
          <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'components', label: 'Components', icon: TrendingUp },
                { id: 'details', label: 'Details', icon: Shield }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-crella-600">{result.paitScore.toFixed(1)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Overall Score</div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{(result.confidence * 100).toFixed(0)}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Confidence</div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{result.tags.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Tags Found</div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {result.componentScores ? result.componentScores.length : 'N/A'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Components</div>
            </div>
          </div>
        )}

        {activeTab === 'components' && result.componentScores && (
          <div className="space-y-4">
            {result.componentScores.map((component, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {component.component}
                    </h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(component.category)}`}>
                      {component.category}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getScoreColor(component.score)}`}>
                      {component.score.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-500">{(component.confidence * 100).toFixed(0)}% conf.</div>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {component.reasoning}
                  </p>
                </div>
                
                {/* Progress bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Score</span>
                    <span>{component.score.toFixed(1)}/5.0</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        component.score >= 4 ? 'bg-green-500' :
                        component.score >= 3 ? 'bg-yellow-500' :
                        component.score >= 2 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${(component.score / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'details' && (
          <div className="space-y-4">
            {/* Content Type */}
            {result.contentType && (
              <div>
                <h4 className="font-medium mb-2">Content Classification</h4>
                <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 rounded-full text-sm font-medium capitalize">
                  {result.contentType.replace('_', ' ')}
                </span>
              </div>
            )}

            {/* Tags */}
            <div>
              <h4 className="font-medium mb-2">Detected Tags</h4>
              <div className="flex flex-wrap gap-2">
                {result.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-crella-100 dark:bg-crella-900/30 text-crella-800 dark:text-crella-200 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm">
                <span className="text-gray-600 dark:text-gray-400">Size:</span>
                <span className="ml-2 font-medium">{result.metadata.imageSize}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600 dark:text-gray-400">Processing:</span>
                <span className="ml-2 font-medium">{result.metadata.processingTime}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600 dark:text-gray-400">Language:</span>
                <span className="ml-2 font-medium">{result.metadata.language.toUpperCase()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
