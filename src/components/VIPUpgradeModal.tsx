import React, { useState } from 'react'
import { X, Crown, CreditCard, Zap, Shield, Check, Star, TrendingUp } from 'lucide-react'

interface VIPUpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  currentTier: 'free' | 'vip' | 'staff'
  onUpgradeSuccess?: () => void
}

export function VIPUpgradeModal({ isOpen, onClose, currentTier, onUpgradeSuccess }: VIPUpgradeModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly')
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'crypto'>('stripe')
  const [isProcessing, setIsProcessing] = useState(false)

  if (!isOpen || currentTier !== 'free') return null

  // VIP pricing plans
  const plans = {
    monthly: {
      price: 99,
      tokens: 10000,
      savings: 0,
      popular: false
    },
    annual: {
      price: 999, // $83.25/month
      tokens: 120000,
      savings: 189,
      popular: true
    }
  }

  const handleStripePayment = async () => {
    setIsProcessing(true)
    
    try {
      // Simulate Stripe payment processing
      console.log('🔄 Processing Stripe payment...', { plan: selectedPlan, amount: plans[selectedPlan].price })
      
      // In production, you would call Stripe API here:
      // const response = await fetch('/api/stripe/create-payment-intent', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     plan: selectedPlan,
      //     amount: plans[selectedPlan].price * 100, // Stripe uses cents
      //   })
      // })
      
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate processing
      
      // Success - upgrade user
      onUpgradeSuccess?.()
      
      // Show success and close
      alert('🎉 Welcome to VIP! Your account has been upgraded successfully!')
      onClose()
      
    } catch (error) {
      console.error('Payment error:', error)
      alert('Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCryptoPayment = async () => {
    setIsProcessing(true)
    
    try {
      // Simulate crypto payment processing
      console.log('🔄 Processing crypto payment...', { plan: selectedPlan, amount: plans[selectedPlan].price })
      
      // In production, integrate with crypto payment processor:
      // - CoinGate, BitPay, or custom Web3 integration
      // - Generate payment wallet address
      // - Monitor blockchain for payment confirmation
      
      const cryptoAmount = (plans[selectedPlan].price / 45000).toFixed(6) // Simulate BTC conversion
      
      alert(`Please send ${cryptoAmount} BTC to:\n\nbc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh\n\n(This is a demo address)`)
      
      await new Promise(resolve => setTimeout(resolve, 3000)) // Simulate processing
      
      // Success - upgrade user
      onUpgradeSuccess?.()
      
      alert('🎉 Crypto payment confirmed! Welcome to VIP!')
      onClose()
      
    } catch (error) {
      console.error('Crypto payment error:', error)
      alert('Crypto payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePayment = () => {
    if (paymentMethod === 'stripe') {
      handleStripePayment()
    } else {
      handleCryptoPayment()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative p-6 border-b border-slate-700">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
          
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-yellow-500/20 rounded-full border border-yellow-500/30">
              <Crown className="w-8 h-8 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Upgrade to VIP</h2>
              <p className="text-gray-400">Unlock the full power of AI orchestration</p>
            </div>
          </div>

          {/* Value Proposition */}
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-lg p-4 border border-blue-500/20">
            <h3 className="text-white font-semibold mb-2">🚀 Transform Your Analysis Capabilities</h3>
            <p className="text-gray-300 text-sm">
              Join Paul's exclusive HNW beta group with premium AI concierge services, 
              multi-agent orchestration, and secure vault intelligence.
            </p>
          </div>
        </div>

        <div className="p-6">
          {/* Plan Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Choose Your Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(plans).map(([key, plan]) => (
                <div
                  key={key}
                  onClick={() => setSelectedPlan(key as 'monthly' | 'annual')}
                  className={`relative p-6 rounded-lg border cursor-pointer transition-all ${
                    selectedPlan === key
                      ? 'border-yellow-500 bg-yellow-500/10'
                      : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        MOST POPULAR
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <h4 className="font-semibold text-white text-lg mb-2">
                      {key === 'monthly' ? 'Monthly VIP' : 'Annual VIP'}
                    </h4>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-white">${plan.price}</span>
                      <span className="text-gray-400 text-sm">/{key === 'monthly' ? 'month' : 'year'}</span>
                      {plan.savings > 0 && (
                        <div className="text-green-400 text-sm font-medium">
                          Save ${plan.savings}!
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-300">
                      <div className="flex items-center">
                        <Check className="w-4 h-4 text-green-400 mr-2" />
                        {plan.tokens.toLocaleString()} tokens
                      </div>
                      <div className="flex items-center">
                        <Check className="w-4 h-4 text-green-400 mr-2" />
                        Multi-agent orchestration
                      </div>
                      <div className="flex items-center">
                        <Check className="w-4 h-4 text-green-400 mr-2" />
                        Unlimited vault storage
                      </div>
                      <div className="flex items-center">
                        <Check className="w-4 h-4 text-green-400 mr-2" />
                        Premium Claire guidance
                      </div>
                      <div className="flex items-center">
                        <Check className="w-4 h-4 text-green-400 mr-2" />
                        Advanced pAIt™ analysis
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Payment Method</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setPaymentMethod('stripe')}
                className={`p-4 rounded-lg border transition-all flex items-center justify-center ${
                  paymentMethod === 'stripe'
                    ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                    : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
                }`}
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Credit Card
              </button>
              
              <button
                onClick={() => setPaymentMethod('crypto')}
                className={`p-4 rounded-lg border transition-all flex items-center justify-center ${
                  paymentMethod === 'crypto'
                    ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                    : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
                }`}
              >
                <Zap className="w-5 h-5 mr-2" />
                Crypto
              </button>
            </div>
          </div>

          {/* VIP Benefits Showcase */}
          <div className="mb-6 bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-red-500/10 rounded-lg p-6 border border-yellow-500/20">
            <h3 className="text-yellow-400 font-semibold mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2" />
              Exclusive VIP Benefits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center text-white">
                  <Shield className="w-4 h-4 text-blue-400 mr-2" />
                  JBot Trading Analysis
                </div>
                <div className="flex items-center text-white">
                  <Shield className="w-4 h-4 text-purple-400 mr-2" />
                  Claudia Legal Research
                </div>
                <div className="flex items-center text-white">
                  <Shield className="w-4 h-4 text-green-400 mr-2" />
                  Kathy Media Verification
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-white">
                  <TrendingUp className="w-4 h-4 text-yellow-400 mr-2" />
                  Real Estate Beta Access
                </div>
                <div className="flex items-center text-white">
                  <Crown className="w-4 h-4 text-yellow-400 mr-2" />
                  Paul's HNW Network
                </div>
                <div className="flex items-center text-white">
                  <Zap className="w-4 h-4 text-blue-400 mr-2" />
                  Priority Support
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
              Maybe Later
            </button>
            
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-3 px-6 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <Zap className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Crown className="w-5 h-5 mr-2" />
                  Upgrade to VIP - ${plans[selectedPlan].price}
                </>
              )}
            </button>
          </div>

          {/* Security Notice */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-400">
              🔒 Secure payment processing • Cancel anytime • 30-day money-back guarantee
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VIPUpgradeModal
