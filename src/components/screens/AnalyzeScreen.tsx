import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Bot, 
  Crown, 
  TrendingUp, 
  FileSearch, 
  Video, 
  Brain,
  Sparkles,
  MessageSquare,
  ArrowRight,
  Clock
} from 'lucide-react'
import { AppState } from '../MobileRouter'

interface AnalyzeScreenProps {
  appState: AppState
  updateAppState: (updates: Partial<AppState>) => void
}

interface AgentStatus {
  id: 'claire' | 'claude' | 'jbot' | 'claudia' | 'kathy'
  name: string
  status: 'idle' | 'thinking' | 'active' | 'complete'
  progress: number
  message?: string
}

export function AnalyzeScreen({ appState, updateAppState }: AnalyzeScreenProps) {
  const [analysisPhase, setAnalysisPhase] = useState<'starting' | 'claire' | 'orchestration' | 'agents' | 'complete'>('starting')
  const [agents, setAgents] = useState<AgentStatus[]>([
    { id: 'claire', name: 'Claire', status: 'idle', progress: 0 },
    { id: 'claude', name: 'Claude', status: 'idle', progress: 0 },
    { id: 'jbot', name: 'JBot', status: 'idle', progress: 0 },
    { id: 'claudia', name: 'Claudia', status: 'idle', progress: 0 },
    { id: 'kathy', name: 'Kathy', status: 'idle', progress: 0 }
  ])
  const [claireMessage, setClaireMessage] = useState('')
  const [showPAItRequest, setShowPAItRequest] = useState(false)
  const [paitRequested, setPaitRequested] = useState(false)
  const navigate = useNavigate()

  // Simulate analysis flow
  useEffect(() => {
    const runAnalysis = async () => {
      // Phase 1: Claire introduction
      setAnalysisPhase('claire')
      setClaireMessage("Hi! 👋 I can see you've uploaded some interesting images. Let me take a quick look and provide initial insights.")
      
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setAgents(prev => prev.map(agent => 
        agent.id === 'claire' 
          ? { ...agent, status: 'active', progress: 50 }
          : agent
      ))
      
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setClaireMessage("I've completed my initial analysis! These images show some fascinating patterns. Would you like me to coordinate with my specialist team for deeper insights?")
      
      setAgents(prev => prev.map(agent => 
        agent.id === 'claire' 
          ? { ...agent, status: 'complete', progress: 100 }
          : agent
      ))
      
      setShowPAItRequest(true)
    }

    if (appState.uploadedImages.length > 0) {
      runAnalysis()
    }
  }, [appState.uploadedImages])

  // Handle pAIt scoring request
  const handlePAItRequest = async () => {
    setPaitRequested(true)
    setShowPAItRequest(false)
    setAnalysisPhase('orchestration')
    
    setClaireMessage("Perfect! I'm bringing in the specialists. Claude is analyzing your request to determine which agents we need...")
    
    // Claude orchestration
    setAgents(prev => prev.map(agent => 
      agent.id === 'claude' 
        ? { ...agent, status: 'active', progress: 30, message: 'Analyzing intent and routing...' }
        : agent
    ))
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setAgents(prev => prev.map(agent => 
      agent.id === 'claude' 
        ? { ...agent, status: 'complete', progress: 100, message: 'Routing complete' }
        : agent
    ))
    
    // Start agent orchestration
    setAnalysisPhase('agents')
    setClaireMessage("Excellent! Claude has determined we need JBot for analysis, Claudia for research, and Kathy for verification. They're working now...")
    
    // Simulate parallel agent execution
    const agentIds = ['jbot', 'claudia', 'kathy']
    
    for (let i = 0; i < agentIds.length; i++) {
      const agentId = agentIds[i] as 'jbot' | 'claudia' | 'kathy'
      
      setTimeout(() => {
        setAgents(prev => prev.map(agent => 
          agent.id === agentId 
            ? { ...agent, status: 'active', progress: 0, message: `${agent.name} analyzing...` }
            : agent
        ))
        
        // Progress simulation
        const progressInterval = setInterval(() => {
          setAgents(prev => prev.map(agent => {
            if (agent.id === agentId) {
              const newProgress = Math.min(agent.progress + 10, 100)
              return { 
                ...agent, 
                progress: newProgress,
                status: newProgress === 100 ? 'complete' : 'active',
                message: newProgress === 100 ? 'Analysis complete' : `${agent.name} analyzing...`
              }
            }
            return agent
          }))
        }, 300)
        
        setTimeout(() => {
          clearInterval(progressInterval)
          if (i === agentIds.length - 1) {
            // All agents complete
            setTimeout(() => {
              setAnalysisPhase('complete')
              setClaireMessage("Fantastic! All agents have completed their analysis. I've synthesized their findings into comprehensive results. Ready to see what we discovered?")
            }, 1000)
          }
        }, 3000)
        
      }, i * 1000)
    }
  }

  const getAgentIcon = (agentId: string) => {
    switch (agentId) {
      case 'claire': return <Crown className="w-6 h-6" />
      case 'claude': return <Brain className="w-6 h-6" />
      case 'jbot': return <TrendingUp className="w-6 h-6" />
      case 'claudia': return <FileSearch className="w-6 h-6" />
      case 'kathy': return <Video className="w-6 h-6" />
      default: return <Bot className="w-6 h-6" />
    }
  }

  const getAgentColor = (agentId: string) => {
    switch (agentId) {
      case 'claire': return 'from-purple-500 to-pink-600'
      case 'claude': return 'from-blue-500 to-indigo-600'
      case 'jbot': return 'from-green-500 to-emerald-600'
      case 'claudia': return 'from-orange-500 to-red-600'
      case 'kathy': return 'from-yellow-500 to-orange-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const handleViewResults = () => {
    // Create mock analysis result that matches AnalysisResult interface
    const mockResult = {
      id: Date.now().toString(),
      timestamp: new Date(),
      images: appState.uploadedImages,
      agents: agents.filter(a => a.status === 'complete'),
      paitScore: 2150,
      confidence: 0.87,
      ocrText: 'Sample extracted text',
      tags: ['analysis', 'ai-generated'],
      metadata: {
        processingTime: 3.2,
        agentsUsed: agents.filter(a => a.status === 'complete').length,
        model: 'crella-mobile-v1'
      }
    }
    
    updateAppState({
      currentAnalysis: mockResult as any
    })
    
    navigate('/results')
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
            AI Analysis in Progress
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {appState.uploadedImages.length} image{appState.uploadedImages.length !== 1 ? 's' : ''} being analyzed
          </p>
        </motion.div>

        {/* Claire Chat Interface */}
        <motion.div
          className="mb-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="flex items-start space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white shadow-lg">
              <Crown className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">Claire</h3>
                <span className="text-xs text-purple-500 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-full">
                  AI Concierge
                </span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                  {claireMessage || "Initializing analysis..."}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* pAIt Request Modal */}
        {showPAItRequest && (
          <motion.div
            className="mb-8 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-center">
              <Sparkles className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Request pAIt™ Scoring?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                This will activate advanced multi-agent review and analysis with comprehensive pAIt™ intelligence scoring.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handlePAItRequest}
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Activate pAIt™
                </button>
                <button
                  onClick={() => setAnalysisPhase('complete')}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Skip for Now
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Agent Status */}
        <motion.div
          className="space-y-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {agents.filter(agent => agent.status !== 'idle' || analysisPhase === 'agents').map((agent, index) => (
            <motion.div
              key={agent.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${getAgentColor(agent.id)} rounded-full flex items-center justify-center text-white ${
                  agent.status === 'active' ? 'animate-pulse' : ''
                }`}>
                  {getAgentIcon(agent.id)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">{agent.name}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      agent.status === 'complete' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      agent.status === 'active' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      {agent.status === 'complete' ? 'Complete' :
                       agent.status === 'active' ? 'Working' : 'Waiting'}
                    </span>
                  </div>
                  {agent.message && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">{agent.message}</p>
                  )}
                </div>
                {agent.status === 'active' && (
                  <Clock className="w-4 h-4 text-blue-500 animate-spin" />
                )}
              </div>
              
              {agent.status !== 'idle' && (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full bg-gradient-to-r ${getAgentColor(agent.id)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${agent.progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* View Results Button */}
        {analysisPhase === 'complete' && (
          <motion.button
            onClick={handleViewResults}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>View Analysis Results</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        )}
      </div>
    </div>
  )
}

export default AnalyzeScreen
