import React, { useState } from 'react';
import { Camera, Download, Share, Shield, Crown, MessageCircle, Star, Lock, Zap } from 'lucide-react';

interface PAItAnalysisResult {
  analysis_id: string;
  pait_score: number;
  rating_classification: string;
  confidence_level: string;
  technical_breakdown: {
    platform_identification: string[];
    technical_accuracy: string;
    quality_reality_gap: string;
    market_analysis: string;
    strategic_depth: string;
  };
  comparison_baseline: {
    single_llm_claude: number;
    crella_multi_agent: number;
    improvement_factor: string;
  };
  digital_fingerprint: {
    timestamp: string;
    analysis_id: string;
    privacy_mode: string;
  };
  concierge_offering: {
    greeting: string;
    membership_tiers: {
      vip: {
        price: string;
        features: string[];
      };
    };
    privacy_selling_points: string[];
  };
}

const VisualPAItAnalysis: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<PAItAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showConcierge, setShowConcierge] = useState(false);
  const [userType, setUserType] = useState<'standard' | 'vip'>('standard');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Mock analysis result (in production, this would come from your backend)
  const mockAnalysisResult: PAItAnalysisResult = {
    analysis_id: "8c4af1f7",
    pait_score: 2200,
    rating_classification: "Framework-Level Innovation",
    confidence_level: "85%",
    technical_breakdown: {
      platform_identification: ["Suno", "Udio", "Amper Music"],
      technical_accuracy: "7/10",
      quality_reality_gap: "6/10",
      market_analysis: "8/10", 
      strategic_depth: "8/10"
    },
    comparison_baseline: {
      single_llm_claude: 1465,
      crella_multi_agent: 2200,
      improvement_factor: "+50%"
    },
    digital_fingerprint: {
      timestamp: new Date().toISOString(),
      analysis_id: "8c4af1f7-2024-analysis",
      privacy_mode: "vip_protected"
    },
    concierge_offering: {
      greeting: "👋 Hi! I'm Claire, your AiiQ AI Concierge",
      membership_tiers: {
        vip: {
          price: "$29/month",
          features: [
            "Multi-agent analysis",
            "Trading strategy extraction",
            "Complete privacy protection",
            "Concierge chat access",
            "H100 GPU priority",
            "Export to trading platforms"
          ]
        }
      },
      privacy_selling_points: [
        "🚫 No tracking by X/Twitter algorithm",
        "🚫 No data sold to Rick Beato or other creators",
        "🚫 No engagement manipulation",
        "✅ Your analysis, your data, your privacy",
        "✅ Anonymous pAIt scoring"
      ]
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulate analysis time
    setTimeout(() => {
      setAnalysisResult(mockAnalysisResult);
      setIsAnalyzing(false);
      setShowConcierge(true);
    }, 3000);
  };

  const ScoreComparison = ({ result }: { result: PAItAnalysisResult }) => (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <h3 className="text-xl font-bold text-white mb-4">AI Analysis Comparison</h3>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Crella-Lens Score */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Zap className="w-5 h-5 text-yellow-400 mr-2" />
            <span className="text-white font-semibold crella-font">Crella</span><span className="text-white font-semibold">-Lens</span>
          </div>
          <div className="text-white text-sm opacity-80">Multi-Agent System</div>
          <div className="text-4xl font-bold text-white mt-2">{result.pait_score}</div>
          <div className="text-white text-sm">pAIt score</div>
        </div>

        {/* Single LLM Score */}
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <span className="text-white font-semibold">Single LLM</span>
          </div>
          <div className="text-gray-300 text-sm">Claude 3</div>
          <div className="text-4xl font-bold text-gray-300 mt-2">{result.comparison_baseline.single_llm_claude}</div>
          <div className="text-gray-300 text-sm">pAIt score</div>
        </div>
      </div>

      {/* Improvement Factor */}
      <div className="mt-4 text-center">
        <div className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-lg">
          <Star className="w-4 h-4 mr-2" />
          {result.comparison_baseline.improvement_factor} Better Analysis
        </div>
      </div>
    </div>
  );

  const TechnicalBreakdown = ({ breakdown }: { breakdown: any }) => (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <h3 className="text-xl font-bold text-white mb-4">Technical Analysis Breakdown</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-700 rounded p-3">
          <div className="text-teal-400 font-semibold">Platform Assessment</div>
          <div className="text-white text-sm mt-1">
            {breakdown.platform_identification.join(", ")}
          </div>
        </div>
        
        <div className="bg-gray-700 rounded p-3">
          <div className="text-teal-400 font-semibold">Technical Accuracy</div>
          <div className="text-white text-sm mt-1">{breakdown.technical_accuracy}</div>
        </div>
        
        <div className="bg-gray-700 rounded p-3">
          <div className="text-teal-400 font-semibold">Market Analysis</div>
          <div className="text-white text-sm mt-1">{breakdown.market_analysis}</div>
        </div>
        
        <div className="bg-gray-700 rounded p-3">
          <div className="text-teal-400 font-semibold">Strategic Depth</div>
          <div className="text-white text-sm mt-1">{breakdown.strategic_depth}</div>
        </div>
      </div>
    </div>
  );

  const ConciergeModal = ({ result }: { result: PAItAnalysisResult }) => (
    showConcierge && (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4 border border-teal-500">
          <div className="flex items-center mb-4">
            <img 
              src="/crella_claire.jpg" 
              alt="Claire" 
              className="w-12 h-12 rounded-full mr-3"
            />
            <div>
              <h3 className="text-white font-bold">Claire - AiiQ Concierge</h3>
              <div className="text-teal-400 text-sm">AI Strategy Assistant</div>
            </div>
          </div>
          
          <div className="text-white mb-4">
            {result.concierge_offering.greeting}
          </div>
          
          <div className="text-white text-sm mb-4">
            I see you're exploring Framework-Level content (pAIt: {result.pait_score}). 
            Want deeper insights?
          </div>

          {/* VIP Benefits */}
          <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg p-4 mb-4">
            <div className="flex items-center mb-2">
              <Crown className="w-5 h-5 text-yellow-200 mr-2" />
              <span className="text-white font-bold">VIP Upgrade - {result.concierge_offering.membership_tiers.vip.price}</span>
            </div>
            <div className="text-white text-sm space-y-1">
              {result.concierge_offering.membership_tiers.vip.features.slice(0, 3).map((feature, idx) => (
                <div key={idx} className="flex items-center">
                  <span className="text-yellow-200 mr-2">✓</span>
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Protection */}
          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <div className="flex items-center mb-2">
              <Shield className="w-5 h-5 text-green-400 mr-2" />
              <span className="text-white font-semibold">Privacy Protection</span>
            </div>
            <div className="text-gray-300 text-xs space-y-1">
              {result.concierge_offering.privacy_selling_points.slice(0, 2).map((point, idx) => (
                <div key={idx}>{point}</div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => setShowConcierge(false)}
              className="flex-1 bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
            >
              Maybe Later
            </button>
            <button 
              onClick={() => {
                setUserType('vip');
                setShowConcierge(false);
              }}
              className="flex-1 bg-gradient-to-r from-teal-600 to-teal-700 text-white py-2 px-4 rounded-lg hover:from-teal-700 hover:to-teal-800"
            >
              Upgrade to VIP
            </button>
          </div>
        </div>
      </div>
    )
  );

  const DigitalFingerprint = ({ fingerprint }: { fingerprint: any }) => (
    <div className="bg-gray-800 rounded-lg p-4 mb-6">
      <h4 className="text-white font-semibold mb-3 flex items-center">
        <Lock className="w-4 h-4 mr-2 text-teal-400" />
        Digital Fingerprint & Metadata
      </h4>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-gray-400">Analysis ID</div>
          <div className="text-white font-mono">{fingerprint.analysis_id}</div>
        </div>
        <div>
          <div className="text-gray-400">Privacy Mode</div>
          <div className="text-teal-400">{fingerprint.privacy_mode}</div>
        </div>
        <div>
          <div className="text-gray-400">Generated</div>
          <div className="text-white">{new Date(fingerprint.timestamp).toLocaleString()}</div>
        </div>
        <div>
          <div className="text-gray-400">Protection Level</div>
          <div className="text-green-400">
            {userType === 'vip' ? 'Maximum' : 'Standard'}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gray-900 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Camera className="w-6 h-6 mr-3 text-teal-400" />
          Visual pAIt Analysis Generator
          {userType === 'vip' && (
            <Crown className="w-5 h-5 ml-2 text-yellow-400" />
          )}
        </h2>

        {/* Image Upload */}
        {!analysisResult && (
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center mb-6">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-white mb-2">Upload Social Media Post or Screenshot</p>
              <p className="text-gray-400 text-sm">Supports: Twitter, LinkedIn, YouTube, TikTok posts</p>
            </label>
          </div>
        )}

        {/* Uploaded Image Preview */}
        {uploadedImage && !analysisResult && (
          <div className="mb-6">
            <img 
              src={uploadedImage} 
              alt="Uploaded content" 
              className="max-w-full h-48 object-cover rounded-lg mx-auto"
            />
            <div className="text-center mt-4">
              <button
                onClick={runAnalysis}
                disabled={isAnalyzing}
                className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <Zap className="w-4 h-4 mr-2 inline animate-spin" />
                    Analyzing with Multi-Agent System...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2 inline" />
                    Generate pAIt Analysis
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {analysisResult && (
          <>
            <ScoreComparison result={analysisResult} />
            <TechnicalBreakdown breakdown={analysisResult.technical_breakdown} />
            <DigitalFingerprint fingerprint={analysisResult.digital_fingerprint} />

            {/* Export Options */}
            <div className="bg-gray-800 rounded-lg p-4 mb-6">
              <h4 className="text-white font-semibold mb-3">Export & Share</h4>
              <div className="flex gap-3">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center">
                  <Download className="w-4 h-4 mr-2" />
                  Download PNG
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center">
                  <Share className="w-4 h-4 mr-2" />
                  Share Link
                </button>
                {userType === 'vip' && (
                  <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded flex items-center">
                    <Crown className="w-4 h-4 mr-2" />
                    Export to Trading Platform
                  </button>
                )}
              </div>
            </div>

            {/* Concierge Chat Button */}
            <div className="text-center">
              <button
                onClick={() => setShowConcierge(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center mx-auto"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat with Claire - Get Deeper Insights
              </button>
            </div>
          </>
        )}

        {/* Concierge Modal */}
        {analysisResult && <ConciergeModal result={analysisResult} />}
      </div>
    </div>
  );
};

export default VisualPAItAnalysis;
