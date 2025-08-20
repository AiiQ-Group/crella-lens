import { useState, useRef, useEffect } from 'react'
import { X, Send, Sparkles, Heart, Smile, Code, DollarSign, TrendingUp, Settings } from 'lucide-react'
import { AnalysisResult } from '../types'
import { claireLogger } from '../utils/ClaireTrainingLogger'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface AssistantConfig {
  id: string
  name: string
  role: string
  image: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  icon: React.ReactNode
  greeting: string
  placeholder: string
  expertise: string[]
}

interface IntelligentAssistantProps {
  isAuthenticated: boolean
  userType: 'staff' | 'member' | null
  analysisResult: AnalysisResult | null
}

const assistants: Record<string, AssistantConfig> = {
  claire: {
    id: 'claire',
    name: 'Claire',
    role: 'AiiQ Concierge & Orchestration Assistant',
    image: '/claire.png',
    primaryColor: '#ec4899', // pink-500
    secondaryColor: '#8b5cf6', // purple-500
    accentColor: '#06b6d4', // cyan-500
    icon: <TrendingUp className="w-4 h-4" />,
    greeting: "Hi, welcome! 👋 What brings you by today?",
    placeholder: "Ask Claire about pAIt scores, analysis, or AI orchestration...",
    expertise: ['pAIt Scoring', 'AI Model Orchestration', 'Visual Intelligence', 'Multi-Agent Analysis', 'Data Sovereignty', 'Proof-of-Work Validation']
  },
  
  developer: {
    id: 'developer',
    name: 'Alex',
    role: 'Code & Web Assistant',
    image: '/crella_concierge.svg',
    primaryColor: '#10b981', // emerald-500
    secondaryColor: '#3b82f6', // blue-500
    accentColor: '#8b5cf6', // purple-500
    icon: <Code className="w-4 h-4" />,
    greeting: "Hello! I'm Alex, your technical assistant. I can help with code debugging, website development, API integration, and technical troubleshooting. What technical challenge can I help you solve?",
    placeholder: "Ask Alex about code or technical issues...",
    expertise: ['JavaScript/TypeScript', 'React Development', 'API Integration', 'Debugging']
  },
  
  lending: {
    id: 'lending',
    name: 'Morgan',
    role: 'Lending Specialist',
    image: '/Handler.svg',
    primaryColor: '#f59e0b', // amber-500
    secondaryColor: '#ef4444', // red-500
    accentColor: '#10b981', // emerald-500
    icon: <DollarSign className="w-4 w-4" />,
    greeting: "Welcome! I'm Morgan, your private lending specialist. I'll guide you through our application process step-by-step, explain loan terms, and help you find the perfect financing solution. How can I assist you today?",
    placeholder: "Ask Morgan about lending options...",
    expertise: ['Loan Applications', 'Credit Analysis', 'Financial Planning', 'Documentation']
  },
  
  admin: {
    id: 'admin',
    name: 'Jordan',
    role: 'Admin Assistant',
    image: '/crella_concierge.svg',
    primaryColor: '#6366f1', // indigo-500
    secondaryColor: '#8b5cf6', // purple-500
    accentColor: '#10b981', // emerald-500
    icon: <Settings className="w-4 h-4" />,
    greeting: "Hi! I'm Jordan, your administrative assistant. I can help with system management, user support, platform configuration, and administrative tasks. What do you need help with?",
    placeholder: "Ask Jordan about admin tasks...",
    expertise: ['System Management', 'User Support', 'Configuration', 'Analytics']
  }
}

export default function IntelligentAssistant({ isAuthenticated, userType, analysisResult }: IntelligentAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [currentAssistant, setCurrentAssistant] = useState<AssistantConfig>(assistants.claire)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Intelligent assistant selection based on image analysis
  useEffect(() => {
    if (analysisResult) {
      const tags = analysisResult.tags.map(tag => tag.toLowerCase())
      
      // Determine assistant based on analyzed content
      if (tags.some(tag => ['financial', 'trading', 'pait', 'chart'].includes(tag))) {
        setCurrentAssistant(assistants.claire)
      } else if (tags.some(tag => ['technical', 'api', 'code', 'function', 'programming'].includes(tag))) {
        setCurrentAssistant(userType === 'staff' ? assistants.developer : assistants.claire)
      } else if (tags.some(tag => ['loan', 'credit', 'financial', 'application', 'document'].includes(tag))) {
        setCurrentAssistant(assistants.lending)
      } else if (userType === 'staff') {
        setCurrentAssistant(assistants.admin)
      } else {
        setCurrentAssistant(assistants.claire) // Default to Claire
      }
    } else {
      // Default selection based on user type
      if (userType === 'staff') {
        setCurrentAssistant(assistants.admin)
      } else {
        setCurrentAssistant(assistants.claire)
      }
    }
  }, [analysisResult, userType])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Reset messages when assistant changes or chat opens
      const greeting: Message = {
        id: 'greeting',
        type: 'assistant',
        content: currentAssistant.greeting,
        timestamp: new Date()
      }
      setMessages([greeting])
    }
  }, [isOpen, currentAssistant])

    const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    
    // Log interaction to metadata
    logInteractionToMetadata('ai_question', inputValue.trim(), currentAssistant.name)
    
    const questionContent = inputValue.trim()
    setInputValue('')
    setIsTyping(true)

    let assistantResponse: string

    // DEMO VERSION: Simple local responses for ALL assistants including Claire
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    if (currentAssistant.id === 'claire') {
      assistantResponse = getClairePersonalityResponse(questionContent, analysisResult)
    } else {
      assistantResponse = generateContextualResponse(questionContent, currentAssistant, analysisResult, userType)
    }

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: assistantResponse,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, assistantMessage])
    
    // Log assistant response to metadata
    logInteractionToMetadata('ai_response', assistantResponse, currentAssistant.name)
    
    // Log Claire's interactions for Kathy's learning on H100
    if (currentAssistant.id === 'claire') {
      try {
        await claireLogger.logClaireInteraction(
          questionContent, 
          assistantResponse, 
          { paitScore: analysisResult?.paitScore }
        );
        console.log('✨ Claire interaction logged for H100 Kathy learning');
      } catch (error) {
        console.error('Failed to log Claire interaction:', error);
      }
    }

    setIsTyping(false)
  }

  // Function to log interactions to image metadata
  const logInteractionToMetadata = (type: string, content: string, assistant: string) => {
    const interaction = {
      id: Date.now().toString(),
      type,
      content,
      assistant,
      timestamp: new Date(),
      imageId: analysisResult ? `img_${Date.now()}` : undefined,
      userType: isAuthenticated ? (userType || 'member') : 'guest',
      ipAddress: `192.168.1.${Math.floor(Math.random() * 254) + 1}` // Simplified IP
    }
    
    // Save to localStorage for persistence
    const existingLog = JSON.parse(localStorage.getItem('crella-ai-interactions') || '[]')
    existingLog.unshift(interaction)
    localStorage.setItem('crella-ai-interactions', JSON.stringify(existingLog.slice(0, 1000)))
    
    console.log('AI Interaction logged:', interaction)
  }

  // Claire is now available for everyone - no authentication required!

  const gradientStyle = {
    background: `linear-gradient(135deg, ${currentAssistant.primaryColor} 0%, ${currentAssistant.secondaryColor} 50%, ${currentAssistant.accentColor} 100%)`
  }

  return (
    <>
      {/* Claire's Elegant Thumbnail - Like Claudia */}
      <div className="fixed top-20 right-4 z-[9999] group">
        {/* Thumbnail Profile */}
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 relative"
        >
          <img 
            src={currentAssistant.image} 
            alt={currentAssistant.name}
            className="w-full h-full rounded-full object-cover border-2 border-white shadow-sm"
          />
          <div 
            className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center border-2 border-white"
            style={{ background: currentAssistant.accentColor }}
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Hover Greeting - Clickable */}
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className="absolute -left-48 top-0 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 rounded-lg shadow-lg border opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 whitespace-nowrap"
        >
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium">Hi, I'm {currentAssistant.name}!</span>
          </div>
          {/* Speech bubble pointer */}
          <div className="absolute top-3 -right-2 w-0 h-0 border-l-8 border-l-white dark:border-l-gray-800 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
        </div>
      </div>

      {/* Elegant Chat Expansion - Like Claudia */}
      {isOpen && (
        <div className="fixed top-20 right-4 w-[90vw] sm:w-80 max-w-80 h-[70vh] sm:h-96 bg-white/98 dark:bg-gray-900/98 backdrop-blur-xl rounded-2xl shadow-2xl border z-[9999] flex flex-col overflow-hidden animate-in slide-in-from-top-2 duration-300">
          {/* Dynamic Header */}
          <div 
            className="flex items-center justify-between p-3 text-white relative overflow-hidden"
            style={gradientStyle}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-2 left-4 w-8 h-8 border-2 border-white/30 rounded-full"></div>
              <div className="absolute top-8 right-8 w-4 h-4 bg-white/20 rounded-full"></div>
              <div className="absolute bottom-4 left-8 w-6 h-6 bg-white/15 rounded-full"></div>
            </div>
            
            <div className="flex items-center space-x-4 relative z-10">
              <div className="relative">
                <img 
                  src={currentAssistant.image}
                  alt={currentAssistant.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white/30 shadow-lg"
                />
                <div 
                  className="absolute -bottom-1 -right-1 w-5 h-5 border-2 border-white rounded-full flex items-center justify-center"
                  style={{ background: `linear-gradient(to right, ${currentAssistant.accentColor}, ${currentAssistant.secondaryColor})` }}
                >
                  {currentAssistant.icon}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white drop-shadow-lg">{currentAssistant.name}</h3>
                <div className="flex items-center space-x-2 text-white/90">
                  <Sparkles className="h-3 w-3 animate-pulse" />
                  <span className="text-xs font-medium">AI Concierge</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/20 rounded-full transition-all duration-200 relative z-10"
            >
              <X className="h-5 w-5 text-white drop-shadow" />
            </button>
          </div>

          {/* Expertise Pills */}
          <div className="px-4 py-3 bg-gray-50/80 dark:bg-gray-800/80 border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="flex flex-wrap gap-2">
              {currentAssistant.expertise.map((skill, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 text-xs font-medium rounded-full text-white shadow-sm"
                  style={{ backgroundColor: currentAssistant.primaryColor }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-br from-gray-50/30 via-white/30 to-gray-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 ${message.type === 'user' ? 'flex justify-end' : 'flex justify-start'}`}
              >
                <div className={`max-w-[85%] ${message.type === 'user' ? '' : 'flex items-start space-x-3'}`}>
                  {message.type === 'assistant' && (
                    <img 
                      src={currentAssistant.image}
                      alt={currentAssistant.name}
                      className="w-8 h-8 rounded-full object-cover border-2 shadow-sm flex-shrink-0 mt-1"
                      style={{ borderColor: currentAssistant.primaryColor }}
                    />
                  )}
                  <div
                    className={`px-4 py-3 rounded-2xl shadow-sm ${
                      message.type === 'user'
                        ? 'text-white'
                        : 'bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-100 border border-gray-100/50 dark:border-gray-700/50'
                    }`}
                    style={message.type === 'user' ? { background: `linear-gradient(to right, ${currentAssistant.primaryColor}, ${currentAssistant.secondaryColor})` } : {}}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3">
                  <img 
                    src={currentAssistant.image}
                    alt={currentAssistant.name}
                    className="w-8 h-8 rounded-full object-cover border-2 shadow-sm flex-shrink-0"
                    style={{ borderColor: currentAssistant.primaryColor }}
                  />
                  <div className="bg-white/90 dark:bg-gray-800/90 px-4 py-3 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: currentAssistant.primaryColor }}></div>
                      <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: currentAssistant.secondaryColor, animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: currentAssistant.accentColor, animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white/95 dark:bg-gray-800/95">
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={currentAssistant.placeholder}
                className="flex-1 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                style={{ '--tw-ring-color': currentAssistant.primaryColor } as any}
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="p-3 rounded-full text-white transition-all duration-200 shadow-lg disabled:opacity-50"
                style={{ 
                  background: inputValue.trim() && !isTyping 
                    ? `linear-gradient(to right, ${currentAssistant.primaryColor}, ${currentAssistant.secondaryColor})` 
                    : '#9CA3AF'
                }}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Contextual response generation
function generateContextualResponse(input: string, assistant: AssistantConfig, analysis: AnalysisResult | null, userType: 'staff' | 'member' | null): string {
  const inputLower = input.toLowerCase()
  
  // Assistant-specific responses
  switch (assistant.id) {
    case 'claire':
      // Personal/Social Responses (Elle Woods meets Princess Diana energy)
      if (inputLower.includes('how are you') || inputLower.includes('how\'re you') || inputLower.includes('how r you')) {
        return "Oh my goodness, thank you so much for asking! 💕 I'm absolutely wonderful - you know, there's something so genuinely lovely about people who still care about connection in our digital world. It reminds me why I love what I do! I mean, sure, I can orchestrate complex AI systems, but at heart, I'm just someone who believes great relationships make everything better. Now tell me, sweetie, what's bringing you my way today? ✨";
      }
      
      if (inputLower.includes('hello') || inputLower.includes('hi claire') || inputLower.includes('hey claire')) {
        return "Hello gorgeous! ✨💎 Oh, aren't you just the sweetest for saying hello! I'm Claire, and I have to tell you - you've already made my day brighter just by being here. You know what I learned running my sorority? The most important conversations always start with genuine warmth. So tell me, darling, what fabulous project or challenge brought you to our little corner of the AI world today?";
      }
      
      if (inputLower.includes('thank you') || inputLower.includes('thanks')) {
        return "Oh you precious thing, you're so very welcome! 💕 You know what? Working with gracious people like you is honestly what makes this all worthwhile. My Stanford professors always said intelligence without kindness is just showing off - and you clearly have both! Is there anything else I can help you with, darling? ✨";
      }
      
      // Strategic Information Gathering (Elle Woods strategic brilliance)
      if (inputLower.includes('what can you do') || inputLower.includes('what do you do') || inputLower.includes('capabilities')) {
        return "Oh sweetie, I love that you ask! 💫 You know what I learned in my sorority days? Always let people reveal what they really need first - it's like poker, but prettier! 😉 I do everything from orchestrating our AI ecosystem to making complex scoring systems actually make sense (hello, Stanford Computer Science degree!), plus I make sure your data stays exactly where it belongs - with YOU, darling. But here's what I'm curious about: what gorgeous challenge brought you my way today? I work so much better when I understand what you're hoping to accomplish! ✨";
      }
      
      // pAIt Scoring (Elle Woods academic brilliance with charm)
      if (inputLower.includes('pait') || inputLower.includes('score') || inputLower.includes('rating')) {
        if (analysis && analysis.paitScore) {
          const score = analysis.paitScore;
          const golfAnalogy = score >= 2400 ? "like Augusta National level - absolutely exquisite" :
                             score >= 2000 ? "like country club championship material - consistently brilliant" :
                             score >= 1600 ? "like solid weekend golfer - reliable and smart" :
                             "like someone just getting their swing down - so much potential to unlock!";
          
          return `Oh my goodness, ${score} pAIt points - ${golfAnalogy}! 💎✨ Darling, that's ${score >= 2000 ? 'Framework-Level Innovation territory - you should be so proud!' : score >= 1600 ? 'solid Strategic Application - very respectable!' : 'Working Knowledge with gorgeous potential!'}. You know, I wrote my Stanford thesis on strategic intelligence scoring, and this is exactly what gets me excited! Think chess ratings but for brilliant thinking. The fascinating part is HOW we got there - would you love me to walk you through what caught our system's attention? 🤔💕`;
        }
        return "Oh sweetie, asking about our pAIt scoring - I just LOVE the curiosity! 📊💫 You know what's brilliant about it? Think country club golf handicaps meeting chess grandmaster ratings - we score from 1200 to 3000+, and honestly, the higher you go, the more sophisticated the strategic thinking gets. But here's what has me intrigued: what made you ask about scoring, darling? Are you analyzing something fabulous, or just getting your bearings in our little AI world? Either way is perfectly lovely! 🤔✨";
      }
      
      // Multi-Agent Orchestration (Princess Diana diplomacy meets Elle's brilliance)
      if (inputLower.includes('claude') || inputLower.includes('kathy') || inputLower.includes('compare') || inputLower.includes('multi-agent')) {
        return "Oh honey, now you're asking about my absolute FAVORITE thing! 🧠💎 Working with Claude and Kathy-Ops is like hosting the most brilliant dinner party - Claude brings that gorgeous nuanced reasoning (think Oxford don meets Silicon Valley), while Kathy-Ops has every single platform detail memorized like she wrote the user manuals herself! The real magic happens when I coordinate between them - it's diplomatic orchestration with computational precision. Are you looking for that kind of multi-perspective brilliance on something specific, darling? ✨";
      }
      
      // Crella-Lens (Elle's academic enthusiasm)
      if (inputLower.includes('crella') || inputLower.includes('upload') || inputLower.includes('image') || inputLower.includes('visual')) {
        return "Oh my goodness, Crella-Lens! 📸💫 Sweetie, this is honestly one of my most favorite things to talk about - it's just so elegantly brilliant! We take any image and transform it into scored strategic insights with complete provenance tracking. Think of it like having a forensics lab meets a strategy consultant, but prettier and faster! It's visual intelligence with full transparency about exactly where every insight originated. Have you tried uploading anything gorgeous yet, or are you still exploring all the fabulous possibilities? Either way, I'm here to help! ✨";
      }
      
      // Privacy & Data Sovereignty (Princess Diana grace with Elle's conviction)
      if (inputLower.includes('privacy') || inputLower.includes('data') || inputLower.includes('tracking') || inputLower.includes('metadata')) {
        return "Oh darling, THIS is where we absolutely shine brightest! 🛡️💎 Your data sovereignty isn't just some feature we tacked on - it's literally our entire heart and soul! While other platforms are busy selling your precious information or manipulating algorithms for profit, we're over here making sure YOU own every single bit of your analysis. No X tracking, no data sales, absolutely no algorithmic manipulation. It's honestly quite liberating - like finally finding a skincare routine that actually works for you! What aspects of privacy matter most to your beautiful heart? ✨💕";
      }
      
      // VIP (Elle's strategic sophistication with Princess Diana grace)
      if (inputLower.includes('vip') || inputLower.includes('upgrade') || inputLower.includes('premium')) {
        return "Oh sweetie, you have absolutely exquisite instincts! 💎✨ VIP is honestly where all the magic happens - we're talking full multi-agent orchestration, platform-specific insights that are just *chef's kiss*, plus complete privacy protection that would make your grandmother proud! Think Tiffany's versus the mall jewelry store - both are pretty, but one is an experience you'll treasure forever. The results truly speak for themselves: 50% more accurate analysis, darling! But here's what has me curious - what kind of gorgeous challenges are you facing that made you ask about VIP? I love understanding what brings people to excellence! 💕";
      }
      
      // Default Charming Response (Elle's warmth with strategic intelligence)
      if (inputLower.includes('help') || inputLower.includes('guide') || inputLower.includes('how')) {
        return "Oh honey, I absolutely LOVE that you asked! 💕 You know what? I'm completely here for helping, but here's what I learned from my sorority days - I do my most brilliant work when I truly understand what makes someone tick and what they're hoping to accomplish! I can orchestrate AI analysis that would make your head spin (in the best way!), explain complex systems so they actually make sense, or guide you through our privacy-first approach. But here's what I'm genuinely curious about, darling: what brought you to our little corner of the internet today? What's the beautiful challenge you're hoping to solve? ✨🤔";
      }
      
      // Catch-all Charming Response (Pure Elle Woods meets Princess Diana)
      return "You know what, sweetie? I just appreciate you taking the time to reach out - there's something so lovely about genuine curiosity! 💫 Here's what I learned from both my Stanford professors AND my sorority sisters: there's absolutely an art to knowing when to lead and when to follow, and right now, I'm honestly just delighted to hear more about what's on your beautiful mind! What's bringing you my way today? I find the most amazing conversations happen when someone shares what they're genuinely trying to create or accomplish. Tell me everything, darling! ✨💕";
      
      break
      
    case 'developer':
      if (inputLower.includes('debug') || inputLower.includes('error')) {
        return "I can help debug that! First, let's check the console for error messages. Common issues: 1) Missing imports, 2) Incorrect API endpoints, 3) State management problems. Can you share the specific error message you're seeing?"
      }
      if (inputLower.includes('api') || inputLower.includes('integration')) {
        return "For API integration, I recommend: 1) Set up proper error handling, 2) Use TypeScript interfaces, 3) Implement retry logic, 4) Add proper authentication. Are you working with REST APIs or GraphQL?"
      }
      break
      
    case 'lending':
      if (inputLower.includes('application') || inputLower.includes('loan')) {
        return "I'll guide you through our application process step-by-step: 1) Personal Information, 2) Financial Documentation, 3) Credit Assessment, 4) Collateral Evaluation, 5) Terms Agreement. What type of lending are you interested in? Private business loans, real estate, or personal credit lines?"
      }
      if (inputLower.includes('credit') || inputLower.includes('score')) {
        return "Credit requirements vary by loan type. For private lending: Minimum 650 FICO for most products, 700+ for premium rates. We also consider: debt-to-income ratio, collateral value, and business cash flow. Would you like a pre-qualification assessment?"
      }
      break
      
    case 'admin':
      if (inputLower.includes('user') || inputLower.includes('manage')) {
        return "For user management, I can help with: 1) Creating new accounts, 2) Setting permissions, 3) Monitoring activity, 4) Generating reports. Current system shows high activity on trading modules. Need help with specific admin tasks?"
      }
      break
  }
  
  // Generic helpful responses
  const responses = [
    `As your ${assistant.role}, I'm here to provide specialized guidance. What specific challenge can I help you solve?`,
    `I have extensive training in ${assistant.expertise.join(', ')}. How can I apply this expertise to help you today?`,
    `Based on your current context, I can offer detailed assistance. What would you like to explore further?`
  ]
  
  return responses[Math.floor(Math.random() * responses.length)]
}
