import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Zap, 
  Crown, 
  Calendar,
  BarChart3,
  Home,
  Eye,
  Award,
  Clock,
  Users,
  Star,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import { AppState } from '../MobileRouter'

interface MobileDashboardProps {
  appState: AppState
  updateAppState: (updates: Partial<AppState>) => void
}

export function MobileDashboard({ appState, updateAppState }: MobileDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const navigate = useNavigate()

  // Mock analytics data
  const analytics = {
    totalAnalyses: 24,
    tokensUsed: 156,
    avgScore: 1987,
    successRate: 87,
    weeklyTrend: +12,
    topCategory: 'Real Estate',
    recentActivity: [
      { date: 'Today', analyses: 3, tokens: 12 },
      { date: 'Yesterday', analyses: 5, tokens: 18 },
      { date: '2 days ago', analyses: 2, tokens: 8 },
      { date: '3 days ago', analyses: 4, tokens: 15 },
      { date: '4 days ago', analyses: 1, tokens: 4 },
      { date: '5 days ago', analyses: 6, tokens: 22 },
      { date: '6 days ago', analyses: 3, tokens: 11 }
    ]
  }

  const propertyHistory = [
    {
      id: '1',
      address: '1234 Tech Ridge Blvd, Austin, TX',
      date: '2 days ago',
      score: 2150,
      status: 'Analysis Complete',
      type: 'Residential'
    },
    {
      id: '2', 
      address: '5678 Domain Dr, Austin, TX',
      date: '1 week ago',
      score: 1980,
      status: 'Saved to Vault',
      type: 'Commercial'
    },
    {
      id: '3',
      address: '9012 Lake Austin Blvd, Austin, TX',
      date: '2 weeks ago',
      score: 2200,
      status: 'Shared',
      type: 'Luxury'
    }
  ]

  const getScoreColor = (score: number) => {
    if (score >= 2000) return 'text-green-400'
    if (score >= 1500) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getTierInfo = () => {
    switch (appState.user.type) {
      case 'staff':
        return {
          name: 'Staff Access',
          icon: <Award className="w-5 h-5" />,
          color: 'text-purple-400',
          bgColor: 'from-purple-500/20 to-indigo-500/20',
          borderColor: 'border-purple-500/30'
        }
      case 'member':
        return {
          name: 'VIP Member',
          icon: <Crown className="w-5 h-5" />,
          color: 'text-yellow-400',
          bgColor: 'from-yellow-500/20 to-orange-500/20',
          borderColor: 'border-yellow-500/30'
        }
      default:
        return {
          name: 'Guest Access',
          icon: <Users className="w-5 h-5" />,
          color: 'text-gray-400',
          bgColor: 'from-gray-500/20 to-gray-600/20',
          borderColor: 'border-gray-500/30'
        }
    }
  }

  const tierInfo = getTierInfo()

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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your AI analysis activity and insights
          </p>
        </motion.div>

        {/* User Tier Status */}
        <motion.div
          className={`mb-6 bg-gradient-to-r ${tierInfo.bgColor} border ${tierInfo.borderColor} rounded-2xl p-4`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {tierInfo.icon}
              <div>
                <h3 className={`font-semibold ${tierInfo.color}`}>{tierInfo.name}</h3>
                <p className="text-sm text-gray-300">
                  {appState.user.tokens} tokens remaining
                </p>
              </div>
            </div>
            {appState.user.type === 'guest' && (
              <button
                onClick={() => navigate('/login')}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Upgrade
              </button>
            )}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="grid grid-cols-2 gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              <div className={`flex items-center text-xs ${
                analytics.weeklyTrend > 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {analytics.weeklyTrend > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {Math.abs(analytics.weeklyTrend)}%
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {analytics.totalAnalyses}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Total Analyses
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <Star className="w-4 h-4 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {analytics.avgScore}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Avg pAIt™ Score
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-5 h-5 text-purple-500" />
              <Clock className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {analytics.tokensUsed}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Tokens Used
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <Eye className="w-5 h-5 text-orange-500" />
              <div className="text-xs text-green-500 font-medium">
                {analytics.successRate}%
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {analytics.topCategory}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Top Category
            </div>
          </div>
        </motion.div>

        {/* Activity Chart */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Weekly Activity</h3>
          <div className="space-y-3">
            {analytics.recentActivity.map((day, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {day.date}
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {day.analyses}
                    </span>
                  </div>
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                      style={{ width: `${Math.min(day.tokens * 4, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 w-8 text-right">
                    {day.tokens}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Property History */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Austin Property History</h3>
            <Home className="w-5 h-5 text-blue-500" />
          </div>
          <div className="space-y-3">
            {propertyHistory.map((property, index) => (
              <div key={property.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white text-sm">
                    {property.address}
                  </div>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {property.date}
                    </span>
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                      {property.type}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold text-sm ${getScoreColor(property.score)}`}>
                    {property.score}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {property.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="grid grid-cols-2 gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <button
            onClick={() => navigate('/upload')}
            className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-medium py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            New Analysis
          </button>
          <button
            onClick={() => navigate('/vault')}
            className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-4 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            View Vault
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default MobileDashboard
