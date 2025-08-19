import React, { useState, useEffect } from 'react'
import { Bot, TrendingUp, FileSearch, Video, Brain, Crown, Star, Zap, ChevronRight, X } from 'lucide-react'

interface AgentStatus {
  id: 'claire' | 'claude' | 'jbot' | 'claudia' | 'kathy'
  name: string
  role: string
  status: 'idle' | 'thinking' | 'active' | 'complete' | 'error'
  confidence?: number
  lastActivity?: string
  isAvailable: boolean
  description: string
  capabilities: string[]
  paitScore?: number
  executionTime?: number
}

interface VisualAgentSelectorProps {
  userType: 'guest' | 'member' | 'staff'
  activeAgents: string[]
  onAgentClick?: (agentId: string) => void
  onAgentRate?: (agentId: string, rating: number) => void
  className?: string
  isVisible?: boolean
}

export function VisualAgentSelector({ 
  userType, 
  activeAgents, 
  onAgentClick, 
  onAgentRate,
  className = "",
  isVisible = true 
}: VisualAgentSelectorProps) {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [agents, setAgents] = useState<AgentStatus[]>([])

  // Initialize agent statuses
  useEffect(() => {
    const initialAgents: AgentStatus[] = [
      {
        id: 'claire',
        name: 'Claire',
        role: 'AI Concierge',
        status: 'active',
        confidence: 0.95,
        lastActivity: 'Coordinating multi-agent analysis',
        isAvailable: true,
        description: 'Your personal AI concierge and orchestration assistant. Claire guides conversations and coordinates with specialist agents.',
        capabilities: [
          'Natural conversation & guidance',
          'Multi-agent orchestration',
          'Context awareness & memory',
          'User experience optimization',
          'Intelligent routing & delegation'
        ],
        paitScore: 2800
      },
      {
        id: 'claude',
        name: 'Claude',
        role: 'Orchestrator',
        status: activeAgents.includes('claude') ? 'thinking' : 'idle',
        confidence: 0.92,
        lastActivity: 'Analyzing intent and routing to specialists',
        isAvailable: userType !== 'guest',
        description: 'Behind-the-scenes intelligence orchestrator. Claude analyzes your requests and determines which specialist agents to engage.',
        capabilities: [
          'Intent analysis & understanding',
          'Strategic agent coordination',
          'Complex reasoning & planning',
          'Context synthesis',
          'Priority assessment'
        ],
        paitScore: 2650
      },
      {
        id: 'jbot',
        name: 'JBot',
        role: 'Trading Specialist',
        status: activeAgents.includes('jbot') ? 'active' : 'idle',
        confidence: 0.89,
        lastActivity: 'Analyzing options strategy risk profile',
        isAvailable: userType !== 'guest',
        description: 'Expert trading strategist specializing in options, risk management, and portfolio analysis with advanced pAIt™ scoring.',
        capabilities: [
          'Options strategy analysis',
          'Risk assessment & management',
          'Portfolio optimization',
          'Market pattern recognition',
          'Trading signal generation'
        ],
        paitScore: 2400
      },
      {
        id: 'claudia',
        name: 'Claudia',
        role: 'Research Specialist',
        status: activeAgents.includes('claudia') ? 'active' : 'idle',
        confidence: 0.91,
        lastActivity: 'Searching county property records',
        isAvailable: userType !== 'guest',
        description: 'Legal and document research specialist with access to public records, property databases, and compliance checking.',
        capabilities: [
          'Legal document analysis',
          'Property record research',
          'County database access',
          'Compliance verification',
          'Public records investigation'
        ],
        paitScore: 2350
      },
      {
        id: 'kathy',
        name: 'Kathy',
        role: 'Media Analyst',
        status: activeAgents.includes('kathy') ? 'active' : 'idle',
        confidence: 0.88,
        lastActivity: 'Verifying video content authenticity',
        isAvailable: userType !== 'guest',
        description: 'Technical media analysis specialist focusing on video verification, audio transcription, and digital forensics.',
        capabilities: [
          'Video content analysis',
          'Audio transcription & analysis',
          'Digital forensics',
          'Authenticity verification',
          'Technical media processing'
        ],
        paitScore: 2200
      }
    ]

    setAgents(initialAgents)
  }, [activeAgents, userType])

  // Get agent visual properties
  const getAgentVisuals = (agent: AgentStatus) => {
    const baseConfig = {
      claire: {
        color: 'from-purple-500 to-pink-600',
        borderColor: 'border-purple-400',
        shadowColor: 'shadow-purple-500/50',
        icon: <Crown className="w-6 h-6" />,
        glowColor: 'bg-purple-400'
      },
      claude: {
        color: 'from-blue-500 to-indigo-600', 
        borderColor: 'border-blue-400',
        shadowColor: 'shadow-blue-500/50',
        icon: <Brain className="w-6 h-6" />,
        glowColor: 'bg-blue-400'
      },
      jbot: {
        color: 'from-green-500 to-emerald-600',
        borderColor: 'border-green-400', 
        shadowColor: 'shadow-green-500/50',
        icon: <TrendingUp className="w-6 h-6" />,
        glowColor: 'bg-green-400'
      },
      claudia: {
        color: 'from-orange-500 to-red-600',
        borderColor: 'border-orange-400',
        shadowColor: 'shadow-orange-500/50', 
        icon: <FileSearch className="w-6 h-6" />,
        glowColor: 'bg-orange-400'
      },
      kathy: {
        color: 'from-yellow-500 to-orange-600',
        borderColor: 'border-yellow-400',
        shadowColor: 'shadow-yellow-500/50',
        icon: <Video className="w-6 h-6" />,
        glowColor: 'bg-yellow-400'
      }
    }

    const config = baseConfig[agent.id]
    
    // Determine status effects
    let statusEffect = ''
    let pulseSpeed = 'animate-pulse'
    
    switch (agent.status) {
      case 'active':
        statusEffect = 'animate-ping'
        pulseSpeed = 'animate-bounce'
        break
      case 'thinking':
        statusEffect = 'animate-spin'
        pulseSpeed = 'animate-pulse'
        break
      case 'complete':
        statusEffect = ''
        pulseSpeed = ''
        break
      case 'error':
        config.color = 'from-red-500 to-red-700'
        config.borderColor = 'border-red-400'
        break
    }

    return { ...config, statusEffect, pulseSpeed }
  }

  // Handle agent click
  const handleAgentClick = (agent: AgentStatus) => {
    if (!agent.isAvailable && userType === 'guest') {
      alert('This agent requires VIP access. Upgrade to unlock multi-agent coordination!')
      return
    }

    setSelectedAgent(agent.id)
    setShowDetailModal(true)
    onAgentClick?.(agent.id)
  }

  // Agent rating component
  const AgentRating = ({ agent }: { agent: AgentStatus }) => {
    const [rating, setRating] = useState(0)
    
    const handleRate = (value: number) => {
      setRating(value)
      onAgentRate?.(agent.id, value)
    }

    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRate(star)}
            className={`transition-colors ${
              star <= rating ? 'text-yellow-400' : 'text-gray-600'
            }`}
          >
            <Star className="w-4 h-4" />
          </button>
        ))}
      </div>
    )
  }

  if (!isVisible) return null

  const selectedAgentData = agents.find(a => a.id === selectedAgent)

  return (
    <div className={`fixed left-6 top-1/2 transform -translate-y-1/2 z-30 ${className}`}>
      {/* Agent Orbs */}
      <div className="space-y-6">
        {agents.map((agent, index) => {
          const visuals = getAgentVisuals(agent)
          const isActive = activeAgents.includes(agent.id)
          
          return (
            <div
              key={agent.id}
              className="relative group"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Main Agent Orb */}
              <button
                onClick={() => handleAgentClick(agent)}
                className={`relative w-16 h-16 rounded-full bg-gradient-to-br ${visuals.color} border-2 ${visuals.borderColor} ${visuals.shadowColor} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 ${
                  agent.isAvailable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                } ${visuals.pulseSpeed}`}
                title={`${agent.name} - ${agent.role}`}
              >
                {/* Agent Icon */}
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  {visuals.icon}
                </div>

                {/* Status Indicator */}
                {isActive && (
                  <div className={`absolute -top-1 -right-1 w-4 h-4 ${visuals.glowColor} rounded-full ${visuals.statusEffect}`}></div>
                )}

                {/* Availability Indicator */}
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${
                  agent.isAvailable ? 'bg-green-400' : 'bg-red-400'
                }`}></div>

                {/* Breathing Animation Overlay */}
                <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${visuals.color} opacity-30 animate-pulse`}></div>
              </button>

              {/* Agent Name Tooltip (appears on hover) */}
              <div className="absolute left-20 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                <div className="bg-gray-900/95 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-gray-700 shadow-xl">
                  <div className="font-semibold text-sm">{agent.name}</div>
                  <div className="text-xs text-gray-400">{agent.role}</div>
                  {agent.status !== 'idle' && (
                    <div className="text-xs text-blue-300 mt-1">
                      Status: {agent.status}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Agent Detail Modal */}
      {showDetailModal && selectedAgentData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="relative p-6 border-b border-slate-700">
              <button
                onClick={() => setShowDetailModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getAgentVisuals(selectedAgentData).color} border-2 ${getAgentVisuals(selectedAgentData).borderColor} flex items-center justify-center text-white relative`}>
                  {getAgentVisuals(selectedAgentData).icon}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent animate-pulse"></div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white">{selectedAgentData.name}</h2>
                  <p className="text-gray-400">{selectedAgentData.role}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedAgentData.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      selectedAgentData.status === 'thinking' ? 'bg-blue-500/20 text-blue-400' :
                      selectedAgentData.status === 'complete' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {selectedAgentData.status.toUpperCase()}
                    </div>
                    {selectedAgentData.paitScore && (
                      <div className="text-xs text-gray-300">
                        pAIt™ {selectedAgentData.paitScore}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">About {selectedAgentData.name}</h3>
                <p className="text-gray-300 leading-relaxed">{selectedAgentData.description}</p>
              </div>

              {/* Capabilities */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Core Capabilities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedAgentData.capabilities.map((capability, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                      <Zap className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{capability}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Metrics */}
              {selectedAgentData.confidence && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Performance Metrics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-400">
                        {Math.round(selectedAgentData.confidence * 100)}%
                      </div>
                      <div className="text-xs text-gray-400">Confidence Level</div>
                    </div>
                    {selectedAgentData.executionTime && (
                      <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-blue-400">
                          {selectedAgentData.executionTime}ms
                        </div>
                        <div className="text-xs text-gray-400">Avg Response Time</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Last Activity */}
              {selectedAgentData.lastActivity && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Recent Activity</h3>
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-300 text-sm">{selectedAgentData.lastActivity}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Rate This Agent */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Rate This Agent's Performance</h3>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">How helpful was {selectedAgentData.name}?</span>
                    <AgentRating agent={selectedAgentData} />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
                {selectedAgentData.isAvailable && (
                  <button
                    onClick={() => {
                      onAgentClick?.(selectedAgentData.id)
                      setShowDetailModal(false)
                    }}
                    className={`flex-1 bg-gradient-to-r ${getAgentVisuals(selectedAgentData).color} hover:opacity-90 text-white py-3 px-6 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center`}
                  >
                    Consult {selectedAgentData.name}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIP Upgrade Notice for Guests */}
      {userType === 'guest' && (
        <div className="mt-6 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <div className="text-xs text-yellow-300 text-center">
            <Crown className="w-4 h-4 inline mr-1" />
            VIP access unlocks all agents
          </div>
        </div>
      )}
    </div>
  )
}

export default VisualAgentSelector
