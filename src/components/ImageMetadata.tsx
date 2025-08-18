import { useState, useEffect } from 'react'
import { Tag, MessageSquare, Eye, Clock, User, Database } from 'lucide-react'
import { AnalysisResult } from '../types'

interface ImageMetadata {
  id: string
  originalName: string
  uploadTime: Date
  size: number
  dimensions?: { width: number; height: number }
  analysis: AnalysisResult
  interactions: ImageInteraction[]
  views: ViewRecord[]
  tags: CustomTag[]
  lastModified: Date
}

interface ImageInteraction {
  id: string
  type: 'ai_question' | 'analysis' | 'save' | 'comment'
  content: string
  assistant?: string
  timestamp: Date
  userType: 'guest' | 'member' | 'staff'
  ipAddress: string
}

interface ViewRecord {
  timestamp: Date
  ipAddress: string
  userType: 'guest' | 'member' | 'staff'
  duration: number
  location?: string
}

interface CustomTag {
  name: string
  value: string
  addedBy: string
  timestamp: Date
}

interface ImageMetadataProps {
  imageFile: File | null
  analysisResult: AnalysisResult | null
  userType: 'staff' | 'member' | null
  isAuthenticated: boolean
}

export default function ImageMetadata({ imageFile, analysisResult, userType, isAuthenticated }: ImageMetadataProps) {
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null)
  const [showMetadata, setShowMetadata] = useState(false)

  useEffect(() => {
    if (imageFile && analysisResult) {
      // Create or update metadata when image is analyzed
      const imageId = `img_${Date.now()}_${imageFile.name.replace(/\W/g, '_')}`
      
      const newMetadata: ImageMetadata = {
        id: imageId,
        originalName: imageFile.name,
        uploadTime: new Date(),
        size: imageFile.size,
        analysis: analysisResult,
        interactions: [],
        views: [{
          timestamp: new Date(),
          ipAddress: getClientIP(),
          userType: isAuthenticated ? (userType || 'member') : 'guest',
          duration: 0,
          location: 'Unknown' // Would be populated by geolocation
        }],
        tags: [
          ...analysisResult.tags.map(tag => ({
            name: 'analysis_tag',
            value: tag,
            addedBy: 'system',
            timestamp: new Date()
          })),
          {
            name: 'pait_score',
            value: analysisResult.paitScore.toString(),
            addedBy: 'system',
            timestamp: new Date()
          },
          {
            name: 'confidence',
            value: (analysisResult.confidence * 100).toFixed(1) + '%',
            addedBy: 'system',
            timestamp: new Date()
          }
        ],
        lastModified: new Date()
      }

      setMetadata(newMetadata)
      
      // Save to localStorage (in production, this would go to a database)
      saveMetadataToStorage(newMetadata)
    }
  }, [imageFile, analysisResult, userType, isAuthenticated])

  const saveMetadataToStorage = (metadata: ImageMetadata) => {
    const existingMetadata = JSON.parse(localStorage.getItem('crella-image-metadata') || '[]')
    const updatedMetadata = [metadata, ...existingMetadata.filter((m: ImageMetadata) => m.id !== metadata.id)]
    localStorage.setItem('crella-image-metadata', JSON.stringify(updatedMetadata.slice(0, 100)))
  }

  const addInteraction = (type: ImageInteraction['type'], content: string, assistant?: string) => {
    if (!metadata) return

    const interaction: ImageInteraction = {
      id: Date.now().toString(),
      type,
      content,
      assistant,
      timestamp: new Date(),
      userType: isAuthenticated ? (userType || 'member') : 'guest',
      ipAddress: getClientIP()
    }

    const updatedMetadata = {
      ...metadata,
      interactions: [...metadata.interactions, interaction],
      lastModified: new Date()
    }

    setMetadata(updatedMetadata)
    saveMetadataToStorage(updatedMetadata)
  }

  const addCustomTag = (name: string, value: string) => {
    if (!metadata) return

    const tag: CustomTag = {
      name,
      value,
      addedBy: userType || 'user',
      timestamp: new Date()
    }

    const updatedMetadata = {
      ...metadata,
      tags: [...metadata.tags, tag],
      lastModified: new Date()
    }

    setMetadata(updatedMetadata)
    saveMetadataToStorage(updatedMetadata)
  }

  // Only show to staff or when metadata exists
  if (!metadata || (userType !== 'staff' && !isAuthenticated)) {
    return null
  }

  return (
    <>
      {/* Metadata Toggle Button */}
      <button
        onClick={() => setShowMetadata(!showMetadata)}
        className="fixed bottom-20 left-4 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg shadow-lg transition-all duration-200 flex items-center space-x-2 z-30"
      >
        <Database className="h-4 w-4" />
        <span className="text-sm font-medium">Metadata</span>
        {metadata.interactions.length > 0 && (
          <span className="bg-white text-indigo-600 text-xs px-2 py-1 rounded-full font-semibold">
            {metadata.interactions.length}
          </span>
        )}
      </button>

      {/* Metadata Panel */}
      {showMetadata && (
        <div className="fixed bottom-32 left-4 w-96 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-40 max-h-80 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <Tag className="h-5 w-5 text-indigo-600" />
              <span>Image Metadata</span>
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{metadata.originalName}</p>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <div>
                  <div className="font-medium">Uploaded</div>
                  <div className="text-gray-600 dark:text-gray-400">{metadata.uploadTime.toLocaleString()}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Database className="h-4 w-4 text-gray-500" />
                <div>
                  <div className="font-medium">Size</div>
                  <div className="text-gray-600 dark:text-gray-400">{(metadata.size / 1024).toFixed(1)} KB</div>
                </div>
              </div>
            </div>

            {/* Analysis Tags */}
            <div>
              <h4 className="font-medium mb-2 flex items-center space-x-2">
                <Tag className="h-4 w-4" />
                <span>Auto-Generated Tags</span>
              </h4>
              <div className="flex flex-wrap gap-1">
                {metadata.tags.filter(tag => tag.addedBy === 'system').map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 rounded text-xs font-medium"
                  >
                    {tag.name === 'analysis_tag' ? tag.value : `${tag.name}: ${tag.value}`}
                  </span>
                ))}
              </div>
            </div>

            {/* View Records */}
            <div>
              <h4 className="font-medium mb-2 flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>Views ({metadata.views.length})</span>
              </h4>
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {metadata.views.map((view, index) => (
                  <div key={index} className="flex items-center justify-between text-xs bg-gray-50 dark:bg-gray-700 p-2 rounded">
                    <div className="flex items-center space-x-2">
                      <User className="h-3 w-3" />
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        view.userType === 'staff' 
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      }`}>
                        {view.userType}
                      </span>
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      {view.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Interactions */}
            <div>
              <h4 className="font-medium mb-2 flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span>AI Interactions ({metadata.interactions.length})</span>
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {metadata.interactions.map((interaction) => (
                  <div key={interaction.id} className="bg-gray-50 dark:bg-gray-700 p-3 rounded text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium capitalize">{interaction.type.replace('_', ' ')}</span>
                      <span className="text-gray-500">{interaction.timestamp.toLocaleTimeString()}</span>
                    </div>
                    {interaction.assistant && (
                      <div className="text-indigo-600 dark:text-indigo-400 mb-1">
                        Assistant: {interaction.assistant}
                      </div>
                    )}
                    <div className="text-gray-700 dark:text-gray-300">
                      {interaction.content}
                    </div>
                  </div>
                ))}
                {metadata.interactions.length === 0 && (
                  <p className="text-gray-500 text-xs italic">No interactions yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Utility function to get client IP (simplified)
function getClientIP(): string {
  return `192.168.1.${Math.floor(Math.random() * 254) + 1}`
}

// Export function to add interactions from other components
export const useImageMetadata = () => {
  const addInteraction = (imageId: string, type: ImageInteraction['type'], content: string, assistant?: string) => {
    // This would integrate with the ImageMetadata component
    console.log('Adding interaction:', { imageId, type, content, assistant })
    
    // Add to interaction log
    const interaction = {
      id: Date.now().toString(),
      imageId,
      type,
      content,
      assistant,
      timestamp: new Date(),
      ipAddress: getClientIP()
    }
    
    const existingLog = JSON.parse(localStorage.getItem('crella-interactions-log') || '[]')
    existingLog.unshift(interaction)
    localStorage.setItem('crella-interactions-log', JSON.stringify(existingLog.slice(0, 500)))
  }

  return { addInteraction }
}
