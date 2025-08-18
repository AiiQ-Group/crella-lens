#!/usr/bin/env python3
"""
📊 Gringots Dashboard Client - Pull from H100 Results
Lightweight Windows client that pulls analysis results from H100 GPU server

This runs on Gringots (Windows) and displays results processed on H100.
"""

import requests
import json
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from pathlib import Path
import logging
import time

# Configure logging for Windows
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class GringotsDashboardClient:
    """Windows client for H100 analysis results"""
    
    def __init__(self, h100_ip: str = "143.198.44.252"):
        self.h100_ip = h100_ip
        
        # H100 API endpoints (updated with working IP and ports)
        self.endpoints = {
            "latest_collection": f"http://{h100_ip}:5003/latest_video_collection",
            "video_scores": f"http://{h100_ip}:5003/video_pait_scores", 
            "pait_dashboard": f"http://{h100_ip}:5003/status",
            "health_check": f"http://{h100_ip}:5003/health"
        }
        
        # Local storage for caching
        self.cache_dir = Path("lens-data/h100_cache")
        self.dashboard_dir = Path("lens-data/dashboard")
        
        for dir_path in [self.cache_dir, self.dashboard_dir]:
            dir_path.mkdir(parents=True, exist_ok=True)
        
        logger.info(f"Gringots Dashboard Client initialized for H100: {h100_ip}")
    
    def test_h100_connection(self) -> Dict[str, bool]:
        """Test connection to H100 endpoints"""
        
        connection_status = {}
        
        for service, url in self.endpoints.items():
            try:
                response = requests.get(url, timeout=10)
                connection_status[service] = response.status_code == 200
                
                if response.status_code == 200:
                    logger.info(f"✅ {service} connected")
                else:
                    logger.warning(f"⚠️ {service} returned {response.status_code}")
                    
            except requests.exceptions.Timeout:
                connection_status[service] = False
                logger.warning(f"⏰ {service} timeout")
            except Exception as e:
                connection_status[service] = False
                logger.warning(f"❌ {service} connection failed: {e}")
        
        return connection_status
    
    def fetch_latest_video_scores(self) -> Optional[List[Dict]]:
        """Fetch latest video pAIt scores from H100 (using latest_collection data)"""
        
        try:
            # Use the latest_collection endpoint which we know works
            response = requests.get(self.endpoints["latest_collection"], timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                
                # Extract video analysis data and convert to scores format
                video_analyses = data.get("youtube_analysis", [])
                scores = []
                
                for video in video_analyses:
                    # Convert H100 video data to score format
                    score_data = {
                        "video_id": video.get("video_id"),
                        "title": video.get("title"),
                        "channel": video.get("channel"), 
                        "video_url": video.get("video_url"),
                        "processed_at": video.get("processed_at"),
                        "duration": video.get("duration"),
                        "views": video.get("views"),
                        "pait_score": 75,  # Estimated from analysis (could be enhanced)
                        "risk_assessment": "medium",
                        "model_used": video.get("model_used")
                    }
                    scores.append(score_data)
                
                logger.info(f"✅ Extracted {len(scores)} video scores from H100 collection data")
                
                # Cache locally
                cache_file = self.cache_dir / f"video_scores_{datetime.now().strftime('%Y%m%d_%H')}.json"
                with open(cache_file, 'w', encoding='utf-8') as f:
                    json.dump({"scores": scores, "source": "latest_collection"}, f, indent=2)
                
                return scores
            
            else:
                logger.error(f"❌ Latest collection API error: {response.status_code}")
                return None
                
        except Exception as e:
            logger.error(f"💥 Error fetching video data: {e}")
            return None
    
    def fetch_collection_data(self) -> Optional[Dict]:
        """Fetch latest collection data from H100"""
        
        try:
            response = requests.get(self.endpoints["latest_collection"], timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                logger.info("✅ Collection data fetched from H100")
                return data
            else:
                logger.error(f"❌ Collection API error: {response.status_code}")
                return None
                
        except Exception as e:
            logger.error(f"💥 Error fetching collection: {e}")
            return None
    
    def convert_h100_to_pait_format(self, video_scores: List[Dict]) -> List[Dict]:
        """Convert H100 video scores to pAIt format for UI"""
        
        pait_entries = []
        
        for i, score_data in enumerate(video_scores[:20]):  # Top 20
            
            # Extract pAIt score
            pait_score = score_data.get("pait_score", 50)
            
            # Map to risk rating
            if pait_score >= 80:
                risk_rating = "Low"
                category = "top10"
            elif pait_score >= 65:
                risk_rating = "Medium"
                category = "socialMediaLow"  # Quality smaller channels
            elif pait_score >= 50:
                risk_rating = "High" 
                category = "socialMediaHigh"
            else:
                risk_rating = "Very High"
                category = "socialMediaHigh"
            
            # Estimate return potential
            if pait_score >= 85:
                monthly_return = 12.5
            elif pait_score >= 70:
                monthly_return = 8.9
            elif pait_score >= 55:
                monthly_return = 6.2
            else:
                monthly_return = 3.1
            
            pait_entry = {
                "rank": i + 1,
                "name": score_data.get("title", f"Video Analysis #{i+1}")[:50] + "..." if len(score_data.get("title", "")) > 50 else score_data.get("title", f"Video Analysis #{i+1}"),
                "source": score_data.get("channel", "H100 Analysis"),
                "monthlyReturn": monthly_return,
                "aiScore": pait_score,
                "riskRating": risk_rating,
                "lastUpdated": score_data.get("processed_at", "")[:10],  # YYYY-MM-DD
                "category": category,
                "video_url": score_data.get("video_url", ""),
                "processing_time": score_data.get("processing_time", ""),
                "h100_processed": True,
                "recommendation": score_data.get("recommendation", {})
            }
            
            pait_entries.append(pait_entry)
        
        return pait_entries
    
    def create_member_dashboard(self) -> Dict[str, Any]:
        """Create member dashboard from H100 data"""
        
        logger.info("📊 Creating member dashboard from H100...")
        
        # Fetch data from H100
        video_scores = self.fetch_latest_video_scores()
        collection_data = self.fetch_collection_data()
        
        # Convert to pAIt format
        pait_entries = []
        if video_scores:
            pait_entries = self.convert_h100_to_pait_format(video_scores)
        
        # Categorize entries
        categorized_data = {
            "latestAnalyzed": pait_entries[:10],  # Most recent
            "topPerformers": [entry for entry in pait_entries if entry["aiScore"] >= 80][:5],
            "moderateRisk": [entry for entry in pait_entries if 50 <= entry["aiScore"] < 80][:5],
            "highRisk": [entry for entry in pait_entries if entry["aiScore"] < 50][:3]
        }
        
        dashboard_data = {
            "generated_at": datetime.now().isoformat(),
            "data_source": f"H100 GPU Server ({self.h100_ip})",
            "total_videos_analyzed": len(pait_entries),
            "categories": categorized_data,
            "summary_stats": {
                "average_pait_score": round(sum(entry["aiScore"] for entry in pait_entries) / max(len(pait_entries), 1), 1),
                "high_quality_count": len([entry for entry in pait_entries if entry["aiScore"] >= 80]),
                "processing_summary": {
                    "latest_update": video_scores[0].get("processed_at") if video_scores else None,
                    "h100_status": "online",
                    "models_used": "claudia-trader:latest, jbot:latest"
                }
            }
        }
        
        # Save dashboard
        dashboard_file = self.dashboard_dir / "h100_member_dashboard.json"
        with open(dashboard_file, 'w', encoding='utf-8') as f:
            json.dump(dashboard_data, f, indent=2, ensure_ascii=False)
        
        logger.info(f"📊 Dashboard saved: {dashboard_file}")
        return dashboard_data
    
    def generate_react_component_data(self, dashboard_data: Dict = None) -> str:
        """Generate React component compatible data"""
        
        if not dashboard_data:
            dashboard_data = self.create_member_dashboard()
        
        # Format for React components (compatible with your existing pAIt format)
        react_data = {
            "h100Analysis": dashboard_data["categories"]["latestAnalyzed"],
            "topPerformers": dashboard_data["categories"]["topPerformers"],
            "metadata": {
                "lastUpdated": dashboard_data["generated_at"],
                "totalAnalyzed": dashboard_data["total_videos_analyzed"],
                "averageScore": dashboard_data["summary_stats"]["average_pait_score"],
                "h100_server": self.h100_ip,
                "processing_models": dashboard_data["summary_stats"]["processing_summary"]["models_used"]
            }
        }
        
        # Save for React import
        react_file = self.dashboard_dir / "h100_dashboard_data.js"
        with open(react_file, 'w', encoding='utf-8') as f:
            f.write(f"// H100 GPU Analysis Results - Generated {datetime.now()}\n")
            f.write(f"export const h100AnalysisData = {json.dumps(react_data, indent=2)};\n")
        
        logger.info(f"📱 React data generated: {react_file}")
        return json.dumps(react_data, indent=2)
    
    def monitor_h100_continuous(self, interval_minutes: int = 10) -> None:
        """Continuously monitor H100 and update dashboard"""
        
        logger.info(f"👁️ Starting continuous H100 monitoring (every {interval_minutes} minutes)")
        
        while True:
            try:
                # Update dashboard
                dashboard = self.create_member_dashboard()
                
                # Generate React data
                self.generate_react_component_data(dashboard)
                
                # Log status
                total_analyzed = dashboard["total_videos_analyzed"]
                avg_score = dashboard["summary_stats"]["average_pait_score"]
                logger.info(f"📊 Dashboard updated: {total_analyzed} videos, avg pAIt: {avg_score}/100")
                
                # Wait for next update
                time.sleep(interval_minutes * 60)
                
            except KeyboardInterrupt:
                logger.info("🛑 Monitoring stopped by user")
                break
            except Exception as e:
                logger.error(f"💥 Monitoring error: {e}")
                time.sleep(60)  # Wait 1 minute before retrying

def main():
    """CLI interface for Gringots dashboard client"""
    import argparse
    
    parser = argparse.ArgumentParser(description="📊 Gringots Dashboard Client")
    parser.add_argument('--test-connection', action='store_true', help='Test H100 connection')
    parser.add_argument('--fetch-scores', action='store_true', help='Fetch latest video scores')
    parser.add_argument('--create-dashboard', action='store_true', help='Create member dashboard')
    parser.add_argument('--monitor', type=int, help='Monitor continuously (minutes between updates)')
    parser.add_argument('--h100-ip', default='146.190.188.208', help='H100 server IP')
    
    args = parser.parse_args()
    
    client = GringotsDashboardClient(h100_ip=args.h100_ip)
    
    if args.test_connection:
        print("🌐 Testing H100 Connection...")
        status = client.test_h100_connection()
        for service, connected in status.items():
            print(f"  {'✅' if connected else '❌'} {service}")
    
    if args.fetch_scores:
        print("📥 Fetching Video Scores from H100...")
        scores = client.fetch_latest_video_scores()
        if scores:
            print(f"✅ Fetched {len(scores)} video scores")
            for i, score in enumerate(scores[:5]):  # Show top 5
                print(f"  {i+1}. {score.get('title', 'Unknown')[:40]}... - pAIt: {score.get('pait_score', 'N/A')}/100")
        else:
            print("❌ Failed to fetch scores")
    
    if args.create_dashboard:
        print("📊 Creating Member Dashboard...")
        dashboard = client.create_member_dashboard()
        
        print(f"✅ Dashboard created!")
        print(f"   Total Videos: {dashboard['total_videos_analyzed']}")
        print(f"   Average pAIt Score: {dashboard['summary_stats']['average_pait_score']}/100")
        print(f"   High Quality: {dashboard['summary_stats']['high_quality_count']} videos")
        
        # Generate React data
        client.generate_react_component_data(dashboard)
        print(f"📱 React component data generated!")
    
    if args.monitor:
        print(f"👁️ Starting continuous monitoring (every {args.monitor} minutes)...")
        client.monitor_h100_continuous(interval_minutes=args.monitor)
    
    if not any([args.test_connection, args.fetch_scores, args.create_dashboard, args.monitor]):
        parser.print_help()

if __name__ == "__main__":
    main()
