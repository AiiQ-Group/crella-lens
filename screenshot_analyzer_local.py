#!/usr/bin/env python3
"""
📸 Screenshot Analyzer - Local Processing with Remote Integration
Analyzes trading screenshots locally, with future GPU server integration

This works NOW with your existing setup:
1. Local OCR + analysis (immediate results)
2. API bridge to your cron collection system  
3. Future: Direct GPU model integration when ports are configured
"""

import cv2
import pytesseract
from PIL import Image
import requests
import json
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any, Optional
import logging
import re

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ScreenshotAnalyzer:
    """Analyze trading screenshots with pAIt scoring"""
    
    def __init__(self, base_dir: str = "lens-data"):
        self.base_dir = Path(base_dir)
        self.screenshots_dir = self.base_dir / "screenshots"
        self.analysis_dir = self.base_dir / "screenshot_analysis"
        
        # Create directories
        for dir_path in [self.screenshots_dir, self.analysis_dir]:
            dir_path.mkdir(parents=True, exist_ok=True)
        
        # Your cron collection endpoint (when available)
        self.collection_endpoint = "http://146.190.188.208/latest_collection"
        
        logger.info("Screenshot Analyzer initialized")
    
    def extract_text_from_screenshot(self, image_path: str) -> str:
        """Extract text using OCR"""
        try:
            # Load image
            image = cv2.imread(image_path)
            if image is None:
                return ""
            
            # Convert to RGB
            image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            pil_image = Image.fromarray(image_rgb)
            
            # OCR extraction
            text = pytesseract.image_to_string(pil_image, config='--psm 6')
            return text.strip()
            
        except Exception as e:
            logger.error(f"OCR extraction failed: {e}")
            return ""
    
    def analyze_profit_claims(self, text: str) -> Dict[str, Any]:
        """Analyze profit claims in the content"""
        
        # Extract monetary amounts
        money_pattern = r'\$[\d,]+(?:\.\d{2})?'
        amounts = re.findall(money_pattern, text)
        
        # Extract time periods
        time_patterns = [
            r'(\d+)\s*(hour|hr|minute|min|day|week|month)s?',
            r'in\s+(\d+)\s*(hour|hr|minute|min|day|week|month)s?',
            r'just\s+(\d+)\s*(hour|hr|minute|min|day|week|month)s?'
        ]
        
        time_claims = []
        for pattern in time_patterns:
            matches = re.findall(pattern, text.lower())
            time_claims.extend(matches)
        
        # Calculate realism score
        realism_score = 10  # Start optimistic
        red_flags = []
        
        # Check for unrealistic claims
        if any("hour" in claim[1] for claim in time_claims) and amounts:
            realism_score -= 4
            red_flags.append("Hourly profit claims")
        
        if "99%" in text or "100%" in text:
            realism_score -= 3
            red_flags.append("Unrealistic success rates")
        
        if "guaranteed" in text.lower() or "no risk" in text.lower():
            realism_score -= 5
            red_flags.append("Guaranteed profit claims")
        
        return {
            "claimed_amounts": amounts,
            "time_claims": time_claims,
            "realism_score": max(0, realism_score),
            "red_flags": red_flags
        }
    
    def analyze_strategy_elements(self, text: str) -> Dict[str, Any]:
        """Identify trading strategies and tools"""
        
        # Common trading platforms
        platforms = ["pocket option", "iq option", "binomo", "olymp trade", "binance", "mt4", "mt5"]
        found_platforms = [p for p in platforms if p.lower() in text.lower()]
        
        # Trading tools/bots
        tools = ["bot", "signal", "indicator", "algorithm", "ai", "automated"]
        found_tools = [t for t in tools if t.lower() in text.lower()]
        
        # Technical indicators
        indicators = ["rsi", "macd", "bollinger", "moving average", "support", "resistance"]
        found_indicators = [i for i in indicators if i.lower() in text.lower()]
        
        # Strategy types
        if "binary" in text.lower():
            strategy_type = "Binary Options"
        elif "forex" in text.lower():
            strategy_type = "Forex"
        elif "crypto" in text.lower():
            strategy_type = "Cryptocurrency"
        else:
            strategy_type = "General Trading"
        
        return {
            "strategy_type": strategy_type,
            "platforms": found_platforms,
            "tools": found_tools,
            "indicators": found_indicators,
            "mentions_bot": "bot" in text.lower(),
            "mentions_telegram": "telegram" in text.lower()
        }
    
    def assess_educational_value(self, text: str) -> Dict[str, Any]:
        """Assess what traders can actually learn"""
        
        educational_keywords = [
            "learn", "tutorial", "guide", "strategy", "method", "technique",
            "analysis", "chart", "pattern", "signal", "entry", "exit"
        ]
        
        educational_mentions = sum(1 for keyword in educational_keywords 
                                 if keyword.lower() in text.lower())
        
        # Calculate score
        if educational_mentions >= 5:
            score = 8
        elif educational_mentions >= 3:
            score = 6
        elif educational_mentions >= 1:
            score = 4
        else:
            score = 2
        
        # Reduce score for get-rich-quick content
        if any(phrase in text.lower() for phrase in ["get rich", "easy money", "no work"]):
            score = max(1, score - 3)
        
        learnable_concepts = []
        if "chart" in text.lower():
            learnable_concepts.append("Chart reading")
        if "signal" in text.lower():
            learnable_concepts.append("Signal recognition")
        if "risk" in text.lower():
            learnable_concepts.append("Risk management")
        
        return {
            "score": score,
            "educational_mentions": educational_mentions,
            "learnable_concepts": learnable_concepts,
            "skill_level": "beginner" if educational_mentions < 3 else "intermediate"
        }
    
    def calculate_pait_components(self, text: str, profit_analysis: Dict, 
                                 strategy_analysis: Dict, educational_analysis: Dict) -> Dict[str, Any]:
        """Calculate pAIt component scores"""
        
        # Strategy Logic (0-25)
        strategy_logic = 15  # Base score
        if strategy_analysis["indicators"]:
            strategy_logic += 5
        if strategy_analysis["strategy_type"] != "General Trading":
            strategy_logic += 3
        if profit_analysis["realism_score"] > 7:
            strategy_logic += 2
        strategy_logic = min(25, strategy_logic)
        
        # Risk Transparency (0-25)
        risk_transparency = 10  # Base score
        if "risk" in text.lower():
            risk_transparency += 8
        if "loss" in text.lower():
            risk_transparency += 5
        if profit_analysis["red_flags"]:
            risk_transparency = max(5, risk_transparency - len(profit_analysis["red_flags"]) * 3)
        risk_transparency = min(25, risk_transparency)
        
        # Proof Quality (0-25)
        proof_quality = 12  # Base score
        if "screenshot" in text.lower() or "proof" in text.lower():
            proof_quality += 6
        if "result" in text.lower():
            proof_quality += 4
        if profit_analysis["realism_score"] < 6:
            proof_quality -= 8
        proof_quality = max(0, min(25, proof_quality))
        
        # Educational Merit (0-25)
        educational_merit = educational_analysis["score"] * 2.5  # Convert 0-10 to 0-25
        educational_merit = min(25, educational_merit)
        
        total_score = strategy_logic + risk_transparency + proof_quality + educational_merit
        
        return {
            "strategy_logic": strategy_logic,
            "risk_transparency": risk_transparency,
            "proof_quality": proof_quality,
            "educational_merit": educational_merit,
            "total_pait_score": total_score
        }
    
    def generate_frankenstein_recommendations(self, strategy_analysis: Dict, 
                                            educational_analysis: Dict) -> Dict[str, Any]:
        """Generate strategy combination recommendations"""
        
        base_concept = strategy_analysis.get("strategy_type", "Trading Strategy")
        
        # Safety modifications
        safety_mods = []
        if strategy_analysis["mentions_bot"]:
            safety_mods.append("Manual verification of bot signals")
            safety_mods.append("Reduced position sizing for automated trades")
        
        if "binary" in base_concept.lower():
            safety_mods.append("Limit binary options to <5% of portfolio")
            safety_mods.append("Focus on longer time frames")
        
        # Integration potential
        integration_ideas = []
        if strategy_analysis["indicators"]:
            integration_ideas.append("Combine with traditional technical analysis")
        if strategy_analysis["platforms"]:
            integration_ideas.append("Cross-platform signal verification")
        
        return {
            "base_concept": base_concept,
            "extractable_value": strategy_analysis.get("tools", []),
            "safety_modifications": safety_mods,
            "integration_potential": integration_ideas
        }
    
    def analyze_screenshot_content(self, content_text: str, 
                                  metadata: Dict = None) -> Dict[str, Any]:
        """Complete screenshot analysis"""
        
        if not metadata:
            metadata = {"source": "manual_input", "timestamp": datetime.now().isoformat()}
        
        logger.info("Starting screenshot analysis...")
        
        # Core analysis components
        profit_analysis = self.analyze_profit_claims(content_text)
        strategy_analysis = self.analyze_strategy_elements(content_text)
        educational_analysis = self.assess_educational_value(content_text)
        
        # Calculate pAIt scores
        pait_components = self.calculate_pait_components(
            content_text, profit_analysis, strategy_analysis, educational_analysis
        )
        
        # Generate recommendations
        frankenstein_recs = self.generate_frankenstein_recommendations(
            strategy_analysis, educational_analysis
        )
        
        # Final assessment
        total_score = pait_components["total_pait_score"]
        
        if total_score >= 80:
            recommendation = "EXCELLENT - Highly recommended"
            badge = "🏆 Top Quality"
            risk_level = "LOW"
        elif total_score >= 65:
            recommendation = "GOOD - Valuable with precautions"
            badge = "✅ Quality Content"
            risk_level = "MEDIUM"
        elif total_score >= 50:
            recommendation = "MIXED - Proceed carefully"
            badge = "⚠️ Caution Advised"
            risk_level = "HIGH"
        else:
            recommendation = "RISKY - Avoid or educational only"
            badge = "🚨 High Risk"
            risk_level = "VERY HIGH"
        
        # Compile results
        analysis_results = {
            "content_analyzed": content_text,
            "metadata": metadata,
            "analysis_timestamp": datetime.now().isoformat(),
            "profit_analysis": profit_analysis,
            "strategy_analysis": strategy_analysis,
            "educational_analysis": educational_analysis,
            "pait_components": pait_components,
            "frankenstein_recommendations": frankenstein_recs,
            "final_assessment": {
                "pait_score": total_score,
                "recommendation": recommendation,
                "badge": badge,
                "risk_level": risk_level
            },
            "member_summary": self._generate_member_summary(
                total_score, strategy_analysis, educational_analysis
            )
        }
        
        # Save analysis
        self._save_analysis(analysis_results)
        
        return analysis_results
    
    def _generate_member_summary(self, score: int, strategy_analysis: Dict, 
                               educational_analysis: Dict) -> str:
        """Generate member-friendly summary"""
        
        strategy_type = strategy_analysis.get("strategy_type", "Trading")
        educational_score = educational_analysis.get("score", 5)
        
        if score >= 80:
            return f"Excellent {strategy_type.lower()} content with strong educational value. Safe for learning fundamental concepts."
        elif score >= 65:
            return f"Good {strategy_type.lower()} insights with educational merit. Useful for expanding knowledge with awareness of risks."
        elif score >= 50:
            return f"Mixed {strategy_type.lower()} content - has some valuable elements but requires careful evaluation."
        else:
            return f"High-risk {strategy_type.lower()} content with limited educational value. Best avoided or viewed critically."
    
    def _save_analysis(self, analysis_results: Dict) -> None:
        """Save analysis results"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"screenshot_analysis_{timestamp}.json"
        filepath = self.analysis_dir / filename
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(analysis_results, f, indent=2, ensure_ascii=False)
        
        logger.info(f"Analysis saved: {filename}")
    
    def send_to_collection_system(self, analysis_results: Dict) -> bool:
        """Send results to your cron collection system (when available)"""
        
        try:
            # Format for your collection system
            collection_data = {
                "model_used": "local-ocr-analysis",
                "analysis": analysis_results["final_assessment"]["recommendation"],
                "pait_score": f"{analysis_results['final_assessment']['pait_score']}/100",
                "tournament_ready": analysis_results["final_assessment"]["pait_score"] >= 70,
                "timestamp": analysis_results["analysis_timestamp"],
                "screenshot_analysis": True,
                "strategy_type": analysis_results["strategy_analysis"]["strategy_type"],
                "risk_level": analysis_results["final_assessment"]["risk_level"]
            }
            
            # Try to send to collection endpoint
            response = requests.post(self.collection_endpoint, json=collection_data, timeout=10)
            if response.status_code == 200:
                logger.info("✅ Sent to collection system")
                return True
            else:
                logger.warning(f"Collection system response: {response.status_code}")
                return False
                
        except Exception as e:
            logger.warning(f"Could not send to collection system: {e}")
            return False

def main():
    """CLI interface for screenshot analysis"""
    import argparse
    
    parser = argparse.ArgumentParser(description="📸 Screenshot Analyzer - Trading Content Analysis")
    parser.add_argument('--text', type=str, help='Text content to analyze')
    parser.add_argument('--image', type=str, help='Path to screenshot image')
    parser.add_argument('--demo', action='store_true', help='Run with demo content')
    
    args = parser.parse_args()
    
    analyzer = ScreenshotAnalyzer()
    
    if args.demo:
        # Use your example content
        demo_content = """
        $322 IN JUST HOUR
        WITH POCKET OPTION
        $322 in 1 Hour?! Pocket Option AI Trading Bot from Telegram BLEW My Mind
        141K views • 3 weeks ago
        Techno Cows
        Binary Options Trading Bot
        Telegram Channel: @PocketOptionBot
        Success Rate: 99.2%
        Profit Tracking Dashboard
        Real-time Signals
        """
        
        results = analyzer.analyze_screenshot_content(demo_content)
        
    elif args.image:
        # Extract text from image
        text = analyzer.extract_text_from_screenshot(args.image)
        if not text:
            print("❌ Could not extract text from image")
            return
        
        results = analyzer.analyze_screenshot_content(text)
        
    elif args.text:
        # Analyze provided text
        results = analyzer.analyze_screenshot_content(args.text)
        
    else:
        parser.print_help()
        return
    
    # Display results
    final = results["final_assessment"]
    print(f"\n{'='*60}")
    print(f"📸 SCREENSHOT ANALYSIS COMPLETE")
    print(f"{'='*60}")
    print(f"🎯 pAIt Score: {final['pait_score']}/100")
    print(f"📋 {final['badge']}: {final['recommendation']}")
    print(f"⚠️  Risk Level: {final['risk_level']}")
    
    # Component breakdown
    components = results["pait_components"]
    print(f"\n📊 COMPONENT SCORES:")
    print(f"   Strategy Logic: {components['strategy_logic']}/25")
    print(f"   Risk Transparency: {components['risk_transparency']}/25")
    print(f"   Proof Quality: {components['proof_quality']}/25")
    print(f"   Educational Merit: {components['educational_merit']}/25")
    
    # Key insights
    strategy = results["strategy_analysis"]
    print(f"\n🎯 STRATEGY INSIGHTS:")
    print(f"   Type: {strategy['strategy_type']}")
    if strategy['platforms']:
        print(f"   Platforms: {', '.join(strategy['platforms'])}")
    if strategy['tools']:
        print(f"   Tools: {', '.join(strategy['tools'])}")
    
    # Frankenstein potential
    frankenstein = results["frankenstein_recommendations"]
    if frankenstein['safety_modifications']:
        print(f"\n🔬 SAFETY RECOMMENDATIONS:")
        for mod in frankenstein['safety_modifications']:
            print(f"   • {mod}")
    
    # Member summary
    print(f"\n📝 MEMBER SUMMARY:")
    print(f"   {results['member_summary']}")
    
    # Try sending to collection system
    if analyzer.send_to_collection_system(results):
        print(f"\n✅ Results sent to collection system")
    else:
        print(f"\n💾 Results saved locally (collection system unavailable)")

if __name__ == "__main__":
    main()
