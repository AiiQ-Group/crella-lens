import { Save, Trash2, Archive, Star } from 'lucide-react'
import { AnalysisResult } from '../types'

interface VaultActionsProps {
  result: AnalysisResult
  isAuthenticated: boolean
  userType: 'staff' | 'member' | null
  onSave: () => void
  onDiscard: () => void
}

export default function VaultActions({ result, isAuthenticated, userType, onSave, onDiscard }: VaultActionsProps) {
  if (!isAuthenticated) return null

  return (
    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center space-x-2">
          <img 
            src="/lens_vault.png" 
            alt="Vault" 
            className="w-5 h-5 object-contain"
          />
          <span>Private Vault</span>
          {userType === 'staff' && (
            <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-full text-xs font-medium">
              Staff
            </span>
          )}
        </h3>
      </div>

      <div className="space-y-4">
        {/* Analysis Summary */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">pAIt Score:</span>
              <span className="ml-2 font-semibold text-crella-600">{result.paitScore}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Tags:</span>
              <span className="ml-2 font-medium">{result.tags.join(', ')}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Confidence:</span>
              <span className="ml-2 font-medium">{(result.confidence * 100).toFixed(0)}%</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Size:</span>
              <span className="ml-2 font-medium">{result.metadata.imageSize}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onSave}
            className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
          >
            <Save className="h-5 w-5" />
            <span>Save to Vault</span>
          </button>

          <button
            onClick={onDiscard}
            className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
          >
            <Trash2 className="h-5 w-5" />
            <span>Discard</span>
          </button>
        </div>

        {/* Additional Staff Actions */}
        {userType === 'staff' && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Staff Actions:</p>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center space-x-2 py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm">
                <Star className="h-4 w-4" />
                <span>Mark Featured</span>
              </button>
              <button className="flex items-center justify-center space-x-2 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm">
                <Archive className="h-4 w-4" />
                <span>Archive</span>
              </button>
            </div>
          </div>
        )}

        {/* Save Status */}
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {userType === 'staff' ? 'Staff vault with admin privileges' : 'Member vault - your private trading analyses'}
          </p>
        </div>
      </div>
    </div>
  )
}
