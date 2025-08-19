import React, { useState, useEffect, useRef } from 'react'
import { Send, Mic, Image, MoreVertical, Sparkles, Users, Zap, Brain, Shield } from 'lucide-react'
import { AgentResultCard } from './AgentResultCard'
import { VaultImageBuilder } from './VaultImageBuilder'

interface ChatMessage {
  id: string
  type: 'user' | 'claire' | 'system'
  content: string
  timestamp: Date
  agentResults?: AgentResult[]
  suggestOrchestration?: boolean
  imageMetadata?: ImageMetadata
}

interface AgentResult {
  agent: 'JBot' | 'Claudia' | 'Kathy'
  summary: string
  score: number
  confidence: number
  details?: string
  recommendations?: string[]
}

interface ImageMetadata {
  filename: string
  size: number
  type: string
  extractedText?: string
}

interface ClaireChatProps {
  userType: 'guest' | 'member' | 'staff'
  className?: string
  isVisible?: boolean
  onToggle?: () => void
}

export function ClaireChat({ userType, className = "", isVisible = true, onToggle }: ClaireChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [orchestrationActive, setOrchestrationActive] = useState(false)
  const [showVaultBuilder, setShowVaultBuilder] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Initialize with Claire's greeting
  useEffect(() => {
    if (messages.length === 0) {
      const greeting: ChatMessage = {
        id: `msg-${Date.now()}`,
        type: 'claire',
        content: userType === 'guest' 
          ? "Hi! 👋 I'm Claire, your AiiQ concierge. I can help analyze images, discuss trading strategies, or research documents. What brings you by today?"
          : `Welcome back! 🌟 I'm ready to coordinate with the full team - JBot for trading analysis, Claudia for document research, and Kathy for media analysis. What can we explore together?`,
        timestamp: new Date(),
        suggestOrchestration: userType !== 'guest'
      }
      setMessages([greeting])
    }
  }, [userType, messages.length])

  // Handle Claire's GPT-4 response
  const getClaireResponse = async (userMessage: string, imageData?: ImageMetadata): Promise<string> => {
    // Simulate GPT-4 API call with intelligent personality
    const context = {
      userType,
      hasImage: !!imageData,
      previousMessages: messages.slice(-3) // Last 3 messages for context
    }

    // Mock Claire's intelligent responses based on context
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500))

    // Analyze user intent and provide contextual responses
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('video') || lowerMessage.includes('youtube') || lowerMessage.includes('tiktok')) {
      return userType === 'guest' 
        ? "I can see you're interested in video analysis! 📹 I'd analyze the basic content and authenticity. For deeper insights like technical breakdowns and pAIt scoring, you'd need VIP access to work with my technical team."
        : "Interesting video content! 📹 I can have Kathy analyze the technical aspects, extract transcripts, and provide pAIt scoring. Would you like me to coordinate with the team for a comprehensive analysis?"
    }
    
    if (lowerMessage.includes('property') || lowerMessage.includes('deed') || lowerMessage.includes('legal')) {
      return userType === 'guest'
        ? "Property and legal research sounds important! ⚖️ I can provide basic insights, but comprehensive deed searches and legal document analysis require VIP access to my research specialist Claudia."
        : "Perfect - legal and property research is Claudia's specialty! 🏡 She can search county records, analyze deeds, and provide comprehensive documentation. Shall I have her dive deep into this?"
    }
    
    if (lowerMessage.includes('trading') || lowerMessage.includes('options') || lowerMessage.includes('strategy')) {
      return userType === 'guest'
        ? "Trading strategy analysis is fascinating! 📈 I can discuss the basics, but for detailed risk assessment, pAIt scoring, and strategy breakdowns, you'd want VIP access to JBot's expertise."
        : "Excellent - trading strategies are JBot's forte! 📊 He can break down risk profiles, calculate pAIt scores, and identify potential setups. Ready for a deep strategic analysis?"
    }

    if (imageData) {
      return userType === 'guest'
        ? `I can see you uploaded ${imageData.filename}! 🖼️ I'd analyze the basic content and authenticity markers. For comprehensive digital forensics and multi-agent analysis, VIP members get the full team involved.`
        : `Great! I see ${imageData.filename} - let me analyze this and determine if we should bring in JBot for trading patterns, Claudia for document analysis, or Kathy for technical verification. Would you like the full team assessment?`
    }

    // General conversation responses
    const responses = [
      "That's a great question! 💭 I'm here to help you navigate complex analysis and research. What specific area interests you most?",
      "I love diving deep into interesting problems! 🔍 Whether it's visual intelligence, strategy analysis, or document research - what's on your mind?",
      "Absolutely! 🌟 I specialize in coordinating complex analysis across different domains. What would you like to explore?",
      `${userType !== 'guest' ? 'With your VIP access, I can coordinate the full team for comprehensive insights. ' : ''}What specific challenge can I help you with?`
    ]
    
    return responses[Math.floor(Math.random() * responses.length)]
  }

  // Handle orchestration trigger
  const triggerOrchestration = async (prompt: string, imageData?: ImageMetadata) => {
    if (userType === 'guest') {
      // Suggest upgrade for guests
      const upgradeMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        type: 'system',
        content: "🔒 Multi-agent orchestration requires VIP access. Upgrade to coordinate with JBot, Claudia, and Kathy for comprehensive analysis!",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, upgradeMessage])
      return
    }

    setOrchestrationActive(true)
    
    const orchestrationMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      type: 'claire',
      content: "Perfect! 🎛️ Let me coordinate with the team. Claude is analyzing your request and determining which specialists we need...",
      timestamp: new Date()
    }
    setMessages(prev => [...prev, orchestrationMessage])

    try {
      // Import and call Claude orchestrator
      const { orchestrateAgents } = await import('./ClaudeOrchestrator')
      const agentResults = await orchestrateAgents({
        user_prompt: prompt,
        user_type: userType,
        context_type: imageData ? 'image' : 'text',
        image_metadata: imageData
      })

      // Claire synthesizes the results
      const synthesizedResponse = synthesizeAgentResults(agentResults)
      
      const resultMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        type: 'claire',
        content: synthesizedResponse,
        timestamp: new Date(),
        agentResults
      }
      
      setMessages(prev => [...prev, resultMessage])
      
    } catch (error) {
      console.error('Orchestration error:', error)
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        type: 'claire',
        content: "I'm having trouble coordinating with the team right now. Let me help you directly! 🤝",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setOrchestrationActive(false)
    }
  }

  // Synthesize agent results into Claire's voice
  const synthesizeAgentResults = (results: AgentResult[]): string => {
    if (results.length === 0) return "The team didn't find anything significant to report this time."

    let synthesis = "Here's what the team found: "
    
    results.forEach((result, index) => {
      const agentName = result.agent === 'JBot' ? 'JBot' : result.agent === 'Claudia' ? 'Claudia' : 'Kathy'
      synthesis += `\n\n🤖 **${agentName}**: ${result.summary}`
      
      if (result.score) {
        synthesis += ` (pAIt™ score: ${result.score})`
      }
      
      if (result.confidence) {
        synthesis += ` - ${Math.round(result.confidence * 100)}% confidence`
      }
    })

    synthesis += "\n\n💎 Shall I package this analysis into a secure pAIt™ image for your vault?"
    return synthesis
  }

  // Handle sending messages
  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      type: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Get Claire's response
      const claireResponse = await getClaireResponse(input)
      
      const claireMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        type: 'claire',
        content: claireResponse,
        timestamp: new Date(),
        suggestOrchestration: userType !== 'guest' && claireResponse.includes('coordinate with the team')
      }
      
      setMessages(prev => [...prev, claireMessage])
      
    } catch (error) {
      console.error('Claire response error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const imageData: ImageMetadata = {
      filename: file.name,
      size: file.size,
      type: file.type
    }

    const imageMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      type: 'user',
      content: `Uploaded: ${file.name}`,
      timestamp: new Date(),
      imageMetadata: imageData
    }

    setMessages(prev => [...prev, imageMessage])
    
    // Auto-trigger Claire's response to the image
    setTimeout(() => {
      getClaireResponse(`analyze this image: ${file.name}`, imageData).then(response => {
        const claireMessage: ChatMessage = {
          id: `msg-${Date.now()}`,
          type: 'claire',
          content: response,
          timestamp: new Date(),
          suggestOrchestration: userType !== 'guest'
        }
        setMessages(prev => [...prev, claireMessage])
      })
    }, 500)
  }

  if (!isVisible) return null

  return (
    <div className={`fixed bottom-0 right-0 w-full max-w-md h-[600px] bg-gradient-to-b from-blue-900/95 via-blue-800/95 to-purple-900/95 backdrop-blur-sm border border-blue-500/30 shadow-2xl flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-blue-500/30">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src="/claire_profile.png"
              alt="Claire"
              className="w-8 h-8 rounded-full border border-blue-400/50"
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-blue-900 animate-pulse"></div>
          </div>
          <div>
            <h3 className="text-white font-medium text-sm">Claire</h3>
            <p className="text-blue-300 text-xs">AiiQ Concierge {orchestrationActive && '• Coordinating...'}</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <MoreVertical size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id}>
            {/* Regular Message */}
            <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                message.type === 'user' 
                  ? 'bg-blue-500 text-white'
                  : message.type === 'system'
                  ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-300'
                  : 'bg-gray-800/50 text-white border border-gray-700'
              }`}>
                <div className="text-sm whitespace-pre-wrap">
                  {message.content}
                </div>
                <div className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>

            {/* Orchestration Suggestion */}
            {message.suggestOrchestration && (
              <div className="mb-3">
                <button
                  onClick={() => triggerOrchestration(messages[messages.indexOf(message) - 1]?.content || '')}
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white text-xs px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center"
                >
                  <Brain className="w-3 h-3 mr-2" />
                  Coordinate with the team
                </button>
              </div>
            )}

            {/* Agent Results */}
            {message.agentResults && message.agentResults.length > 0 && (
              <div className="space-y-2 mb-3">
                {message.agentResults.map((result, index) => (
                  <AgentResultCard key={index} result={result} />
                ))}
                <button
                  onClick={() => setShowVaultBuilder(true)}
                  className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white text-xs px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center"
                >
                  <Shield className="w-3 h-3 mr-2" />
                  Generate Secure pAIt™ Image
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Loading indicator */}
        {(isLoading || orchestrationActive) && (
          <div className="flex justify-start">
            <div className="bg-gray-800/50 rounded-2xl px-4 py-2 border border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="animate-spin">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-white text-sm">
                  {orchestrationActive ? 'Coordinating with agents...' : 'Claire is thinking...'}
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-blue-500/30">
        <div className="flex items-end space-x-2">
          {/* Image Upload */}
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <div className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">
              <Image size={18} className="text-gray-300" />
            </div>
          </label>

          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              placeholder="Ask Claire anything..."
              className="w-full bg-gray-800/50 text-white placeholder-gray-400 rounded-2xl px-4 py-2 pr-10 border border-gray-700 focus:border-blue-500 focus:outline-none resize-none max-h-20 text-sm"
              rows={1}
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} className="text-white" />
          </button>
        </div>
      </div>

      {/* Vault Image Builder Modal */}
      {showVaultBuilder && (
        <VaultImageBuilder
          isOpen={showVaultBuilder}
          onClose={() => setShowVaultBuilder(false)}
          agentResults={messages.find(m => m.agentResults)?.agentResults || []}
          userType={userType}
        />
      )}
    </div>
  )
}

export default ClaireChat
