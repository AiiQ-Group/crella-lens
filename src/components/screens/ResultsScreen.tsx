import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  FileSearch, 
  Video, 
  Crown,
  Archive,
  Share2,
  Download,
  Star,
  ChevronDown,
  ChevronUp,
  Shield,
  Sparkles
} from 'lucide-react'
import { AppState } from '../MobileRouter'
import { PAItScoreOrb } from '../PAItScoreOrb'

interface ResultsScreenProps {
  appState: AppState
  updateAppState: (updates: Partial<AppState>) => void
}

export function ResultsScreen({ appState, updateAppState }: ResultsScreenProps) {
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null)
  const [showPAItModal, setShowPAItModal] = useState(false)
  const navigate = useNavigate()

  // Mock agent results
  const agentResults = [
    {
      id: 'jbot',
      name: 'JBot',
      role: 'Trading Specialist',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-600',
      score: 2150,
      confidence: 0.92,
      summary: 'Bullish call spread strategy identified with favorable risk-reward ratio and strong technical indicators.',
      details: 'This trading setup shows excellent potential with defined risk parameters. The underlying asset demonstrates strong momentum with key support levels intact.',
      recommendations: [
        'Consider 30-45 days to expiration for optimal time decay',
        'Target profit at 25-50% of maximum potential',
        'Monitor implied volatility changes closely'
      ],
      executionTime: 2.3
    },
    {
      id: 'claudia',
      name: 'Claudia',
      role: 'Legal Research',
      icon: <FileSearch className="w-6 h-6" />,
      color: 'from-orange-500 to-red-600',
      score: 1980,
      confidence: 0.87,
      summary: 'Document analysis complete. Standard formatting with extractable key information and no compliance issues detected.',
      details: 'Legal documentation appears authentic with consistent metadata patterns. No obvious manipulation detected in the reviewed materials.',
      recommendations: [
        'Cross-reference key facts with additional sources',
        'Verify document authenticity through issuing authority',
        'Consider professional document examination if needed'
      ],
      executionTime: 3.1
    },
    {
      id: 'kathy',
      name: 'Kathy',
      role: 'Media Analyst',
      icon: <Video className="w-6 h-6" />,
      color: 'from-yellow-500 to-orange-600',
      score: 2200,
      confidence: 0.89,
      summary: 'High-resolution image analysis reveals authentic content with no signs of digital manipulation or AI generation.',
      details: 'Technical quality assessment shows consistent metadata patterns. No compression artifacts or manipulation signatures detected.',
      recommendations: [
        'Verify source application interface authenticity',
        'Check for selective editing or context manipulation',
        'Cross-verify timestamp with external sources'
      ],
      executionTime: 1.8
    }
  ]

  const overallScore = Math.round(agentResults.reduce((acc, result) => acc + result.score, 0) / agentResults.length)
  const overallConfidence = agentResults.reduce((acc, result) => acc + result.confidence, 0) / agentResults.length

  const handleSaveToVault = () => {
    const vaultItem = {
      id: Date.now().toString(),
      timestamp: new Date(),
      images: appState.uploadedImages,
      results: agentResults,
      paitScore: overallScore,
      confidence: overallConfidence
    }

    updateAppState({
      vaultItems: [...appState.vaultItems, vaultItem]
    })

    navigate('/vault')
  }

  const getScoreColor = (score: number) => {
    if (score >= 2000) return 'text-green-400'
    if (score >= 1500) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Analysis Complete
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Multi-agent intelligence analysis results
          </p>
        </motion.div>

        {/* Overall pAIt Score */}
        <motion.div
          className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-2xl p-6 mb-6 border border-purple-500/20"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="text-center">
            <h2 className="text-lg font-semibold text-white mb-4">Overall pAIt™ Score</h2>
            <div className="mb-4">
              <PAItScoreOrb score={overallScore} size="large" />
            </div>
            <div className="flex justify-center items-center space-x-4 text-sm">
              <div className="text-center">
                <div className={`text-xl font-bold ${getScoreColor(overallScore)}`}>
                  {overallScore}
                </div>
                <div className="text-gray-400">Score</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-400">
                  {Math.round(overallConfidence * 100)}%
                </div>
                <div className="text-gray-400">Confidence</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-purple-400">
                  {agentResults.length}
                </div>
                <div className="text-gray-400">Agents</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Agent Results */}
        <div className="space-y-4 mb-6">
          {agentResults.map((result, index) => (
            <motion.div
              key={result.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
            >
              <div className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${result.color} rounded-full flex items-center justify-center text-white`}>
                    {result.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{result.name}</h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{result.role}</span>
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      <div className={`text-lg font-bold ${getScoreColor(result.score)}`}>
                        pAIt™ {result.score}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {Math.round(result.confidence * 100)}% confidence
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {result.executionTime}s
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-3">
                  {result.summary}
                </p>

                <button
                  onClick={() => setExpandedAgent(expandedAgent === result.id ? null : result.id)}
                  className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 text-sm font-medium hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                >
                  <span>{expandedAgent === result.id ? 'Show Less' : 'Show Details'}</span>
                  {expandedAgent === result.id ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {expandedAgent === result.id && (
                  <motion.div
                    className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Detailed Analysis:</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                          {result.details}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Recommendations:</h4>
                        <ul className="space-y-1">
                          {result.recommendations.map((rec, i) => (
                            <li key={i} className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <motion.button
            onClick={handleSaveToVault}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Archive className="w-5 h-5" />
            <span>🧠 Save to Vault</span>
          </motion.button>

          <div className="flex space-x-3">
            <motion.button
              className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-3 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </motion.button>

            <motion.button
              className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-3 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6 }}
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </motion.button>
          </div>
        </div>

        {/* Analysis Footer */}
        <motion.div
          className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
        >
          <p className="flex items-center justify-center space-x-1">
            <Sparkles className="w-4 h-4" />
            <span>Processed by Crella Lens AI • pAIt™ Analysis • {new Date().toLocaleString()}</span>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default ResultsScreen
