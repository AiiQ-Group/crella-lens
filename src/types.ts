export interface AnalysisResult {
  ocrText: string
  tags: string[]
  confidence: number
  paitScore: number
  metadata: {
    imageSize: string
    processingTime: string
    language: string
  }
}

export interface Comment {
  id: string
  text: string
  timestamp: Date
  author?: string
}
