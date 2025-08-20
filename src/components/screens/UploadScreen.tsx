import React, { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Upload, 
  Camera, 
  Image as ImageIcon, 
  X, 
  Plus,
  FileText,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import { AppState } from '../MobileRouter'
import { IntentPromptModal } from '../IntentPromptModal'

interface UploadScreenProps {
  appState: AppState
  updateAppState: (updates: Partial<AppState>) => void
}

export function UploadScreen({ appState, updateAppState }: UploadScreenProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [comments, setComments] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [showIntentModal, setShowIntentModal] = useState(false)
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  // Handle drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = Array.from(e.dataTransfer.files)
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length > 0) {
      setSelectedImages(prev => [...prev, ...imageFiles])
    }
  }, [])

  // Handle file input change
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length > 0) {
      setSelectedImages(prev => [...prev, ...imageFiles])
    }
  }

  // Remove image
  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
  }

  // Handle camera capture
  const handleCameraCapture = () => {
    fileInputRef.current?.click()
  }

  // Handle upload and show intent modal
  const handleUploadAndAnalyze = async () => {
    if (selectedImages.length === 0) return

    setIsUploading(true)

    // Update app state with uploaded images
    updateAppState({
      uploadedImages: selectedImages,
      waitingForIntent: true,
      selectedIntent: null,
      user: {
        ...appState.user,
        tokens: Math.max(0, appState.user.tokens - selectedImages.length),
        dailyUsage: appState.user.dailyUsage + selectedImages.length
      }
    })

    // Simulate upload processing
    await new Promise(resolve => setTimeout(resolve, 1500))

    setIsUploading(false)
    
    // Show intent modal instead of navigating immediately
    setShowIntentModal(true)
  }

  // Handle intent selection
  const handleIntentSelected = (intent: any) => {
    updateAppState({
      selectedIntent: intent,
      waitingForIntent: false
    })
    
    setShowIntentModal(false)
    
    // Now navigate to analyze screen with intent selected
    navigate('/analyze')
  }

  // Handle modal close
  const handleModalClose = () => {
    setShowIntentModal(false)
    // Reset upload state if user cancels
    updateAppState({
      waitingForIntent: false,
      uploadedImages: [],
      selectedIntent: null
    })
  }

  const canUpload = selectedImages.length > 0 && !isUploading
  const hasTokens = appState.user.tokens > 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Upload Images
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Drop images or take photos for AI-powered visual intelligence analysis
          </p>
        </motion.div>

        {/* Token Status */}
        <motion.div 
          className={`mb-6 p-4 rounded-xl border ${
            hasTokens 
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
          }`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className={`w-5 h-5 ${hasTokens ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
              <span className="font-medium">
                {appState.user.tokens} tokens remaining
              </span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {appState.user.type.toUpperCase()}
            </span>
          </div>
          {!hasTokens && (
            <p className="text-red-600 dark:text-red-400 text-sm mt-2">
              No tokens remaining. Upgrade to VIP for unlimited analysis.
            </p>
          )}
        </motion.div>

        {/* Upload Area */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div
            className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
              dragActive
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                : hasTokens
                ? 'border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500'
                : 'border-gray-200 dark:border-gray-700 opacity-50'
            } ${hasTokens ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            onDragEnter={hasTokens ? handleDrag : undefined}
            onDragLeave={hasTokens ? handleDrag : undefined}
            onDragOver={hasTokens ? handleDrag : undefined}
            onDrop={hasTokens ? handleDrop : undefined}
            onClick={hasTokens ? () => fileInputRef.current?.click() : undefined}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={!hasTokens}
            />
            
            <div className="text-center">
              <Upload className={`w-12 h-12 mx-auto mb-4 ${
                hasTokens ? 'text-purple-500' : 'text-gray-400'
              }`} />
              
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {dragActive ? 'Drop images here' : 'Upload Images'}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Drag and drop images or click to browse
              </p>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCameraCapture()
                  }}
                  disabled={!hasTokens}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  <span>Camera</span>
                </button>
                
                <button
                  onClick={(e) => e.stopPropagation()}
                  disabled={!hasTokens}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 rounded-lg transition-colors"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Gallery</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Selected Images */}
        {selectedImages.length > 0 && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Selected Images ({selectedImages.length})
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              {selectedImages.map((file, index) => (
                <motion.div
                  key={`${file.name}-${index}`}
                  className="relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-32 object-cover"
                  />
                  
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Comments Section */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            Optional Comments
          </label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Add context or specific questions about your images..."
            disabled={!hasTokens}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50"
            rows={3}
          />
        </motion.div>

        {/* Upload Button */}
        <motion.button
          onClick={handleUploadAndAnalyze}
          disabled={!canUpload || !hasTokens}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          whileHover={canUpload && hasTokens ? { scale: 1.02 } : {}}
          whileTap={canUpload && hasTokens ? { scale: 0.98 } : {}}
        >
          {isUploading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-5 h-5" />
            </motion.div>
          ) : (
            <>
              <span>Start Analysis</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </motion.button>

        {/* Usage Info */}
        <motion.div
          className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <p>
            Each image costs 1 token. 
            {appState.user.type === 'guest' && ' Upgrade to VIP for unlimited analysis.'}
          </p>
        </motion.div>
      </div>

      {/* Intent Prompt Modal */}
      <IntentPromptModal
        isOpen={showIntentModal}
        onClose={handleModalClose}
        uploadedImage={selectedImages.length > 0 ? {
          url: URL.createObjectURL(selectedImages[0]),
          name: selectedImages[0].name
        } : undefined}
        onIntentSelected={handleIntentSelected}
      />
    </div>
  )
}

export default UploadScreen
