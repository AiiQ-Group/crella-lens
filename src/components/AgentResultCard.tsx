import React, { useState } from 'react'
import { Bot, Brain, FileSearch, ChevronDown, ChevronUp, Clock, Target, TrendingUp, TrendingDown } from 'lucide-react'

interface AgentResult {
  agent: 'JBot' | 'Claudia' | 'Kathy'
  summary: string
  score: number
  confidence: number
  details?: string
  recommendations?: string[]
  executionTime?: number
}

interface AgentResultCardProps {
  result: AgentResult
  className?: string
}

export function AgentResultCard({ result, className = "" }: AgentResultCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Get agent-specific styling and info
  const getAgentInfo = (agent: string) => {
    switch (agent) {
      case 'JBot':
        return {
          name: 'JBot',
          role: 'Trading Strategy Specialist',
          icon: <TrendingUp className="w-4 h-4" />,
          colors: 'from-green-500/20 to-emerald-600/20 border-green-500/30 text-green-400',
          accentColor: 'text-green-400',
          bgColor: 'bg-green-500/10'
        }
      case 'Claudia':
        return {
          name: 'Claudia',
          role: 'Legal & Research Specialist',
          icon: <FileSearch className="w-4 h-4" />,
          colors: 'from-purple-500/20 to-indigo-600/20 border-purple-500/30 text-purple-400',
          accentColor: 'text-purple-400',
          bgColor: 'bg-purple-500/10'
        }
      case 'Kathy':
        return {
          name: 'Kathy',
          role: 'Technical Media Analyst',
          icon: <Brain className="w-4 h-4" />,
          colors: 'from-blue-500/20 to-cyan-600/20 border-blue-500/30 text-blue-400',
          accentColor: 'text-blue-400',
          bgColor: 'bg-blue-500/10'
        }
      default:
        return {
          name: agent,
          role: 'AI Specialist',
          icon: <Bot className="w-4 h-4" />,
          colors: 'from-gray-500/20 to-gray-600/20 border-gray-500/30 text-gray-400',
          accentColor: 'text-gray-400',
          bgColor: 'bg-gray-500/10'
        }
    }
  }

  // Get pAIt score color and interpretation
  const getScoreInfo = (score: number) => {
    if (score >= 2000) {
      return {
        color: 'text-green-400',
        bgColor: 'bg-green-500/20',
        borderColor: 'border-green-500/30',
        level: 'Excellent',
        trend: <TrendingUp className="w-3 h-3" />
      }
    } else if (score >= 1500) {
      return {
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/20',
        borderColor: 'border-yellow-500/30',
        level: 'Good',
        trend: <TrendingUp className="w-3 h-3" />
      }
    } else if (score >= 1000) {
      return {
        color: 'text-orange-400',
        bgColor: 'bg-orange-500/20',
        borderColor: 'border-orange-500/30',
        level: 'Fair',
        trend: <TrendingDown className="w-3 h-3" />
      }
    } else {
      return {
        color: 'text-red-400',
        bgColor: 'bg-red-500/20',
        borderColor: 'border-red-500/30',
        level: 'Poor',
        trend: <TrendingDown className="w-3 h-3" />
      }
    }
  }

  // Get confidence level interpretation
  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 0.9) return 'Very High'
    if (confidence >= 0.8) return 'High'
    if (confidence >= 0.7) return 'Medium'
    if (confidence >= 0.6) return 'Low'
    return 'Very Low'
  }

  const agentInfo = getAgentInfo(result.agent)
  const scoreInfo = getScoreInfo(result.score)

  return (
    <div className={`bg-gradient-to-br ${agentInfo.colors} rounded-xl border backdrop-blur-sm ${className}`}>
      {/* Agent Header */}
      <div className="p-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`p-2 ${agentInfo.bgColor} rounded-lg border border-white/10`}>
              {agentInfo.icon}
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">{agentInfo.name}</h4>
              <p className={`text-xs ${agentInfo.accentColor} opacity-90`}>{agentInfo.role}</p>
            </div>
          </div>
          
          {/* Execution Time */}
          {result.executionTime && (
            <div className="flex items-center text-xs text-gray-400">
              <Clock className="w-3 h-3 mr-1" />
              {(result.executionTime / 1000).toFixed(1)}s
            </div>
          )}
        </div>

        {/* Summary */}
        <p className="text-white text-sm leading-relaxed mb-3">
          {result.summary}
        </p>

        {/* Metrics Row */}
        <div className="flex items-center justify-between">
          {/* pAIt Score */}
          {result.score > 0 && (
            <div className={`flex items-center space-x-2 px-3 py-2 ${scoreInfo.bgColor} border ${scoreInfo.borderColor} rounded-lg`}>
              <div className="flex items-center space-x-1">
                {scoreInfo.trend}
                <span className={`font-bold text-sm ${scoreInfo.color}`}>
                  pAIt™ {result.score}
                </span>
              </div>
              <span className={`text-xs ${scoreInfo.color} opacity-75`}>
                {scoreInfo.level}
              </span>
            </div>
          )}

          {/* Confidence */}
          <div className="flex items-center space-x-2">
            <Target className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-white">
              {Math.round(result.confidence * 100)}% confidence
            </span>
            <span className={`text-xs ${
              result.confidence >= 0.8 ? 'text-green-400' :
              result.confidence >= 0.6 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              ({getConfidenceLevel(result.confidence)})
            </span>
          </div>
        </div>
      </div>

      {/* Expandable Details */}
      {(result.details || (result.recommendations && result.recommendations.length > 0)) && (
        <div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full px-4 py-2 border-t border-white/10 text-xs text-gray-300 hover:text-white transition-colors flex items-center justify-center"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-3 h-3 mr-1" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3 mr-1" />
                Show Details
              </>
            )}
          </button>

          {isExpanded && (
            <div className="px-4 pb-4 border-t border-white/10 space-y-3">
              {/* Details */}
              {result.details && (
                <div>
                  <h5 className={`text-xs font-medium ${agentInfo.accentColor} mb-2 mt-3`}>
                    Analysis Details:
                  </h5>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {result.details}
                  </p>
                </div>
              )}

              {/* Recommendations */}
              {result.recommendations && result.recommendations.length > 0 && (
                <div>
                  <h5 className={`text-xs font-medium ${agentInfo.accentColor} mb-2`}>
                    Recommendations:
                  </h5>
                  <ul className="space-y-1">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start text-xs text-gray-300">
                        <div className={`w-1.5 h-1.5 ${agentInfo.bgColor} rounded-full mr-2 mt-1.5 flex-shrink-0`}></div>
                        <span className="leading-relaxed">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AgentResultCard
