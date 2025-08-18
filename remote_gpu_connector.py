#!/usr/bin/env python3
"""
🌐 Remote GPU Connector - Bridge to Your AiiQ Neural Center
Connect Windows analysis to your GPU server at 146.190.188.208
"""

import requests
import json
from typing import Dict, List, Any, Optional
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

class RemoteGPUConnector:
    """Connect to your remote Ollama GPU server"""
    
    def __init__(self, gpu_server_ip: str = "146.190.188.208", gpu_port: int = 11434):
        self.gpu_server_url = f"http://{gpu_server_ip}:{gpu_port}"
        self.local_ollama_url = "http://localhost:11434"
        
        # Your specialized models on the GPU server
        self.gpu_models = {
            "primary_analyst": "jbot:latest",           # 47GB - Main trading analysis
            "strategy_expert": "claudia-trader:latest", # 67GB - Advanced strategies
            "options_specialist": "kathy-ops:latest",   # 67GB - Options expert
            "max_trader": "trader-max:latest",          # 47GB - Maximum insights
            "fraud_detector": "fraud-detector:latest",  # Security analysis
            "compliance_officer": "compliance-officer:latest", # Regulatory
            "quantum_analyst": "qwen2.5:72b",          # 47GB - Deep analysis
            "juliet_assistant": "juliet:latest"         # 5GB - Quick analysis
        }
        
        logger.info(f"Remote GPU Connector initialized: {self.gpu_server_url}")
    
    def check_gpu_server_connection(self) -> bool:
        """Test connection to your GPU server"""
        try:
            response = requests.get(f"{self.gpu_server_url}/api/tags", timeout=10)
            if response.status_code == 200:
                models = response.json().get('models', [])
                logger.info(f"✅ GPU Server connected - {len(models)} models available")
                return True
            else:
                logger.error(f"❌ GPU Server response error: {response.status_code}")
                return False
        except requests.exceptions.RequestException as e:
            logger.error(f"❌ Cannot connect to GPU server: {e}")
            return False
    
    def get_available_gpu_models(self) -> Dict[str, bool]:
        """Check which models are available on your GPU server"""
        if not self.check_gpu_server_connection():
            return {role: False for role in self.gpu_models.keys()}
        
        try:
            response = requests.get(f"{self.gpu_server_url}/api/tags", timeout=15)
            if response.status_code != 200:
                return {role: False for role in self.gpu_models.keys()}
            
            available_models = [model['name'] for model in response.json().get('models', [])]
            
            model_status = {}
            for role, model_name in self.gpu_models.items():
                model_status[role] = model_name in available_models
            
            available_count = sum(model_status.values())
            logger.info(f"GPU Models: {available_count}/{len(self.gpu_models)} available")
            
            return model_status
            
        except Exception as e:
            logger.error(f"Error checking GPU models: {e}")
            return {role: False for role in self.gpu_models.keys()}
    
    def query_gpu_model(self, model_role: str, prompt: str, timeout: int = 180) -> Optional[str]:
        """Query a model on your GPU server"""
        
        if model_role not in self.gpu_models:
            logger.error(f"Unknown model role: {model_role}")
            return None
        
        model_name = self.gpu_models[model_role]
        
        try:
            payload = {
                "model": model_name,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.7,
                    "top_p": 0.9
                }
            }
            
            logger.info(f"🤖 Querying {model_role} ({model_name}) on GPU server...")
            
            response = requests.post(
                f"{self.gpu_server_url}/api/generate",
                json=payload,
                timeout=timeout
            )
            
            if response.status_code == 200:
                result = response.json()
                response_text = result.get('response', '').strip()
                
                if response_text:
                    logger.info(f"✅ {model_role} analysis complete ({len(response_text)} chars)")
                    return response_text
                else:
                    logger.warning(f"⚠️ {model_role} returned empty response")
                    return None
            else:
                logger.error(f"❌ {model_role} error: HTTP {response.status_code}")
                return None
                
        except requests.exceptions.Timeout:
            logger.error(f"⏰ {model_role} timeout after {timeout}s")
            return None
        except Exception as e:
            logger.error(f"💥 {model_role} error: {e}")
            return None
    
    def analyze_screenshot_content(self, screenshot_text: str, metadata: Dict = None) -> Dict[str, Any]:
        """Complete screenshot analysis using your GPU models"""
        
        if not metadata:
            metadata = {"source": "screenshot", "timestamp": "2025-08-18"}
        
        analysis_results = {
            "screenshot_content": screenshot_text,
            "metadata": metadata,
            "gpu_server": self.gpu_server_url,
            "models_attempted": []
        }
        
        # Check GPU server availability
        if not self.check_gpu_server_connection():
            analysis_results["error"] = "GPU server unavailable"
            return analysis_results
        
        available_models = self.get_available_gpu_models()
        
        # 1. Primary Analysis with JBot (47GB model)
        if available_models.get("primary_analyst", False):
            jbot_prompt = f"""You are JBot, analyzing a trading screenshot for pAIt scoring.

SCREENSHOT CONTENT:
{screenshot_text}

Your mission: Extract BEST PRACTICES and educational value, even from overhyped content.

ANALYSIS FRAMEWORK:
1. **Profit Claims Analysis** - Are the profit claims realistic or inflated?
2. **Strategy Identification** - What trading methods/tools are mentioned?
3. **Risk Assessment** - Any risk warnings or lack thereof?
4. **Educational Value** - What can traders actually learn?
5. **Implementation Clarity** - How clear are the instructions?

FRANKENSTEIN POTENTIAL:
- Which elements could be adapted safely?
- What modifications would reduce risk?
- How could this combine with other strategies?

OUTPUT (JSON):
{{
  "profit_claims": {{
    "claimed_return": "amount claimed",
    "timeframe": "time period",
    "realism_score": 0-10,
    "red_flags": ["unrealistic aspects"]
  }},
  "strategy_elements": {{
    "trading_method": "method used",
    "platforms": ["platforms mentioned"],
    "tools": ["tools/bots mentioned"],
    "indicators": ["technical indicators"]
  }},
  "educational_value": {{
    "score": 0-10,
    "learnable_concepts": ["specific lessons"],
    "skill_level_required": "beginner|intermediate|advanced"
  }},
  "risk_assessment": {{
    "risk_warnings_present": true/false,
    "potential_losses": "risk level",
    "regulatory_concerns": ["concerns if any"]
  }},
  "pait_components": {{
    "strategy_logic": 0-25,
    "risk_transparency": 0-25,
    "proof_quality": 0-25,
    "educational_merit": 0-25
  }},
  "frankenstein_recommendations": {{
    "extractable_value": ["valuable elements"],
    "safety_modifications": ["risk reduction methods"],
    "integration_potential": "how to combine safely"
  }},
  "member_verdict": "concise recommendation for members"
}}"""

            jbot_response = self.query_gpu_model("primary_analyst", jbot_prompt)
            analysis_results["models_attempted"].append("jbot")
            
            if jbot_response:
                try:
                    # Extract JSON from response
                    json_start = jbot_response.find('{')
                    json_end = jbot_response.rfind('}') + 1
                    if json_start >= 0 and json_end > json_start:
                        jbot_analysis = json.loads(jbot_response[json_start:json_end])
                        analysis_results["jbot_analysis"] = jbot_analysis
                except json.JSONDecodeError:
                    analysis_results["jbot_raw"] = jbot_response
        
        # 2. Strategy Deep-Dive with Claudia (67GB model)
        if available_models.get("strategy_expert", False):
            claudia_prompt = f"""You are Claudia-Trader, providing advanced strategy analysis.

SCREENSHOT CONTENT:
{screenshot_text}

JBOT FINDINGS:
{json.dumps(analysis_results.get("jbot_analysis", {}), indent=2)}

ADVANCED STRATEGY ANALYSIS:
1. **Core Strategy Mechanics** - How does this actually work?
2. **Market Condition Dependencies** - When would this succeed/fail?
3. **Capital Requirements** - What investment levels are needed?
4. **Scalability Assessment** - Can this be scaled up/down?
5. **Alternative Implementations** - Better ways to execute this idea?

FRANKENSTEIN ENHANCEMENT:
How can we improve this strategy by combining with proven methods?

OUTPUT (JSON):
{{
  "strategy_deconstruction": {{
    "core_mechanism": "how it works",
    "success_conditions": ["when it works"],
    "failure_modes": ["when it fails"],
    "capital_requirements": "investment needed"
  }},
  "pait_detailed_scoring": {{
    "strategy_logic": {{
      "score": 0-25,
      "reasoning": "detailed explanation"
    }},
    "risk_management": {{
      "score": 0-25,
      "reasoning": "risk assessment details"
    }},
    "proof_quality": {{
      "score": 0-25,
      "reasoning": "evidence evaluation"
    }},
    "educational_value": {{
      "score": 0-25,
      "reasoning": "learning potential"
    }},
    "total_pait_score": 0-100
  }},
  "frankenstein_strategy": {{
    "base_concept": "core idea worth keeping",
    "recommended_modifications": ["safety improvements"],
    "complementary_strategies": ["what to combine with"],
    "risk_mitigation": ["how to reduce dangers"]
  }},
  "implementation_guidance": {{
    "beginner_approach": "safer version for beginners",
    "advanced_approach": "full implementation for experts",
    "position_sizing": "recommended capital allocation"
  }}
}}"""

            claudia_response = self.query_gpu_model("strategy_expert", claudia_prompt)
            analysis_results["models_attempted"].append("claudia_trader")
            
            if claudia_response:
                try:
                    json_start = claudia_response.find('{')
                    json_end = claudia_response.rfind('}') + 1
                    if json_start >= 0 and json_end > json_start:
                        claudia_analysis = json.loads(claudia_response[json_start:json_end])
                        analysis_results["claudia_analysis"] = claudia_analysis
                except json.JSONDecodeError:
                    analysis_results["claudia_raw"] = claudia_response
        
        # 3. Generate final pAIt score and recommendation
        analysis_results["final_assessment"] = self._generate_final_assessment(analysis_results)
        
        return analysis_results
    
    def _generate_final_assessment(self, analysis: Dict) -> Dict[str, Any]:
        """Generate final pAIt score and member recommendation"""
        
        # Extract scores from Claudia's detailed analysis
        claudia = analysis.get("claudia_analysis", {})
        detailed_scoring = claudia.get("pait_detailed_scoring", {})
        
        if detailed_scoring:
            final_score = detailed_scoring.get("total_pait_score", 50)
        else:
            # Fallback: calculate from JBot components
            jbot = analysis.get("jbot_analysis", {})
            components = jbot.get("pait_components", {})
            final_score = sum(components.values()) if components else 50
        
        # Generate recommendation based on score
        if final_score >= 80:
            recommendation = "EXCELLENT - Highly recommended for learning"
            badge = "🏆 Top Quality"
            risk_level = "LOW"
        elif final_score >= 65:
            recommendation = "GOOD - Valuable insights, proceed with awareness"
            badge = "✅ Quality Content"
            risk_level = "MEDIUM"
        elif final_score >= 50:
            recommendation = "MIXED - Some value, significant caution advised"
            badge = "⚠️ Proceed Carefully"
            risk_level = "HIGH"
        elif final_score >= 35:
            recommendation = "RISKY - Limited educational value"
            badge = "🚨 High Risk"
            risk_level = "VERY HIGH"
        else:
            recommendation = "AVOID - Likely misleading or fraudulent"
            badge = "❌ Avoid"
            risk_level = "EXTREME"
        
        return {
            "final_pait_score": final_score,
            "recommendation": recommendation,
            "badge": badge,
            "risk_level": risk_level,
            "analysis_timestamp": "2025-08-18T11:15:00Z",
            "models_used": len(analysis.get("models_attempted", [])),
            "gpu_server_used": True
        }
    
    def integrate_with_cron_system(self, analysis_results: Dict) -> Dict[str, Any]:
        """Format results for your existing cron collection system"""
        
        final_assessment = analysis_results.get("final_assessment", {})
        jbot_analysis = analysis_results.get("jbot_analysis", {})
        claudia_analysis = analysis_results.get("claudia_analysis", {})
        
        # Format for your collection system (similar to vwap_analysis format)
        collection_data = {
            "model_used": "claudia-trader",
            "analysis": "screenshot_pait_analysis",
            "pait_score": f"{final_assessment.get('final_pait_score', 50)}/100",
            "tournament_ready": final_assessment.get('final_pait_score', 50) >= 70,
            "timestamp": "2025-08-18T11:15:00Z",
            "risk_assessment": final_assessment.get('risk_level', 'MEDIUM'),
            "recommendation": final_assessment.get('recommendation', 'Under Review'),
            "gpu_server_analysis": True,
            "extractable_strategies": claudia_analysis.get("frankenstein_strategy", {}).get("base_concept", ""),
            "member_safety_score": 100 - (analysis_results.get("fraud_risk_score", 20)),
            "educational_value": jbot_analysis.get("educational_value", {}).get("score", 5)
        }
        
        return collection_data

def main():
    """Test connection to your GPU server and run analysis"""
    import argparse
    
    parser = argparse.ArgumentParser(description="🤖 Remote GPU Connector Test")
    parser.add_argument('--check-connection', action='store_true', help='Test GPU server connection')
    parser.add_argument('--test-analysis', action='store_true', help='Test screenshot analysis')
    
    args = parser.parse_args()
    
    connector = RemoteGPUConnector(gpu_server_ip="146.190.188.208")
    
    if args.check_connection:
        print("🌐 Testing GPU Server Connection...")
        if connector.check_gpu_server_connection():
            models = connector.get_available_gpu_models()
            print(f"✅ Connected to GPU server!")
            print(f"📊 Available Models:")
            for role, available in models.items():
                status = "✅" if available else "❌"
                model_name = connector.gpu_models[role]
                print(f"   {status} {role}: {model_name}")
        else:
            print("❌ Cannot connect to GPU server")
    
    if args.test_analysis:
        test_screenshot = """
        $322 IN JUST HOUR
        WITH POCKET OPTION
        Binary Options Trading Bot
        Telegram Channel: @PocketOptionBot
        Success Rate: 99.2%
        141K views • 3 weeks ago
        """
        
        print("🧪 Testing Screenshot Analysis...")
        results = connector.analyze_screenshot_content(test_screenshot)
        
        final = results.get("final_assessment", {})
        print(f"🎯 Final pAIt Score: {final.get('final_pait_score', 'N/A')}/100")
        print(f"📋 {final.get('badge', 'N/A')}: {final.get('recommendation', 'N/A')}")
        print(f"🤖 Models Used: {results.get('models_attempted', [])}")
        
        # Show cron integration format
        cron_data = connector.integrate_with_cron_system(results)
        print(f"\n📊 Cron Collection Format:")
        print(json.dumps(cron_data, indent=2))

if __name__ == "__main__":
    main()
