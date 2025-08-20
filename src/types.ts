export interface AnalysisResult {
  id: string
  timestamp: Date
  images: any[]
  agents: Array<{
    id: string
    name: string
    type: 'jbot' | 'claudia' | 'kathy' | 'claire' | 'claude'
    status: 'idle' | 'thinking' | 'active' | 'complete'
    results?: any
  }>
  ocrText: string
  tags: string[]
  confidence: number
  paitScore: number
  metadata: {
    processingTime: number
    agentsUsed: number
    model: string
  }
}

export interface Comment {
  id: string
  text: string
  timestamp: Date
  author?: string
}
