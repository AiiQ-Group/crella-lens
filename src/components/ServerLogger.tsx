import { useState, useEffect } from 'react'
import { Terminal, Download, RefreshCw, Filter, Search } from 'lucide-react'

interface LogEntry {
  timestamp: string
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG'
  method: string
  endpoint: string
  statusCode: number
  responseTime: number
  ipAddress: string
  userAgent: string
  userId?: string
  sessionId?: string
  payload?: any
  response?: any
}

interface ServerLoggerProps {
  userType: 'staff' | 'member' | null
}

export default function ServerLogger({ userType }: ServerLoggerProps) {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([])
  const [showLogger, setShowLogger] = useState(false)
  const [filter, setFilter] = useState<'ALL' | 'INFO' | 'WARN' | 'ERROR'>('ALL')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (userType === 'staff' && showLogger) {
      loadServerLogs()
      // Auto-refresh every 5 seconds
      const interval = setInterval(loadServerLogs, 5000)
      return () => clearInterval(interval)
    }
  }, [userType, showLogger])

  useEffect(() => {
    // Filter logs based on level and search
    let filtered = logs
    
    if (filter !== 'ALL') {
      filtered = filtered.filter(log => log.level === filter)
    }
    
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.endpoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ipAddress.includes(searchTerm) ||
        log.method.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    setFilteredLogs(filtered)
  }, [logs, filter, searchTerm])

  const loadServerLogs = () => {
    // Generate mock server-style logs (in production, this would come from real server logs)
    const mockLogs: LogEntry[] = [
      {
        timestamp: new Date().toISOString(),
        level: 'INFO',
        method: 'POST',
        endpoint: '/api/analyze',
        statusCode: 200,
        responseTime: 1247,
        ipAddress: '192.168.1.142',
        userAgent: 'Mozilla/5.0...',
        userId: 'member_001',
        sessionId: 'sess_12345',
        payload: { image: 'trading_chart.jpg', size: '2.1MB' },
        response: { paitScore: 3.4, tags: ['financial', 'chart'] }
      },
      {
        timestamp: new Date(Date.now() - 30000).toISOString(),
        level: 'INFO',
        method: 'POST',
        endpoint: '/api/vip/upload',
        statusCode: 200,
        responseTime: 2134,
        ipAddress: '10.0.1.55',
        userAgent: 'Mozilla/5.0...',
        userId: 'vip_002',
        sessionId: 'vip_sess_67890',
        payload: { image: 'youtube_trader.png', encrypted: true },
        response: { componentScores: 5, overallScore: 2.1 }
      },
      {
        timestamp: new Date(Date.now() - 60000).toISOString(),
        level: 'WARN',
        method: 'POST',
        endpoint: '/api/analyze',
        statusCode: 429,
        responseTime: 45,
        ipAddress: '203.0.113.45',
        userAgent: 'Mozilla/5.0...',
        payload: { error: 'Rate limit exceeded' }
      },
      {
        timestamp: new Date(Date.now() - 90000).toISOString(),
        level: 'INFO',
        method: 'GET',
        endpoint: '/api/session/track',
        statusCode: 200,
        responseTime: 156,
        ipAddress: '192.168.1.15',
        userAgent: 'Chrome/120.0...',
        userId: 'staff_admin',
        sessionId: 'admin_sess_999'
      },
      {
        timestamp: new Date(Date.now() - 120000).toISOString(),
        level: 'ERROR',
        method: 'POST',
        endpoint: '/api/analyze',
        statusCode: 500,
        responseTime: 5000,
        ipAddress: '172.16.0.100',
        userAgent: 'Mozilla/5.0...',
        payload: { image: 'corrupted.jpg' },
        response: { error: 'OCR processing failed' }
      }
    ]

    // Add to existing logs
    const existingLogs = JSON.parse(localStorage.getItem('crella-server-logs') || '[]')
    const allLogs = [...mockLogs, ...existingLogs].slice(0, 100) // Keep last 100 logs
    
    setLogs(allLogs)
    localStorage.setItem('crella-server-logs', JSON.stringify(allLogs))
  }

  const getStatusColor = (code: number) => {
    if (code >= 200 && code < 300) return 'text-green-600 dark:text-green-400'
    if (code >= 300 && code < 400) return 'text-blue-600 dark:text-blue-400'
    if (code >= 400 && code < 500) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'INFO': return 'text-blue-600 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/30'
      case 'WARN': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900/30'
      case 'ERROR': return 'text-red-600 bg-red-100 dark:text-red-300 dark:bg-red-900/30'
      case 'DEBUG': return 'text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-700'
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-700'
    }
  }

  const exportLogs = () => {
    const logData = filteredLogs.map(log => ({
      timestamp: log.timestamp,
      level: log.level,
      request: `${log.method} ${log.endpoint}`,
      status: log.statusCode,
      time: `${log.responseTime}ms`,
      client: `${log.ipAddress}`,
      user: log.userId || 'anonymous'
    }))

    const csv = [
      'Timestamp,Level,Request,Status,Time,Client,User',
      ...logData.map(row => Object.values(row).join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `crella-logs-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Only show to staff
  if (userType !== 'staff') return null

  return (
    <>
      {/* Logger Toggle */}
      <button
        onClick={() => setShowLogger(!showLogger)}
        className="fixed bottom-32 right-4 bg-gray-800 hover:bg-gray-900 text-white p-3 rounded-lg shadow-lg transition-all duration-200 flex items-center space-x-2 z-30"
      >
        <Terminal className="h-4 w-4" />
        <span className="text-sm font-medium">Server Logs</span>
        {logs.length > 0 && (
          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            {logs.length}
          </span>
        )}
      </button>

      {/* Server Logger Panel */}
      {showLogger && (
        <div className="fixed bottom-44 right-4 w-[48rem] bg-black/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700 z-40 max-h-[24rem] overflow-hidden flex flex-col font-mono text-sm">
          {/* Header */}
          <div className="p-4 border-b border-gray-700 bg-gray-900/50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-green-400 flex items-center space-x-2">
                <Terminal className="h-5 w-5" />
                <span>Crella Server Logs</span>
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={loadServerLogs}
                  className="p-1 hover:bg-gray-700 rounded transition-colors"
                  title="Refresh logs"
                >
                  <RefreshCw className="h-4 w-4 text-gray-400" />
                </button>
                <button
                  onClick={exportLogs}
                  className="p-1 hover:bg-gray-700 rounded transition-colors"
                  title="Export logs"
                >
                  <Download className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-gray-300"
                >
                  <option value="ALL">All Levels</option>
                  <option value="INFO">INFO</option>
                  <option value="WARN">WARN</option>
                  <option value="ERROR">ERROR</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2 flex-1">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search logs..."
                  className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-gray-300 flex-1"
                />
              </div>
            </div>
          </div>

          {/* Log Content */}
          <div className="flex-1 overflow-y-auto p-2 bg-black text-xs text-gray-300">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No logs found matching current filters
              </div>
            ) : (
              filteredLogs.map((log, index) => (
                <div key={index} className="mb-2 hover:bg-gray-900/50 p-2 rounded border-l-2 border-l-transparent hover:border-l-green-500 transition-all">
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="text-gray-500 w-20">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(log.level)}`}>
                      {log.level}
                    </span>
                    <span className="text-blue-400 w-12">{log.method}</span>
                    <span className="text-gray-300 flex-1">{log.endpoint}</span>
                    <span className={`font-medium ${getStatusColor(log.statusCode)}`}>
                      {log.statusCode}
                    </span>
                    <span className="text-yellow-400 w-16">{log.responseTime}ms</span>
                    <span className="text-purple-400 w-24">{log.ipAddress}</span>
                  </div>
                  
                  {(log.payload || log.response) && (
                    <div className="mt-1 ml-24 text-xs">
                      {log.payload && (
                        <div className="text-cyan-400">
                          → {JSON.stringify(log.payload, null, 0)}
                        </div>
                      )}
                      {log.response && (
                        <div className="text-green-400">
                          ← {JSON.stringify(log.response, null, 0)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer Stats */}
          <div className="p-2 border-t border-gray-700 bg-gray-900/50">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>
                Showing {filteredLogs.length} of {logs.length} entries
              </span>
              <span>
                Errors: {logs.filter(l => l.level === 'ERROR').length} | 
                Warnings: {logs.filter(l => l.level === 'WARN').length}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Export function to log server activities
export const logServerActivity = (
  method: string,
  endpoint: string,
  statusCode: number,
  responseTime: number,
  payload?: any,
  response?: any
) => {
  const logEntry: LogEntry = {
    timestamp: new Date().toISOString(),
    level: statusCode >= 400 ? 'ERROR' : statusCode >= 300 ? 'WARN' : 'INFO',
    method,
    endpoint,
    statusCode,
    responseTime,
    ipAddress: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
    userAgent: navigator.userAgent,
    payload,
    response
  }

  const existingLogs = JSON.parse(localStorage.getItem('crella-server-logs') || '[]')
  existingLogs.unshift(logEntry)
  localStorage.setItem('crella-server-logs', JSON.stringify(existingLogs.slice(0, 1000)))

  console.log('Server Log:', logEntry)
}
