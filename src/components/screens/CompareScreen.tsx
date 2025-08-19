import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Crown, 
  Plus, 
  X,
  ArrowRight,
  TrendingUp,
  BarChart3,
  Eye,
  Zap
} from 'lucide-react'
import { AppState } from '../MobileRouter'
import { PAItScoreOrb } from '../PAItScoreOrb'

interface CompareScreenProps {
  appState: AppState
  updateAppState: (updates: Partial<AppState>) => void
}

export function CompareScreen({ appState, updateAppState }: CompareScreenProps) {
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [comparisonResults, setComparisonResults] = useState<any[]>([])
  const [isComparing, setIsComparing] = useState(false)

  // Mock comparison for demo
  const mockComparison = [
    {
      id: '1',
      image: null,
      title: 'Property A - Downtown Austin',
      paitScore: 2150,
      confidence: 0.92,
      insights: {
        authenticity: 95,
        marketValue: 88,
        compliance: 92
      },
      summary: 'Strong investment opportunity with excellent compliance record'
    },
    {
      id: '2',
      image: null,
      title: 'Property B - Tech Ridge Area',
      paitScore: 1880,
      confidence: 0.87,
      insights: {
        authenticity: 91,
        marketValue: 79,
        compliance: 85
      },
      summary: 'Moderate investment potential with some regulatory considerations'
    }
  ]

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    setSelectedImages(prev => [...prev, ...imageFiles])
  }

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
  }

  const startComparison = async () => {
    setIsComparing(true)
    
    // Simulate comparison process
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setComparisonResults(mockComparison)
    setIsComparing(false)
  }

  const getScoreColor = (score: number) => {
    if (score >= 2000) return 'text-green-400'
    if (score >= 1500) return 'text-yellow-400'
    return 'text-red-400'
  }

  if (appState.user.type === 'guest') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 flex items-center justify-center">
        <motion.div
          className="max-w-md mx-auto px-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            VIP Feature Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Image comparison and side-by-side analysis is available exclusively for VIP members.
          </p>
          <button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl">
            Upgrade to VIP
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Crown className="w-7 h-7 text-yellow-500" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Compare Analysis
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Side-by-side intelligent comparison (VIP Only)
          </p>
        </motion.div>

        {/* Upload Areas */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[0, 1].map((index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id={`upload-${index}`}
              />
              
              <label
                htmlFor={`upload-${index}`}
                className="block aspect-square border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-purple-500 dark:hover:border-purple-400 transition-colors"
              >
                {selectedImages[index] ? (
                  <div className="relative h-full">
                    <img
                      src={URL.createObjectURL(selectedImages[index])}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        removeImage(index)
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                    <Plus className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">
                      Image {index + 1}
                    </span>
                  </div>
                )}
              </label>
            </motion.div>
          ))}
        </div>

        {/* Compare Button */}
        {selectedImages.length >= 2 && !comparisonResults.length && (
          <motion.button
            onClick={startComparison}
            disabled={isComparing}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isComparing ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Zap className="w-5 h-5" />
                </motion.div>
                <span>Comparing...</span>
              </>
            ) : (
              <>
                <span>Compare Images</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        )}

        {/* Comparison Results */}
        {comparisonResults.length > 0 && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Overall Comparison */}
            <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/20 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 text-center">
                Comparison Summary
              </h3>
              <div className="grid grid-cols-2 gap-6">
                {comparisonResults.map((result, index) => (
                  <div key={result.id} className="text-center">
                    <div className="mb-3">
                      <PAItScoreOrb score={result.paitScore} size="medium" />
                    </div>
                    <h4 className="font-medium text-white mb-2">
                      {result.title}
                    </h4>
                    <div className={`text-xl font-bold ${getScoreColor(result.paitScore)} mb-1`}>
                      {result.paitScore}
                    </div>
                    <div className="text-sm text-gray-400">
                      {Math.round(result.confidence * 100)}% confidence
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Winner Badge */}
              <div className="mt-6 text-center">
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-medium text-sm">
                    {comparisonResults[0].paitScore > comparisonResults[1].paitScore 
                      ? `${comparisonResults[0].title} scores higher`
                      : `${comparisonResults[1].title} scores higher`
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Detailed Comparison */}
            {comparisonResults.map((result, index) => (
              <motion.div
                key={result.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  {result.title}
                </h4>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {result.summary}
                </p>

                <div className="space-y-3">
                                            {Object.entries(result.insights).map(([key, value]) => {
                            const numValue = typeof value === 'number' ? value : 0;
                            return (
                              <div key={key} className="flex items-center justify-between">
                                <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                                  {key.replace(/([A-Z])/g, ' $1')}
                                </span>
                                <div className="flex items-center space-x-2">
                                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div 
                                      className={`h-2 rounded-full ${
                                        numValue >= 90 ? 'bg-green-500' :
                                        numValue >= 80 ? 'bg-yellow-500' :
                                        'bg-red-500'
                                      }`}
                                      style={{ width: `${numValue}%` }}
                                    />
                                  </div>
                                  <span className="text-sm font-medium text-gray-900 dark:text-white w-8">
                                    {numValue}
                                  </span>
                                </div>
                              </div>
                            )
                          })}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default CompareScreen
