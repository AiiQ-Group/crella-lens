import React, { useState, useEffect } from 'react'
import './styles/floating-vault.css'
import './styles/crella-font.css'
import './index.css'
import MobileRouter from './components/MobileRouter'

function MobileApp() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    // Apply dark mode to document
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  const toggleDarkMode = () => {
    setIsDark(!isDark)
  }

  return (
    <div className={`${isDark ? 'dark' : ''} transition-colors duration-300`}>
      <MobileRouter 
        isDark={isDark}
        toggleDarkMode={toggleDarkMode}
      />
    </div>
  )
}

export default MobileApp
