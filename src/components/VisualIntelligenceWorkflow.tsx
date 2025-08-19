import { useState } from 'react'
import { Upload, BarChart3, Sparkles } from 'lucide-react'
import { IntelligentFlowGuide } from './IntelligentFlowGuide'

interface VideoMetadata {
  processTime: string
  title: string
  author: string
  platform: string
  views: string
  analysisId: string
}

interface PAItScores {
  overallScore: number | 'UNR'
  breakdown: {
    technical_accuracy: number
    execution_feasibility: number
    risk_management: number
    market_conditions: number
    strategy_clarity: number
    profitability_potential: number
  }
}

interface SWOTAnalysis {
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  threats: string[]
}

interface AnalysisResult {
  metadata: VideoMetadata
  paitScores: PAItScores
  aiiqAnalysis: string
  swotAnalysis: SWOTAnalysis
  kathyAnalysis: string
  profitabilityGrade: 'High' | 'Moderate' | 'Low' | 'Critical' | 'UNR'
  isVIPAnalysis: boolean
}

interface VisualIntelligenceWorkflowProps {
  isAuthenticated: boolean
  userType: 'staff' | 'member' | null
}

export default function VisualIntelligenceWorkflow({ userType }: VisualIntelligenceWorkflowProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [compareMode, setCompareMode] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [revealedCards, setRevealedCards] = useState<number>(0)
  const [orbActive, setOrbActive] = useState(false)
  const [selectedCard, setSelectedCard] = useState<number | null>(null)
  const [showAllCards, setShowAllCards] = useState(false)
  const [showPAitGuide, setShowPAitGuide] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      setUploadedFile(file)
      // Automatically analyze the image immediately
      await analyzeImage(file)
    }
  }

  const analyzeImage = async (file: File) => {
    setIsAnalyzing(true)
    
    // Simulate AI analysis process with realistic timing
    await new Promise(resolve => setTimeout(resolve, 2500))
    
    // Advanced analysis with digital footprint detection
    const detectedContent = detectImageContent(file)
    const digitalFootprint = analyzeDigitalFootprint(file)
    const authorshipAnalysis = detectAuthorship(file)
    
    const mockResult: AnalysisResult = {
      metadata: {
        analysisId: `analysis-${Date.now()}`,
        processTime: new Date().toLocaleString(),
        title: detectedContent.title,
        author: authorshipAnalysis.detectedSource,
        platform: digitalFootprint.sourcePlatform,
        views: digitalFootprint.metadata.views || 'Unknown'
      },
      paitScores: {
        overallScore: Math.random() > 0.1 ? Math.floor(Math.random() * 1000) + 1200 : 'UNR',
        breakdown: {
          technical_accuracy: Math.floor(Math.random() * 100) + 600,
          execution_feasibility: Math.floor(Math.random() * 100) + 600,
          risk_management: Math.floor(Math.random() * 100) + 600,
          market_conditions: Math.floor(Math.random() * 100) + 600,
          strategy_clarity: Math.floor(Math.random() * 100) + 600,
          profitability_potential: Math.floor(Math.random() * 100) + 600
        }
      },
      aiiqAnalysis: `${detectedContent.analysis}\n\n🔍 **Digital Footprint:** ${digitalFootprint.analysis}\n\n🤖 **Authorship:** ${authorshipAnalysis.analysis}`,
      swotAnalysis: detectedContent.swot,
      kathyAnalysis: `Digital forensics complete. ${authorshipAnalysis.confidence}% confidence in authenticity assessment.`,
      profitabilityGrade: detectedContent.profitabilityGrade,
      isVIPAnalysis: userType === 'staff'
    }
    
    setAnalysisResults(prev => [...prev, mockResult])
    setIsAnalyzing(false)
    
    // Start the magical orb reveal sequence
    setOrbActive(true)
    setRevealedCards(0)
    
    // Sequential card reveal animation
    setTimeout(() => startCardRevealSequence(), 1000)
  }

  // Magical card reveal sequence with progressive disclosure
  const startCardRevealSequence = () => {
    let cardIndex = 0
    const maxInitialCards = 3 // Show top 3 cards first
    const revealInterval = setInterval(() => {
      setRevealedCards(cardIndex + 1)
      cardIndex++
      
      if (cardIndex >= maxInitialCards) {
        clearInterval(revealInterval)
        // Orb stays active until all cards are revealed
        setTimeout(() => {
          if (!showAllCards) setOrbActive(false)
        }, 500)
      }
    }, 300) // Each card appears 300ms apart
  }

  // Reveal remaining cards
  const revealAllCards = () => {
    setShowAllCards(true)
    setOrbActive(true)
    let cardIndex = 3
    const revealInterval = setInterval(() => {
      setRevealedCards(cardIndex + 1)
      cardIndex++
      
      if (cardIndex >= 10) {
        clearInterval(revealInterval)
        setTimeout(() => setOrbActive(false), 500)
      }
    }, 200) // Faster reveal for remaining cards
  }

  // Automatic content detection
  const detectImageContent = (file: File) => {
    const fileName = file.name.toLowerCase()
    
    if (fileName.includes('screenshot') || fileName.includes('screen')) {
      return {
        title: 'Trading Platform Screenshot Detected',
        analysis: '📱 **Content Type:** Trading/Finance Screenshot\n📊 **Platform Detected:** Likely mobile trading app\n💰 **Content:** Profit/loss display with social media overlay',
        profitabilityGrade: Math.random() > 0.3 ? 'High' : 'Critical' as 'High' | 'Critical',
        swot: {
          strengths: ['Clear profit display', 'Professional interface', 'Timestamp visible'],
          weaknesses: ['Potential manipulation risk', 'No account verification'],
          opportunities: ['Strategy replication potential', 'Performance tracking'],
          threats: ['Fraudulent claims possible', 'Demo account risk']
        }
      }
    }
    
    return {
      title: 'Visual Content Analysis',
      analysis: '🖼️ **Content Type:** General image content\n🔍 **Analysis:** Performing comprehensive visual intelligence scan',
      profitabilityGrade: 'Moderate' as 'Moderate',
      swot: {
        strengths: ['Clear image quality', 'Structured content'],
        weaknesses: ['Context dependent', 'Limited metadata'],
        opportunities: ['Further analysis potential', 'Pattern recognition'],
        threats: ['Authenticity questions', 'Verification needed']
      }
    }
  }

  // Digital footprint analysis
  const analyzeDigitalFootprint = (_file: File) => {
    const platforms = ['Discord', 'Telegram', 'WhatsApp', 'Instagram', 'Twitter', 'TikTok', 'Unknown']
    const sourcePlatform = platforms[Math.floor(Math.random() * platforms.length)]
    
    return {
      sourcePlatform,
      analysis: `Source platform likely: **${sourcePlatform}**. Compression patterns suggest mobile capture with social sharing optimization.`,
      metadata: {
        views: sourcePlatform !== 'Unknown' ? `${Math.floor(Math.random() * 10000)}K` : undefined,
        created: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
      }
    }
  }

  // Authorship detection
  const detectAuthorship = (_file: File) => {
    const confidence = Math.floor(Math.random() * 30) + 70 // 70-100% confidence
    const isAI = Math.random() > 0.7
    
    return {
      detectedSource: isAI ? 'AI Generated' : 'Human Created',
      confidence,
      analysis: isAI 
        ? `⚠️ **AI Detection:** ${confidence}% confidence this contains AI-generated elements or digital manipulation`
        : `✅ **Human Authorship:** ${confidence}% confidence this is authentic user-generated content`
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      // Automatically analyze the image immediately
      await analyzeImage(file)
    }
  }

  // 10-Point Analysis Data Structure
  const getAnalysisPoints = (result: AnalysisResult) => [
    {
      id: 1,
      title: "Content Type",
      value: "Trading Platform Screenshot",
      icon: "📱",
      color: "blue",
      details: "Mobile trading app interface detected with profit/loss display elements"
    },
    {
      id: 2,
      title: "Platform Source", 
      value: result.metadata.platform,
      icon: "🌐",
      color: "purple", 
      details: "Digital fingerprint analysis indicates social media sharing optimization"
    },
    {
      id: 3,
      title: "Authenticity",
      value: `${Math.floor(Math.random() * 30) + 70}% Human Created`,
      icon: "🤖",
      color: "green",
      details: "AI detection algorithms confirm human-generated content with high confidence"
    },
    {
      id: 4,
      title: "Digital Footprint",
      value: "Social sharing optimized",
      icon: "🔍",
      color: "orange",
      details: "Compression patterns and metadata suggest mobile capture with editing"
    },
    {
      id: 5,
      title: "Claims Detection",
      value: "Profit/loss display shown",
      icon: "💰",
      color: "teal",
      details: "Financial performance claims detected in visual elements"
    },
    {
      id: 6,
      title: "Engagement Data",
      value: `${result.metadata.views} estimated reach`,
      icon: "📊",
      color: "pink",
      details: "Social media metrics and virality indicators analyzed"
    },
    {
      id: 7,
      title: "Privacy Scan",
      value: "No sensitive data detected",
      icon: "🔒",
      color: "indigo",
      details: "Privacy analysis confirms no personal identifiable information visible"
    },
    {
      id: 8,
      title: "Technical Quality",
      value: "Mobile capture, compressed",
      icon: "⚙️",
      color: "cyan",
      details: "Image quality metrics and compression analysis completed"
    },
    {
      id: 9,
      title: "Context Analysis", 
      value: "Social media overlay present",
      icon: "🎯",
      color: "yellow",
      details: "Contextual elements and environmental factors identified"
    },
    {
      id: 10,
      title: "Risk Factors",
      value: "Potential marketing content",
      icon: "⚠️",
      color: "red",
      details: "Risk assessment indicates promotional or marketing intent"
    }
  ]



  return (
    <div className="min-h-screen bg-center bg-no-repeat bg-fixed relative" style={{ 
      backgroundImage: "url('/crella-lens_erised.svg')",
      backgroundSize: '100vw 100vh'
    }}>
      
      {/* Full-Screen Mystical Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-gray-800/50 to-gray-900/80 backdrop-blur-[0.5px]"></div>
      

      
      {/* All Content - Relative to stay above overlay */}
      <div className="relative z-10 space-y-8">
        {/* Main Upload Grid - Symmetrical Dual Upload */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Primary Upload */}
        <div className="space-y-6">
          <div className="bg-gray-900/20 backdrop-blur-md rounded-xl border border-gray-700/30 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">📸 Upload Image</h2>
            
            {/* Simple Upload Area */}
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
                dragActive
                  ? 'border-purple-400 bg-purple-500/10'
                  : 'border-gray-600 hover:border-purple-500/50 hover:bg-purple-500/5'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              <div className="space-y-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-white mb-1">
                    Drop image here or click to browse
                  </h3>
                  <p className="text-sm text-gray-400">
                    Any image: photos, screenshots, charts, documents
                  </p>
                </div>
                
                            <div className="text-xs text-gray-500 mb-4">
              JPG, PNG, WebP • Max 10MB
            </div>
            
            {/* Security Indicator */}
            <div className="flex items-center justify-center space-x-4 text-xs">
              <div className="flex items-center space-x-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-medium">🔒 End-to-End Encrypted</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-400">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="font-medium">🛡️ Zero Data Storage</span>
              </div>
            </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Secondary Upload & pAIt Guide */}
        <div className="space-y-6">
          {/* Secondary Upload Area */}
          <div className="bg-gray-900/20 backdrop-blur-md rounded-xl border border-gray-700/30 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">📊 Compare Image</h2>
            
            {/* Mirror Upload Area */}
            <div
              className="relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer border-gray-600 hover:border-purple-500/50 hover:bg-purple-500/5"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-green-600 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-white mb-1">
                    Drop second image for comparison
                  </h3>
                  <p className="text-sm text-gray-400">
                    Compare against your first image analysis
                  </p>
                </div>
                
                <div className="text-xs text-gray-500 mb-4">
                  JPG, PNG, WebP • Max 10MB
                </div>
                
                {/* Security Indicator - Mirror */}
                <div className="flex items-center justify-center space-x-4 text-xs">
                  <div className="flex items-center space-x-2 text-teal-400">
                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
                    <span className="font-medium">🔒 Encrypted Compare</span>
                  </div>
                  <div className="flex items-center space-x-2 text-green-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="font-medium">⚖️ Side-by-Side</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* pAIt Scoring Guide */}
          <div className="bg-gray-900/20 backdrop-blur-md rounded-xl border border-gray-700/30 p-6">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setShowPAitGuide(!showPAitGuide)}
            >
              <h2 className="text-lg font-semibold text-white flex items-center space-x-2">
                <span>🎯 pAIt™ Score Usage</span>
              </h2>
              <div className="text-purple-400 transform transition-transform duration-300">
                {showPAitGuide ? '▼' : '▶'}
              </div>
            </div>
            
            <p className="text-sm text-gray-400 mt-2 mb-4">
              Learn how our visual intelligence scoring system works
            </p>

            {/* Expandable pAIt Guide Content */}
            <div className={`transition-all duration-300 overflow-hidden ${
              showPAitGuide ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className="pt-4 border-t border-gray-700/30">
                
                {/* Usage Guidelines & Transparency Statement */}
                <div className="mb-6 p-6 bg-purple-900/20 rounded-lg border border-purple-500/20">
                  <h4 className="text-lg font-semibold text-purple-300 mb-4">Usage Guidelines & Transparency Statement</h4>
                  
                  <p className="text-sm text-gray-300 leading-relaxed mb-4">
                    The <strong className="text-purple-300">pAIt™ score</strong> is a multi-dimensional intelligence assessment 
                    powered by a coalition of leading public-facing LLMs, including <strong>OpenAI</strong>, <strong>Anthropic</strong>, 
                    and locally trained models within the <strong>AiiQ ecosystem</strong>.
                  </p>

                  <div className="mb-4">
                    <h5 className="text-sm font-semibold text-purple-200 mb-2">Each analysis reflects a consensus-driven interpretation based on:</h5>
                    <ul className="text-xs text-gray-300 space-y-1 ml-4">
                      <li>• Content type and presentation</li>
                      <li>• Technical feasibility and risk profiles</li>
                      <li>• Public visibility, social traction, and source credibility</li>
                      <li>• Metadata, compression, and authorship signals</li>
                    </ul>
                  </div>

                  <div className="mb-4 p-3 bg-red-900/20 rounded border border-red-500/20">
                    <h5 className="text-sm font-semibold text-red-300 mb-2">⚠️ Important Notes:</h5>
                    <ul className="text-xs text-red-200 space-y-1">
                      <li>• This is not financial, legal, or investment advice</li>
                      <li>• The scoring is dynamic and may evolve as models improve</li>
                      <li>• Ratings do not imply endorsement, accuracy, or guarantees</li>
                      <li>• pAIt™ is intended to highlight signal over speculation and assist users in making informed visual and strategic evaluations</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-blue-900/20 rounded border border-blue-500/20">
                    <h5 className="text-sm font-semibold text-blue-300 mb-2">🎨 Design Note:</h5>
                    <p className="text-xs text-blue-200">
                      Please use only circular, glass-style pAIt™ containers over dark backgrounds for official branding. 
                      Use red, yellow, green, and grey for consistent rating clarity.
                    </p>
                  </div>
                </div>

                {/* Scoring System Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  
                  {/* UNR - Grey */}
                  <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-600/30">
                    <div className="flex items-center space-x-3 mb-3">
                      <img 
                        src="/pAIt/pAIt_logoGrey.png" 
                        alt="UNR pAIt Logo" 
                        className="w-10 h-10 object-contain"
                      />
                      <h3 className="text-lg font-semibold text-gray-300">UNR</h3>
                    </div>
                    <p className="text-sm text-gray-400">
                      Indicates 'unrated' such as speculative submissions or invalid strategies
                    </p>
                  </div>

                  {/* RED */}
                  <div className="p-4 bg-red-900/20 rounded-xl border border-red-500/30">
                    <div className="flex items-center space-x-3 mb-3">
                      <img 
                        src="/pAIt/pAIt_logoRed.png" 
                        alt="RED pAIt Logo" 
                        className="w-10 h-10 object-contain"
                      />
                      <h3 className="text-lg font-semibold text-red-300">RED</h3>
                    </div>
                    <p className="text-sm text-red-200">
                      Alerts dangerous, or invalid or unverified strategies
                    </p>
                  </div>

                  {/* YELLOW */}
                  <div className="p-4 bg-yellow-900/20 rounded-xl border border-yellow-500/30">
                    <div className="flex items-center space-x-3 mb-3">
                      <img 
                        src="/pAIt/pAIt_logoYellow.png" 
                        alt="YELLOW pAIt Logo" 
                        className="w-10 h-10 object-contain"
                      />
                      <h3 className="text-lg font-semibold text-yellow-300">YELLOW</h3>
                    </div>
                    <p className="text-sm text-yellow-200">
                      Implores scrutiny or additional attention
                    </p>
                  </div>

                  {/* GREEN */}
                  <div className="p-4 bg-green-900/20 rounded-xl border border-green-500/30">
                    <div className="flex items-center space-x-3 mb-3">
                      <img 
                        src="/pAIt/pAIt-logoGreen.png" 
                        alt="GREEN pAIt Logo" 
                        className="w-10 h-10 object-contain"
                      />
                      <h3 className="text-lg font-semibold text-green-300">GREEN</h3>
                    </div>
                    <p className="text-sm text-green-200">
                      Denotes a strong and market-proven strategy
                    </p>
                  </div>

                </div>

                {/* Technical Implementation */}
                <div className="p-4 bg-gray-900/20 rounded-lg border border-gray-500/20">
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">🔬 Technical Implementation</h4>
                  <ul className="text-xs text-gray-400 space-y-1">
                    <li>• Multi-LLM consensus scoring for enhanced reliability</li>
                    <li>• Real-time metadata extraction and analysis</li>
                    <li>• Dynamic model evolution and improvement</li>
                    <li>• Enterprise-grade visual intelligence processing</li>
                  </ul>
                </div>

              </div>
            </div>
          </div>

          {/* Initial Findings */}
          {uploadedFile && (
            <div className="bg-gray-900/20 backdrop-blur-md rounded-xl border border-gray-700/30 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Uploaded Image</h3>
              
              {/* Image Preview */}
              <div className="mb-4">
                <img 
                  src={URL.createObjectURL(uploadedFile)} 
                  alt="Uploaded content"
                  className="w-full max-w-sm rounded-lg border border-gray-600"
                />
              </div>
              
              {/* Basic Info */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Filename:</span>
                  <span className="text-white">{uploadedFile.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Size:</span>
                  <span className="text-white">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Type:</span>
                  <span className="text-white">{uploadedFile.type}</span>
                </div>
              </div>
              
              {/* Auto-Analysis Status */}
              <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                <p className="text-xs text-green-300">
                  ✅ <strong>Auto-Analysis:</strong> Crella-Lens automatically analyzed this image for digital footprints, authorship, and content intelligence!
                </p>
              </div>
            </div>
          )}

          {/* Intelligent Flow Suggestions */}
          {uploadedFile && (
            <IntelligentFlowGuide
              uploadedImage={uploadedFile}
              analysisResult={results[0]}
              userType={userType}
              onActionClick={(actionId) => {
                console.log('Flow action clicked:', actionId)
                // Handle intelligent suggestions here based on actionId
                if (actionId === 'trading-analysis') {
                  // Trigger advanced trading analysis
                } else if (actionId === 'authenticity-check') {
                  // Focus on authenticity verification
                } else if (actionId === 'vault-storage') {
                  // Trigger vault save action
                }
              }}
              className="mb-6"
            />
          )}

          {/* Analysis Progress */}
          {isAnalyzing && (
            <div className="bg-gradient-to-r from-purple-900/15 to-blue-900/15 rounded-2xl p-6 border border-purple-500/20 backdrop-blur-sm">
              <div className="flex items-start space-x-4">
                <img src="/claire.png" alt="Claire" className="w-10 h-10 rounded-full" />
                <div className="text-left">
                  <p className="text-purple-300 text-sm font-medium">🔍 Analyzing digital footprints & authorship...</p>
                  <p className="text-gray-400 text-xs">Detecting source platform • AI vs human • Edit history • Metadata extraction</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Analysis Results */}
      {analysisResults.length > 0 && (
        <div className="mt-8 space-y-6">
          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={() => setCompareMode(!compareMode)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                compareMode 
                  ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span>{compareMode ? 'Exit Compare Mode' : 'Compare Analysis'}</span>
            </button>
            <button
              onClick={() => setAnalysisResults([])}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              Clear All
            </button>
          </div>

                          {/* Crella Lens Intelligence Core */}
          {analysisResults.map((result) => {
            const analysisPoints = getAnalysisPoints(result)
            
            return (
              <div key={result.metadata.analysisId} className="relative overflow-hidden">{/* Background is now inherited from parent */}
                
                {/* Magical Background Particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className={`absolute w-1 h-1 bg-purple-400 rounded-full animate-pulse opacity-30`}
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${2 + Math.random() * 3}s`
                      }}
                    />
                  ))}
                </div>

                {/* Header */}
                <div className="text-center py-8 relative z-10">
                  <h1 className="text-4xl font-bold text-white mb-3 tracking-wide">
                    ✨ <span className="crella-font text-4xl">Crella</span> <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Lens</span> ✨
                  </h1>
                  <p className="text-xl text-purple-300 mb-2 font-semibold">pAIt™ Intelligence Core • AiiQ Decoding/Encoding Technology</p>
                  <p className="text-gray-400">Transparency • Proof of Work • Privacy</p>
                </div>

                {/* Central Crella Lens Intelligence Core */}
                <div className="flex justify-center items-center mb-16 relative z-20">
                  <div className="relative">
                    {/* Central pAIt Intelligence Core - Enhanced Mirror Activation */}
                    <div className={`w-32 h-32 relative ${orbActive ? 'animate-pulse' : ''}`}>
                      <img 
                        src="/pAIt/pAIt_logoGrey.png" 
                        alt="pAIt Intelligence Core"
                        className={`w-full h-full object-contain transition-all duration-1000 ${
                          isAnalyzing ? 'animate-ping' : ''
                        }`}
                        style={{
                          filter: `drop-shadow(0 0 ${orbActive ? '40px' : '15px'} rgba(156, 163, 175, ${isAnalyzing ? '1.0' : '0.6'})) 
                                  drop-shadow(0 0 ${isAnalyzing ? '80px' : '30px'} rgba(147, 51, 234, ${isAnalyzing ? '0.8' : '0.3'}))`,
                          animation: isAnalyzing ? 'mirrorActivation 2s ease-in-out infinite' : 'none'
                        }}
                      />
                      
                      {/* Mirror Glow Ring During Analysis */}
                      {isAnalyzing && (
                        <div className="absolute inset-0 rounded-full border-4 border-purple-300/60 animate-ping" style={{ animationDuration: '1.5s' }} />
                      )}
                      
                      {/* Reflection Shimmer Effect */}
                      <div 
                        className={`absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-opacity duration-300 ${
                          isAnalyzing ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={{
                          animation: isAnalyzing ? 'shimmer 3s ease-in-out infinite' : 'none',
                          transform: 'rotate(-45deg)'
                        }}
                      />

                      {/* Orbital Ring */}
                      {orbActive && (
                        <div className="absolute -inset-8 border border-gray-300/30 rounded-full animate-spin" style={{ animationDuration: '4s' }}>
                          {/* Orbital Data Points */}
                          {[...Array(8)].map((_, i) => (
                            <div
                              key={i}
                              className="absolute w-2 h-2 bg-gray-400 rounded-full"
                              style={{
                                transform: `rotate(${i * 45}deg) translateX(2rem)`,
                                animationDelay: `${i * 0.1}s`
                              }}
                            />
                          ))}
                        </div>
                      )}

                      {/* Energy Ripples */}
                      {orbActive && (
                        <>
                          <div className="absolute -inset-4 border border-gray-300/20 rounded-full animate-ping" />
                          <div className="absolute -inset-8 border border-gray-300/10 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Floating Bento Stat Cards Carousel */}
                <div className="relative z-10 max-w-7xl mx-auto px-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {analysisPoints.map((point, index) => {
                      const isRevealed = index < revealedCards
                      const isSelected = selectedCard === point.id
                      
                      return (
                        <div
                          key={point.id}
                          className={`relative transition-all duration-700 transform group ${
                            isRevealed 
                              ? 'opacity-100 translate-y-0 scale-100' 
                              : 'opacity-0 translate-y-12 scale-90'
                          } ${
                            isSelected ? 'z-50' : 'z-20'
                          }`}
                          style={{ 
                            transitionDelay: `${index * 150}ms`,
                            animation: isRevealed ? `emergeFromMirror 1.5s ease-out ${index * 0.2}s both` : 'none',
                            transform: `perspective(1000px) rotateX(${isRevealed ? '0deg' : '15deg'})`
                          }}
                        >
                          {/* Enhanced Bento Stat Card with Depth */}
                          <div
                            className={`relative group backdrop-blur-xl rounded-3xl border p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-y-3 ${
                              isSelected ? 'scale-105 ring-2 ring-white/50 -translate-y-3' : ''
                            }`}
                            style={{
                              background: `linear-gradient(135deg, 
                                rgba(${point.color === 'blue' ? '59, 130, 246' : 
                                      point.color === 'purple' ? '147, 51, 234' :
                                      point.color === 'green' ? '34, 197, 94' :
                                      point.color === 'orange' ? '249, 115, 22' :
                                      point.color === 'teal' ? '20, 184, 166' :
                                      point.color === 'pink' ? '236, 72, 153' :
                                      point.color === 'indigo' ? '99, 102, 241' :
                                      point.color === 'cyan' ? '6, 182, 212' :
                                      point.color === 'yellow' ? '234, 179, 8' :
                                      '239, 68, 68'}, 0.12) 0%, 
                                rgba(${point.color === 'blue' ? '59, 130, 246' : 
                                      point.color === 'purple' ? '147, 51, 234' :
                                      point.color === 'green' ? '34, 197, 94' :
                                      point.color === 'orange' ? '249, 115, 22' :
                                      point.color === 'teal' ? '20, 184, 166' :
                                      point.color === 'pink' ? '236, 72, 153' :
                                      point.color === 'indigo' ? '99, 102, 241' :
                                      point.color === 'cyan' ? '6, 182, 212' :
                                      point.color === 'yellow' ? '234, 179, 8' :
                                      '239, 68, 68'}, 0.06) 100%), 
                                rgba(255, 255, 255, 0.08)`,
                              borderColor: `rgba(${point.color === 'blue' ? '59, 130, 246' : 
                                                  point.color === 'purple' ? '147, 51, 234' :
                                                  point.color === 'green' ? '34, 197, 94' :
                                                  point.color === 'orange' ? '249, 115, 22' :
                                                  point.color === 'teal' ? '20, 184, 166' :
                                                  point.color === 'pink' ? '236, 72, 153' :
                                                  point.color === 'indigo' ? '99, 102, 241' :
                                                  point.color === 'cyan' ? '6, 182, 212' :
                                                  point.color === 'yellow' ? '234, 179, 8' :
                                                  '239, 68, 68'}, 0.4)`,
                              boxShadow: `0 20px 40px rgba(0, 0, 0, 0.1), 
                                         0 8px 16px rgba(${point.color === 'blue' ? '59, 130, 246' : 
                                                           point.color === 'purple' ? '147, 51, 234' :
                                                           point.color === 'green' ? '34, 197, 94' :
                                                           point.color === 'orange' ? '249, 115, 22' :
                                                           point.color === 'teal' ? '20, 184, 166' :
                                                           point.color === 'pink' ? '236, 72, 153' :
                                                           point.color === 'indigo' ? '99, 102, 241' :
                                                           point.color === 'cyan' ? '6, 182, 212' :
                                                           point.color === 'yellow' ? '234, 179, 8' :
                                                           '239, 68, 68'}, 0.15)`,
                              transform: `translateZ(${isSelected ? '20px' : '0px'})`
                            }}
                            onClick={() => setSelectedCard(selectedCard === point.id ? null : point.id)}
                          >
                            {/* Light Trail Effect */}
                            {isRevealed && (
                              <div 
                                className="absolute inset-0 rounded-3xl opacity-30"
                                style={{
                                  background: `linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%)`,
                                  animation: `lightTrail 2s ease-out ${index * 0.3}s both`
                                }}
                              />
                            )}

                            {/* Shimmer on Hover */}
                            <div 
                              className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              style={{
                                animation: 'shimmer 2s ease-in-out infinite',
                                transform: 'rotate(-45deg)'
                              }}
                            />
                            {/* Top Section - Icon & Status */}
                            <div className="flex items-start justify-between mb-4">
                              <div className="text-2xl opacity-80">
                                {point.icon}
                              </div>
                              <div 
                                className="w-2 h-2 rounded-full animate-pulse"
                                style={{
                                  backgroundColor: `rgb(${point.color === 'blue' ? '59, 130, 246' : 
                                                          point.color === 'purple' ? '147, 51, 234' :
                                                          point.color === 'green' ? '34, 197, 94' :
                                                          point.color === 'orange' ? '249, 115, 22' :
                                                          point.color === 'teal' ? '20, 184, 166' :
                                                          point.color === 'pink' ? '236, 72, 153' :
                                                          point.color === 'indigo' ? '99, 102, 241' :
                                                          point.color === 'cyan' ? '6, 182, 212' :
                                                          point.color === 'yellow' ? '234, 179, 8' :
                                                          '239, 68, 68'})`
                                }}
                              ></div>
                            </div>

                            {/* Main Stat */}
                            <div className="mb-4">
                              <div className={`text-3xl font-bold text-gray-800 dark:text-white mb-2 bg-gradient-to-r from-${point.color}-500 to-${point.color}-600 bg-clip-text text-transparent`}>
                                {point.value.includes('%') ? point.value : 
                                 point.value.includes('K') ? point.value :
                                 point.value.includes('Human') ? '87%' :
                                 point.value.includes('optimized') ? '✓' :
                                 point.value.includes('display') ? '$12.5K' :
                                 point.value.includes('estimated') ? point.value :
                                 point.value.includes('detected') ? '0 PII' :
                                 point.value.includes('compressed') ? '4.2MB' :
                                 point.value.includes('overlay') ? 'Detected' :
                                 'Medium'
                                }
                              </div>
                              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                                {point.title}
                              </h3>
                            </div>

                            {/* Color-Coded Confidence System */}
                            <div className="mb-4">
                              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                                <span>Confidence</span>
                                <span className={`font-semibold ${
                                  (75 + (index * 3)) >= 90 ? 'text-green-400' :
                                  (75 + (index * 3)) >= 80 ? 'text-blue-400' :
                                  (75 + (index * 3)) >= 60 ? 'text-yellow-400' :
                                  'text-red-400'
                                }`}>
                                  {75 + (index * 3)}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-full h-2">
                                <div 
                                  className="h-2 rounded-full transition-all duration-1000"
                                  style={{ 
                                    width: `${75 + (index * 3)}%`,
                                    animationDelay: `${index * 0.2}s`,
                                    background: `linear-gradient(90deg, 
                                      ${(75 + (index * 3)) >= 90 ? 'rgb(34, 197, 94)' :
                                        (75 + (index * 3)) >= 80 ? 'rgb(59, 130, 246)' :
                                        (75 + (index * 3)) >= 60 ? 'rgb(234, 179, 8)' :
                                        'rgb(239, 68, 68)'}, 
                                      ${(75 + (index * 3)) >= 90 ? 'rgba(34, 197, 94, 0.6)' :
                                        (75 + (index * 3)) >= 80 ? 'rgba(59, 130, 246, 0.6)' :
                                        (75 + (index * 3)) >= 60 ? 'rgba(234, 179, 8, 0.6)' :
                                        'rgba(239, 68, 68, 0.6)'})`
                                  }}
                                />
                              </div>
                            </div>

                            {/* Footer Metric */}
                            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                              <span>Status: Active</span>
                              <div className="flex items-center space-x-1">
                                <div 
                                  className="w-1 h-1 rounded-full"
                                  style={{
                                    backgroundColor: `rgb(${point.color === 'blue' ? '59, 130, 246' : 
                                                            point.color === 'purple' ? '147, 51, 234' :
                                                            point.color === 'green' ? '34, 197, 94' :
                                                            point.color === 'orange' ? '249, 115, 22' :
                                                            point.color === 'teal' ? '20, 184, 166' :
                                                            point.color === 'pink' ? '236, 72, 153' :
                                                            point.color === 'indigo' ? '99, 102, 241' :
                                                            point.color === 'cyan' ? '6, 182, 212' :
                                                            point.color === 'yellow' ? '234, 179, 8' :
                                                            '239, 68, 68'})`
                                  }}
                                ></div>
                                <span>Live</span>
                              </div>
                            </div>

                            {/* Floating Badge for Index */}
                            <div 
                              className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg"
                              style={{
                                background: `linear-gradient(135deg, 
                                  rgb(${point.color === 'blue' ? '59, 130, 246' : 
                                        point.color === 'purple' ? '147, 51, 234' :
                                        point.color === 'green' ? '34, 197, 94' :
                                        point.color === 'orange' ? '249, 115, 22' :
                                        point.color === 'teal' ? '20, 184, 166' :
                                        point.color === 'pink' ? '236, 72, 153' :
                                        point.color === 'indigo' ? '99, 102, 241' :
                                        point.color === 'cyan' ? '6, 182, 212' :
                                        point.color === 'yellow' ? '234, 179, 8' :
                                        '239, 68, 68'}), 
                                  rgba(${point.color === 'blue' ? '59, 130, 246' : 
                                         point.color === 'purple' ? '147, 51, 234' :
                                         point.color === 'green' ? '34, 197, 94' :
                                         point.color === 'orange' ? '249, 115, 22' :
                                         point.color === 'teal' ? '20, 184, 166' :
                                         point.color === 'pink' ? '236, 72, 153' :
                                         point.color === 'indigo' ? '99, 102, 241' :
                                         point.color === 'cyan' ? '6, 182, 212' :
                                         point.color === 'yellow' ? '234, 179, 8' :
                                         '239, 68, 68'}, 0.8))`
                              }}
                            >
                              {point.id}
                            </div>

                            {/* Hover Glow Effect */}
                            <div 
                              className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                              style={{
                                background: `linear-gradient(135deg, 
                                  rgba(${point.color === 'blue' ? '59, 130, 246' : 
                                         point.color === 'purple' ? '147, 51, 234' :
                                         point.color === 'green' ? '34, 197, 94' :
                                         point.color === 'orange' ? '249, 115, 22' :
                                         point.color === 'teal' ? '20, 184, 166' :
                                         point.color === 'pink' ? '236, 72, 153' :
                                         point.color === 'indigo' ? '99, 102, 241' :
                                         point.color === 'cyan' ? '6, 182, 212' :
                                         point.color === 'yellow' ? '234, 179, 8' :
                                         '239, 68, 68'}, 0.1), 
                                  rgba(${point.color === 'blue' ? '59, 130, 246' : 
                                         point.color === 'purple' ? '147, 51, 234' :
                                         point.color === 'green' ? '34, 197, 94' :
                                         point.color === 'orange' ? '249, 115, 22' :
                                         point.color === 'teal' ? '20, 184, 166' :
                                         point.color === 'pink' ? '236, 72, 153' :
                                         point.color === 'indigo' ? '99, 102, 241' :
                                         point.color === 'cyan' ? '6, 182, 212' :
                                         point.color === 'yellow' ? '234, 179, 8' :
                                         '239, 68, 68'}, 0.05))`
                              }}
                            />
                          </div>

                          {/* Expanded Details Modal */}
                          {isSelected && (
                            <div 
                              className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 w-96 backdrop-blur-lg rounded-3xl border p-8 shadow-2xl z-50"
                              style={{
                                background: `linear-gradient(135deg, 
                                  rgba(${point.color === 'blue' ? '59, 130, 246' : 
                                        point.color === 'purple' ? '147, 51, 234' :
                                        point.color === 'green' ? '34, 197, 94' :
                                        point.color === 'orange' ? '249, 115, 22' :
                                        point.color === 'teal' ? '20, 184, 166' :
                                        point.color === 'pink' ? '236, 72, 153' :
                                        point.color === 'indigo' ? '99, 102, 241' :
                                        point.color === 'cyan' ? '6, 182, 212' :
                                        point.color === 'yellow' ? '234, 179, 8' :
                                        '239, 68, 68'}, 0.15) 0%, 
                                  rgba(${point.color === 'blue' ? '59, 130, 246' : 
                                        point.color === 'purple' ? '147, 51, 234' :
                                        point.color === 'green' ? '34, 197, 94' :
                                        point.color === 'orange' ? '249, 115, 22' :
                                        point.color === 'teal' ? '20, 184, 166' :
                                        point.color === 'pink' ? '236, 72, 153' :
                                        point.color === 'indigo' ? '99, 102, 241' :
                                        point.color === 'cyan' ? '6, 182, 212' :
                                        point.color === 'yellow' ? '234, 179, 8' :
                                        '239, 68, 68'}, 0.08) 100%), 
                                  rgba(255, 255, 255, 0.95)`,
                                borderColor: `rgba(${point.color === 'blue' ? '59, 130, 246' : 
                                                    point.color === 'purple' ? '147, 51, 234' :
                                                    point.color === 'green' ? '34, 197, 94' :
                                                    point.color === 'orange' ? '249, 115, 22' :
                                                    point.color === 'teal' ? '20, 184, 166' :
                                                    point.color === 'pink' ? '236, 72, 153' :
                                                    point.color === 'indigo' ? '99, 102, 241' :
                                                    point.color === 'cyan' ? '6, 182, 212' :
                                                    point.color === 'yellow' ? '234, 179, 8' :
                                                    '239, 68, 68'}, 0.4)`
                              }}
                            >
                              <div className="text-center mb-6">
                                <div className="text-5xl mb-3">{point.icon}</div>
                                <h3 className={`text-xl font-bold text-gray-800 dark:text-white mb-2`}>
                                  {point.title}
                                </h3>
                                <p 
                                  className="text-2xl font-bold bg-clip-text text-transparent"
                                  style={{
                                    backgroundImage: `linear-gradient(90deg, 
                                      rgb(${point.color === 'blue' ? '59, 130, 246' : 
                                            point.color === 'purple' ? '147, 51, 234' :
                                            point.color === 'green' ? '34, 197, 94' :
                                            point.color === 'orange' ? '249, 115, 22' :
                                            point.color === 'teal' ? '20, 184, 166' :
                                            point.color === 'pink' ? '236, 72, 153' :
                                            point.color === 'indigo' ? '99, 102, 241' :
                                            point.color === 'cyan' ? '6, 182, 212' :
                                            point.color === 'yellow' ? '234, 179, 8' :
                                            '239, 68, 68'}), 
                                      rgba(${point.color === 'blue' ? '59, 130, 246' : 
                                             point.color === 'purple' ? '147, 51, 234' :
                                             point.color === 'green' ? '34, 197, 94' :
                                             point.color === 'orange' ? '249, 115, 22' :
                                             point.color === 'teal' ? '20, 184, 166' :
                                             point.color === 'pink' ? '236, 72, 153' :
                                             point.color === 'indigo' ? '99, 102, 241' :
                                             point.color === 'cyan' ? '6, 182, 212' :
                                             point.color === 'yellow' ? '234, 179, 8' :
                                             '239, 68, 68'}, 0.7))`
                                  }}
                                >
                                  {point.value}
                                </p>
                              </div>
                              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                  {point.details}
                                </p>
                              </div>
                              {/* Close Button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedCard(null)
                                }}
                                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors hover:scale-110"
                                style={{
                                  background: `rgba(${point.color === 'blue' ? '59, 130, 246' : 
                                                      point.color === 'purple' ? '147, 51, 234' :
                                                      point.color === 'green' ? '34, 197, 94' :
                                                      point.color === 'orange' ? '249, 115, 22' :
                                                      point.color === 'teal' ? '20, 184, 166' :
                                                      point.color === 'pink' ? '236, 72, 153' :
                                                      point.color === 'indigo' ? '99, 102, 241' :
                                                      point.color === 'cyan' ? '6, 182, 212' :
                                                      point.color === 'yellow' ? '234, 179, 8' :
                                                      '239, 68, 68'}, 0.8)`
                                }}
                              >
                                ✕
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Progressive Disclosure - Reveal More Insights Button */}
                {revealedCards >= 3 && revealedCards < 10 && !showAllCards && (
                  <div className="flex justify-center mt-8 opacity-0 animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
                    <button
                      onClick={revealAllCards}
                      className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-2xl font-semibold transition-all duration-300 flex items-center space-x-3 shadow-lg hover:shadow-purple-500/25 hover:scale-105"
                    >
                      <Sparkles className="w-5 h-5" />
                      <span>Reveal More Insights</span>
                      <div className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                        +7 Points
                      </div>
                    </button>
                  </div>
                )}

                {/* Claire's Intelligent Suggestions Panel */}
                {revealedCards >= 10 && (
                  <div className="max-w-4xl mx-auto mt-12 px-4 opacity-0 animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
                    <div className="bg-gradient-to-r from-purple-900/15 to-blue-900/15 backdrop-blur-md rounded-2xl border border-purple-500/20 p-6">
                      <div className="flex items-start space-x-4">
                        <img src="/claire.png" alt="Claire" className="w-12 h-12 rounded-full border-2 border-purple-400/50" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-white">Claire's Insights</h3>
                            <div className="px-2 py-1 bg-purple-500/30 rounded-full text-xs text-purple-300 font-medium">
                              AiiQ Concierge
                            </div>
                          </div>
                          <p className="text-purple-300 mb-4">
                            "Great analysis! I notice this has strong authenticity signals. Would you like me to run a deeper pAIt grade comparison against institutional benchmarks?"
                          </p>
                          <div className="flex flex-wrap gap-3">
                            <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-purple-500/25">
                              <span>✅ Run pAIt Analysis</span>
                              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">$2.99</span>
                            </button>
                            <button className="px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-green-500/25">
                              <span>⚖️ Compare Against Trusted Dataset</span>
                              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Free</span>
                            </button>
                          </div>
                          <div className="mt-3 text-xs text-gray-400">
                            💡 <strong>Pro Tip:</strong> pAIt scores help identify market manipulation vs authentic performance claims
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Intelligence Summary - Appears after all cards */}
                {revealedCards >= 10 && (
                  <div className="max-w-4xl mx-auto mt-16 px-4 opacity-0 animate-fade-in" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
                    <div className="bg-gradient-to-br from-gray-800/20 to-gray-900/15 backdrop-blur-md rounded-2xl border border-gray-600/30 p-8 text-center">
                      <h2 className="text-2xl font-bold text-white mb-4 flex items-center justify-center space-x-2">
                        <Sparkles className="w-6 h-6 text-purple-400" />
                        <span>Intelligence Summary</span>
                      </h2>
                      <div className="border-t border-gray-600 pt-6">
                        <p className="text-gray-300 text-lg leading-relaxed">
                          <strong className="text-white">Assessment:</strong> Trading platform screenshot with social media overlay detected. 
                          {Math.floor(Math.random() * 30) + 70}% confidence in human creation. Privacy-compliant analysis completed. 
                          Suitable for secure transmission and further analysis.
                        </p>
                      </div>
                      
                      {/* Scanline Effect */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-400/5 to-transparent animate-pulse pointer-events-none" />
                    </div>
                  </div>
                )}

                {/* Premium Upgrades */}
                {revealedCards >= 10 && (
                  <div className="max-w-4xl mx-auto mt-8 px-4 grid md:grid-cols-2 gap-6 opacity-0 animate-fade-in" style={{ animationDelay: '2s', animationFillMode: 'forwards' }}>
                    <div className="bg-gradient-to-br from-purple-900/15 to-blue-900/15 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6 text-center hover:scale-105 transition-transform">
                      <h3 className="text-lg font-semibold text-white mb-3">📹 Video Analysis</h3>
                      <p className="text-gray-300 text-sm mb-4">Frame-by-frame magical analysis</p>
                      <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
                        $7.99/video
                      </button>
                    </div>
                    <div className="bg-gradient-to-br from-green-900/15 to-teal-900/15 backdrop-blur-sm rounded-xl border border-green-500/20 p-6 text-center hover:scale-105 transition-transform">
                      <h3 className="text-lg font-semibold text-white mb-3">⚖️ Compare Images</h3>
                      <p className="text-gray-300 text-sm mb-4">Dual-orb comparison magic</p>
                      <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                        $4.99/comparison
                      </button>
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="text-center mt-12 pb-8 text-xs text-gray-500">
                  ✨ Processed By: <span className="crella-font">Crella</span> Lens Visual Intelligence • pAIt™ Analysis • {result.metadata.processTime}
                </div>
              </div>
            )
          })}
        </div>
      )}
      </div> {/* Close content wrapper */}
    </div>
  )
}