import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Crown, 
  Users, 
  Shield, 
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle,
  ArrowRight
} from 'lucide-react'
import { AppState } from '../MobileRouter'

interface LoginScreenProps {
  appState: AppState
  updateAppState: (updates: Partial<AppState>) => void
}

export function LoginScreen({ appState, updateAppState }: LoginScreenProps) {
  const [loginMode, setLoginMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const navigate = useNavigate()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return

    setIsProcessing(true)

    // Simulate authentication
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Demo login logic
    let userType: 'guest' | 'member' | 'staff' = 'guest'
    
    if (password === 'crella123') {
      if (email.includes('staff') || email.includes('admin')) {
        userType = 'staff'
      } else {
        userType = 'member'
      }
    }

    updateAppState({
      user: {
        ...appState.user,
        type: userType,
        email: email,
        isAuthenticated: userType !== 'guest',
        tokens: userType === 'staff' ? 999999 : userType === 'member' ? 1000 : 10
      }
    })

    setIsProcessing(false)
    navigate('/dashboard')
  }

  const tiers = [
    {
      id: 'guest',
      name: 'Guest',
      icon: <Users className="w-8 h-8" />,
      color: 'from-gray-500 to-gray-600',
      price: 'Free',
      features: [
        '10 tokens per day',
        'Claire chat only',
        'Basic analysis',
        'No vault storage'
      ]
    },
    {
      id: 'vip',
      name: 'VIP Member',
      icon: <Crown className="w-8 h-8" />,
      color: 'from-yellow-500 to-orange-600',
      price: '$99/month',
      features: [
        'Unlimited tokens',
        'Multi-agent orchestration',
        'Private vault storage',
        'Real estate beta access',
        'Premium support'
      ]
    },
    {
      id: 'staff',
      name: 'Staff',
      icon: <Shield className="w-8 h-8" />,
      color: 'from-purple-500 to-indigo-600',
      price: 'Enterprise',
      features: [
        'All VIP features',
        'Admin dashboard',
        'System monitoring',
        'User management',
        'Analytics access'
      ]
    }
  ]

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
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to <span className="crella-font">Crella</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {loginMode === 'login' ? 'Sign in to your account' : 'Create your VIP account'}
          </p>
        </motion.div>

        {/* Auth Form */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 shadow-lg border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {loginMode === 'login' && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  <strong>Demo Access:</strong> Use password "crella123" for VIP access, or any email with "staff" for admin access.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isProcessing || !email || !password}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
              ) : (
                <>
                  <span>{loginMode === 'login' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => setLoginMode(loginMode === 'login' ? 'signup' : 'login')}
              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-medium"
            >
              {loginMode === 'login' 
                ? "Don't have an account? Sign up" 
                : 'Already have an account? Sign in'
              }
            </button>
          </div>
        </motion.div>

        {/* Pricing Tiers */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-4">
            Choose Your Access Level
          </h2>

          {tiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              className={`bg-gradient-to-r ${tier.color} p-[1px] rounded-2xl`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`bg-gradient-to-br ${tier.color} rounded-full p-3 text-white`}>
                    {tier.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {tier.name}
                    </h3>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {tier.price}
                    </p>
                  </div>
                  {tier.id === 'vip' && (
                    <div className="ml-auto">
                      <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs font-medium px-2 py-1 rounded-full">
                        POPULAR
                      </span>
                    </div>
                  )}
                </div>

                <ul className="space-y-2">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div
          className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <p>
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
          <p className="mt-2">
            🔒 Your data is encrypted and secure with AiiQ Group.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default LoginScreen
