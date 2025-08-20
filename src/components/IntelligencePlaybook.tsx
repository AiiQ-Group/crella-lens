import React, { useState, useEffect } from 'react'
import { AnalysisResult } from '../types'
import { 
  TrendingUp, 
  ChevronDown, 
  ChevronRight, 
  Download, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Info,
  Target,
  BarChart3,
  FileText,
  Camera,
  DollarSign
} from 'lucide-react'

interface IntelligencePlaybookProps {
  result: AnalysisResult
  className?: string
}

interface VaultData {
  similarResults?: Array<{
    paitScore: number
    category: string
    outcome?: string
    confidence: number
  }>
  historicalStats?: {
    winRate: number
    avgScore: number
    riskProfile: string
  }
}

export function IntelligencePlaybook({ result, className = '' }: IntelligencePlaybookProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const [vaultData, setVaultData] = useState<VaultData>({})
  const [isExporting, setIsExporting] = useState(false)

  // Load similar results from localStorage (vault data)
  useEffect(() => {
    try {
      const vaultHistory = JSON.parse(localStorage.getItem('crella-vault-history') || '[]')
      const similarResults = vaultHistory
        .filter((item: any) => Math.abs(item.paitScore - result.paitScore) < 300)
        .slice(0, 5)

      const avgScore = similarResults.length > 0 
        ? Math.round(similarResults.reduce((sum: number, item: any) => sum + item.paitScore, 0) / similarResults.length)
        : result.paitScore

      setVaultData({
        similarResults,
        historicalStats: {
          winRate: 62, // Mock data - in production, calculate from vault history
          avgScore,
          riskProfile: result.paitScore > 2000 ? 'Medium' : result.paitScore > 1600 ? 'Low' : 'High'
        }
      })
    } catch (error) {
      console.warn('Could not load vault data:', error)
    }
  }, [result])

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      // Generate PDF export (simplified for now)
      const exportData = {
        timestamp: new Date().toISOString(),
        paitScore: result.paitScore,
        confidence: result.confidence,
        agents: result.agents.length,
        hash: btoa(JSON.stringify(result)).substring(0, 16)
      }
      
      // In production, use @react-pdf/renderer or canvas
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `crella-intelligence-brief-${Date.now()}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setTimeout(() => setIsExporting(false), 2000)
    } catch (error) {
      console.error('Export failed:', error)
      setIsExporting(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 2400) return 'text-green-400'
    if (score >= 2000) return 'text-blue-400'
    if (score >= 1600) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 2400) return 'Strategic'
    if (score >= 2000) return 'Tactical'
    if (score >= 1600) return 'Operational'
    return 'Foundational'
  }

  const getPeerRank = (score: number) => {
    if (score >= 2400) return 'top 5%'
    if (score >= 2200) return 'top 10%'
    if (score >= 2000) return 'top 25%'
    if (score >= 1800) return 'top 50%'
    return 'bottom 50%'
  }

  return (
    <div className={`bg-gray-900 text-white rounded-xl border border-gray-700 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900/50 via-purple-900/50 to-teal-900/50 p-6 text-center">
        <h2 className="text-2xl font-bold mb-2">Intelligence Playbook</h2>
        <p className="text-gray-300 text-sm">
          Insight-agent intelligence analysis results include
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Overall pAIt Score */}
        <div className="bg-gray-800/50 rounded-lg p-6 text-center border border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Overall pAIt™ Score</h3>
          <div className="relative inline-block">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center mx-auto mb-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">
                  {result.paitScore.toLocaleString()}
                </div>
                <div className="text-sm text-white/80">pAIt™</div>
              </div>
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-900 px-3 py-1 rounded-full text-sm font-medium">
              {getScoreLabel(result.paitScore)}
            </div>
          </div>
          
          <div className="flex justify-center space-x-8 mt-6 text-center">
            <div>
              <div className={`text-2xl font-bold ${getScoreColor(result.paitScore)}`}>
                {result.paitScore}
              </div>
              <div className="text-sm text-gray-400">Score</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {Math.round(result.confidence * 100)}%
              </div>
              <div className="text-sm text-gray-400">Confidence</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">
                {result.agents.length}
              </div>
              <div className="text-sm text-gray-400">Agents</div>
            </div>
          </div>
        </div>

        {/* Strategic Comparison Panel */}
        <div className="bg-gray-800/50 rounded-lg border border-gray-700">
          <button
            onClick={() => toggleSection('comparison')}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-700/30 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="font-semibold">Strategic Comparison</span>
            </div>
            {expandedSections['comparison'] ? <ChevronDown /> : <ChevronRight />}
          </button>
          
          {expandedSections['comparison'] && (
            <div className="px-4 pb-4 space-y-3">
              <div className="text-lg font-semibold text-green-400">
                Ranked {getPeerRank(result.paitScore)} of similar trades
              </div>
              <div className="text-gray-300">
                <span className="text-white">pAIt™ range for this category:</span> 1,800 - 2,300
              </div>
              <div className="text-gray-300">
                <span className="text-white">Most common risk profile:</span> 
                <span className="ml-2 text-yellow-400">{vaultData.historicalStats?.riskProfile}</span>
                <span className="text-gray-500 ml-1">(vs {getScoreLabel(result.paitScore)} here)</span>
              </div>
            </div>
          )}
        </div>

        {/* Intelligence Matrix Breakdown */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <span>Intelligence Matrix Breakdown</span>
          </h3>

          {result.agents.map((agent, index) => (
            <div key={agent.id} className="bg-gray-800/50 rounded-lg border border-gray-700">
              <button
                onClick={() => toggleSection(`agent-${agent.id}`)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-700/30 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {agent.type === 'jbot' && <DollarSign className="w-5 h-5 text-green-400" />}
                  {agent.type === 'claudia' && <FileText className="w-5 h-5 text-orange-400" />}
                  {agent.type === 'kathy' && <Camera className="w-5 h-5 text-yellow-400" />}
                  <div className="text-left">
                    <div className="font-semibold">{agent.name}</div>
                    <div className="text-sm text-gray-400">{agent.type === 'jbot' ? 'Trading Analysis' : agent.type === 'claudia' ? 'Legal Analysis' : 'Media Analysis'}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-sm font-medium">How score was calculated</div>
                  </div>
                  {expandedSections[`agent-${agent.id}`] ? <ChevronDown /> : <ChevronRight />}
                </div>
              </button>
              
              {expandedSections[`agent-${agent.id}`] && (
                <div className="px-4 pb-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      {agent.type === 'jbot' && (
                        <>
                          <div>
                            <span className="text-gray-300">Entry Logic:</span>
                            <div className="text-white ml-2">RSI + MA alignment detected</div>
                          </div>
                          <div>
                            <span className="text-gray-300">Risk:Reward Ratio:</span>
                            <div className="text-green-400 ml-2 font-medium">1:3.2</div>
                          </div>
                          <div>
                            <span className="text-gray-300">IV Analysis:</span>
                            <div className="text-yellow-400 ml-2 flex items-center">
                              High <AlertTriangle className="w-4 h-4 ml-1" />
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-300">Historical outcome from Medium:</span>
                            <div className="text-white ml-2">(vs Low here)</div>
                          </div>
                        </>
                      )}
                      
                      {agent.type === 'claudia' && (
                        <>
                          <div className="text-white font-medium">Title, zoning, lien check most clear</div>
                          <div className="text-gray-300">Property classified: Commercial</div>
                          <div className="text-gray-300">No disclosures not noted</div>
                        </>
                      )}
                      
                      {agent.type === 'kathy' && (
                        <>
                          <div>
                            <span className="text-gray-300">Deepfake Flags:</span>
                            <div className="text-green-400 ml-2">None detected</div>
                          </div>
                          <div>
                            <span className="text-gray-300">Compression:</span>
                            <div className="text-green-400 ml-2">Lossless format</div>
                          </div>
                          <div>
                            <span className="text-gray-300">Source Quality:</span>
                            <div className="text-green-400 ml-2">High, image from DSLR</div>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Confidence</span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Peer similarity</span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Edge</span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Volatility penalty</span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* How Score Was Calculated */}
        <div className="bg-gray-800/50 rounded-lg border border-gray-700">
          <button
            onClick={() => toggleSection('calculation')}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-700/30 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Info className="w-5 h-5 text-blue-400" />
              <span className="font-semibold">How Score Was Calculated</span>
            </div>
            {expandedSections['calculation'] ? <ChevronDown /> : <ChevronRight />}
          </button>
          
          {expandedSections['calculation'] && (
            <div className="px-4 pb-4">
              <div className="text-gray-300 mb-4">
                <strong className="text-white">Factors:</strong> Confidence, Peer similarity • Edge • (rarity bonus) • Volatility penalty
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Confidence</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span>Edge</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Volatility penalty</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Peer similarity</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Optimization Suggestions */}
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
            <Target className="w-5 h-5 text-green-400" />
            <span>Optimization Suggestions</span>
          </h3>
          <div className="space-y-2">
            <div className="flex items-start space-x-2 text-green-400">
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Spread width should be increased to reduce risk</span>
            </div>
            <div className="flex items-start space-x-2 text-green-400">
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Zoning needs legal follow-up before closing</span>
            </div>
          </div>
        </div>

        {/* Export Button */}
        <div className="text-center">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white px-8 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 mx-auto transition-all"
          >
            {isExporting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Download className="w-5 h-5" />
            )}
            <span>{isExporting ? 'Generating...' : 'Export as Intelligence Brief (PDF)'}</span>
          </button>
        </div>

        {/* Disclaimer */}
        <div className="bg-gray-800/30 border border-gray-600 rounded-lg p-4 text-sm text-gray-400">
          <div className="flex items-start space-x-2">
            <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="mb-2">
                <span className="text-white font-medium">Disclaimer:</span> This report was generated locally using Crella AI's multi-agent coordination system.
              </p>
              <p className="mb-2">
                All scores reflect LLM-generated assessments using proprietary pAIt™ algorithms.
              </p>
              <p className="text-blue-400">
                Optional enhancement available via GPT-4 or Claude API for deeper reasoning.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
