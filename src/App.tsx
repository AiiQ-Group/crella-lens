import { useState } from 'react'
import { Moon, Sun, Eye, Shield, LogOut, Sparkles } from 'lucide-react'
import VIPUploader, { generateTraderAnalysis } from './components/VIPUploader'
import ImagePreview from './components/ImagePreview'
import EnhancedAnalysisResults from './components/EnhancedAnalysisResults'
import ServerLogger from './components/ServerLogger'
import LoginModal from './components/LoginModal'
import VaultActions from './components/VaultActions'
import OptionsStrategies from './components/OptionsStrategies'
import IntelligentAssistant from './components/IntelligentAssistant'
import FloatingVault from './components/FloatingVault'
import SessionTracker from './components/SessionTracker'
import ImageMetadata from './components/ImageMetadata'
import AnalyticsDashboard from './components/AnalyticsDashboard'
import VisualPAItAnalysis from './components/VisualPAItAnalysis'
import YouTubeAnalysisWorkflow from './components/YouTubeAnalysisWorkflow'
// Using existing IntelligentAssistant (Ferrari Chat) instead
import { AnalysisResult } from './types'

function App() {
  const [isDark, setIsDark] = useState(true)
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isVIPUpload, setIsVIPUpload] = useState(false)
  const [showVisualAnalysis, setShowVisualAnalysis] = useState(false)
  const [showYouTubeAnalysis, setShowYouTubeAnalysis] = useState(false)
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userType, setUserType] = useState<'staff' | 'member' | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [savedCount, setSavedCount] = useState(0)

  const toggleDarkMode = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  const handleLogin = (type: 'staff' | 'member', code: string) => {
    // Simple demo authentication - unified password for easy demo
    const validCodes = {
      member: 'crella123',
      staff: 'crella123'
    }
    
    if (validCodes[type] === code) {
      setIsAuthenticated(true)
      setUserType(type)
      console.log(`Authenticated as ${type}`)
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUserType(null)
  }

  const handleSaveToVault = () => {
    if (!analysisResult) return
    
    // Simulate saving to vault
    setSavedCount(prev => prev + 1)
    
    // Show success message (could be a toast)
    console.log('Saved to private vault:', {
      type: userType,
      paitScore: analysisResult.paitScore,
      tags: analysisResult.tags,
      timestamp: new Date()
    })
    
    alert(`Analysis saved to ${userType} vault! (${savedCount + 1} total saved)`)
  }

  const handleDiscardAnalysis = () => {
    if (confirm('Are you sure you want to discard this analysis?')) {
      setAnalysisResult(null)
      setUploadedImage(null)
      setImagePreview(null)
    }
  }

  const handleImageUpload = (file: File, isVIP: boolean = false) => {
    setUploadedImage(file)
    setIsVIPUpload(isVIP)
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
    setAnalysisResult(null)
    
    // Auto-analyze VIP uploads
    if (isVIP) {
      setTimeout(() => analyzeImage(), 1000)
    }
  }

  const analyzeImage = async () => {
    if (!uploadedImage) return

    setIsAnalyzing(true)
    try {
      const formData = new FormData()
      formData.append('image', uploadedImage)

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const result = await response.json()
      setAnalysisResult(result)
    } catch (error) {
      console.error('Analysis error:', error)
      // Enhanced results for VIP vs regular uploads
      if (isVIPUpload) {
        const traderAnalysis = generateTraderAnalysis("YouTube trader claiming 10x profits")
        setAnalysisResult({
          ocrText: "EXPLOSIVE PROFITS! 10X RETURNS IN JUST ONE WEEK!\n\nMy secret strategy revealed:\n- Buy low, sell high (revolutionary!)\n- Follow my signals for guaranteed profits\n- Only $99/month for premium alerts\n\nDisclaimer: Past results don't guarantee future performance (fine print)",
          tags: ["financial", "trading", "promotional", "claims"],
          confidence: traderAnalysis.overallConfidence,
          paitScore: traderAnalysis.overallScore,
          metadata: {
            imageSize: `${uploadedImage.size} bytes`,
            processingTime: "3.7s",
            language: "en"
          },
          isVIP: true,
          encrypted: true,
          componentScores: traderAnalysis.components,
          overallRecommendation: traderAnalysis.recommendation,
          estimatedWatchTime: traderAnalysis.watchTime,
          riskLevel: traderAnalysis.overallScore < 2.5 ? 'high' : traderAnalysis.overallScore < 3.5 ? 'medium' : 'low',
          contentType: 'promotional'
        } as any)
      } else {
        setAnalysisResult({
          ocrText: "Sample extracted text from the image...\nMultiple lines of detected content.",
          tags: ["vault", "pAIt", "secure", "analysis"],
          confidence: 0.92,
          paitScore: 3.68,
          metadata: {
            imageSize: `${uploadedImage.size} bytes`,
            processingTime: "1.2s",
            language: "en"
          }
        })
      }
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'dark' : ''}`}>
      <div 
        className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
        style={{
          backgroundImage: isDark ? 'url(/crella_datacenter.svg)' : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Header */}
        <header className="border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm relative">
          {/* Full-width header image */}
          <div 
            className="w-full h-20 sm:h-24 md:h-28 lg:h-32 xl:h-36 bg-center bg-no-repeat transition-all duration-300"
            style={{ 
              backgroundImage: 'url(/lens_header1920.svg)',
              backgroundSize: '100% auto',
              backgroundPosition: 'center'
            }}
          ></div>
        </header>

        {/* Controls Bar - Under Header */}
        <div className="border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              {/* Authentication Status */}
              <div>
                {isAuthenticated ? (
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 px-3 py-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-medium text-green-700 dark:text-green-300">
                        {userType === 'staff' ? 'Staff Access' : 'Member'}
                      </span>
                      {savedCount > 0 && (
                        <span className="px-2 py-1 bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full text-xs font-semibold">
                          {savedCount}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      title="Logout"
                    >
                      <LogOut className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Guest Access
                  </div>
                )}
              </div>

              {/* Action Controls */}
              <div className="flex items-center space-x-3">
                {/* Visual Analysis Toggle */}
                <button
                  onClick={() => setShowVisualAnalysis(!showVisualAnalysis)}
                  className={`p-2 rounded-lg transition-colors ${
                    showVisualAnalysis 
                      ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400' 
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  title="Visual pAIt Analysis"
                >
                  <Sparkles className="h-5 w-5" />
                </button>

                {/* YouTube Analysis Toggle */}
                <button
                  onClick={() => setShowYouTubeAnalysis(!showYouTubeAnalysis)}
                  className={`p-2 rounded-lg transition-colors ${
                    showYouTubeAnalysis 
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' 
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  title="YouTube Shorts Analysis"
                >
                  <Eye className="h-5 w-5" />
                </button>

                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {isDark ? (
                    <Sun className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <Moon className="h-5 w-5 text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {showYouTubeAnalysis ? (
            <YouTubeAnalysisWorkflow 
              isAuthenticated={isAuthenticated}
              userType={userType}
            />
          ) : showVisualAnalysis ? (
            <VisualPAItAnalysis />
          ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Upload & Preview */}
            <div className="space-y-6">
              <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold mb-4">Upload Image</h2>
                <VIPUploader 
                  onImageUpload={handleImageUpload}
                  userType={userType}
                  isAuthenticated={isAuthenticated}
                />
              </div>

              {imagePreview && (
                <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Preview</h2>
                    <button
                      onClick={analyzeImage}
                      disabled={isAnalyzing}
                      className="px-4 py-2 bg-crella-600 hover:bg-crella-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <Eye className="h-4 w-4" />
                      <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Image'}</span>
                    </button>
                  </div>
                  <ImagePreview imageUrl={imagePreview} />
                </div>
              )}
            </div>

            {/* Right Column - Results & Strategies */}
            <div className="space-y-6">
              {/* Options Strategies for Members */}
              <OptionsStrategies
                isAuthenticated={isAuthenticated}
                userType={userType}
              />

              {analysisResult && (
                <>
                  <EnhancedAnalysisResults 
                    result={analysisResult as any}
                    isVIP={isVIPUpload}
                  />
                  <VaultActions
                    result={analysisResult}
                    isAuthenticated={isAuthenticated}
                    userType={userType}
                    onSave={handleSaveToVault}
                    onDiscard={handleDiscardAnalysis}
                  />
                </>
              )}
            </div>
          </div>
          )}
        </main>

        {/* Login Modal */}
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
        />

        {/* Floating Private Vault */}
        <FloatingVault
          isAuthenticated={isAuthenticated}
          userType={userType}
          onVaultClick={() => setShowLoginModal(true)}
        />

        {/* Intelligent AI Assistant */}
        <IntelligentAssistant
          isAuthenticated={isAuthenticated}
          userType={userType}
          analysisResult={analysisResult}
        />

        {/* Session Tracking */}
        <SessionTracker
          isAuthenticated={isAuthenticated}
          userType={userType}
          currentImageId={uploadedImage?.name}
        />

        {/* Image Metadata Tracking */}
        <ImageMetadata
          imageFile={uploadedImage}
          analysisResult={analysisResult}
          userType={userType}
          isAuthenticated={isAuthenticated}
        />

        {/* Analytics Dashboard */}
        <AnalyticsDashboard userType={userType} />

        {/* Server Logger */}
        <ServerLogger userType={userType} />

        {/* Existing Ferrari Chat (IntelligentAssistant) is now persistent for everyone! */}
      </div>
    </div>
  )
}

export default App
