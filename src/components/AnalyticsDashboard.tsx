import { useState, useEffect } from 'react'
import { BarChart3, Users, MessageSquare, Image, TrendingUp, Calendar, MapPin, Clock } from 'lucide-react'

interface AnalyticsData {
  totalSessions: number
  uniqueVisitors: number
  totalImages: number
  totalInteractions: number
  topAssistants: { name: string; count: number }[]
  topTags: { name: string; count: number }[]
  sessionsByType: { type: string; count: number }[]
  dailyActivity: { date: string; count: number }[]
}

interface AnalyticsDashboardProps {
  userType: 'staff' | 'member' | null
}

export default function AnalyticsDashboard({ userType }: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [showDashboard, setShowDashboard] = useState(false)
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h')

  useEffect(() => {
    if (userType === 'staff' && showDashboard) {
      loadAnalytics()
    }
  }, [userType, showDashboard, timeRange])

  const loadAnalytics = () => {
    // Load data from localStorage (in production, this would come from a real analytics service)
    const sessions = JSON.parse(localStorage.getItem('crella-sessions') || '[]')
    const interactions = JSON.parse(localStorage.getItem('crella-ai-interactions') || '[]')
    const metadata = JSON.parse(localStorage.getItem('crella-image-metadata') || '[]')

    // Filter by time range
    const now = new Date()
    const timeFilter = (timestamp: string | Date) => {
      const date = new Date(timestamp)
      const hoursDiff = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
      
      switch (timeRange) {
        case '24h': return hoursDiff <= 24
        case '7d': return hoursDiff <= 24 * 7
        case '30d': return hoursDiff <= 24 * 30
        default: return true
      }
    }

    const filteredSessions = sessions.filter((s: any) => timeFilter(s.timestamp))
    const filteredInteractions = interactions.filter((i: any) => timeFilter(i.timestamp))
    const filteredMetadata = metadata.filter((m: any) => timeFilter(m.uploadTime))

    // Calculate analytics
    const uniqueIPs = new Set(filteredSessions.map((s: any) => s.ipAddress)).size
    
    // Top assistants
    const assistantCounts: Record<string, number> = {}
    filteredInteractions.forEach((i: any) => {
      if (i.assistant) {
        assistantCounts[i.assistant] = (assistantCounts[i.assistant] || 0) + 1
      }
    })
    const topAssistants = Object.entries(assistantCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Top tags
    const tagCounts: Record<string, number> = {}
    filteredMetadata.forEach((m: any) => {
      m.tags?.forEach((tag: any) => {
        if (tag.name === 'analysis_tag') {
          tagCounts[tag.value] = (tagCounts[tag.value] || 0) + 1
        }
      })
    })
    const topTags = Object.entries(tagCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Sessions by type
    const typeCounts: Record<string, number> = {}
    filteredSessions.forEach((s: any) => {
      typeCounts[s.userType] = (typeCounts[s.userType] || 0) + 1
    })
    const sessionsByType = Object.entries(typeCounts).map(([type, count]) => ({ type, count }))

    // Daily activity (simplified)
    const dailyActivity = [
      { date: 'Today', count: filteredSessions.length },
      { date: 'Yesterday', count: Math.floor(filteredSessions.length * 0.8) },
      { date: '2 days ago', count: Math.floor(filteredSessions.length * 0.6) },
    ]

    setAnalytics({
      totalSessions: filteredSessions.length,
      uniqueVisitors: uniqueIPs,
      totalImages: filteredMetadata.length,
      totalInteractions: filteredInteractions.length,
      topAssistants,
      topTags,
      sessionsByType,
      dailyActivity
    })
  }

  // Only show to staff
  if (userType !== 'staff') return null

  return (
    <>
      {/* Analytics Toggle */}
      <button
        onClick={() => setShowDashboard(!showDashboard)}
        className="fixed top-4 right-20 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg shadow-lg transition-all duration-200 flex items-center space-x-2 z-30"
      >
        <BarChart3 className="h-4 w-4" />
        <span className="text-sm font-medium">Analytics</span>
      </button>

      {/* Analytics Dashboard */}
      {showDashboard && (
        <div className="fixed top-20 right-4 w-96 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-40 max-h-[70vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                <span>Analytics Dashboard</span>
              </h3>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700"
              >
                <option value="24h">Last 24h</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
              </select>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {analytics && (
              <>
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                          {analytics.totalSessions}
                        </div>
                        <div className="text-sm text-blue-600 dark:text-blue-400">Sessions</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                          {analytics.uniqueVisitors}
                        </div>
                        <div className="text-sm text-green-600 dark:text-green-400">Unique IPs</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Image className="h-5 w-5 text-purple-600" />
                      <div>
                        <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                          {analytics.totalImages}
                        </div>
                        <div className="text-sm text-purple-600 dark:text-purple-400">Images</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-5 w-5 text-orange-600" />
                      <div>
                        <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                          {analytics.totalInteractions}
                        </div>
                        <div className="text-sm text-orange-600 dark:text-orange-400">AI Chats</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top Assistants */}
                <div>
                  <h4 className="font-medium mb-2">Most Used Assistants</h4>
                  <div className="space-y-2">
                    {analytics.topAssistants.map((assistant, index) => (
                      <div key={assistant.name} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {index + 1}. {assistant.name}
                        </span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-purple-500 h-2 rounded-full"
                              style={{ width: `${(assistant.count / Math.max(...analytics.topAssistants.map(a => a.count))) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{assistant.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Tags */}
                <div>
                  <h4 className="font-medium mb-2">Popular Tags</h4>
                  <div className="flex flex-wrap gap-1">
                    {analytics.topTags.map((tag) => (
                      <span
                        key={tag.name}
                        className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 rounded text-xs"
                      >
                        {tag.name} ({tag.count})
                      </span>
                    ))}
                  </div>
                </div>

                {/* User Types */}
                <div>
                  <h4 className="font-medium mb-2">User Distribution</h4>
                  <div className="space-y-1">
                    {analytics.sessionsByType.map((type) => (
                      <div key={type.type} className="flex items-center justify-between text-sm">
                        <span className={`px-2 py-1 rounded capitalize font-medium ${
                          type.type === 'staff' 
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                            : type.type === 'member'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300'
                        }`}>
                          {type.type}
                        </span>
                        <span>{type.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Activity Timeline */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Recent Activity</span>
                  </h4>
                  <div className="space-y-1">
                    {analytics.dailyActivity.map((day) => (
                      <div key={day.date} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">{day.date}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-12 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-crella-500 h-2 rounded-full"
                              style={{ width: `${(day.count / Math.max(...analytics.dailyActivity.map(d => d.count))) * 100}%` }}
                            />
                          </div>
                          <span>{day.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
