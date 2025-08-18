import { useState, useEffect } from 'react'
import { Clock, MapPin, Eye, User, Monitor } from 'lucide-react'

interface SessionData {
  id: string
  ipAddress: string
  userAgent: string
  timestamp: Date
  location?: string
  userType: 'guest' | 'member' | 'staff'
  userName?: string
  activity: string
  imageId?: string
  duration?: number
}

interface SessionTrackerProps {
  isAuthenticated: boolean
  userType: 'staff' | 'member' | null
  currentImageId?: string
}

// Simulated IP geolocation (in production, use a real service)
const getLocationFromIP = async (ip: string): Promise<string> => {
  // Mock data - in production, integrate with ipapi.co or similar
  const locations = ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'London, UK', 'Toronto, CA']
  return locations[Math.floor(Math.random() * locations.length)]
}

// Get client IP (simplified - in production, handle proxies properly)
const getClientIP = (): string => {
  // This is a simplified version - in production, you'd get this from headers
  return `192.168.1.${Math.floor(Math.random() * 254) + 1}`
}

export default function SessionTracker({ isAuthenticated, userType, currentImageId }: SessionTrackerProps) {
  const [currentSession, setCurrentSession] = useState<SessionData | null>(null)
  const [sessionHistory, setSessionHistory] = useState<SessionData[]>([])
  const [showTracker, setShowTracker] = useState(false)

  useEffect(() => {
    // Initialize session tracking
    const initSession = async () => {
      const ip = getClientIP()
      const location = await getLocationFromIP(ip)
      
      const session: SessionData = {
        id: Date.now().toString(),
        ipAddress: ip,
        userAgent: navigator.userAgent,
        timestamp: new Date(),
        location,
        userType: isAuthenticated ? (userType || 'member') : 'guest',
        userName: isAuthenticated ? (userType === 'staff' ? 'Staff User' : 'Member') : undefined,
        activity: 'Page View',
        imageId: currentImageId,
        duration: 0
      }
      
      setCurrentSession(session)
      
      // Add to history
      setSessionHistory(prev => [session, ...prev.slice(0, 49)]) // Keep last 50 sessions
      
      // Log to localStorage for persistence
      const existingLog = JSON.parse(localStorage.getItem('crella-sessions') || '[]')
      existingLog.unshift(session)
      localStorage.setItem('crella-sessions', JSON.stringify(existingLog.slice(0, 100)))
    }

    initSession()
  }, [isAuthenticated, userType, currentImageId])

  useEffect(() => {
    // Load session history from localStorage
    const savedSessions = JSON.parse(localStorage.getItem('crella-sessions') || '[]')
    setSessionHistory(savedSessions.map((s: any) => ({ ...s, timestamp: new Date(s.timestamp) })))
  }, [])

  // Track activity duration
  useEffect(() => {
    if (!currentSession) return

    const interval = setInterval(() => {
      setCurrentSession(prev => prev ? { ...prev, duration: (prev.duration || 0) + 1 } : null)
    }, 1000)

    return () => clearInterval(interval)
  }, [currentSession])

  const logActivity = (activity: string, imageId?: string) => {
    if (!currentSession) return

    const updatedSession = {
      ...currentSession,
      activity,
      imageId: imageId || currentSession.imageId,
      timestamp: new Date()
    }

    setCurrentSession(updatedSession)
    
    // Update history
    setSessionHistory(prev => [updatedSession, ...prev])
    
    // Update localStorage
    const existingLog = JSON.parse(localStorage.getItem('crella-sessions') || '[]')
    existingLog.unshift(updatedSession)
    localStorage.setItem('crella-sessions', JSON.stringify(existingLog.slice(0, 100)))
  }

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`
  }

  // Only show to staff
  if (userType !== 'staff') {
    // Still track sessions, but don't show UI
    return null
  }

  return (
    <>
      {/* Floating Activity Tracker */}
      <div className="fixed top-4 left-4 z-30">
        <button
          onClick={() => setShowTracker(!showTracker)}
          className="bg-gray-800/90 dark:bg-gray-700/90 backdrop-blur-sm text-white p-3 rounded-lg shadow-lg hover:bg-gray-700/90 transition-all duration-200 flex items-center space-x-2"
        >
          <Monitor className="h-4 w-4" />
          <span className="text-sm font-medium">Activity</span>
          {sessionHistory.length > 0 && (
            <span className="bg-crella-600 text-white text-xs px-2 py-1 rounded-full">
              {sessionHistory.length}
            </span>
          )}
        </button>
      </div>

      {/* Session Tracker Panel */}
      {showTracker && (
        <div className="fixed top-20 left-4 w-80 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-40 max-h-96 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">Session Activity</h3>
              <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live Tracking</span>
              </div>
            </div>
          </div>

          {/* Current Session */}
          {currentSession && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-700 dark:text-green-300">Current Session</span>
                <span className="text-xs text-green-600 dark:text-green-400">
                  {formatDuration(currentSession.duration || 0)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">{currentSession.ipAddress}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {currentSession.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="h-3 w-3 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">{currentSession.userType}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="h-3 w-3 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">{currentSession.activity}</span>
                </div>
              </div>
              {currentSession.location && (
                <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                  📍 {currentSession.location}
                </div>
              )}
            </div>
          )}

          {/* Session History */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Recent Activity</h4>
              <div className="space-y-3">
                {sessionHistory.slice(0, 10).map((session, index) => (
                  <div key={session.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          session.userType === 'staff' 
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                            : session.userType === 'member'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300'
                        }`}>
                          {session.userType}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">{session.activity}</span>
                      </div>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <span>🌐 {session.ipAddress}</span>
                        <span>🕒 {session.timestamp.toLocaleTimeString()}</span>
                      </div>
                      {session.location && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          📍 {session.location}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Export logging function for use in other components
export const useSessionLogger = () => {
  const logActivity = (activity: string, imageId?: string) => {
    // This would integrate with the SessionTracker's logActivity function
    // For now, we'll just log to console and localStorage
    const log = {
      activity,
      imageId,
      timestamp: new Date(),
      ipAddress: getClientIP()
    }
    
    console.log('Activity:', log)
    
    // Add to activity log
    const existingLog = JSON.parse(localStorage.getItem('crella-activity-log') || '[]')
    existingLog.unshift(log)
    localStorage.setItem('crella-activity-log', JSON.stringify(existingLog.slice(0, 200)))
  }

  return { logActivity }
}
