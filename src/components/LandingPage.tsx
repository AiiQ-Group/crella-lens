import React, { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { 
  Sparkles, 
  Bot, 
  TrendingUp, 
  Shield, 
  Crown, 
  ArrowRight, 
  Play,
  CheckCircle,
  Star,
  Users,
  Home,
  BarChart3,
  Eye,
  Zap
} from 'lucide-react'

interface LandingPageProps {
  onJoinVIP: (email: string) => void
  onStartDemo: () => void
}

export function LandingPage({ onJoinVIP, onStartDemo }: LandingPageProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  
  const { scrollYProgress } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -100])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  const handleVIPSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsSubmitting(true)
    
    try {
      // In production, integrate with Airtable/Supabase webhook
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      onJoinVIP(email)
      setShowSuccess(true)
      setEmail('')
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000)
      
    } catch (error) {
      console.error('VIP signup error:', error)
      alert('Signup failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const agentProfiles = [
    {
      name: 'Claire',
      role: 'AI Concierge',
      color: 'from-purple-500 to-pink-600',
      icon: <Crown className="w-8 h-8" />,
      description: 'Your personal guide through complex AI analysis'
    },
    {
      name: 'JBot',
      role: 'Trading Specialist',
      color: 'from-green-500 to-emerald-600',
      icon: <TrendingUp className="w-8 h-8" />,
      description: 'Expert options analysis and risk management'
    },
    {
      name: 'Claudia',
      role: 'Legal Research',
      color: 'from-orange-500 to-red-600',
      icon: <Shield className="w-8 h-8" />,
      description: 'Property records and legal document analysis'
    },
    {
      name: 'Kathy',
      role: 'Media Analyst',
      color: 'from-yellow-500 to-orange-600',
      icon: <Eye className="w-8 h-8" />,
      description: 'Video verification and digital forensics'
    }
  ]

  const features = [
    {
      title: 'Multi-Agent Orchestration',
      description: 'Multiple AI specialists working together seamlessly',
      icon: <Bot className="w-12 h-12 text-blue-400" />,
      benefits: ['Specialized expertise', 'Coordinated analysis', 'Transparent process']
    },
    {
      title: 'Real Estate Intelligence',
      description: 'Austin property data with county record integration',
      icon: <Home className="w-12 h-12 text-green-400" />,
      benefits: ['Travis County data', 'SWOT analysis', 'Investment tagging']
    },
    {
      title: 'Secure Vault Storage',
      description: 'Cryptographically sealed analysis with audit trails',
      icon: <Shield className="w-12 h-12 text-purple-400" />,
      benefits: ['Blockchain verification', 'Complete privacy', 'Audit ready']
    },
    {
      title: 'pAIt™ Intelligence Scoring',
      description: 'Chess-style ratings for strategic decision making',
      icon: <BarChart3 className="w-12 h-12 text-yellow-400" />,
      benefits: ['1200-3000+ scale', 'Multi-dimensional', 'Confidence scoring']
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Hero Section */}
      <motion.section 
        className="relative min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-64 h-64 rounded-full"
              style={{
                background: `linear-gradient(45deg, ${
                  ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'][i]
                }20, transparent)`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, 100, 0],
                y: [0, -100, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 20 + i * 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Logo */}
          <motion.div 
            className="mb-8"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, type: "spring" }}
          >
            <div className="inline-flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center animate-pulse">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-6xl md:text-8xl font-bold">
                <span className="crella-font bg-gradient-to-r from-purple-400 via-blue-400 to-teal-400 bg-clip-text text-transparent">
                  Crella
                </span>
              </h1>
            </div>
          </motion.div>

          {/* Tagline */}
          <motion.h2 
            className="text-2xl md:text-4xl font-light mb-8 text-gray-300"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            AI-Powered Visual Intelligence Platform
          </motion.h2>

          <motion.p 
            className="text-lg md:text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            Transform images into scored strategic insights with multi-agent AI orchestration. 
            Real estate analysis, trading intelligence, and digital forensics—all powered by pAIt™ scoring.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 1 }}
          >
            <button
              onClick={onStartDemo}
              className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 flex items-center"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Demo
            </button>
            
            <button
              onClick={() => document.getElementById('vip-signup')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center"
            >
              <Crown className="w-5 h-5 mr-2" />
              Join VIP Beta
            </button>
          </motion.div>

          {/* Beta Badge */}
          <motion.div 
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            <span className="inline-flex items-center px-6 py-2 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-300 text-sm">
              <Star className="w-4 h-4 mr-2" />
              Austin Real Estate Beta • Paul's HNW Network
            </span>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Beyond Traditional AI
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              While others offer single AI models, we orchestrate teams of specialists. 
              It's the difference between consulting one expert and convening your entire advisory board.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">{feature.title}</h3>
                <p className="text-gray-400 text-center mb-4">{feature.description}</p>
                <div className="space-y-2">
                  {feature.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center text-sm text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                      {benefit}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Agent Profiles Section */}
      <section className="py-24 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Meet Your AI Team
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Each agent specializes in different domains, working together under Claire's orchestration 
              to deliver comprehensive intelligence analysis.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {agentProfiles.map((agent, index) => (
              <motion.div
                key={agent.name}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className={`w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br ${agent.color} flex items-center justify-center text-white shadow-2xl animate-pulse`}>
                  {agent.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-2">{agent.name}</h3>
                <p className="text-purple-400 mb-4">{agent.role}</p>
                <p className="text-gray-400 text-sm">{agent.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* VIP Signup Section */}
      <section id="vip-signup" className="py-24 px-4 bg-gradient-to-br from-purple-900/20 to-blue-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Join the VIP Beta
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Be among the first to experience multi-agent AI orchestration. 
              Exclusive access for Paul's high-net-worth network and Austin real estate professionals.
            </p>

            {showSuccess ? (
              <motion.div
                className="bg-green-500/20 border border-green-500/30 rounded-2xl p-8"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" }}
              >
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-green-400 mb-2">Welcome to VIP!</h3>
                <p className="text-green-300">You'll receive exclusive early access and demo invitations.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleVIPSignup} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email for VIP access"
                    required
                    className="flex-1 bg-gray-800/50 border border-gray-600 rounded-2xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <Zap className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Join VIP
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-gray-400">
              <div className="flex items-center justify-center">
                <Users className="w-5 h-5 mr-2 text-purple-400" />
                Exclusive HNW Network
              </div>
              <div className="flex items-center justify-center">
                <Crown className="w-5 h-5 mr-2 text-yellow-400" />
                Early Access Features
              </div>
              <div className="flex items-center justify-center">
                <Shield className="w-5 h-5 mr-2 text-blue-400" />
                Premium Support
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900/50 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center items-center mb-6">
            <img 
              src="/logo-icon-main.png" 
              alt="AiiQ Group" 
              className="w-8 h-8 mr-3 opacity-80"
            />
            <h3 className="text-xl font-semibold">AiiQ Group</h3>
          </div>
          
          <p className="text-gray-400 mb-6">
            pAIt™ is founded and created by AiiQ Group and its core LLM model partners
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-gray-500 mb-6">
            <span>San Antonio, TX (HQ)</span>
            <span>•</span>
            <span>Cebu, Philippines (Dev)</span>
            <span>•</span>
            <span>Las Vegas, NV (Marketing)</span>
            <span>•</span>
            <span>Toronto, Canada (Tech)</span>
            <span>•</span>
            <span>New York, NY (Data)</span>
          </div>
          
          <a 
            href="mailto:hq@aiiq.group" 
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            hq@aiiq.group
          </a>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
