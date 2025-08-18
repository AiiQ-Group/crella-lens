import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Crown, Shield, Zap, Star, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'

interface VIPUploaderProps {
  onImageUpload: (file: File, isVIP: boolean) => void
  userType: 'staff' | 'member' | null
  isAuthenticated: boolean
}

interface VIPSession {
  id: string
  userId: string
  deviceFingerprint: string
  ipAddress: string
  lastActivity: Date
  autoLogin: boolean
}

interface ComponentScore {
  component: string
  score: number
  confidence: number
  reasoning: string
  category: 'claims' | 'evidence' | 'methodology' | 'credibility' | 'risk'
}

export default function VIPUploader({ onImageUpload, userType, isAuthenticated }: VIPUploaderProps) {
  const [vipSession, setVipSession] = useState<VIPSession | null>(null)
  const [isVIPMode, setIsVIPMode] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [processingVIP, setProcessingVIP] = useState(false)

  useEffect(() => {
    // Check for existing VIP session
    const existingSession = localStorage.getItem('crella-vip-session')
    if (existingSession) {
      const session = JSON.parse(existingSession)
      // Verify session is still valid (within 7 days)
      const sessionAge = Date.now() - new Date(session.lastActivity).getTime()
      if (sessionAge < 7 * 24 * 60 * 60 * 1000) { // 7 days
        setVipSession(session)
        setIsVIPMode(true)
      } else {
        localStorage.removeItem('crella-vip-session')
      }
    }
  }, [])

  const generateDeviceFingerprint = (): string => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    ctx!.textBaseline = 'top'
    ctx!.font = '14px Arial'
    ctx!.fillText('Device fingerprint', 2, 2)
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL()
    ].join('|')
    
    return btoa(fingerprint).substr(0, 32)
  }

  const createVIPSession = () => {
    const session: VIPSession = {
      id: `vip_${Date.now()}`,
      userId: isAuthenticated ? `user_${userType}` : 'guest_vip',
      deviceFingerprint: generateDeviceFingerprint(),
      ipAddress: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
      lastActivity: new Date(),
      autoLogin: true
    }
    
    setVipSession(session)
    setIsVIPMode(true)
    localStorage.setItem('crella-vip-session', JSON.stringify(session))
    
    // Log VIP session creation
    logVIPActivity('VIP_SESSION_CREATED', 'New VIP session established', session)
  }

  const logVIPActivity = (action: string, details: string, session: VIPSession) => {
    const log = {
      timestamp: new Date().toISOString(),
      sessionId: session.id,
      action,
      details,
      ipAddress: session.ipAddress,
      deviceFingerprint: session.deviceFingerprint,
      userAgent: navigator.userAgent
    }
    
    const existingLogs = JSON.parse(localStorage.getItem('crella-vip-logs') || '[]')
    existingLogs.unshift(log)
    localStorage.setItem('crella-vip-logs', JSON.stringify(existingLogs.slice(0, 1000)))
    
    console.log('VIP Activity:', log)
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      
      if (isVIPMode && vipSession) {
        setProcessingVIP(true)
        
        // Enhanced processing for VIP uploads
        await processVIPUpload(file, vipSession)
        
        // Update session activity
        const updatedSession = { ...vipSession, lastActivity: new Date() }
        setVipSession(updatedSession)
        localStorage.setItem('crella-vip-session', JSON.stringify(updatedSession))
        
        setProcessingVIP(false)
      }
      
      onImageUpload(file, isVIPMode)
    }
  }, [onImageUpload, isVIPMode, vipSession])

  const processVIPUpload = async (file: File, session: VIPSession) => {
    // Simulate advanced VIP processing
    logVIPActivity('VIP_UPLOAD_START', `Processing ${file.name} (${file.size} bytes)`, session)
    
    // Simulate encryption and metadata embedding
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    logVIPActivity('VIP_UPLOAD_ENCRYPTED', 'Image encrypted with embedded metadata', session)
    
    // Simulate component-level analysis
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    logVIPActivity('VIP_ANALYSIS_COMPLETE', 'Component-level pAIt scoring completed', session)
  }

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp']
    },
    multiple: false,
    maxSize: 50 * 1024 * 1024, // 50MB for VIP
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false)
  })

  return (
    <div className="space-y-4">
      {/* VIP Toggle */}
      {!isVIPMode && (
        <div className="bg-gradient-to-r from-amber-50 to-purple-50 dark:from-amber-900/20 dark:to-purple-900/20 border border-amber-200 dark:border-amber-800/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-amber-400 to-purple-500 rounded-lg">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-amber-800 dark:text-amber-200">Unlock VIP Mode</h3>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Auto-login, encrypted uploads, advanced pAIt scoring
                </p>
              </div>
            </div>
            <button
              onClick={createVIPSession}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-600 hover:to-purple-700 text-white rounded-lg transition-all duration-200 flex items-center space-x-2 font-medium"
            >
              <Star className="h-4 w-4" />
              <span>Enable VIP</span>
            </button>
          </div>
        </div>
      )}

      {/* VIP Status */}
      {isVIPMode && vipSession && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-purple-800 dark:text-purple-200 flex items-center space-x-2">
                  <span>VIP Mode Active</span>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </h3>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Session ID: {vipSession.id.slice(-8)} • Auto-login enabled
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-purple-600 dark:text-purple-400">
              <Shield className="h-4 w-4" />
              <span>Encrypted</span>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Uploader */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
          ${isVIPMode 
            ? 'bg-gradient-to-br from-purple-50/50 to-indigo-50/50 dark:from-purple-900/10 dark:to-indigo-900/10' 
            : 'bg-white dark:bg-gray-800'
          }
          ${isDragActive && !isDragReject
            ? isVIPMode 
              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-lg shadow-purple-200/50' 
              : 'border-crella-500 bg-crella-50 dark:bg-crella-900/20'
            : isDragReject
            ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
            : isVIPMode
            ? 'border-purple-300 dark:border-purple-600 hover:border-purple-400 dark:hover:border-purple-500'
            : 'border-gray-300 dark:border-gray-600 hover:border-crella-400 dark:hover:border-crella-500'
          }
        `}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-4">
          <div className={`mx-auto w-20 h-20 flex items-center justify-center rounded-full ${
            isVIPMode 
              ? 'bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-800 dark:to-indigo-800' 
              : 'bg-gray-100 dark:bg-gray-700'
          }`}>
            {processingVIP ? (
              <div className="animate-spin">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
            ) : isDragActive ? (
              <TrendingUp className={`h-8 w-8 ${isVIPMode ? 'text-purple-600' : 'text-crella-600'}`} />
            ) : (
              <div className="relative">
                {isVIPMode && (
                  <Crown className="absolute -top-2 -right-2 h-5 w-5 text-amber-500" />
                )}
                <div className={`h-8 w-8 ${isVIPMode ? 'text-purple-500' : 'text-gray-400'}`}>
                  📸
                </div>
              </div>
            )}
          </div>
          
          <div>
            <p className={`text-lg font-medium ${isVIPMode ? 'text-purple-800 dark:text-purple-200' : 'text-gray-900 dark:text-gray-100'}`}>
              {processingVIP
                ? 'Processing VIP Upload...'
                : isDragActive
                ? isDragReject
                  ? 'Invalid file type'
                  : isVIPMode 
                  ? 'Drop for VIP Analysis'
                  : 'Drop image here'
                : isVIPMode
                ? 'VIP Upload Ready'
                : 'Upload an image'
              }
            </p>
            
            {!processingVIP && (
              <>
                <p className={`text-sm mt-1 ${isVIPMode ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'}`}>
                  Drag and drop or click to browse
                </p>
                <p className={`text-xs mt-2 ${isVIPMode ? 'text-purple-500 dark:text-purple-500' : 'text-gray-400 dark:text-gray-500'}`}>
                  Supports: JPEG, PNG, GIF, WebP (max {isVIPMode ? '50MB' : '10MB'})
                </p>
              </>
            )}
          </div>

          {/* VIP Features */}
          {isVIPMode && !processingVIP && (
            <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
              <div className="flex flex-col items-center p-2 bg-purple-100/50 dark:bg-purple-800/20 rounded">
                <Shield className="h-4 w-4 text-purple-600 mb-1" />
                <span className="text-purple-700 dark:text-purple-300">Encrypted</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-indigo-100/50 dark:bg-indigo-800/20 rounded">
                <Zap className="h-4 w-4 text-indigo-600 mb-1" />
                <span className="text-indigo-700 dark:text-indigo-300">Auto pAIt</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-amber-100/50 dark:bg-amber-800/20 rounded">
                <TrendingUp className="h-4 w-4 text-amber-600 mb-1" />
                <span className="text-amber-700 dark:text-amber-300">Components</span>
              </div>
            </div>
          )}
        </div>

        {/* Processing Overlay */}
        {processingVIP && (
          <div className="absolute inset-0 bg-purple-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <div className="text-center">
              <div className="animate-pulse text-purple-600 font-semibold">
                🔐 Encrypting & Analyzing...
              </div>
              <div className="text-sm text-purple-500 mt-2">
                Component-level pAIt scoring in progress
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Generate YouTube trader analysis mock data
export const generateTraderAnalysis = (imageContent: string) => {
  const components: ComponentScore[] = [
    {
      component: "Profit Claims",
      score: 2.1,
      confidence: 0.34,
      reasoning: "Claims 10x returns without showing verified trading statements",
      category: 'claims'
    },
    {
      component: "Risk Disclosure",
      score: 1.2,
      confidence: 0.89,
      reasoning: "Minimal risk warning, focuses only on potential gains",
      category: 'risk'
    },
    {
      component: "Strategy Methodology", 
      score: 3.4,
      confidence: 0.67,
      reasoning: "Shows some technical analysis but lacks detailed explanations",
      category: 'methodology'
    },
    {
      component: "Evidence & Proof",
      score: 1.8,
      confidence: 0.71,
      reasoning: "Screenshots appear edited, no verified account statements",
      category: 'evidence'
    },
    {
      component: "Credibility Markers",
      score: 2.9,
      confidence: 0.56,
      reasoning: "Some trading knowledge evident but overly promotional tone",
      category: 'credibility'
    }
  ]

  const overallScore = components.reduce((sum, comp) => sum + comp.score, 0) / components.length
  const overallConfidence = components.reduce((sum, comp) => sum + comp.confidence, 0) / components.length

  return {
    overallScore: Number(overallScore.toFixed(1)),
    overallConfidence: Number(overallConfidence.toFixed(2)),
    components,
    recommendation: overallScore < 2.5 
      ? "⚠️ High Risk - Multiple red flags detected" 
      : overallScore < 3.5 
      ? "⚡ Moderate - Exercise caution, verify claims"
      : "✅ Acceptable - Reasonable credibility indicators",
    watchTime: overallScore < 2.0 
      ? "Not recommended" 
      : `Worth ${Math.round(overallScore * 3)} minutes of your time`
  }
}
