import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Upload, 
  BarChart3, 
  Archive, 
  Crown, 
  Home, 
  Menu, 
  X, 
  Settings,
  Moon,
  Sun,
  Sparkles,
  TrendingUp,
  LogOut
} from 'lucide-react'
import { AppState } from './MobileRouter'

interface MobileNavigationProps {
  appState: AppState
  toggleDarkMode: () => void
  onReturnToLanding: () => void
}

export function MobileNavigation({ appState, toggleDarkMode, onReturnToLanding }: MobileNavigationProps) {
  const [showMenu, setShowMenu] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = [
    { path: '/upload', icon: Upload, label: 'Upload', color: 'text-blue-400' },
    { path: '/analyze', icon: BarChart3, label: 'Analyze', color: 'text-purple-400' },
    { path: '/results', icon: TrendingUp, label: 'Results', color: 'text-green-400' },
    { path: '/vault', icon: Archive, label: 'Vault', color: 'text-orange-400' },
    { path: '/dashboard', icon: Home, label: 'Dashboard', color: 'text-pink-400' }
  ]

  // Only show Compare for VIP users
  if (appState.user.type !== 'guest') {
    navItems.splice(4, 0, { 
      path: '/compare', 
      icon: Crown, 
      label: 'Compare', 
      color: 'text-yellow-400' 
    })
  }

  const getCurrentPageTitle = () => {
    const currentItem = navItems.find(item => item.path === location.pathname)
    return currentItem?.label || 'Crella Mobile'
  }

  const handleTokensClick = () => {
    if (appState.user.type === 'guest') {
      navigate('/login')
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <>
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between px-4 h-16">
          {/* Menu Toggle */}
          <button
            onClick={() => setShowMenu(true)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Crella Logo and Title */}
          <div className="flex items-center space-x-2">
            <img 
              src="/logo-icon-main.png" 
              alt="Crella" 
              className="w-6 h-6"
            />
            <h1 className="font-semibold text-lg crella-font">
              <span className="text-indigo-500">C</span>rella
            </h1>
          </div>

          {/* Token Counter */}
          <button
            onClick={handleTokensClick}
            className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-full text-sm font-medium hover:from-purple-500/30 hover:to-blue-500/30 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>{appState.user.tokens}</span>
          </button>
        </div>
      </header>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-around px-4 py-2">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-all relative"
              >
                <div className={`relative ${isActive ? item.color : 'text-gray-400'} transition-colors`}>
                  <Icon className="w-6 h-6" />
                  {isActive && (
                    <motion.div
                      className="absolute -inset-2 bg-current rounded-full opacity-20"
                      layoutId="bottomNavIndicator"
                      initial={false}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </div>
                <span className={`text-xs ${isActive ? 'font-medium' : 'text-gray-500'}`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Side Menu Overlay */}
      {showMenu && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowMenu(false)}
        >
          {/* Side Menu */}
          <motion.div
            className="fixed left-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-900 shadow-2xl"
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Menu Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <img 
                    src="/logo-icon-main.png" 
                    alt="Crella" 
                    className="w-6 h-6"
                  />
                </div>
                <div>
                  <h2 className="font-semibold text-lg crella-font">
                    <span className="text-indigo-500">C</span>rella Mobile
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {appState.user.type.toUpperCase()} {appState.user.isAuthenticated ? 'Member' : 'Access'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowMenu(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="p-6 space-y-4">
              {/* Main Navigation */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Navigation
                </h3>
                <div className="space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = location.pathname === item.path
                    
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setShowMenu(false)}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${
                          isActive 
                            ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                        {item.path === '/compare' && appState.user.type === 'guest' && (
                          <Crown className="w-4 h-4 text-yellow-500" />
                        )}
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Settings */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Settings
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      toggleDarkMode()
                      setShowMenu(false)
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
                  >
                    <Moon className="w-5 h-5 dark:hidden" />
                    <Sun className="w-5 h-5 hidden dark:block" />
                    <span className="font-medium">
                      <span className="dark:hidden">Dark Mode</span>
                      <span className="hidden dark:inline">Light Mode</span>
                    </span>
                  </button>

                  {!appState.user.isAuthenticated ? (
                    <Link
                      to="/login"
                      onClick={() => setShowMenu(false)}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
                    >
                      <Crown className="w-5 h-5" />
                      <span className="font-medium">Login / Upgrade</span>
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        // Handle logout
                        setShowMenu(false)
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Logout</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Return to Landing */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={onReturnToLanding}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-medium py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Return to Landing
                </button>
              </div>
            </div>

            {/* User Stats */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gray-50 dark:bg-gray-800/50">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {appState.user.tokens}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Tokens</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {appState.user.dailyUsage}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Today</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}

export default MobileNavigation
