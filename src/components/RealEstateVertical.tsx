import React, { useState, useEffect } from 'react'
import { MapPin, Home, FileText, TrendingUp, AlertTriangle, CheckCircle, Clock, Search } from 'lucide-react'

interface PropertyData {
  address: string
  owner: string
  parcelId: string
  legalDescription: string
  assessedValue: number
  marketValue: number
  propertyType: string
  yearBuilt: number
  squareFootage: number
  lotSize: string
  zoning: string
  schoolDistrict: string
  taxAmount: number
  taxYear: number
  lastSaleDate: string
  lastSalePrice: number
  compliance: {
    permits: 'current' | 'expired' | 'pending' | 'violations'
    zoning: 'compliant' | 'non-compliant' | 'pending-review'
    environmental: 'clear' | 'concerns' | 'unknown'
    liens: 'none' | 'active' | 'resolved'
  }
  coordinates: {
    lat: number
    lng: number
  }
}

interface RealEstateAnalysis {
  property: PropertyData | null
  swotAnalysis: {
    strengths: string[]
    weaknesses: string[]
    opportunities: string[]
    threats: string[]
  }
  paitScore: number
  confidence: number
  marketComparables: PropertyData[]
  investmentTags: ('property' | 'deal' | 'loan' | 'buildout')[]
  recommendations: string[]
}

interface RealEstateVerticalProps {
  uploadedImage?: File | null
  userType: 'guest' | 'member' | 'staff'
  onAnalysisComplete?: (analysis: RealEstateAnalysis) => void
}

export function RealEstateVertical({ uploadedImage, userType, onAnalysisComplete }: RealEstateVerticalProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<RealEstateAnalysis | null>(null)
  const [searchAddress, setSearchAddress] = useState('')
  const [autoDetectedAddress, setAutoDetectedAddress] = useState<string | null>(null)

  // Auto-detect address from uploaded image
  useEffect(() => {
    if (uploadedImage) {
      detectAddressFromImage(uploadedImage).then(setAutoDetectedAddress)
    }
  }, [uploadedImage])

  // Mock Austin property data APIs integration
  const searchAustinCountyRecords = async (address: string): Promise<PropertyData | null> => {
    console.log('🔍 Searching Austin County Records for:', address)
    
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock property data - in production, integrate with:
    // - Data.AustinTexas.gov
    // - Travis County Clerk records
    // - TCAD (Travis Central Appraisal District)
    const mockProperty: PropertyData = {
      address: address || '1234 Tech Ridge Blvd, Austin, TX 78753',
      owner: 'Austin Property Holdings LLC',
      parcelId: 'TR-2024-001234',
      legalDescription: 'LOT 15 BLK A TECH RIDGE SUBDIVISION',
      assessedValue: 475000,
      marketValue: 525000,
      propertyType: 'Single Family Residential',
      yearBuilt: 2019,
      squareFootage: 2100,
      lotSize: '0.25 acres',
      zoning: 'SF-3',
      schoolDistrict: 'Austin ISD',
      taxAmount: 12750,
      taxYear: 2024,
      lastSaleDate: '2023-08-15',
      lastSalePrice: 485000,
      compliance: {
        permits: 'current',
        zoning: 'compliant',
        environmental: 'clear',
        liens: 'none'
      },
      coordinates: {
        lat: 30.3935,
        lng: -97.7129
      }
    }
    
    return mockProperty
  }

  // Detect address from image (OCR + AI)
  const detectAddressFromImage = async (file: File): Promise<string | null> => {
    console.log('🔍 Detecting address from image:', file.name)
    
    // Mock OCR detection - in production, integrate with:
    // - Google Vision API
    // - AWS Textract  
    // - Azure Computer Vision
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Simulate address detection success rate
    const detectionSuccess = Math.random() > 0.3
    if (detectionSuccess) {
      return '1234 Tech Ridge Blvd, Austin, TX 78753'
    }
    
    return null
  }

  // Perform comprehensive real estate analysis
  const performRealEstateAnalysis = async (address: string): Promise<RealEstateAnalysis> => {
    setIsAnalyzing(true)
    
    try {
      // Step 1: Get property data from county records
      const property = await searchAustinCountyRecords(address)
      
      if (!property) {
        throw new Error('Property not found in county records')
      }

      // Step 2: Generate SWOT analysis
      const swotAnalysis = {
        strengths: [
          'Strong Austin market fundamentals',
          'Growing tech corridor location',
          'Recent construction with modern amenities',
          'No outstanding liens or violations'
        ],
        weaknesses: [
          'Higher property tax rate in Travis County',
          'Limited inventory in surrounding area',
          'Potential HOA restrictions'
        ],
        opportunities: [
          'Apple campus proximity driving demand',
          'Infrastructure improvements planned',
          'Rental income potential in growth area',
          'Property value appreciation trend'
        ],
        threats: [
          'Interest rate volatility affecting buyers',
          'Austin market cooling from peak',
          'Property tax increases with reassessment',
          'Competition from new developments'
        ]
      }

      // Step 3: Calculate pAIt score based on multiple factors
      let paitScore = 1500 // Base score
      
      // Positive factors
      if (property.compliance.permits === 'current') paitScore += 100
      if (property.compliance.zoning === 'compliant') paitScore += 150
      if (property.compliance.liens === 'none') paitScore += 200
      if (property.yearBuilt > 2015) paitScore += 150
      if (property.marketValue > property.assessedValue) paitScore += 100
      
      // Location bonus for Austin tech corridors
      if (address.toLowerCase().includes('austin') || address.toLowerCase().includes('tech')) {
        paitScore += 250
      }

      // Step 4: Determine investment tags
      const investmentTags: ('property' | 'deal' | 'loan' | 'buildout')[] = []
      
      if (property.marketValue < property.assessedValue * 0.9) {
        investmentTags.push('deal')
      }
      if (property.yearBuilt < 2000) {
        investmentTags.push('buildout')
      }
      if (property.marketValue > 300000) {
        investmentTags.push('loan')
      }
      investmentTags.push('property')

      // Step 5: Generate recommendations
      const recommendations = [
        'Verify recent comparable sales in Tech Ridge area',
        'Review HOA documents and monthly fees',
        'Schedule professional inspection before closing',
        'Consider rental income potential given location',
        'Evaluate long-term Austin growth projections'
      ]

      const analysis: RealEstateAnalysis = {
        property,
        swotAnalysis,
        paitScore: Math.min(paitScore, 3000),
        confidence: 0.87,
        marketComparables: [], // Would fetch from MLS/Zillow in production
        investmentTags,
        recommendations
      }

      return analysis
      
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Handle analysis trigger
  const handleAnalyze = async () => {
    const address = autoDetectedAddress || searchAddress
    if (!address.trim()) {
      alert('Please enter an address or upload an image containing property information')
      return
    }

    try {
      const result = await performRealEstateAnalysis(address)
      setAnalysis(result)
      onAnalysisComplete?.(result)
    } catch (error) {
      console.error('Real estate analysis error:', error)
      alert('Analysis failed. Please try again.')
    }
  }

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'current':
      case 'compliant':
      case 'clear':
      case 'none':
        return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'pending':
      case 'pending-review':
      case 'unknown':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      default:
        return 'text-red-400 bg-red-500/20 border-red-500/30'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/20 to-green-900/20 rounded-xl p-6 border border-blue-500/20">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
          <Home className="w-8 h-8 mr-3 text-blue-400" />
          Real Estate Intelligence
        </h2>
        <p className="text-gray-300 text-sm">
          Austin Beta • County Records Integration • AI-Powered Property Analysis
        </p>
      </div>

      {/* Address Input Section */}
      <div className="bg-gray-900/20 backdrop-blur-md rounded-xl border border-gray-700/30 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Property Search</h3>
        
        {/* Auto-detected address */}
        {autoDetectedAddress && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-300 text-sm font-medium">Address Detected from Image:</span>
            </div>
            <p className="text-white font-medium">{autoDetectedAddress}</p>
          </div>
        )}

        {/* Manual address input */}
        <div className="flex space-x-3">
          <div className="flex-1">
            <input
              type="text"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              placeholder="Enter Austin area address..."
              className="w-full bg-gray-800/50 text-white placeholder-gray-400 rounded-lg px-4 py-3 border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || (!autoDetectedAddress && !searchAddress.trim())}
            className="bg-gradient-to-r from-blue-500 to-green-600 hover:from-blue-600 hover:to-green-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center"
          >
            {isAnalyzing ? (
              <>
                <Clock className="w-5 h-5 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="w-5 h-5 mr-2" />
                Analyze
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Property Overview */}
          <div className="bg-gray-900/20 backdrop-blur-md rounded-xl border border-gray-700/30 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Property Details</h3>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  analysis.paitScore >= 2000 ? 'text-green-400 bg-green-500/20 border border-green-500/30' :
                  analysis.paitScore >= 1500 ? 'text-yellow-400 bg-yellow-500/20 border border-yellow-500/30' :
                  'text-red-400 bg-red-500/20 border border-red-500/30'
                }`}>
                  pAIt™ {analysis.paitScore}
                </span>
              </div>
            </div>

            {analysis.property && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-white font-medium mb-2">Property Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Address:</span>
                        <span className="text-white">{analysis.property.address}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Owner:</span>
                        <span className="text-white">{analysis.property.owner}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Type:</span>
                        <span className="text-white">{analysis.property.propertyType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Built:</span>
                        <span className="text-white">{analysis.property.yearBuilt}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Info */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-white font-medium mb-2">Financial Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Market Value:</span>
                        <span className="text-green-400 font-medium">${analysis.property.marketValue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Assessed Value:</span>
                        <span className="text-white">${analysis.property.assessedValue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Annual Tax:</span>
                        <span className="text-white">${analysis.property.taxAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Last Sale:</span>
                        <span className="text-white">${analysis.property.lastSalePrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Compliance Status */}
            {analysis.property && (
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h4 className="text-white font-medium mb-4">Compliance Status</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className={`text-center p-3 rounded-lg border ${getComplianceColor(analysis.property.compliance.permits)}`}>
                    <div className="text-xs opacity-75 mb-1">Permits</div>
                    <div className="font-medium capitalize">{analysis.property.compliance.permits}</div>
                  </div>
                  <div className={`text-center p-3 rounded-lg border ${getComplianceColor(analysis.property.compliance.zoning)}`}>
                    <div className="text-xs opacity-75 mb-1">Zoning</div>
                    <div className="font-medium capitalize">{analysis.property.compliance.zoning}</div>
                  </div>
                  <div className={`text-center p-3 rounded-lg border ${getComplianceColor(analysis.property.compliance.environmental)}`}>
                    <div className="text-xs opacity-75 mb-1">Environmental</div>
                    <div className="font-medium capitalize">{analysis.property.compliance.environmental}</div>
                  </div>
                  <div className={`text-center p-3 rounded-lg border ${getComplianceColor(analysis.property.compliance.liens)}`}>
                    <div className="text-xs opacity-75 mb-1">Liens</div>
                    <div className="font-medium capitalize">{analysis.property.compliance.liens}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SWOT Analysis */}
          <div className="bg-gray-900/20 backdrop-blur-md rounded-xl border border-gray-700/30 p-6">
            <h3 className="text-lg font-semibold text-white mb-6">SWOT Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {/* Strengths */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <h4 className="text-green-400 font-medium mb-3 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Strengths
                  </h4>
                  <ul className="space-y-1 text-sm text-green-300">
                    {analysis.swotAnalysis.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-400 mr-2">•</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Opportunities */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <h4 className="text-blue-400 font-medium mb-3 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Opportunities
                  </h4>
                  <ul className="space-y-1 text-sm text-blue-300">
                    {analysis.swotAnalysis.opportunities.map((opportunity, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-400 mr-2">•</span>
                        {opportunity}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                {/* Weaknesses */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <h4 className="text-yellow-400 font-medium mb-3 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Weaknesses
                  </h4>
                  <ul className="space-y-1 text-sm text-yellow-300">
                    {analysis.swotAnalysis.weaknesses.map((weakness, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-yellow-400 mr-2">•</span>
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Threats */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <h4 className="text-red-400 font-medium mb-3 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Threats
                  </h4>
                  <ul className="space-y-1 text-sm text-red-300">
                    {analysis.swotAnalysis.threats.map((threat, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-red-400 mr-2">•</span>
                        {threat}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Investment Tags & Recommendations */}
          <div className="bg-gray-900/20 backdrop-blur-md rounded-xl border border-gray-700/30 p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Investment Analysis</h3>
            
            {/* Tags */}
            <div className="mb-6">
              <h4 className="text-white font-medium mb-3">Investment Tags</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.investmentTags.map((tag, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${
                      tag === 'deal' ? 'text-green-400 bg-green-500/20 border-green-500/30' :
                      tag === 'property' ? 'text-blue-400 bg-blue-500/20 border-blue-500/30' :
                      tag === 'loan' ? 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30' :
                      'text-purple-400 bg-purple-500/20 border-purple-500/30'
                    }`}
                  >
                    {tag.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h4 className="text-white font-medium mb-3">Recommendations</h4>
              <ul className="space-y-2">
                {analysis.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-300">
                    <CheckCircle className="w-4 h-4 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                    {recommendation}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Austin Beta Notice */}
      <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl p-4 border border-purple-500/20">
        <div className="flex items-center space-x-2 text-purple-300 text-sm">
          <MapPin className="w-4 h-4" />
          <span>
            <strong>Austin Beta Program</strong> • Integrated with Travis County data • 
            Powered by Crella-Lens AI • For Paul's HNW network
          </span>
        </div>
      </div>
    </div>
  )
}

export default RealEstateVertical
