import { useState } from 'react'
import { Upload, Sparkles, TrendingUp, Shield, Crown, Star, BarChart3, Target, AlertTriangle, CheckCircle } from 'lucide-react'
import PAItScoreOrb from './PAItScoreOrb'

interface VideoMetadata {
  processTime: string
  title: string
  author: string
  platform: string
  views: string
  analysisId: string
}

interface PAItScores {
  technicalAccuracy: number
  executionFeasibility: number
  riskManagement: number
  marketConditions: number
  strategyClarity: number
  profitabilityPotential: number
  overallScore: number
}

interface SWOTAnalysis {
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  threats: string[]
}

interface AnalysisResult {
  metadata: VideoMetadata
  paitScores: PAItScores
  swot: SWOTAnalysis
  claireInsight: string
  kathyAnalysis: string
  profitabilityGrade: 'High' | 'Moderate' | 'Low' | 'Critical'
  isVIPAnalysis: boolean
}

interface YouTubeAnalysisWorkflowProps {
  isAuthenticated: boolean
  userType: 'staff' | 'member' | null
}

export default function YouTubeAnalysisWorkflow({ isAuthenticated, userType }: YouTubeAnalysisWorkflowProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [showVIPUpgrade, setShowVIPUpgrade] = useState(false)
  const [compareMode, setCompareMode] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      await analyzeYouTubeShort(file)
    }
  }

  const analyzeYouTubeShort = async (file: File) => {
    setIsAnalyzing(true)
    
    // Simulate AI analysis process
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Generate unique mock results
    const strategyNames = ["ORB Trading Strategy", "Fair Value Gap Analysis", "Breakout Pattern Method", "Support/Resistance Play", "Moving Average Crossover"]
    const authors = ["TradeWithClips", "FVG Master", "PatternPro", "TechAnalyst", "MovingAverageGuru"]
    
    const randomIndex = Math.floor(Math.random() * strategyNames.length)
    
    const mockResult: AnalysisResult = {
      metadata: {
        processTime: new Date().toLocaleString(),
        title: strategyNames[randomIndex],
        author: authors[randomIndex],
        platform: "YouTube Shorts",
        views: `${Math.floor(Math.random() * 900 + 100)}K`,
        analysisId: `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      },
      paitScores: {
        technicalAccuracy: Math.floor(Math.random() * 4) + 6,
        executionFeasibility: Math.floor(Math.random() * 4) + 5,
        riskManagement: Math.floor(Math.random() * 4) + 4,
        marketConditions: Math.floor(Math.random() * 4) + 6,
        strategyClarity: Math.floor(Math.random() * 4) + 6,
        profitabilityPotential: Math.floor(Math.random() * 4) + 7,
        overallScore: Math.floor(Math.random() * 300) + 600
      },
      swot: {
        strengths: ["Recognizable pattern approach", "Strong community backing", "Clear visual examples"],
        weaknesses: ["Limited risk management details", "No backtesting data provided", "Lacks market condition filters"],
        opportunities: ["Trending community-driven strategy", "Social media amplification potential", "Educational content monetization"],
        threats: ["Market volatility impact", "Overconfidence from viral content", "Lack of proper risk education"]
      },
      claireInsight: "Hi! 👋 This strategy shows some interesting patterns! The technical setup looks promising, but I'd love to see more details about risk management. The community engagement is fantastic though! 📈✨",
      kathyAnalysis: "Strong technical foundation with solid pattern recognition. Risk parameters need enhancement for live trading.",
      profitabilityGrade: "High",
      isVIPAnalysis: false
    }
    
    setAnalysisResults(prev => [...prev, mockResult])
    setIsAnalyzing(false)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      analyzeYouTubeShort(file)
    }
  }

  const getScoreColor = (score: number | string) => {
    if (score === 'UNR' || score === 0) return 'text-gray-400'
    if (typeof score === 'number' && score >= 800) return 'text-green-400'
    if (typeof score === 'number' && score >= 600) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getProfitabilityColor = (grade: string) => {
    switch (grade) {
      case 'UNR': return 'text-gray-400 bg-gray-900/30'
      case 'High': return 'text-green-400 bg-green-900/30'
      case 'Moderate': return 'text-yellow-400 bg-yellow-900/30'
      case 'Low': return 'text-orange-400 bg-orange-900/30'
      case 'Critical': return 'text-red-400 bg-red-900/30'
      default: return 'text-gray-400 bg-gray-900/30'
    }
  }

  const renderAnalysisCard = (analysisResult: AnalysisResult, index: number) => (
    <div key={analysisResult.metadata.analysisId} className="space-y-6">
      {/* Strategy Title in Compare Mode */}
      {compareMode && (
        <h3 className="text-xl font-bold text-white text-center mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-600">
          Strategy {index + 1}: {analysisResult.metadata.title}
        </h3>
      )}
      
      {/* Three Card Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: pAIt Analysis */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
          <div className="text-center mb-4">
            <h3 className="text-white font-bold text-xl mb-2">AiiQ Analysis</h3>
            <p className="text-gray-400 text-sm">Processed {analysisResult.metadata.processTime}</p>
            <div className="flex items-center justify-center mt-2">
              <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                + {analysisResult.metadata.author}
              </span>
            </div>
          </div>
          
          <div className="text-center mb-6">
            {/* pAIt Score Orb */}
            <PAItScoreOrb 
              score={analysisResult.paitScores.overallScore} 
              size="large"
            />
            <div className={`mt-3 px-3 py-1 rounded-full text-sm font-medium ${getProfitabilityColor(analysisResult.profitabilityGrade)}`}>
              Profitability ({analysisResult.profitabilityGrade})
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Win Consistency (C+)</span>
              <span className="text-yellow-400">C+</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Truthfulness (B)</span>
              <span className="text-green-400">B</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Accessibility (C)</span>
              <span className="text-yellow-400">C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Realism (B)</span>
              <span className="text-green-400">B</span>
            </div>
          </div>

          <button
            onClick={() => setShowVIPUpgrade(true)}
            className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Crown className="w-4 h-4" />
            <span>Additional Analysis (VIP)</span>
          </button>
        </div>

        {/* Card 2: AiiQ Analysis */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
          <div className="text-center mb-4">
            <h3 className="text-white font-bold text-xl mb-2">AiiQ Analysis</h3>
            <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm">
              <span>📅 {new Date().toISOString().slice(0, 16).replace('T', ' ')}</span>
            </div>
            <div className="text-center mt-2">
              <p className="text-gray-300 text-sm">{analysisResult.kathyAnalysis}</p>
              
              {/* VIP Model Attribution - Collapsible */}
              {(userType === 'staff' || isAuthenticated) && (
                <details className="mt-3">
                  <summary className="text-xs text-purple-400 hover:text-purple-300 cursor-pointer flex items-center justify-center space-x-1">
                    <span>🤖 Model Attribution</span>
                  </summary>
                  <div className="mt-2 p-2 bg-gray-800/50 rounded-lg border border-purple-500/20">
                    <p className="text-xs text-gray-400 mb-1">Analysis powered by:</p>
                    <div className="flex flex-wrap gap-1 justify-center">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">Claude-3.5</span>
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded">Kathy-Ops</span>
                      <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded">GPT-4</span>
                      <span className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded">AiiQ-Core</span>
                    </div>
                  </div>
                </details>
              )}
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Trading Analysis</span>
              <span className="text-yellow-400 font-bold">{analysisResult.paitScores.overallScore}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Technical Accuracy</span>
              <span className="text-white">{analysisResult.paitScores.technicalAccuracy}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Execution Feasibility</span>
              <span className="text-white">{analysisResult.paitScores.executionFeasibility}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Risk Management</span>
              <span className="text-white">{analysisResult.paitScores.riskManagement}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Market Conditions</span>
              <span className="text-white">{analysisResult.paitScores.marketConditions}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Strategy Clarity</span>
              <span className="text-white">{analysisResult.paitScores.strategyClarity}</span>
            </div>
          </div>
        </div>

        {/* Card 3: SWOT Analysis */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
          <div className="text-center mb-6">
            <h3 className="text-white font-bold text-xl mb-2">AiiQ SWOT</h3>
            <p className="text-gray-400 text-sm">Processed {analysisResult.metadata.processTime}</p>
            
            {/* VIP Model Attribution for SWOT */}
            {(userType === 'staff' || isAuthenticated) && (
              <details className="mt-2">
                <summary className="text-xs text-purple-400 hover:text-purple-300 cursor-pointer flex items-center justify-center space-x-1">
                  <span>🧠 SWOT Engine</span>
                </summary>
                <div className="mt-2 p-2 bg-gray-800/50 rounded-lg border border-purple-500/20">
                  <div className="flex flex-wrap gap-1 justify-center">
                    <span className="px-2 py-1 bg-teal-500/20 text-teal-300 text-xs rounded">Strategic-AI</span>
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded">Risk-Engine</span>
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">Pattern-Rec</span>
                  </div>
                </div>
              </details>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-green-400 font-medium mb-2 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Strengths:
              </h4>
              <p className="text-gray-300 text-sm">High reward potential</p>
            </div>

            <div>
              <h4 className="text-red-400 font-medium mb-2 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Weaknesses:
              </h4>
              <p className="text-gray-300 text-sm">Limited risk controls</p>
            </div>

            <div>
              <h4 className="text-blue-400 font-medium mb-2 flex items-center">
                <Target className="w-4 h-4 mr-2" />
                Opportunities:
              </h4>
              <p className="text-gray-300 text-sm">Trending community-driven strategy</p>
            </div>

            <div>
              <h4 className="text-orange-400 font-medium mb-2 flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Threats:
              </h4>
              <p className="text-gray-300 text-sm">Speculative, not suitable for all</p>
            </div>
          </div>

          <button
            onClick={() => setShowVIPUpgrade(true)}
            className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Crown className="w-4 h-4" />
            <span>Additional Analysis (VIP)</span>
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-600 to-cyan-500 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-white text-lg crella-font">Crella</span>
            </div>
            <div className="absolute -inset-2 bg-gradient-to-br from-blue-400 via-purple-500 to-cyan-400 rounded-full opacity-20 animate-ping"></div>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">CLAIRE</h1>
        <p className="text-gray-300">Drag and drop your image to begin analysis...</p>
      </div>

      {/* Controls */}
      {analysisResults.length > 0 && (
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
              compareMode 
                ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>{compareMode ? 'Exit Compare Mode' : 'Compare Analysis'}</span>
          </button>
          <button
            onClick={() => setAnalysisResults([])}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Drag & Drop Zone */}
      {(analysisResults.length === 0 || compareMode) && (
        <div
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
            dragActive 
              ? 'border-purple-400 bg-purple-900/20' 
              : 'border-gray-600 hover:border-purple-500 bg-gray-800/30'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {analysisResults.length === 0 
                  ? 'Drag & drop trading shorts here to analyze'
                  : `Add ${compareMode ? 'comparison' : 'another'} analysis`
                }
              </h3>
              <p className="text-gray-400 mb-4">
                {analysisResults.length === 0
                  ? 'Upload YouTube trading screenshots for AI-powered AiiQ analysis'
                  : `Compare multiple strategies side by side`
                }
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg cursor-pointer transition-colors"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Loading State */}
      {isAnalyzing && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 text-center border border-gray-700">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Analyzing...</h3>
          <p className="text-gray-400">AI agents are processing your trading strategy...</p>
          
          {/* Claire's Processing Message */}
          <div className="mt-6 flex items-center space-x-3 bg-purple-900/30 rounded-lg p-4">
            <img src="/claire.png" alt="Claire" className="w-10 h-10 rounded-full" />
            <div className="text-left">
              <p className="text-purple-300 text-sm font-medium">AiiQ AI is orchestrating the analysis...</p>
              <p className="text-gray-400 text-xs">Coordinating multi-LLM analysis pipeline</p>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {analysisResults.length > 0 && (
        <div className="space-y-6">
          {/* Comparison Header */}
          {compareMode && analysisResults.length > 1 && (
            <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl p-6 border border-purple-500/30 text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Strategy Comparison</h2>
              <p className="text-gray-300">Comparing {analysisResults.length} trading strategies</p>
            </div>
          )}

          {/* Claire's Initial Response - Latest Analysis */}
          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl p-6 border border-purple-500/30">
            <div className="flex items-start space-x-4">
              <img src="/claire.png" alt="Claire" className="w-12 h-12 rounded-full" />
              <div>
                <h3 className="text-white font-semibold mb-2">
                  AiiQ Concierge {compareMode && analysisResults.length > 1 && `(Latest)`}
                </h3>
                <p className="text-gray-300">{analysisResults[analysisResults.length - 1]?.claireInsight}</p>
              </div>
            </div>
          </div>

          {/* Analysis Cards - Either Single or Multiple in Compare Mode */}
          <div className={`grid gap-6 ${
            compareMode && analysisResults.length > 1 
              ? 'grid-cols-1' 
              : 'grid-cols-1'
          }`}>
            {(compareMode ? analysisResults : analysisResults.slice(-1)).map((analysisResult, index) => 
              renderAnalysisCard(analysisResult, index)
            )}
          </div>

          {/* Comparison Summary - Only in Compare Mode */}
          {compareMode && analysisResults.length > 1 && (
            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-2xl p-6 border border-blue-500/30">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Target className="w-6 h-6 mr-2" />
                Comparison Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h4 className="font-semibold text-blue-400 mb-2">Highest AiiQ Score</h4>
                  <PAItScoreOrb 
                    score={Math.max(...analysisResults.map(r => 
                      typeof r.paitScores.overallScore === 'number' ? r.paitScores.overallScore : 0
                    ))} 
                    size="medium" 
                  />
                  <p className="text-gray-400 text-sm mt-1">Best performing strategy</p>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-yellow-400 mb-2">Best Risk Management</h4>
                  <div className="text-3xl font-bold text-blue-400">
                    {Math.max(...analysisResults.map(r => r.paitScores.riskManagement))}/10
                  </div>
                  <p className="text-gray-400 text-sm mt-1">Risk score comparison</p>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-purple-400 mb-2">Strategies Analyzed</h4>
                  <div className="text-3xl font-bold text-purple-400">
                    {analysisResults.length}
                  </div>
                  <p className="text-gray-400 text-sm mt-1">Total comparisons</p>
                </div>
              </div>
            </div>
          )}

          {/* Payment Options */}
          <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-2xl p-6 border border-purple-500/30 text-center">
            <h3 className="text-white font-bold text-lg mb-4">OPTIONAL VIP ANALYSIS</h3>
            <p className="text-gray-300 mb-6">Pay per video or subscribe for token access</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                <Star className="w-4 h-4" />
                <span>$7.99 - VIP Analysis</span>
              </button>
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                <Crown className="w-4 h-4" />
                <span>Monthly Subscription</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}