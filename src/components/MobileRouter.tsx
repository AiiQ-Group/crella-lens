import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import LandingPage from './LandingPage'
import UploadScreen from './screens/UploadScreen'
import AnalyzeScreen from './screens/AnalyzeScreen'
import ResultsScreen from './screens/ResultsScreen'
import VaultScreen from './screens/VaultScreen'
import CompareScreen from './screens/CompareScreen'
import MobileDashboard from './screens/MobileDashboard'
import LoginScreen from './screens/LoginScreen'
import MobileNavigation from './MobileNavigation'
import IntelligentAssistant from './IntelligentAssistant'
import { AnalysisResult } from '../types'

interface MobileRouterProps {
  isDark: boolean
  toggleDarkMode: () => void
}

export interface AppState {
  user: {
    type: 'guest' | 'member' | 'staff'
    email?: string
    isAuthenticated: boolean
    tokens: number
    dailyUsage: number
  }
  currentAnalysis?: AnalysisResult
  vaultItems: any[]
  uploadedImages: File[]
  waitingForIntent: boolean
  selectedIntent: {
    id: string
    title: string
    description: string
    agents: string[]
    reasoning: string
  } | null
}

export function MobileRouter({ isDark, toggleDarkMode }: MobileRouterProps) {
  // Global app state
  const [appState, setAppState] = useState<AppState>({
    user: {
      type: 'guest',
      isAuthenticated: false,
      tokens: 10,
      dailyUsage: 0
    },
    vaultItems: [],
    uploadedImages: [],
    waitingForIntent: false,
    selectedIntent: null
  })

  const [showLanding, setShowLanding] = useState(true)

  // Handle VIP signup from landing page
  const handleVIPSignup = async (email: string) => {
    console.log('VIP signup:', email)
    
    // In production, send to Airtable/Supabase webhook
    try {
      // Mock webhook call
      const response = await fetch('/api/vip-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, timestamp: new Date().toISOString() })
      })
      
      console.log('VIP signup successful')
    } catch (error) {
      console.log('VIP signup mock - would integrate with webhook')
    }
  }

  // Handle demo start from landing page
  const handleStartDemo = () => {
    setShowLanding(false)
    // Will navigate to /upload
  }

  // Update app state helper
  const updateAppState = (updates: Partial<AppState>) => {
    setAppState(prev => ({ ...prev, ...updates }))
  }

  // Page transition animations
  const pageVariants = {
    initial: { opacity: 0, x: 100 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -100 }
  }

  const pageTransition = {
    type: "tween" as const,
    ease: "anticipate" as const,
    duration: 0.4
  }

  if (showLanding) {
    return (
      <LandingPage 
        onJoinVIP={handleVIPSignup}
        onStartDemo={handleStartDemo}
      />
    )
  }

  return (
    <Router>
      <div className={`min-h-screen ${isDark ? 'dark' : ''} bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
        {/* Mobile Navigation */}
        <MobileNavigation 
          appState={appState}
          toggleDarkMode={toggleDarkMode}
          onReturnToLanding={() => setShowLanding(true)}
        />

        {/* Animated Routes */}
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Navigate to="/upload" replace />} />
            
            <Route 
              path="/upload" 
              element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <UploadScreen 
                    appState={appState}
                    updateAppState={updateAppState}
                  />
                </motion.div>
              } 
            />
            
            <Route 
              path="/analyze" 
              element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <AnalyzeScreen 
                    appState={appState}
                    updateAppState={updateAppState}
                  />
                </motion.div>
              } 
            />
            
            <Route 
              path="/results" 
              element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <ResultsScreen 
                    appState={appState}
                    updateAppState={updateAppState}
                  />
                </motion.div>
              } 
            />
            
            <Route 
              path="/vault" 
              element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <VaultScreen 
                    appState={appState}
                    updateAppState={updateAppState}
                  />
                </motion.div>
              } 
            />
            
            <Route 
              path="/compare" 
              element={
                appState.user.type === 'guest' ? (
                  <Navigate to="/upload" replace />
                ) : (
                  <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                  >
                    <CompareScreen 
                      appState={appState}
                      updateAppState={updateAppState}
                    />
                  </motion.div>
                )
              } 
            />
            
            <Route 
              path="/dashboard" 
              element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <MobileDashboard 
                    appState={appState}
                    updateAppState={updateAppState}
                  />
                </motion.div>
              } 
            />
            
            <Route 
              path="/login" 
              element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <LoginScreen 
                    appState={appState}
                    updateAppState={updateAppState}
                  />
                </motion.div>
              } 
            />
          </Routes>
        </AnimatePresence>

        {/* Claire - Floating on all pages */}
        <IntelligentAssistant 
          isAuthenticated={appState.user.isAuthenticated}
          userType={appState.user.type === 'guest' ? null : appState.user.type}
          analysisResult={appState.currentAnalysis}
        />
      </div>
    </Router>
  )
}

export default MobileRouter
