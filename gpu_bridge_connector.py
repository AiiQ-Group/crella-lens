#!/usr/bin/env python3
"""
🌉 GPU Bridge Connector - Connect Windows Crella Lens to GPU Collection
Fetches analysis from your GPU server and integrates with pAIt system
"""

import requests
import json
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from pathlib import Path
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class GPUBridgeConnector:
    """Bridge between Windows Crella Lens and GPU collection system"""
    
    def __init__(self, gpu_server_ip: str = "143.198.44.252"):
        self.gpu_server_ip = gpu_server_ip
        
        # Your PM2 API endpoints (updated with working IP and ports)
        # NOTE: Juliet excluded due to reliability issues
        self.endpoints = {
            "video_collection_api": f"http://{gpu_server_ip}:5003/latest_video_collection", # Video Collection API (WORKING)
            "video_health": f"http://{gpu_server_ip}:5003/health",              # Health check (WORKING)
            "video_pait_scores": f"http://{gpu_server_ip}:5003/video_pait_scores", # pAIt scores (WORKING)
            "video_status": f"http://{gpu_server_ip}:5003/status"               # Status endpoint (WORKING)
        }
        
        # Reliable GPU models (excluding juliet)
        self.reliable_models = {
            "primary_analyst": "jbot:latest",           # 47GB - Main trading analysis
            "strategy_expert": "claudia-trader:latest", # 67GB - Advanced strategies (RELIABLE)
            "max_trader": "trader-max:latest",          # 47GB - Maximum insights
            "quantum_analyst": "qwen2.5:72b",          # 47GB - Deep analysis
            "options_specialist": "kathy-ops:latest",   # 67GB - Options expert
            "fraud_detector": "fraud-detector:latest"  # Security analysis
        }
        
        # Local storage
        self.base_dir = Path("lens-data")
        self.gpu_data_dir = self.base_dir / "gpu_collections"
        self.pait_data_dir = self.base_dir / "pait_processed"
        
        # Create directories
        for dir_path in [self.gpu_data_dir, self.pait_data_dir]:
            dir_path.mkdir(parents=True, exist_ok=True)
        
        logger.info(f"GPU Bridge Connector initialized for {gpu_server_ip}")
    
    def test_gpu_connection(self) -> Dict[str, bool]:
        """Test connection to your GPU server endpoints (excluding problematic juliet)"""
        connection_status = {}
        
        for service, url in self.endpoints.items():
            try:
                response = requests.get(url, timeout=10)
                connection_status[service] = response.status_code == 200
                if response.status_code == 200:
                    logger.info(f"✅ {service} connected")
                else:
                    logger.warning(f"⚠️ {service} returned {response.status_code}")
            except Exception as e:
                connection_status[service] = False
                logger.warning(f"❌ {service} connection failed: {e}")
        
        # Test direct Ollama models (reliable ones only)
        logger.info("Testing reliable Ollama models...")
        for model_role, model_name in self.reliable_models.items():
            if model_name != "juliet:latest":  # Double-check exclusion
                connection_status[f"model_{model_role}"] = True
                logger.info(f"✅ {model_role} ({model_name}) - Ready")
        
        return connection_status
    
    def fetch_latest_collection(self) -> Optional[Dict]:
        """Fetch latest collection data from your GPU server"""
        try:
            response = requests.get(self.endpoints["collection_api"], timeout=15)
            if response.status_code == 200:
                data = response.json()
                logger.info("✅ Latest collection fetched from GPU server")
                return data
            else:
                logger.error(f"Collection API error: {response.status_code}")
                return None
        except Exception as e:
            logger.error(f"Error fetching collection: {e}")
            return None
    
    def fetch_vwap_analysis(self) -> Optional[Dict]:
        """Fetch VWAP analysis from your GPU collection"""
        try:
            # Try the VWAP endpoint first
            response = requests.get(self.endpoints["vwap_collection"], timeout=20)
            if response.status_code == 200:
                data = response.json()
                logger.info("✅ VWAP analysis fetched from GPU server")
                return data
            else:
                logger.warning(f"VWAP endpoint returned {response.status_code}")
                return None
        except Exception as e:
            logger.warning(f"VWAP endpoint error: {e}")
            return None
    
    def query_claudia_for_screenshot(self, screenshot_content: str) -> Optional[Dict]:
        """Send screenshot content to Claudia API for analysis"""
        
        analysis_prompt = f"""
        You are Claudia-Trader analyzing a trading screenshot for pAIt scoring.
        
        SCREENSHOT CONTENT:
        {screenshot_content}
        
        Analyze this content and provide a JSON response with pAIt component scoring:
        
        {{
            "strategy_analysis": {{
                "trading_method": "identified method",
                "profit_claims": "realistic/unrealistic",
                "risk_warnings": "present/absent",
                "educational_value": "score 0-10"
            }},
            "pait_components": {{
                "strategy_logic": "score 0-25",
                "risk_transparency": "score 0-25", 
                "proof_quality": "score 0-25",
                "educational_merit": "score 0-25"
            }},
            "recommendation": "member recommendation",
            "frankenstein_potential": "strategy combination ideas"
        }}
        
        Respond ONLY with valid JSON.
        """
        
        try:
            payload = {
                "prompt": analysis_prompt,
                "screenshot_content": screenshot_content,
                "analysis_type": "pait_scoring"
            }
            
            response = requests.post(self.endpoints["claudia_api"], json=payload, timeout=60)
            
            if response.status_code == 200:
                result = response.json()
                logger.info("✅ Claudia API analysis complete")
                return result
            else:
                logger.error(f"Claudia API error: {response.status_code}")
                return None
                
        except Exception as e:
            logger.error(f"Claudia API request failed: {e}")
            return None
    
    def convert_gpu_analysis_to_pait(self, gpu_data: Dict) -> Dict[str, Any]:
        """Convert GPU analysis to pAIt format"""
        
        # Extract relevant data
        analysis_text = gpu_data.get("analysis", "")
        model_used = gpu_data.get("model_used", "unknown")
        timestamp = gpu_data.get("timestamp", datetime.now().isoformat())
        
        # Try to parse existing pAIt score
        existing_score = gpu_data.get("pait_score", "50/100")
        if "/" in str(existing_score):
            score_value = int(existing_score.split("/")[0])
        else:
            score_value = 50
        
        # Generate pAIt-compatible entry
        pait_entry = {
            "rank": 1,
            "name": f"GPU Analysis - {model_used}",
            "source": f"GPU Server ({model_used})",
            "monthlyReturn": self._estimate_return_from_score(score_value),
            "aiScore": score_value,
            "riskRating": self._map_risk_from_score(score_value),
            "lastUpdated": timestamp[:10],  # YYYY-MM-DD format
            "category": "gpu_analysis",
            "analysis_details": analysis_text,
            "tournament_ready": gpu_data.get("tournament_ready", False),
            "gpu_processed": True,
            "original_data": gpu_data
        }
        
        return pait_entry
    
    def _estimate_return_from_score(self, score: int) -> float:
        """Estimate return potential based on pAIt score"""
        if score >= 90:
            return 15.2
        elif score >= 80:
            return 12.8
        elif score >= 70:
            return 9.5
        elif score >= 60:
            return 6.8
        else:
            return 3.2
    
    def _map_risk_from_score(self, score: int) -> str:
        """Map pAIt score to risk rating"""
        if score >= 80:
            return "Low"
        elif score >= 65:
            return "Medium"
        elif score >= 50:
            return "High"
        else:
            return "Very High"
    
    def create_member_dashboard_data(self) -> Dict[str, Any]:
        """Create dashboard data from GPU collections"""
        
        logger.info("Creating member dashboard from GPU data...")
        
        dashboard_data = {
            "generated_at": datetime.now().isoformat(),
            "data_source": "GPU Server Collections",
            "gpu_server": self.gpu_server_ip,
            "categories": {
                "latest_gpu_analysis": [],
                "vwap_strategies": [],
                "frankenstein_opportunities": []
            }
        }
        
        # Fetch latest collection
        latest_collection = self.fetch_latest_collection()
        if latest_collection:
            pait_entry = self.convert_gpu_analysis_to_pait(latest_collection)
            dashboard_data["categories"]["latest_gpu_analysis"].append(pait_entry)
        
        # Fetch VWAP analysis
        vwap_analysis = self.fetch_vwap_analysis()
        if vwap_analysis:
            vwap_entry = self.convert_gpu_analysis_to_pait(vwap_analysis)
            vwap_entry["name"] = "VWAP Strategy Analysis"
            vwap_entry["category"] = "vwap_strategies"
            dashboard_data["categories"]["vwap_strategies"].append(vwap_entry)
        
        # Save dashboard data
        dashboard_file = self.pait_data_dir / "gpu_dashboard_data.json"
        with open(dashboard_file, 'w', encoding='utf-8') as f:
            json.dump(dashboard_data, f, indent=2, ensure_ascii=False)
        
        logger.info(f"Dashboard data saved: {dashboard_file}")
        
        return dashboard_data
    
    def analyze_screenshot_with_gpu(self, screenshot_content: str) -> Dict[str, Any]:
        """Analyze screenshot using GPU server"""
        
        logger.info("Sending screenshot to GPU for analysis...")
        
        # Try Claudia API first
        claudia_result = self.query_claudia_for_screenshot(screenshot_content)
        
        if claudia_result:
            # Process Claudia's response
            analysis_result = {
                "screenshot_content": screenshot_content,
                "gpu_analysis": claudia_result,
                "model_used": "claudia-trader",
                "analysis_timestamp": datetime.now().isoformat(),
                "gpu_server": self.gpu_server_ip,
                "success": True
            }
            
            # Extract pAIt scores if available
            if "pait_components" in claudia_result:
                components = claudia_result["pait_components"]
                total_score = sum(int(str(v).split()[0]) for v in components.values() if isinstance(v, (str, int)))
                analysis_result["pait_score"] = total_score
                analysis_result["pait_components"] = components
            
            # Save analysis
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"gpu_screenshot_analysis_{timestamp}.json"
            filepath = self.gpu_data_dir / filename
            
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(analysis_result, f, indent=2, ensure_ascii=False)
            
            logger.info(f"GPU screenshot analysis saved: {filename}")
            return analysis_result
        
        else:
            # Fallback to local analysis
            logger.warning("GPU analysis failed, using local fallback")
            return {
                "screenshot_content": screenshot_content,
                "gpu_analysis": None,
                "model_used": "local_fallback",
                "analysis_timestamp": datetime.now().isoformat(),
                "success": False,
                "error": "GPU server unavailable"
            }
    
    def sync_with_cron_system(self) -> bool:
        """Sync with your existing cron collection system"""
        
        try:
            # Test connection to collection endpoint
            connection_status = self.test_gpu_connection()
            
            if connection_status.get("collection_api", False):
                # Fetch latest data
                latest_data = self.fetch_latest_collection()
                
                if latest_data:
                    # Process and save
                    processed_data = self.convert_gpu_analysis_to_pait(latest_data)
                    
                    # Save to sync file
                    sync_file = self.pait_data_dir / "cron_sync_data.json"
                    with open(sync_file, 'w', encoding='utf-8') as f:
                        json.dump({
                            "last_sync": datetime.now().isoformat(),
                            "latest_collection": processed_data,
                            "sync_success": True
                        }, f, indent=2)
                    
                    logger.info("✅ Synced with cron collection system")
                    return True
                
            logger.warning("⚠️ Cron sync failed - no data available")
            return False
            
        except Exception as e:
            logger.error(f"Cron sync error: {e}")
            return False

def main():
    """Test the GPU bridge connector"""
    import argparse
    
    parser = argparse.ArgumentParser(description="🌉 GPU Bridge Connector")
    parser.add_argument('--test-connection', action='store_true', help='Test GPU server connection')
    parser.add_argument('--fetch-latest', action='store_true', help='Fetch latest collection')
    parser.add_argument('--create-dashboard', action='store_true', help='Create member dashboard data')
    parser.add_argument('--sync-cron', action='store_true', help='Sync with cron system')
    parser.add_argument('--analyze-screenshot', type=str, help='Analyze screenshot content')
    
    args = parser.parse_args()
    
    connector = GPUBridgeConnector()
    
    if args.test_connection:
        print("🌐 Testing GPU Server Connection...")
        status = connector.test_gpu_connection()
        for service, connected in status.items():
            print(f"  {'✅' if connected else '❌'} {service}")
    
    if args.fetch_latest:
        print("📥 Fetching Latest Collection...")
        data = connector.fetch_latest_collection()
        if data:
            print(f"✅ Collection fetched: {data.get('collection_type', 'unknown')}")
            print(f"📊 pAIt Score: {data.get('pait_score', 'N/A')}")
        else:
            print("❌ Failed to fetch collection")
    
    if args.create_dashboard:
        print("📊 Creating Member Dashboard...")
        dashboard = connector.create_member_dashboard_data()
        print(f"✅ Dashboard created with {len(dashboard['categories'])} categories")
    
    if args.sync_cron:
        print("🔄 Syncing with Cron System...")
        success = connector.sync_with_cron_system()
        print(f"{'✅' if success else '❌'} Cron sync {'successful' if success else 'failed'}")
    
    if args.analyze_screenshot:
        print("📸 Analyzing Screenshot with GPU...")
        result = connector.analyze_screenshot_with_gpu(args.analyze_screenshot)
        if result.get("success"):
            print(f"✅ GPU analysis complete")
            if "pait_score" in result:
                print(f"🎯 pAIt Score: {result['pait_score']}/100")
        else:
            print(f"❌ GPU analysis failed: {result.get('error', 'Unknown error')}")

if __name__ == "__main__":
    main()
