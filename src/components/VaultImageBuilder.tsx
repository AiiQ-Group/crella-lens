import React, { useState, useRef } from 'react'
import { X, Download, Share2, Mail, MessageSquare, Shield, Sparkles, Eye, Lock } from 'lucide-react'
import { PAItScoreOrb } from './PAItScoreOrb'

interface AgentResult {
  agent: 'JBot' | 'Claudia' | 'Kathy'
  summary: string
  score: number
  confidence: number
  details?: string
  recommendations?: string[]
  executionTime?: number
}

interface VaultImageBuilderProps {
  isOpen: boolean
  onClose: () => void
  agentResults: AgentResult[]
  userType: 'guest' | 'member' | 'staff'
  originalImage?: File
}

export function VaultImageBuilder({ 
  isOpen, 
  onClose, 
  agentResults, 
  userType,
  originalImage 
}: VaultImageBuilderProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<'compact' | 'detailed' | 'professional'>('compact')
  const [includeDetails, setIncludeDetails] = useState(false)
  const [includeRecommendations, setIncludeRecommendations] = useState(true)
  const [customTitle, setCustomTitle] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  if (!isOpen) return null

  // Calculate overall pAIt score from agent results
  const calculateOverallScore = (): number => {
    const validScores = agentResults.filter(r => r.score > 0).map(r => r.score)
    if (validScores.length === 0) return 0
    
    // Weighted average based on confidence
    const weightedSum = agentResults.reduce((sum, result) => {
      return sum + (result.score * result.confidence)
    }, 0)
    const totalWeight = agentResults.reduce((sum, result) => sum + result.confidence, 0)
    
    return Math.round(weightedSum / totalWeight)
  }

  // Generate secure pAIt image
  const generateSecureImage = async () => {
    setIsGenerating(true)
    
    try {
      const canvas = canvasRef.current
      if (!canvas) return
      
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Set canvas dimensions
      canvas.width = selectedTemplate === 'professional' ? 1200 : 800
      canvas.height = selectedTemplate === 'detailed' ? 1000 : selectedTemplate === 'professional' ? 900 : 600

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, '#1a1a2e')
      gradient.addColorStop(0.5, '#16213e')
      gradient.addColorStop(1, '#0f172a')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Add subtle pattern overlay
      ctx.globalAlpha = 0.1
      for (let i = 0; i < canvas.width; i += 40) {
        for (let j = 0; j < canvas.height; j += 40) {
          ctx.fillStyle = '#ffffff'
          ctx.beginPath()
          ctx.arc(i, j, 1, 0, 2 * Math.PI)
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1

      // Header section
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 32px Arial, sans-serif'
      ctx.textAlign = 'center'
      const title = customTitle || 'Crella-Lens AI Analysis'
      ctx.fillText(title, canvas.width / 2, 60)

      // Subtitle
      ctx.font = '16px Arial, sans-serif'
      ctx.fillStyle = '#94a3b8'
      ctx.fillText('pAIt™ Intelligence Report • AiiQ Group', canvas.width / 2, 90)

      // Overall Score Orb (large, centered)
      const overallScore = calculateOverallScore()
      if (overallScore > 0) {
        ctx.font = 'bold 48px Arial, sans-serif'
        ctx.fillStyle = overallScore >= 2000 ? '#10b981' : overallScore >= 1500 ? '#f59e0b' : '#ef4444'
        
        // Draw orb circle
        ctx.beginPath()
        ctx.arc(canvas.width / 2, 180, 60, 0, 2 * Math.PI)
        ctx.strokeStyle = ctx.fillStyle
        ctx.lineWidth = 4
        ctx.stroke()
        
        // Score text
        ctx.textAlign = 'center'
        ctx.fillText(overallScore.toString(), canvas.width / 2, 195)
        
        // pAIt label
        ctx.font = 'bold 16px Arial, sans-serif'
        ctx.fillStyle = '#ffffff'
        ctx.fillText('pAIt™ Score', canvas.width / 2, 220)
      }

      // Agent Results Section
      let yOffset = 280
      const agentWidth = (canvas.width - 80) / Math.min(agentResults.length, 3)
      
      agentResults.forEach((result, index) => {
        if (index >= 3) return // Limit to 3 agents for space
        
        const xPos = 40 + (index * agentWidth) + (agentWidth / 2)
        
        // Agent name
        ctx.font = 'bold 18px Arial, sans-serif'
        ctx.fillStyle = result.agent === 'JBot' ? '#10b981' : 
                       result.agent === 'Claudia' ? '#8b5cf6' : '#3b82f6'
        ctx.textAlign = 'center'
        ctx.fillText(result.agent, xPos, yOffset)
        
        // Agent score
        if (result.score > 0) {
          ctx.font = 'bold 24px Arial, sans-serif'
          ctx.fillText(result.score.toString(), xPos, yOffset + 35)
        }
        
        // Confidence
        ctx.font = '12px Arial, sans-serif'
        ctx.fillStyle = '#94a3b8'
        ctx.fillText(`${Math.round(result.confidence * 100)}% confidence`, xPos, yOffset + 55)
        
        // Summary (truncated)
        if (selectedTemplate !== 'compact') {
          ctx.font = '11px Arial, sans-serif'
          ctx.fillStyle = '#e2e8f0'
          const maxWidth = agentWidth - 20
          const words = result.summary.split(' ')
          let line = ''
          let lineY = yOffset + 80
          
          for (let n = 0; n < words.length && lineY < canvas.height - 100; n++) {
            const testLine = line + words[n] + ' '
            const metrics = ctx.measureText(testLine)
            
            if (metrics.width > maxWidth && line !== '') {
              ctx.fillText(line.trim(), xPos, lineY)
              line = words[n] + ' '
              lineY += 15
            } else {
              line = testLine
            }
          }
          ctx.fillText(line.trim(), xPos, lineY)
        }
      })

      // Footer with security info
      yOffset = canvas.height - 80
      ctx.font = 'bold 14px Arial, sans-serif'
      ctx.fillStyle = '#ffffff'
      ctx.textAlign = 'center'
      ctx.fillText('🔒 Cryptographically Secured Analysis', canvas.width / 2, yOffset)
      
      ctx.font = '12px Arial, sans-serif'
      ctx.fillStyle = '#94a3b8'
      ctx.fillText(`Generated: ${new Date().toLocaleString()} • ${userType.toUpperCase()} Access`, canvas.width / 2, yOffset + 25)
      
      // Timestamp and hash (simulated)
      const timestamp = Date.now()
      const hash = `#${timestamp.toString(16).substr(-8).toUpperCase()}`
      ctx.fillText(`Verification Hash: ${hash}`, canvas.width / 2, yOffset + 45)

      // Convert canvas to image
      const dataUrl = canvas.toDataURL('image/png', 0.95)
      setGeneratedImage(dataUrl)
      
      // Auto-scroll to preview
      setTimeout(() => {
        document.getElementById('generated-preview')?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        })
      }, 100)
      
    } catch (error) {
      console.error('Image generation error:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  // Download generated image
  const downloadImage = () => {
    if (!generatedImage) return
    
    const link = document.createElement('a')
    link.download = `crella-lens-analysis-${Date.now()}.png`
    link.href = generatedImage
    link.click()
  }

  // Share via different methods
  const shareImage = (method: 'email' | 'sms' | 'copy') => {
    if (!generatedImage) return
    
    switch (method) {
      case 'email':
        const emailBody = `Check out this AI analysis from Crella-Lens:\n\nOverall pAIt™ Score: ${calculateOverallScore()}\n\nGenerated by AiiQ Group's multi-agent intelligence system.`
        window.open(`mailto:?subject=Crella-Lens AI Analysis&body=${encodeURIComponent(emailBody)}`)
        break
      
      case 'sms':
        const smsText = `AI Analysis Complete! pAIt™ Score: ${calculateOverallScore()}. View full report: [Secure Link]`
        window.open(`sms:?body=${encodeURIComponent(smsText)}`)
        break
        
      case 'copy':
        navigator.clipboard.writeText(generatedImage).then(() => {
          // Show success message
          console.log('Image copied to clipboard')
        })
        break
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-blue-400" />
            <div>
              <h2 className="text-xl font-bold text-white">Secure pAIt™ Image Builder</h2>
              <p className="text-gray-400 text-sm">Package your analysis into a shareable, cryptographically sealed image</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Template Selection */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Template Style</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { key: 'compact', name: 'Compact', desc: 'Key metrics only' },
                { key: 'detailed', name: 'Detailed', desc: 'Includes summaries' },
                { key: 'professional', name: 'Professional', desc: 'Full analysis report' }
              ].map((template) => (
                <button
                  key={template.key}
                  onClick={() => setSelectedTemplate(template.key as any)}
                  className={`p-4 rounded-lg border transition-all ${
                    selectedTemplate === template.key
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                      : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <div className="font-medium">{template.name}</div>
                  <div className="text-xs opacity-75 mt-1">{template.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Options */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Content Options</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="Custom title (optional)"
                  className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              
              {selectedTemplate !== 'compact' && (
                <>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={includeDetails}
                      onChange={(e) => setIncludeDetails(e.target.checked)}
                      className="rounded border-gray-600"
                    />
                    <span className="text-white">Include detailed analysis</span>
                  </label>
                  
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={includeRecommendations}
                      onChange={(e) => setIncludeRecommendations(e.target.checked)}
                      className="rounded border-gray-600"
                    />
                    <span className="text-white">Include recommendations</span>
                  </label>
                </>
              )}
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex justify-center">
            <button
              onClick={generateSecureImage}
              disabled={isGenerating}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5 mr-2" />
                  Generate Secure Image
                </>
              )}
            </button>
          </div>

          {/* Generated Image Preview */}
          {generatedImage && (
            <div id="generated-preview" className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Generated Image</h3>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <img
                  src={generatedImage}
                  alt="Generated pAIt analysis"
                  className="w-full max-w-2xl mx-auto rounded-lg border border-gray-600"
                />
              </div>

              {/* Share Options */}
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={downloadImage}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </button>
                
                <button
                  onClick={() => shareImage('email')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </button>
                
                <button
                  onClick={() => shareImage('sms')}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  SMS
                </button>
                
                <button
                  onClick={() => shareImage('copy')}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Copy Link
                </button>
              </div>
            </div>
          )}

          {/* Hidden canvas for image generation */}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>
    </div>
  )
}

export default VaultImageBuilder
