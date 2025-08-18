#!/usr/bin/env python3
"""
🤖 Ollama GPU Video Analyzer - Crella Lens Integration
Multi-Agent Analysis System using your existing Ollama models

Specialized Analysis Pipeline:
1. jbot:latest - Primary trading analysis & best practices extraction
2. claudia-trader:latest - Advanced strategy analysis  
3. kathy-ops:latest - Options trading insights
4. fraud-detector:latest - Scam detection & risk assessment
5. compliance-officer:latest - Regulatory compliance check

Author: Multi-AI Collaboration - August 2025
"""

import os
import sys
import json
import subprocess
import requests
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any, Optional
import logging

# Setup logging
Path('lens-data').mkdir(exist_ok=True)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('lens-data/ollama_analyzer.log', encoding='utf-8'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class OllamaVideoAnalyzer:
    """Multi-Agent Video Analysis using your Ollama GPU models"""
    
    def __init__(self, base_dir: str = "lens-data", ollama_url: str = "http://localhost:11434"):
        self.base_dir = Path(base_dir)
        self.analysis_dir = self.base_dir / "ollama_analysis"  
        self.reviews_dir = self.base_dir / "member_reviews"
        self.strategies_dir = self.base_dir / "frankenstein_strategies"
        
        # Create directories
        for dir_path in [self.analysis_dir, self.reviews_dir, self.strategies_dir]:
            dir_path.mkdir(parents=True, exist_ok=True)
        
        self.ollama_url = ollama_url
        
        # Your specialized models
        self.models = {
            "primary_analyst": "jbot:latest",
            "strategy_expert": "claudia-trader:latest", 
            "options_specialist": "kathy-ops:latest",
            "fraud_detector": "fraud-detector:latest",
            "compliance_officer": "compliance-officer:latest",
            "backup_analyst": "trader-max:latest"
        }
        
        logger.info("Ollama Video Analyzer initialized with GPU models")
    
    def check_ollama_models(self) -> Dict[str, bool]:
        """Check which models are available"""
        available_models = {}
        
        try:
            response = requests.get(f"{self.ollama_url}/api/tags", timeout=10)
            if response.status_code == 200:
                models_data = response.json()
                model_names = [model['name'] for model in models_data.get('models', [])]
                
                for role, model_name in self.models.items():
                    available_models[role] = model_name in model_names
                    
                logger.info(f"Available models: {sum(available_models.values())}/{len(available_models)}")
                return available_models
            else:
                logger.error("Could not connect to Ollama API")
                return {role: False for role in self.models.keys()}
        except Exception as e:
            logger.error(f"Ollama connection error: {e}")
            return {role: False for role in self.models.keys()}
    
    def query_ollama_model(self, model_name: str, prompt: str, timeout: int = 120) -> Optional[str]:
        """Query a specific Ollama model"""
        try:
            payload = {
                "model": model_name,
                "prompt": prompt,
                "stream": False
            }
            
            response = requests.post(
                f"{self.ollama_url}/api/generate",
                json=payload,
                timeout=timeout
            )
            
            if response.status_code == 200:
                result = response.json()
                return result.get('response', '').strip()
            else:
                logger.error(f"Model {model_name} error: {response.status_code}")
                return None
                
        except Exception as e:
            logger.error(f"Error querying {model_name}: {e}")
            return None
    
    def analyze_with_jbot(self, content_text: str, video_metadata: Dict) -> Dict[str, Any]:
        """Primary analysis with jbot - focus on BEST practices extraction"""
        
        prompt = f"""You are JBot, the lead trading analysis AI. Your mission is to find the BEST elements in trading content to help members learn and improve.

CONTENT TO ANALYZE:
{content_text}

VIDEO METADATA:
- Duration: {video_metadata.get('duration', 'Unknown')}
- Views: {video_metadata.get('view_count', 'Unknown')}
- Channel: {video_metadata.get('uploader', 'Unknown')}

YOUR ANALYSIS MISSION:
Instead of just criticizing, find the GOLD NUGGETS that members can use. Even questionable content often has valuable techniques buried inside.

ANALYZE FOR BEST PRACTICES:
1. **Trading Techniques** - What specific methods or strategies are mentioned?
2. **Technical Analysis** - Any valid chart patterns, indicators, or setups?
3. **Risk Management** - Are there any risk management principles shown?
4. **Educational Value** - What can viewers actually learn from this?
5. **Platform/Tools** - What trading platforms or tools are demonstrated?

CONSTRUCTIVE ANALYSIS APPROACH:
- Extract the valuable techniques even from overhyped content
- Identify what parts could be adapted for safer trading
- Note any legitimate educational components
- Suggest how to apply concepts responsibly

FRANKENSTEIN POTENTIAL:
- Which elements could be combined with other strategies?
- What modifications would make risky strategies safer?
- How could this fit into a diversified approach?

OUTPUT FORMAT (JSON):
{{
  "best_practices_found": ["technique1", "technique2"],
  "educational_value": {{
    "score": 0-10,
    "reasoning": "what viewers can learn"
  }},
  "technical_elements": {{
    "indicators": ["RSI", "MACD"],
    "chart_patterns": ["support/resistance"],
    "timeframes": ["1hr", "daily"]
  }},
  "frankenstein_potential": {{
    "extractable_techniques": ["specific methods"],
    "safety_modifications": ["how to make safer"],
    "combination_ideas": ["how to combine with other strategies"]
  }},
  "member_value": {{
    "takeaways": ["key lessons"],
    "warnings": ["what to avoid"],
    "adaptations": ["how to use responsibly"]
  }},
  "overall_assessment": "constructive summary focusing on learning opportunities"
}}

Remember: Find the diamonds in the rough! Even bad content can teach us what NOT to do or contain hidden gems."""

        response = self.query_ollama_model(self.models["primary_analyst"], prompt)
        
        if response:
            try:
                # Extract JSON from response
                json_start = response.find('{')
                json_end = response.rfind('}') + 1
                if json_start >= 0 and json_end > json_start:
                    json_str = response[json_start:json_end]
                    return json.loads(json_str)
            except json.JSONDecodeError:
                pass
        
        # Fallback response
        return {
            "best_practices_found": ["Analysis unavailable"],
            "educational_value": {"score": 5, "reasoning": "Model response parsing failed"},
            "technical_elements": {"indicators": [], "chart_patterns": [], "timeframes": []},
            "frankenstein_potential": {"extractable_techniques": [], "safety_modifications": [], "combination_ideas": []},
            "member_value": {"takeaways": [], "warnings": [], "adaptations": []},
            "overall_assessment": "Analysis failed - please try again"
        }
    
    def analyze_with_claudia_trader(self, content_text: str, jbot_analysis: Dict) -> Dict[str, Any]:
        """Advanced strategy analysis with Claudia"""
        
        prompt = f"""You are Claudia-Trader, the advanced strategy analysis specialist. Review this trading content and JBot's initial analysis.

CONTENT: {content_text}

JBOT'S FINDINGS:
{json.dumps(jbot_analysis, indent=2)}

YOUR ADVANCED ANALYSIS:
Building on JBot's findings, dive deeper into the strategic elements.

STRATEGY DECONSTRUCTION:
1. **Core Strategy Logic** - What's the underlying trading theory?
2. **Market Conditions** - What market environments would this work in?
3. **Entry/Exit Rules** - Can you identify specific trade triggers?
4. **Position Sizing** - Any mention of position management?
5. **Risk/Reward Ratios** - What's the theoretical R:R?

FRANKENSTEIN STRATEGY POTENTIAL:
- How could this strategy be IMPROVED?
- What elements from other strategies could enhance this?
- How to reduce risk while maintaining upside?

INTEGRATION WITH PAIT SYSTEM:
Rate this content for our pAIt system (0-100):
- Strategy Logic Score (0-25)
- Risk Management Score (0-25)  
- Educational Value Score (0-25)
- Implementation Clarity Score (0-25)

OUTPUT (JSON):
{{
  "strategy_analysis": {{
    "core_logic": "underlying theory",
    "market_conditions": "when this works",
    "entry_signals": ["specific triggers"],
    "exit_signals": ["specific exits"],
    "position_sizing": "sizing approach"
  }},
  "pait_scores": {{
    "strategy_logic": 0-25,
    "risk_management": 0-25,
    "educational_value": 0-25,
    "implementation_clarity": 0-25,
    "total_score": 0-100
  }},
  "frankenstein_enhancements": {{
    "improvements": ["suggested improvements"],
    "risk_reductions": ["ways to reduce risk"],
    "complementary_strategies": ["what to combine with"]
  }},
  "member_implementation": {{
    "difficulty_level": "beginner|intermediate|advanced",
    "required_capital": "capital requirements",
    "time_commitment": "time needed",
    "recommended_modifications": ["safer adaptations"]
  }}
}}"""

        response = self.query_ollama_model(self.models["strategy_expert"], prompt)
        
        if response:
            try:
                json_start = response.find('{')
                json_end = response.rfind('}') + 1
                if json_start >= 0 and json_end > json_start:
                    return json.loads(response[json_start:json_end])
            except json.JSONDecodeError:
                pass
        
        return {
            "strategy_analysis": {"core_logic": "Analysis unavailable"},
            "pait_scores": {"strategy_logic": 15, "risk_management": 15, "educational_value": 15, "implementation_clarity": 15, "total_score": 60},
            "frankenstein_enhancements": {"improvements": [], "risk_reductions": [], "complementary_strategies": []},
            "member_implementation": {"difficulty_level": "intermediate", "required_capital": "Unknown", "time_commitment": "Unknown", "recommended_modifications": []}
        }
    
    def analyze_with_kathy_ops(self, content_text: str) -> Dict[str, Any]:
        """Options trading specialist analysis"""
        
        if "option" not in content_text.lower():
            return {"options_relevant": False, "analysis": "No options content detected"}
        
        prompt = f"""You are Kathy-Ops, the options trading specialist. Analyze this content for options-specific insights.

CONTENT: {content_text}

OPTIONS ANALYSIS FOCUS:
1. **Options Strategies** - What specific options plays are mentioned?
2. **Greeks Understanding** - Any mention of Delta, Gamma, Theta, Vega?
3. **Expiration Management** - How do they handle time decay?
4. **Risk/Reward Profiles** - Profit/loss potential analysis
5. **Market Conditions** - When these options strategies work best

EXTRACT BEST OPTIONS PRACTICES:
Even from questionable content, find the valuable options concepts.

OUTPUT (JSON):
{{
  "options_strategies": ["strategies mentioned"],
  "greeks_awareness": {{
    "mentioned": ["Delta", "Theta"],
    "understanding_level": "basic|intermediate|advanced"
  }},
  "expiration_management": "approach to time decay",
  "risk_reward_analysis": "profit/loss potential",
  "best_practices_options": ["valuable options concepts"],
  "member_adaptations": ["how members can use safely"]
}}"""

        response = self.query_ollama_model(self.models["options_specialist"], prompt)
        
        if response:
            try:
                json_start = response.find('{')
                json_end = response.rfind('}') + 1
                if json_start >= 0 and json_end > json_start:
                    return json.loads(response[json_start:json_end])
            except:
                pass
        
        return {"options_relevant": True, "analysis": "Options analysis unavailable"}
    
    def fraud_detection_check(self, content_text: str) -> Dict[str, Any]:
        """Fraud detection and risk assessment"""
        
        prompt = f"""You are the Fraud Detector. Analyze this trading content for potential scam indicators, but BALANCE criticism with educational value.

CONTENT: {content_text}

FRAUD INDICATORS TO CHECK:
1. **Unrealistic Profit Claims** - Guaranteed returns, "no risk" claims
2. **Pressure Tactics** - "Limited time", "act now", "exclusive"
3. **Vague Methodology** - No clear explanation of strategy
4. **Social Proof Manipulation** - Fake testimonials, edited screenshots
5. **Missing Risk Disclosures** - No mention of potential losses

BALANCED ANALYSIS:
Don't just flag problems - suggest what viewers can learn despite red flags.

OUTPUT (JSON):
{{
  "fraud_score": 0-10,
  "red_flags": ["specific issues found"],
  "risk_level": "low|medium|high|very_high",
  "educational_salvage": ["what can still be learned"],
  "member_warnings": ["what members should be careful about"],
  "constructive_advice": "how to approach this content safely"
}}"""

        response = self.query_ollama_model(self.models["fraud_detector"], prompt)
        
        if response:
            try:
                json_start = response.find('{')
                json_end = response.rfind('}') + 1
                if json_start >= 0 and json_end > json_start:
                    return json.loads(response[json_start:json_end])
            except:
                pass
        
        return {
            "fraud_score": 5,
            "red_flags": ["Analysis unavailable"],
            "risk_level": "medium",
            "educational_salvage": [],
            "member_warnings": [],
            "constructive_advice": "Exercise caution and verify independently"
        }
    
    def generate_member_review(self, all_analysis: Dict) -> Dict[str, Any]:
        """Generate member-friendly review summary"""
        
        jbot = all_analysis.get("jbot_analysis", {})
        claudia = all_analysis.get("claudia_analysis", {})
        kathy = all_analysis.get("kathy_analysis", {})
        fraud = all_analysis.get("fraud_analysis", {})
        
        # Calculate overall pAIt score
        claudia_scores = claudia.get("pait_scores", {})
        base_score = claudia_scores.get("total_score", 60)
        fraud_penalty = fraud.get("fraud_score", 5) * 5  # Reduce score for fraud indicators
        
        final_pait_score = max(0, min(100, base_score - fraud_penalty))
        
        # Generate recommendation
        if final_pait_score >= 80:
            recommendation = "EXCELLENT - Highly recommended for learning"
            badge = "🏆 Top Quality"
        elif final_pait_score >= 65:
            recommendation = "GOOD - Valuable insights with precautions"
            badge = "✅ Quality Content"
        elif final_pait_score >= 50:
            recommendation = "MIXED - Some value, proceed with caution"
            badge = "⚠️ Proceed Carefully"
        elif final_pait_score >= 35:
            recommendation = "RISKY - Educational value limited"
            badge = "🚨 High Risk"
        else:
            recommendation = "AVOID - Likely fraudulent or misleading"
            badge = "❌ Avoid"
        
        return {
            "review_id": f"review_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            "pait_score": final_pait_score,
            "recommendation": recommendation,
            "badge": badge,
            "best_takeaways": jbot.get("member_value", {}).get("takeaways", [])[:3],
            "key_warnings": fraud.get("member_warnings", [])[:2],
            "frankenstein_potential": claudia.get("frankenstein_enhancements", {}).get("improvements", [])[:2],
            "difficulty_level": claudia.get("member_implementation", {}).get("difficulty_level", "intermediate"),
            "options_relevant": kathy.get("options_relevant", False),
            "educational_highlights": jbot.get("best_practices_found", [])[:3],
            "risk_assessment": fraud.get("risk_level", "medium"),
            "member_summary": self._generate_member_summary(jbot, claudia, fraud)
        }
    
    def _generate_member_summary(self, jbot: Dict, claudia: Dict, fraud: Dict) -> str:
        """Generate a concise summary for members"""
        
        best_practices = jbot.get("best_practices_found", [])
        risk_level = fraud.get("risk_level", "medium")
        educational_score = jbot.get("educational_value", {}).get("score", 5)
        
        if educational_score >= 8 and risk_level == "low":
            return "Excellent educational content with solid trading principles. Great for learning fundamental concepts."
        elif educational_score >= 6 and risk_level in ["low", "medium"]:
            return "Good educational value with some practical insights. Useful for expanding your trading knowledge."
        elif educational_score >= 4:
            return "Mixed content - has some valuable elements but requires careful evaluation. Good for experienced traders."
        else:
            return "Limited educational value with significant concerns. Best avoided or viewed critically for entertainment only."
    
    def analyze_video_content(self, content_text: str, video_metadata: Dict) -> Dict[str, Any]:
        """Complete multi-agent analysis pipeline"""
        
        analysis_start = datetime.now()
        
        logger.info("Starting multi-agent analysis...")
        
        # Check model availability
        available_models = self.check_ollama_models()
        
        results = {
            "analysis_date": analysis_start.isoformat(),
            "video_metadata": video_metadata,
            "models_used": available_models,
            "content_length": len(content_text)
        }
        
        # Primary analysis with JBot
        if available_models.get("primary_analyst", False):
            logger.info("Running JBot primary analysis...")
            results["jbot_analysis"] = self.analyze_with_jbot(content_text, video_metadata)
        
        # Strategy analysis with Claudia
        if available_models.get("strategy_expert", False):
            logger.info("Running Claudia strategy analysis...")
            results["claudia_analysis"] = self.analyze_with_claudia_trader(
                content_text, results.get("jbot_analysis", {})
            )
        
        # Options analysis with Kathy
        if available_models.get("options_specialist", False):
            logger.info("Running Kathy options analysis...")
            results["kathy_analysis"] = self.analyze_with_kathy_ops(content_text)
        
        # Fraud detection
        if available_models.get("fraud_detector", False):
            logger.info("Running fraud detection...")
            results["fraud_analysis"] = self.fraud_detection_check(content_text)
        
        # Generate member review
        results["member_review"] = self.generate_member_review(results)
        
        # Processing time
        analysis_end = datetime.now()
        results["processing_time"] = str(analysis_end - analysis_start)
        
        # Save results
        review_id = results["member_review"]["review_id"]
        
        # Full analysis
        full_analysis_file = self.analysis_dir / f"{review_id}_full_analysis.json"
        with open(full_analysis_file, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        
        # Member-friendly review
        member_review_file = self.reviews_dir / f"{review_id}_member_review.json"
        with open(member_review_file, 'w', encoding='utf-8') as f:
            json.dump(results["member_review"], f, indent=2, ensure_ascii=False)
        
        logger.info(f"Analysis complete: {results['processing_time']}")
        
        return results

def main():
    """CLI interface for Ollama Video Analyzer"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description="🤖 Ollama GPU Video Analyzer - Multi-Agent Trading Content Analysis"
    )
    
    parser.add_argument('--check-models', action='store_true',
                       help='Check available Ollama models')
    parser.add_argument('--text', type=str,
                       help='Text content to analyze')
    parser.add_argument('--title', type=str, default="Unknown",
                       help='Video title')
    parser.add_argument('--channel', type=str, default="Unknown", 
                       help='Channel name')
    
    args = parser.parse_args()
    
    analyzer = OllamaVideoAnalyzer()
    
    if args.check_models:
        print("🤖 Checking Ollama Models...")
        models = analyzer.check_ollama_models()
        for role, available in models.items():
            status = "✅" if available else "❌"
            model_name = analyzer.models[role]
            print(f"  {status} {role}: {model_name}")
        return
    
    if args.text:
        video_metadata = {
            "title": args.title,
            "uploader": args.channel,
            "duration": "Unknown"
        }
        
        results = analyzer.analyze_video_content(args.text, video_metadata)
        
        # Print member review
        review = results["member_review"]
        print(f"\n{'='*60}")
        print(f"🤖 OLLAMA MULTI-AGENT ANALYSIS COMPLETE")
        print(f"{'='*60}")
        print(f"🎯 pAIt Score: {review['pait_score']}/100")
        print(f"📋 {review['badge']}: {review['recommendation']}")
        print(f"⏱️  Processing Time: {results['processing_time']}")
        
        if review['best_takeaways']:
            print(f"\n✅ Best Takeaways:")
            for takeaway in review['best_takeaways']:
                print(f"   • {takeaway}")
        
        if review['frankenstein_potential']:
            print(f"\n🔬 Frankenstein Strategy Potential:")
            for potential in review['frankenstein_potential']:
                print(f"   • {potential}")
        
        print(f"\n📝 Member Summary: {review['member_summary']}")

if __name__ == "__main__":
    main()
