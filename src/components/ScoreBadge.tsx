import { Brain, TrendingUp } from 'lucide-react'

interface ScoreBadgeProps {
  score: number
  confidence: number
}

export default function ScoreBadge({ score, confidence }: ScoreBadgeProps) {
  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-green-600 dark:text-green-400'
    if (score >= 3) return 'text-yellow-600 dark:text-yellow-400'
    if (score >= 2) return 'text-orange-600 dark:text-orange-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 4) return 'Excellent'
    if (score >= 3) return 'Good'
    if (score >= 2) return 'Fair'
    return 'Poor'
  }

  return (
    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center space-x-2">
          <Brain className="h-5 w-5 text-crella-600" />
          <span>pAIt Score</span>
        </h3>
        <TrendingUp className="h-5 w-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        <div className="text-center">
          <div className={`text-4xl font-bold ${getScoreColor(score)}`}>
            {score.toFixed(2)}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {getScoreLabel(score)}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Confidence</span>
            <span className="font-medium">{(confidence * 100).toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-crella-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${confidence * 100}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
            <div className="font-semibold text-red-600 dark:text-red-400">0-2</div>
            <div className="text-gray-500">Poor</div>
          </div>
          <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
            <div className="font-semibold text-yellow-600 dark:text-yellow-400">2-4</div>
            <div className="text-gray-500">Good</div>
          </div>
          <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
            <div className="font-semibold text-green-600 dark:text-green-400">4+</div>
            <div className="text-gray-500">Excellent</div>
          </div>
        </div>
      </div>
    </div>
  )
}
