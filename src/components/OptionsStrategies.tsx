import { useState, useEffect } from 'react'
import { TrendingUp, Clock, AlertTriangle, DollarSign, Target } from 'lucide-react'

interface Strategy {
  id: string
  name: string
  symbol: string
  type: 'Long Call Condor'
  strikes: {
    long1: number
    short1: number
    short2: number
    long2: number
  }
  expiration: string
  maxProfit: number
  maxLoss: number
  breakeven: { lower: number; upper: number }
  probability: number
  timeRemaining: number // in seconds
}

interface OptionsStrategiesProps {
  isAuthenticated: boolean
  userType: 'staff' | 'member' | null
}

export default function OptionsStrategies({ isAuthenticated, userType }: OptionsStrategiesProps) {
  const [strategies, setStrategies] = useState<Strategy[]>([])
  const [timeLeft, setTimeLeft] = useState<Record<string, number>>({})

  useEffect(() => {
    if (isAuthenticated && userType === 'member') {
      // Mock strategies that expire at end of trading day (4:00 PM ET)
      const now = new Date()
      const endOfDay = new Date()
      endOfDay.setHours(16, 0, 0, 0) // 4:00 PM
      
      // If it's past 4 PM, set for next day
      if (now > endOfDay) {
        endOfDay.setDate(endOfDay.getDate() + 1)
      }
      
      const secondsUntilExpiry = Math.floor((endOfDay.getTime() - now.getTime()) / 1000)

      const mockStrategies: Strategy[] = [
        {
          id: 'strategy-1',
          name: 'TSLA Long Call Condor',
          symbol: 'TSLA',
          type: 'Long Call Condor',
          strikes: { long1: 320, short1: 330, short2: 340, long2: 350 },
          expiration: 'Today 4:00 PM ET',
          maxProfit: 485,
          maxLoss: 515,
          breakeven: { lower: 325.15, upper: 344.85 },
          probability: 68,
          timeRemaining: secondsUntilExpiry
        },
        {
          id: 'strategy-2', 
          name: 'SPY Long Call Condor',
          symbol: 'SPY',
          type: 'Long Call Condor',
          strikes: { long1: 540, short1: 545, short2: 550, long2: 555 },
          expiration: 'Today 4:00 PM ET',
          maxProfit: 325,
          maxLoss: 175,
          breakeven: { lower: 541.75, upper: 553.25 },
          probability: 72,
          timeRemaining: secondsUntilExpiry
        }
      ]

      setStrategies(mockStrategies)
      
      // Initialize time tracking
      const initialTimes: Record<string, number> = {}
      mockStrategies.forEach(strategy => {
        initialTimes[strategy.id] = strategy.timeRemaining
      })
      setTimeLeft(initialTimes)
    }
  }, [isAuthenticated, userType])

  useEffect(() => {
    if (Object.keys(timeLeft).length === 0) return

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        const updated = { ...prev }
        Object.keys(updated).forEach(id => {
          if (updated[id] > 0) {
            updated[id] -= 1
          }
        })
        return updated
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return 'EXPIRED'
    
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    return `${hours}h ${minutes}m ${secs}s`
  }

  if (!isAuthenticated || userType !== 'member' || strategies.length === 0) {
    return null
  }

  return (
    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-crella-600" />
          <span>Today's Strategy Recommendations</span>
        </h3>
        <div className="flex items-center space-x-2 text-sm text-amber-600 dark:text-amber-400">
          <Clock className="h-4 w-4" />
          <span className="font-medium">Expires at Market Close</span>
        </div>
      </div>

      <div className="space-y-4">
        {strategies.map((strategy) => (
          <div key={strategy.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            {/* Strategy Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">{strategy.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{strategy.type}</p>
              </div>
              <div className="text-right">
                <div className={`font-mono font-bold text-lg ${
                  timeLeft[strategy.id] <= 3600 
                    ? 'text-red-600 dark:text-red-400' 
                    : timeLeft[strategy.id] <= 7200
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-green-600 dark:text-green-400'
                }`}>
                  {formatTime(timeLeft[strategy.id] || 0)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Time Left</div>
              </div>
            </div>

            {/* Strike Prices */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded text-center">
                <div className="text-xs text-gray-600 dark:text-gray-400">Long</div>
                <div className="font-bold text-blue-600 dark:text-blue-400">${strategy.strikes.long1}</div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded text-center">
                <div className="text-xs text-gray-600 dark:text-gray-400">Short</div>
                <div className="font-bold text-red-600 dark:text-red-400">${strategy.strikes.short1}</div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded text-center">
                <div className="text-xs text-gray-600 dark:text-gray-400">Short</div>
                <div className="font-bold text-red-600 dark:text-red-400">${strategy.strikes.short2}</div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded text-center">
                <div className="text-xs text-gray-600 dark:text-gray-400">Long</div>
                <div className="font-bold text-blue-600 dark:text-blue-400">${strategy.strikes.long2}</div>
              </div>
            </div>

            {/* Strategy Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <div>
                  <div className="text-gray-600 dark:text-gray-400">Max Profit</div>
                  <div className="font-semibold text-green-600">${strategy.maxProfit}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <div>
                  <div className="text-gray-600 dark:text-gray-400">Max Loss</div>
                  <div className="font-semibold text-red-600">${strategy.maxLoss}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-amber-600" />
                <div>
                  <div className="text-gray-600 dark:text-gray-400">Breakeven</div>
                  <div className="font-semibold">${strategy.breakeven.lower} - ${strategy.breakeven.upper}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-crella-600" />
                <div>
                  <div className="text-gray-600 dark:text-gray-400">Success %</div>
                  <div className="font-semibold text-crella-600">{strategy.probability}%</div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <button 
                disabled={timeLeft[strategy.id] <= 0}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  timeLeft[strategy.id] <= 0
                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                    : 'bg-crella-600 hover:bg-crella-700 text-white'
                }`}
              >
                {timeLeft[strategy.id] <= 0 ? 'Strategy Expired' : 'Execute Strategy'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
        <p className="text-xs text-amber-800 dark:text-amber-200">
          <strong>⚠️ Demo Strategies:</strong> These are example strategies for educational purposes. 
          Always consult with Crella.AI Assistant before executing any trades.
        </p>
      </div>
    </div>
  )
}
