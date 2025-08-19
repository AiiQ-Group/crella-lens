import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Archive, 
  Search, 
  Filter, 
  MoreVertical,
  Eye,
  Share2,
  Download,
  Trash2,
  Star,
  Calendar,
  TrendingUp,
  Shield,
  Lock
} from 'lucide-react'
import { AppState } from '../MobileRouter'
import { PAItScoreOrb } from '../PAItScoreOrb'

interface VaultScreenProps {
  appState: AppState
  updateAppState: (updates: Partial<AppState>) => void
}

export function VaultScreen({ appState, updateAppState }: VaultScreenProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  // Mock vault items if empty
  const mockVaultItems = appState.vaultItems.length === 0 ? [
    {
      id: '1',
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      images: [],
      paitScore: 2150,
      confidence: 0.92,
      title: 'Trading Strategy Analysis',
      tags: ['trading', 'options'],
      agents: ['JBot', 'Claudia']
    },
    {
      id: '2', 
      timestamp: new Date(Date.now() - 172800000), // 2 days ago
      images: [],
      paitScore: 1980,
      confidence: 0.87,
      title: 'Property Document Review',
      tags: ['real-estate', 'legal'],
      agents: ['Claudia', 'Kathy']
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 259200000), // 3 days ago
      images: [],
      paitScore: 2200,
      confidence: 0.89,
      title: 'Video Content Verification',
      tags: ['media', 'verification'],
      agents: ['Kathy']
    }
  ] : appState.vaultItems

  const filteredItems = mockVaultItems.filter(item => {
    const matchesSearch = item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    if (selectedFilter === 'all') return matchesSearch
    if (selectedFilter === 'high-score') return matchesSearch && item.paitScore >= 2000
    if (selectedFilter === 'recent') return matchesSearch && (Date.now() - item.timestamp.getTime()) < 86400000 * 7
    
    return matchesSearch
  })

  const getScoreColor = (score: number) => {
    if (score >= 2000) return 'text-green-400'
    if (score >= 1500) return 'text-yellow-400'
    return 'text-red-400'
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    return date.toLocaleDateString()
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center space-x-2">
            <Shield className="w-7 h-7 text-purple-500" />
            <span>Private Vault</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your secure analysis history with cryptographic proof
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          className="mb-6 space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your vault..."
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          <div className="flex space-x-2">
            {[
              { id: 'all', label: 'All' },
              { id: 'high-score', label: 'High Score' },
              { id: 'recent', label: 'Recent' }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilter === filter.id
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Vault Stats */}
        <motion.div
          className="grid grid-cols-3 gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
              {mockVaultItems.length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Total Items</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
              {mockVaultItems.filter(item => item.paitScore >= 2000).length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">High Scores</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              {Math.round(mockVaultItems.reduce((acc, item) => acc + item.confidence, 0) / mockVaultItems.length * 100) || 0}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Avg. Confidence</div>
          </div>
        </motion.div>

        {/* Vault Items */}
        <div className="space-y-4">
          {filteredItems.length === 0 ? (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Archive className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {searchQuery ? 'No results found' : 'Your vault is empty'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchQuery 
                  ? 'Try adjusting your search terms or filters'
                  : 'Start analyzing images to build your secure intelligence vault'
                }
              </p>
            </motion.div>
          ) : (
            filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {item.title || `Analysis ${item.id}`}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(item.timestamp)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <PAItScoreOrb score={item.paitScore} size="small" />
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`text-lg font-bold ${getScoreColor(item.paitScore)}`}>
                      {item.paitScore}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {Math.round(item.confidence * 100)}% confidence
                    </div>
                  </div>
                  
                  <div className="flex space-x-1">
                    {item.agents?.map((agent, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full"
                      >
                        {agent}
                      </span>
                    ))}
                  </div>
                </div>

                {item.tags && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {item.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex space-x-2">
                  <button className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">View</span>
                  </button>
                  
                  <button className="flex items-center justify-center p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                  
                  <button className="flex items-center justify-center p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Vault Security Info */}
        <motion.div
          className="mt-8 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="flex items-center space-x-3 mb-2">
            <Lock className="w-5 h-5 text-blue-400" />
            <h4 className="font-medium text-white">Vault Security</h4>
          </div>
          <p className="text-sm text-blue-200 leading-relaxed">
            Your analyses are encrypted and stored with cryptographic proof. 
            Each item includes timestamp verification and cannot be altered or deleted without leaving a trace.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default VaultScreen
