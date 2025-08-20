import { useState } from 'react'
import { Moon, Sun, Eye, Shield, LogOut, Sparkles, Crown, TrendingUp, Home, X, Menu } from 'lucide-react'
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
import VisualIntelligenceWorkflow from './components/VisualIntelligenceWorkflow'
import { SmartOnboardingModal, useOnboarding } from './components/SmartOnboardingModal'
import { ClaireGuidanceSystem, useClaireGuidance } from './components/ClaireGuidanceSystem'
import { VIPWalkthroughSystem, useVIPWalkthrough } from './components/VIPWalkthroughSystem'
import ClaireChat from './components/ClaireChat'
import { TokenMeter } from './components/TokenMeterSystem'
import VIPUpgradeModal from './components/VIPUpgradeModal'
import VisualAgentSelector from './components/VisualAgentSelector'
import RealEstateVertical from './components/RealEstateVertical'
import { IntentPromptModal } from './components/IntentPromptModal'
import { IntelligencePlaybook } from './components/IntelligencePlaybook'
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
  const [showVisualIntelligence, setShowVisualIntelligence] = useState(false)
  
  // Intent-based workflow state
  const [showIntentModal, setShowIntentModal] = useState(false)
  const [selectedIntent, setSelectedIntent] = useState<any>(null)
  const [waitingForIntent, setWaitingForIntent] = useState(false)
  
  // Mobile menu state
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userType, setUserType] = useState<'staff' | 'member' | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [savedCount, setSavedCount] = useState(0)
  
  // Onboarding system
  const { showOnboarding, closeOnboarding } = useOnboarding()
  
  // Claire's guidance system
  const { showGuidance, dismissGuidance } = useClaireGuidance()
  
  // VIP walkthrough system
  const { showWalkthrough, startWalkthrough, closeWalkthrough } = useVIPWalkthrough()
  
  // Claire Chat system
  const [showClaireChat, setShowClaireChat] = useState(false)
  
  // VIP upgrade system
  const [showVIPUpgrade, setShowVIPUpgrade] = useState(false)
  const [showTokenMeter, setShowTokenMeter] = useState(false)
  
  // Agent orchestration system
  const [activeAgents, setActiveAgents] = useState<string[]>([])
  const [showRealEstate, setShowRealEstate] = useState(false)

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
      // Show intent modal after image loads
      setShowIntentModal(true)
      setWaitingForIntent(true)
    }
    reader.readAsDataURL(file)
    setAnalysisResult(null)
    setSelectedIntent(null)
  }

  // Handle intent selection
  const handleIntentSelected = (intent: any) => {
    setSelectedIntent(intent)
    setWaitingForIntent(false)
    setShowIntentModal(false)
    
    // Auto-analyze after intent is selected
    setTimeout(() => analyzeImage(), 1000)
  }

  // Handle intent modal close
  const handleIntentModalClose = () => {
    setShowIntentModal(false)
    setWaitingForIntent(false)
    // Reset if user cancels
    if (!selectedIntent) {
      setUploadedImage(null)
      setImagePreview(null)
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
            processingTime: 1.2,
            language: "en"
          }
        })
      }
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className={`min-h-screen bg-transparent transition-colors ${isDark ? 'dark' : ''}`}>
      <div 
        className="min-h-screen bg-transparent text-gray-900 dark:text-gray-100 flex flex-col"
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

              {/* Thinking Orb - Center Position */}
              <div className="flex items-center">
                <div className="relative">
                  <img 
                    src="/thinking_orb.gif" 
                    alt="Thinking Orb"
                    className="w-8 h-8 transition-all duration-500 hover:scale-110"
                    style={{
                      filter: 'drop-shadow(0 0 15px rgba(147, 51, 234, 0.6))',
                      animation: 'float 6s ease-in-out infinite'
                    }}
                  />
                  <div className="absolute inset-0 rounded-full border border-purple-400/30 animate-ping"></div>
                  <div className="absolute -inset-1 rounded-full border border-blue-400/20 animate-pulse"></div>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center space-x-3">
                {/* Desktop: Show all icons */}
                <div className="hidden md:flex items-center space-x-3">
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

                  {/* Visual Intelligence Toggle */}
                  <button
                    onClick={() => setShowVisualIntelligence(!showVisualIntelligence)}
                    className={`p-2 rounded-lg transition-colors ${
                      showVisualIntelligence 
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' 
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    title="Visual Intelligence Analysis"
                >
                  <Eye className="h-5 w-5" />
                </button>

                {/* Real Estate Beta Toggle */}
                <button
                  onClick={() => setShowRealEstate(!showRealEstate)}
                  className={`p-2 rounded-lg transition-colors group relative ${
                    showRealEstate 
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-500/30' 
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  title="Austin Real Estate Beta"
                >
                  <Home className="h-5 w-5" />
                  {/* Beta Badge */}
                  <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs px-1 rounded-full" style={{ fontSize: '8px' }}>
                    β
                  </div>
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

                {/* Claire Chat Button */}
                <button
                  onClick={() => setShowClaireChat(!showClaireChat)}
                  className={`p-2 rounded-lg transition-colors group relative ${
                    showClaireChat 
                      ? 'bg-purple-500/20 border border-purple-500/30' 
                      : 'bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50'
                  }`}
                  title="Claire AI Concierge"
                >
                  <Sparkles className={`h-5 w-5 ${showClaireChat ? 'text-purple-400' : 'text-purple-600 dark:text-purple-400'} group-hover:animate-pulse`} />
                  {/* Active indicator */}
                  {showClaireChat && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  )}
                </button>

                {/* Token Meter Button */}
                <button
                  onClick={() => setShowTokenMeter(!showTokenMeter)}
                  className={`p-2 rounded-lg transition-colors group relative ${
                    showTokenMeter 
                      ? 'bg-green-500/20 border border-green-500/30' 
                      : 'bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50'
                  }`}
                  title="Usage Meter"
                >
                  <TrendingUp className={`h-5 w-5 ${showTokenMeter ? 'text-green-400' : 'text-green-600 dark:text-green-400'} group-hover:animate-pulse`} />
                </button>

                {/* VIP Upgrade Button - Show for guests */}
                {userType === null && (
                  <button
                    onClick={() => setShowVIPUpgrade(true)}
                    className="p-2 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-600/20 border border-yellow-500/30 hover:from-yellow-500/30 hover:to-orange-600/30 transition-all group"
                    title="Upgrade to VIP"
                  >
                    <Crown className="h-5 w-5 text-yellow-400 group-hover:animate-pulse" />
                  </button>
                )}

                {/* Help & Guide Button */}
                <button
                  onClick={startWalkthrough}
                  className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors group"
                  title="Help & Walkthrough"
                >
                  <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400 group-hover:animate-pulse" />
                </button>
                </div>

                {/* Mobile: Hamburger Menu */}
                <div className="md:hidden relative">
                  <button
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    title="Menu"
                  >
                    <Menu className="h-5 w-5" />
                  </button>

                  {/* Mobile Dropdown */}
                  {showMobileMenu && (
                    <div className="absolute right-0 top-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 min-w-[200px] z-50">
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <button
                          onClick={() => {
                            setShowVisualAnalysis(!showVisualAnalysis)
                            setShowMobileMenu(false)
                          }}
                          className={`p-3 rounded-lg transition-colors text-center ${
                            showVisualAnalysis 
                              ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400' 
                              : 'bg-gray-100 dark:bg-gray-700'
                          }`}
                        >
                          <Sparkles className="h-5 w-5 mx-auto mb-1" />
                          <div className="text-xs">Analysis</div>
                        </button>

                        <button
                          onClick={() => {
                            setShowVisualIntelligence(!showVisualIntelligence)
                            setShowMobileMenu(false)
                          }}
                          className={`p-3 rounded-lg transition-colors text-center ${
                            showVisualIntelligence 
                              ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' 
                              : 'bg-gray-100 dark:bg-gray-700'
                          }`}
                        >
                          <Eye className="h-5 w-5 mx-auto mb-1" />
                          <div className="text-xs">Intelligence</div>
                        </button>

                        <button
                          onClick={() => {
                            setShowClaireChat(!showClaireChat)
                            setShowMobileMenu(false)
                          }}
                          className={`p-3 rounded-lg transition-colors text-center relative ${
                            showClaireChat 
                              ? 'bg-purple-500/20 border border-purple-500/30' 
                              : 'bg-gray-100 dark:bg-gray-700'
                          }`}
                        >
                          <Sparkles className="h-5 w-5 mx-auto mb-1 text-purple-600 dark:text-purple-400" />
                          <div className="text-xs">Claire</div>
                          {showClaireChat && (
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full"></div>
                          )}
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            toggleDarkMode()
                            setShowMobileMenu(false)
                          }}
                          className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-center"
                        >
                          {isDark ? (
                            <Sun className="h-5 w-5 mx-auto mb-1 text-yellow-500" />
                          ) : (
                            <Moon className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                          )}
                          <div className="text-xs">{isDark ? 'Light' : 'Dark'}</div>
                        </button>

                        {userType === null && (
                          <button
                            onClick={() => {
                              setShowVIPUpgrade(true)
                              setShowMobileMenu(false)
                            }}
                            className="p-3 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-600/20 border border-yellow-500/30 text-center"
                          >
                            <Crown className="h-5 w-5 mx-auto mb-1 text-yellow-400" />
                            <div className="text-xs">VIP</div>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16 w-full">
          {showVisualAnalysis ? (
            <VisualPAItAnalysis />
          ) : showVisualIntelligence ? (
            <VisualIntelligenceWorkflow 
              isAuthenticated={isAuthenticated}
              userType={userType}
            />
          ) : (
            /* Default Upload/Compare Layout */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Upload Image Section - Always visible */}
              <div className="space-y-6">
                <VIPUploader
                  isAuthenticated={isAuthenticated}
                  userType={userType}
                  onImageUpload={handleImageUpload}
                  onAnalysisComplete={setAnalysisResult}
                />
                
                {/* Show results below upload on mobile */}
                {analysisResult && (
                  <div className="lg:hidden">
                    <EnhancedAnalysisResults
                      result={analysisResult}
                      userType={userType}
                      onSaveToVault={handleSaveToVault}
                      onDiscardAnalysis={handleDiscardAnalysis}
                    />
                  </div>
                )}
              </div>

              {/* Compare Image Section - Desktop only */}
              <div className="hidden lg:block space-y-6">
                {!analysisResult ? (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 p-8 text-center">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300 flex items-center justify-center">
                      📊 Compare Image
                    </h2>
                    <div className="space-y-4">
                      <div className="w-16 h-16 mx-auto bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">
                        Drop second image for comparison
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        Compare against your first image analysis
                      </p>
                      <div className="flex items-center justify-center space-x-4 text-sm">
                        <span className="flex items-center text-orange-600 dark:text-orange-400">
                          🔒 Encrypted Compare
                        </span>
                        <span className="flex items-center text-green-600 dark:text-green-400">
                          📊 Side-by-Side
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Show results on desktop */
                  <EnhancedAnalysisResults
                    result={analysisResult}
                    userType={userType}
                    onSaveToVault={handleSaveToVault}
                    onDiscardAnalysis={handleDiscardAnalysis}
                  />
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

        {/* Smart Onboarding Modal */}
        <SmartOnboardingModal
          isOpen={showOnboarding}
          onClose={closeOnboarding}
          userType={userType || 'guest'}
        />

        {/* VIP Walkthrough System */}
        <VIPWalkthroughSystem
          isOpen={showWalkthrough}
          onClose={closeWalkthrough}
          userType={userType || 'guest'}
          onUpgrade={() => {
            // Handle VIP upgrade
            console.log('VIP upgrade clicked')
            setShowLoginModal(true)
          }}
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

        {/* Claire's Contextual Guidance System */}
        <ClaireGuidanceSystem
          userType={userType || 'guest'}
          hasUploadedImage={uploadedImage !== null}
          hasAnalysis={analysisResult !== null}
          isVisible={showGuidance && !showOnboarding}
          onClose={dismissGuidance}
        />

        {/* Claire AI Concierge Chat - Mobile-First */}
        <ClaireChat
          userType={userType || 'guest'}
          isVisible={showClaireChat}
          onToggle={() => setShowClaireChat(!showClaireChat)}
          className={`${showClaireChat ? 'block' : 'hidden'} md:right-4 md:bottom-4 md:max-w-md`}
        />

        {/* Token Meter Panel */}
        {showTokenMeter && (
          <div className="fixed top-20 right-4 z-40 w-80">
            <TokenMeter
              usage={{
                totalTokens: userType === 'staff' ? 999999 : userType === 'member' ? 10000 : 1000,
                tokensUsed: 150,
                tokensRemaining: userType === 'staff' ? 999849 : userType === 'member' ? 9850 : 850,
                dailyLimit: userType === 'staff' ? 999999 : userType === 'member' ? 500 : 50,
                dailyUsed: 25,
                agentCallsToday: 3,
                lastReset: new Date(),
                tier: userType === 'staff' ? 'staff' : userType === 'member' ? 'vip' : 'free'
              }}
              onUpgrade={() => setShowVIPUpgrade(true)}
              showUpgrade={userType !== 'staff' && userType !== 'member'}
            />
          </div>
        )}

        {/* Visual Agent Selector - Floating Orbs */}
        <VisualAgentSelector
          userType={userType || 'guest'}
          activeAgents={activeAgents}
          onAgentClick={(agentId) => {
            console.log('Agent clicked:', agentId)
            // Add agent to active list
            if (!activeAgents.includes(agentId)) {
              setActiveAgents(prev => [...prev, agentId])
            }
          }}
          onAgentRate={(agentId, rating) => {
            console.log('Agent rated:', agentId, rating)
          }}
          isVisible={showVisualIntelligence || showRealEstate}
        />

        {/* Real Estate Beta Panel */}
        {showRealEstate && (
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              {/* Close Button */}
              <button
                onClick={() => setShowRealEstate(false)}
                className="absolute top-4 right-4 z-10 text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="p-6">
                <RealEstateVertical
                  uploadedImage={uploadedImage}
                  userType={userType || 'guest'}
                  onAnalysisComplete={(analysis) => {
                    console.log('Real estate analysis complete:', analysis)
                    // Could integrate with vault or other systems
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Intent Prompt Modal */}
        <IntentPromptModal
          isOpen={showIntentModal}
          onClose={handleIntentModalClose}
          uploadedImage={imagePreview ? {
            url: imagePreview,
            name: uploadedImage?.name || 'uploaded-image'
          } : undefined}
          onIntentSelected={handleIntentSelected}
        />

        {/* Intelligence Playbook - Show after analysis */}
        {analysisResult && selectedIntent && (
          <div className="mt-8">
            <IntelligencePlaybook 
              result={{
                id: Date.now().toString(),
                timestamp: new Date(),
                images: uploadedImage ? [uploadedImage] : [],
                agents: [
                  {
                    id: 'claire',
                    name: 'Claire',
                    type: 'claire' as const,
                    status: 'complete' as const,
                    results: { summary: 'AI Concierge coordination complete' }
                  }
                ],
                paitScore: analysisResult.paitScore,
                confidence: analysisResult.confidence,
                ocrText: analysisResult.ocrText,
                tags: analysisResult.tags,
                metadata: {
                  processingTime: analysisResult.metadata.processingTime,
                  agentsUsed: 1,
                  model: 'crella-cathedral-v1'
                }
              }}
            />
          </div>
        )}

        {/* VIP Upgrade Modal */}
        <VIPUpgradeModal
          isOpen={showVIPUpgrade}
          onClose={() => setShowVIPUpgrade(false)}
          currentTier={userType === 'staff' ? 'staff' : userType === 'member' ? 'vip' : 'free'}
          onUpgradeSuccess={() => {
            // Handle VIP upgrade success
            console.log('🎉 VIP upgrade successful!')
            // In a real app, you would update user state here
            // setUserType('member')
            alert('Welcome to VIP! Please refresh the page to see your new features.')
          }}
        />

        {/* Corporate Footer */}
        <footer className="bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 mt-auto">
          <div className="max-w-7xl mx-auto px-4 py-6">
            {/* AiiQ Logo and Brand Header */}
            <div className="text-center mb-6">
              <div className="flex justify-center items-center mb-3">
                <img 
                  src="/logo-icon-main.png" 
                  alt="AiiQ Group" 
                  className="w-8 h-8 mr-3 opacity-80"
                />
                <h3 className="text-lg font-semibold text-gray-300">AiiQ Group</h3>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                <span className="font-medium text-gray-300">pAIt™ is founded and created by AiiQ Group and its core LLM model partners</span>
              </p>
              <div className="mt-2 flex flex-wrap justify-center items-center gap-4 text-xs text-gray-500">
                <span>Crella Lens</span>
                <span>•</span>
                <span>Crella Video</span>
                <span>•</span>
                <span>Crella Vault</span>
                <span>•</span>
                <span>Crella Trading</span>
                <span>•</span>
                <span>AiiQ.cloud</span>
                <span>•</span>
                <span>AiiQ.dev</span>
              </div>
            </div>

            {/* Bottom Row - Locations and Contact */}
            <div className="text-center border-t border-gray-800 pt-4">
              <div className="flex flex-wrap justify-center items-center gap-3 text-xs text-gray-500">
                <span><strong className="text-gray-400">Global Headquarters:</strong> San Antonio, TX</span>
                <span>•</span>
                <span><strong className="text-gray-400">Development:</strong> Cebu, Philippines</span>
                <span>•</span>
                <span><strong className="text-gray-400">Marketing:</strong> Las Vegas, NV</span>
                <span>•</span>
                <span><strong className="text-gray-400">Technology:</strong> Toronto, Canada</span>
                <span>•</span>
                <span><strong className="text-gray-400">Data Control:</strong> New York, NY</span>
              </div>
              <div className="mt-2">
                <a href="mailto:hq@aiiq.group" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                  hq@aiiq.group
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App

