import { useState } from 'react'
import { X, Shield, Users, Key, Lock } from 'lucide-react'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (userType: 'staff' | 'member', code: string) => void
}

export default function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [loginType, setLoginType] = useState<'staff' | 'member'>('member')
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) {
      setError('Please enter your access code')
      return
    }

    setIsLoading(true)
    setError('')

    // Simulate authentication
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      onLogin(loginType, code)
      onClose()
      setCode('')
    } catch (err) {
      setError('Invalid access code')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <img 
              src="/lens_vault.png" 
              alt="Vault" 
              className="w-6 h-6 object-contain"
            />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Private Vault Access
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Access Type Selection */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
              Access Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLoginType('member')}
                className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center space-y-2 ${
                  loginType === 'member'
                    ? 'border-crella-500 bg-crella-50 dark:bg-crella-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <Users className="h-6 w-6 text-crella-600" />
                <div className="text-center">
                  <div className="font-medium text-gray-900 dark:text-white">Member</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Trading Strategies</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setLoginType('staff')}
                className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center space-y-2 ${
                  loginType === 'staff'
                    ? 'border-crella-500 bg-crella-50 dark:bg-crella-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <Key className="h-6 w-6 text-crella-600" />
                <div className="text-center">
                  <div className="font-medium text-gray-900 dark:text-white">Staff</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Admin Access</div>
                </div>
              </button>
            </div>
          </div>

          {/* Access Code Input */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              {loginType === 'staff' ? 'Staff Code' : 'Member Strategy Code'}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={loginType === 'staff' ? 'Enter staff access code' : 'Enter member strategy code'}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-crella-500 focus:border-transparent"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-crella-600 hover:bg-crella-700 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Shield className="h-5 w-5" />
                <span>Access Private Vault</span>
              </>
            )}
          </button>

          {/* Demo Codes */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Demo Access Code:</p>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Both Member & Staff:</span>
                <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">crella123</code>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
