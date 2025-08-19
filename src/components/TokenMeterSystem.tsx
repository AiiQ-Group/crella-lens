import React, { useState, useEffect, createContext, useContext } from 'react'
import { Crown, Users, Shield, Zap, AlertTriangle, CreditCard, TrendingUp, Clock } from 'lucide-react'

// Token & Usage Context for global state management
interface TokenUsage {
  totalTokens: number
  tokensUsed: number
  tokensRemaining: number
  dailyLimit: number
  dailyUsed: number
  agentCallsToday: number
  lastReset: Date
  tier: 'free' | 'vip' | 'staff'
}

interface TokenContextType {
  usage: TokenUsage
  canUseAgent: (agentName: string) => boolean
  consumeTokens: (amount: number, operation: string) => boolean
  upgradeToVIP: () => void
  resetDaily: () => void
}

const TokenContext = createContext<TokenContextType | null>(null)

// Token Meter Component for Display
interface TokenMeterProps {
  usage: TokenUsage
  className?: string
  showUpgrade?: boolean
  onUpgrade?: () => void
}

export function TokenMeter({ usage, className = "", showUpgrade = true, onUpgrade }: TokenMeterProps) {
  const getProgressColor = () => {
    const percentUsed = (usage.tokensUsed / usage.totalTokens) * 100
    if (percentUsed >= 90) return 'bg-red-500'
    if (percentUsed >= 70) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getTierInfo = () => {
    switch (usage.tier) {
      case 'free':
        return {
          name: 'Free Preview',
          icon: <Users className="w-4 h-4" />,
          color: 'text-gray-400',
          bgColor: 'bg-gray-500/20 border-gray-500/30'
        }
      case 'vip':
        return {
          name: 'VIP Member',
          icon: <Crown className="w-4 h-4" />,
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/20 border-yellow-500/30'
        }
      case 'staff':
        return {
          name: 'Staff Access',
          icon: <Shield className="w-4 h-4" />,
          color: 'text-purple-400',
          bgColor: 'bg-purple-500/20 border-purple-500/30'
        }
    }
  }

  const tierInfo = getTierInfo()

  return (
    <div className={`bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl border border-slate-700 p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-blue-400" />
          <h3 className="font-semibold text-white">Usage Meter</h3>
        </div>
        
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium border ${tierInfo.bgColor}`}>
          {tierInfo.icon}
          <span className={tierInfo.color}>{tierInfo.name}</span>
        </div>
      </div>

      {/* Token Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-300">Tokens</span>
          <span className="text-white font-medium">
            {usage.tokensRemaining.toLocaleString()} / {usage.totalTokens.toLocaleString()}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
            style={{ width: `${Math.min((usage.tokensUsed / usage.totalTokens) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Daily Usage Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-white">{usage.dailyUsed}</div>
          <div className="text-xs text-gray-400">Today's Usage</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-white">{usage.agentCallsToday}</div>
          <div className="text-xs text-gray-400">Agent Calls</div>
        </div>
      </div>

      {/* Tier-Specific Features */}
      <div className="space-y-2 mb-4">
        {usage.tier === 'free' && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
            <h4 className="text-yellow-400 font-medium text-sm mb-2">Free Tier Limits:</h4>
            <ul className="text-xs text-yellow-300 space-y-1">
              <li>• Claire chat + 1 agent per day</li>
              <li>• Basic pAIt™ scoring only</li>
              <li>• No vault storage</li>
              <li>• No comparison tools</li>
            </ul>
          </div>
        )}

        {usage.tier === 'vip' && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
            <h4 className="text-green-400 font-medium text-sm mb-2">VIP Benefits Active:</h4>
            <ul className="text-xs text-green-300 space-y-1">
              <li>• Full multi-agent orchestration</li>
              <li>• Unlimited vault storage</li>
              <li>• Advanced pAIt™ analysis</li>
              <li>• Premium Claire guidance</li>
            </ul>
          </div>
        )}

        {usage.tier === 'staff' && (
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
            <h4 className="text-purple-400 font-medium text-sm mb-2">Staff Privileges:</h4>
            <ul className="text-xs text-purple-300 space-y-1">
              <li>• Unlimited access to all agents</li>
              <li>• Analytics dashboard access</li>
              <li>• System monitoring tools</li>
              <li>• Debug information</li>
            </ul>
          </div>
        )}
      </div>

      {/* Upgrade Button for Free Users */}
      {usage.tier === 'free' && showUpgrade && (
        <button
          onClick={onUpgrade}
          className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
        >
          <Crown className="w-4 h-4 mr-2" />
          Upgrade to VIP
        </button>
      )}

      {/* Low Token Warning */}
      {usage.tokensRemaining < (usage.totalTokens * 0.1) && usage.tier !== 'staff' && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mt-3">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-red-300 text-sm font-medium">
              Low tokens remaining!
            </span>
          </div>
        </div>
      )}

      {/* Last Reset Time */}
      <div className="text-xs text-gray-500 text-center mt-3 flex items-center justify-center">
        <Clock className="w-3 h-3 mr-1" />
        Resets daily at midnight
      </div>
    </div>
  )
}

// Token Provider Component
export function TokenProvider({ children }: { children: React.ReactNode }) {
  const [usage, setUsage] = useState<TokenUsage>(() => {
    // Load from localStorage or default values
    const stored = localStorage.getItem('crella-token-usage')
    if (stored) {
      const parsed = JSON.parse(stored)
      return {
        ...parsed,
        lastReset: new Date(parsed.lastReset)
      }
    }
    
    return {
      totalTokens: 1000,
      tokensUsed: 0,
      tokensRemaining: 1000,
      dailyLimit: 50,
      dailyUsed: 0,
      agentCallsToday: 0,
      lastReset: new Date(),
      tier: 'free' as const
    }
  })

  // Check for daily reset
  useEffect(() => {
    const now = new Date()
    const lastReset = new Date(usage.lastReset)
    
    if (now.getDate() !== lastReset.getDate()) {
      resetDaily()
    }
  }, [])

  // Save to localStorage whenever usage changes
  useEffect(() => {
    localStorage.setItem('crella-token-usage', JSON.stringify(usage))
  }, [usage])

  const canUseAgent = (agentName: string): boolean => {
    if (usage.tier === 'staff') return true
    if (usage.tier === 'vip') return usage.tokensRemaining > 0
    
    // Free tier: Claire + 1 agent per day
    if (agentName === 'Claire') return true
    return usage.agentCallsToday < 1
  }

  const consumeTokens = (amount: number, operation: string): boolean => {
    if (usage.tier === 'staff') {
      // Staff has unlimited access, but still track for analytics
      setUsage(prev => ({
        ...prev,
        tokensUsed: prev.tokensUsed + amount,
        dailyUsed: prev.dailyUsed + amount
      }))
      return true
    }

    if (usage.tokensRemaining < amount) {
      return false // Insufficient tokens
    }

    setUsage(prev => ({
      ...prev,
      tokensUsed: prev.tokensUsed + amount,
      tokensRemaining: prev.tokensRemaining - amount,
      dailyUsed: prev.dailyUsed + amount,
      agentCallsToday: operation.includes('agent') ? prev.agentCallsToday + 1 : prev.agentCallsToday
    }))

    // Log usage for analytics
    logUsage(amount, operation, usage.tier)
    
    return true
  }

  const upgradeToVIP = () => {
    setUsage(prev => ({
      ...prev,
      tier: 'vip',
      totalTokens: 10000,
      tokensRemaining: prev.tokensRemaining + 9000, // Add VIP tokens
      dailyLimit: 500
    }))
    
    // Trigger Stripe payment flow here
    console.log('🔄 Triggering VIP upgrade flow...')
  }

  const resetDaily = () => {
    setUsage(prev => ({
      ...prev,
      dailyUsed: 0,
      agentCallsToday: 0,
      lastReset: new Date(),
      // Add daily token refresh for VIP users
      tokensRemaining: prev.tier === 'vip' ? Math.min(prev.tokensRemaining + 500, prev.totalTokens) : prev.tokensRemaining
    }))
  }

  const contextValue: TokenContextType = {
    usage,
    canUseAgent,
    consumeTokens,
    upgradeToVIP,
    resetDaily
  }

  return (
    <TokenContext.Provider value={contextValue}>
      {children}
    </TokenContext.Provider>
  )
}

// Hook for using token context
export function useTokens() {
  const context = useContext(TokenContext)
  if (!context) {
    throw new Error('useTokens must be used within TokenProvider')
  }
  return context
}

// Usage analytics logging function
function logUsage(amount: number, operation: string, tier: string) {
  // This would send analytics to your backend
  const usageEvent = {
    timestamp: new Date().toISOString(),
    tokensConsumed: amount,
    operation,
    tier,
    userId: 'current-user-id' // Replace with actual user ID
  }
  
  console.log('📊 Usage Event:', usageEvent)
  
  // In production, send to analytics service:
  // await fetch('/api/analytics/usage', { method: 'POST', body: JSON.stringify(usageEvent) })
}

// Token cost constants for different operations
export const TOKEN_COSTS = {
  CLAIRE_MESSAGE: 5,
  AGENT_CALL: 25,
  IMAGE_ANALYSIS: 15,
  VAULT_GENERATION: 30,
  ORCHESTRATION: 40
} as const

export type TokenCost = typeof TOKEN_COSTS[keyof typeof TOKEN_COSTS]
