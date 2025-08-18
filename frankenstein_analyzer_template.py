#!/usr/bin/env python3
"""
🔬 Frankenstein Trading Strategy Analyzer
Identifies high-scoring pAIt elements and creates strategy combinations
for integration with AiiQ-tAIq trading platform
"""

import json
import os
from datetime import datetime, timedelta
from pathlib import Path
import logging

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('video_analysis_logs/frankenstein_analyzer.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class FrankensteinAnalyzer:
    """Analyze video collection results and extract high-scoring trading elements"""
    
    def __init__(self):
        self.base_dir = Path("/home/jbot/aiiq_video_collection")
        self.frankenstein_dir = self.base_dir / "frankenstein_strategies"
        self.strategies_output = self.base_dir / "trading_modules"
        
        # Create directories
        for dir_path in [self.frankenstein_dir, self.strategies_output]:
            dir_path.mkdir(exist_ok=True)
        
        # pAIt score thresholds for strategy creation
        self.HIGH_SCORE_THRESHOLD = 75  # Elements scoring 75+ get considered
        self.EXCELLENT_SCORE_THRESHOLD = 85  # Elements scoring 85+ get priority
        
    def load_recent_collections(self, days=7):
        """Load recent video collection files"""
        cutoff_date = datetime.now() - timedelta(days=days)
        collections = []
        
        # Load all recent collection files
        for collection_file in self.base_dir.glob("youtube_collection_*.json"):
            try:
                with open(collection_file, 'r') as f:
                    data = json.load(f)
                
                collection_date = datetime.fromisoformat(data.get("collected_at", "2025-01-01T00:00:00"))
                if collection_date >= cutoff_date:
                    collections.append(data)
                    
            except Exception as e:
                logger.error(f"Error loading {collection_file}: {e}")
        
        logger.info(f"Loaded {len(collections)} recent collections")
        return collections
    
    def extract_high_scoring_elements(self, collections):
        """Extract trading elements that score well for strategy creation"""
        high_scoring_elements = []
        
        for collection in collections:
            for video in collection.get("youtube_analysis", []):
                # Simulate pAIt scoring analysis (in real implementation, 
                # this would parse the actual Claudia analysis)
                estimated_score = self._estimate_pait_score(video)
                
                if estimated_score >= self.HIGH_SCORE_THRESHOLD:
                    element = {
                        "video_id": video.get("video_id"),
                        "title": video.get("title"),
                        "channel": video.get("channel"),
                        "estimated_pait_score": estimated_score,
                        "trading_elements": self._extract_trading_elements(video),
                        "risk_factors": self._identify_risk_factors(video),
                        "timeframe": self._identify_timeframe(video),
                        "market_conditions": self._identify_market_conditions(video),
                        "extracted_at": datetime.now().isoformat(),
                        "priority": "high" if estimated_score >= self.EXCELLENT_SCORE_THRESHOLD else "medium"
                    }
                    high_scoring_elements.append(element)
        
        logger.info(f"Extracted {len(high_scoring_elements)} high-scoring trading elements")
        return high_scoring_elements
    
    def _estimate_pait_score(self, video):
        """Estimate pAIt score based on video characteristics"""
        score = 50  # Base score
        
        title = video.get("title", "").lower()
        analysis = video.get("analysis", "").lower()
        
        # Positive indicators
        if "strategy" in title or "analysis" in title:
            score += 15
        if "risk" in analysis or "management" in analysis:
            score += 10
        if video.get("duration", 0) > 300:  # Longer videos often more educational
            score += 5
        if video.get("views", 0) < 500000:  # Smaller channels often more authentic
            score += 10
        
        # Negative indicators  
        if "guaranteed" in title or "100%" in title:
            score -= 20
        if "get rich" in title or "easy money" in title:
            score -= 15
        if video.get("duration", 0) < 120:  # Very short videos often low quality
            score -= 10
        
        return min(100, max(0, score))
    
    def _extract_trading_elements(self, video):
        """Extract specific trading elements from video data"""
        elements = []
        
        title = video.get("title", "").lower()
        analysis = video.get("analysis", "").lower()
        
        # Technical indicators
        indicators = ["rsi", "macd", "bollinger", "ema", "sma", "stochastic", "momentum"]
        for indicator in indicators:
            if indicator in title or indicator in analysis:
                elements.append(f"technical_indicator_{indicator}")
        
        # Strategy types
        if "scalping" in title:
            elements.append("strategy_scalping")
        if "swing" in title:
            elements.append("strategy_swing")
        if "day trading" in title:
            elements.append("strategy_daytrading")
        if "options" in title:
            elements.append("strategy_options")
        
        # Risk management
        if "stop loss" in analysis:
            elements.append("risk_stop_loss")
        if "position sizing" in analysis:
            elements.append("risk_position_sizing")
        
        return elements
    
    def _identify_risk_factors(self, video):
        """Identify risk factors mentioned in the video"""
        risks = []
        
        analysis = video.get("analysis", "").lower()
        title = video.get("title", "").lower()
        
        if "high risk" in analysis or "volatile" in analysis:
            risks.append("high_volatility")
        if "margin" in title or "leverage" in title:
            risks.append("leverage_risk")
        if "options" in title:
            risks.append("options_risk")
        
        return risks
    
    def _identify_timeframe(self, video):
        """Identify trading timeframe from video"""
        title = video.get("title", "").lower()
        
        if "scalp" in title or "1 minute" in title:
            return "1m-5m"
        elif "day trading" in title or "intraday" in title:
            return "5m-1h"  
        elif "swing" in title:
            return "1h-1d"
        else:
            return "unknown"
    
    def _identify_market_conditions(self, video):
        """Identify market conditions this strategy works in"""
        analysis = video.get("analysis", "").lower()
        
        conditions = []
        if "trending" in analysis:
            conditions.append("trending_market")
        if "ranging" in analysis or "sideways" in analysis:
            conditions.append("ranging_market")
        if "volatile" in analysis:
            conditions.append("high_volatility")
        
        return conditions or ["general_market"]
    
    def generate_frankenstein_strategies(self, high_scoring_elements):
        """Generate combined trading strategies from high-scoring elements"""
        
        strategies = []
        
        # Group elements by timeframe and risk level
        timeframe_groups = {}
        for element in high_scoring_elements:
            timeframe = element["timeframe"]
            if timeframe not in timeframe_groups:
                timeframe_groups[timeframe] = []
            timeframe_groups[timeframe].append(element)
        
        # Create combination strategies
        for timeframe, elements in timeframe_groups.items():
            if len(elements) >= 2:  # Need at least 2 elements to combine
                
                # Sort by pAIt score (highest first)
                elements.sort(key=lambda x: x["estimated_pait_score"], reverse=True)
                
                # Create a combined strategy from top elements
                top_elements = elements[:3]  # Use top 3 elements
                
                frankenstein_strategy = {
                    "strategy_id": f"frankenstein_{timeframe}_{datetime.now().strftime('%Y%m%d_%H%M')}",
                    "name": f"Frankenstein {timeframe.upper()} Strategy",
                    "timeframe": timeframe,
                    "component_elements": [
                        {
                            "source_video": elem["title"],
                            "pait_score": elem["estimated_pait_score"],
                            "trading_elements": elem["trading_elements"],
                            "weight": elem["estimated_pait_score"] / 100  # Weight by pAIt score
                        }
                        for elem in top_elements
                    ],
                    "combined_score": sum(elem["estimated_pait_score"] for elem in top_elements) / len(top_elements),
                    "risk_assessment": self._assess_combined_risk(top_elements),
                    "market_conditions": list(set().union(*(elem["market_conditions"] for elem in top_elements))),
                    "implementation_notes": self._generate_implementation_notes(top_elements),
                    "created_at": datetime.now().isoformat(),
                    "status": "ready_for_backtesting"
                }
                
                strategies.append(frankenstein_strategy)
        
        logger.info(f"Generated {len(strategies)} Frankenstein strategies")
        return strategies
    
    def _assess_combined_risk(self, elements):
        """Assess the combined risk of multiple elements"""
        all_risks = []
        for elem in elements:
            all_risks.extend(elem.get("risk_factors", []))
        
        unique_risks = list(set(all_risks))
        
        if len(unique_risks) >= 3:
            return "high"
        elif len(unique_risks) >= 2:
            return "medium"
        else:
            return "low"
    
    def _generate_implementation_notes(self, elements):
        """Generate implementation notes for the combined strategy"""
        notes = []
        
        # Extract all trading elements
        all_elements = []
        for elem in elements:
            all_elements.extend(elem.get("trading_elements", []))
        
        unique_elements = list(set(all_elements))
        
        notes.append(f"Combines {len(elements)} high-scoring strategies")
        notes.append(f"Uses {len(unique_elements)} unique trading elements: {', '.join(unique_elements[:5])}")
        notes.append("Requires backtesting before live implementation")
        notes.append("Consider position sizing based on combined risk assessment")
        
        return notes
    
    def save_strategies_for_trading_platform(self, strategies):
        """Save strategies in format compatible with AiiQ-tAIq trading platform"""
        
        # Save individual strategies
        for strategy in strategies:
            strategy_file = self.strategies_output / f"{strategy['strategy_id']}.json"
            with open(strategy_file, 'w') as f:
                json.dump(strategy, f, indent=2)
        
        # Save summary for dashboard
        summary = {
            "generated_at": datetime.now().isoformat(),
            "total_strategies": len(strategies),
            "strategies": [
                {
                    "strategy_id": s["strategy_id"],
                    "name": s["name"],
                    "timeframe": s["timeframe"],
                    "combined_score": s["combined_score"],
                    "risk_assessment": s["risk_assessment"],
                    "status": s["status"]
                }
                for s in strategies
            ],
            "ready_for_integration": True
        }
        
        summary_file = self.strategies_output / "frankenstein_strategies_summary.json"
        with open(summary_file, 'w') as f:
            json.dump(summary, f, indent=2)
        
        logger.info(f"Saved {len(strategies)} strategies for trading platform integration")
        
        # Create a simple CSV for easy import into trading platform
        csv_file = self.strategies_output / "strategies_for_aiiq_platform.csv"
        with open(csv_file, 'w') as f:
            f.write("strategy_id,name,timeframe,pait_score,risk_level,status\n")
            for s in strategies:
                f.write(f"{s['strategy_id']},{s['name']},{s['timeframe']},{s['combined_score']},{s['risk_assessment']},{s['status']}\n")
        
        return summary

def main():
    """Main frankenstein analysis function"""
    logger.info("🔬 Starting Frankenstein Strategy Analysis")
    
    analyzer = FrankensteinAnalyzer()
    
    # Load recent collections
    collections = analyzer.load_recent_collections(days=7)
    
    if not collections:
        logger.warning("No recent collections found")
        return
    
    # Extract high-scoring elements
    high_scoring_elements = analyzer.extract_high_scoring_elements(collections)
    
    if not high_scoring_elements:
        logger.warning("No high-scoring elements found")
        return
    
    # Generate frankenstein strategies
    strategies = analyzer.generate_frankenstein_strategies(high_scoring_elements)
    
    if not strategies:
        logger.warning("No strategies could be generated")
        return
    
    # Save for trading platform integration
    summary = analyzer.save_strategies_for_trading_platform(strategies)
    
    logger.info("🚀 Frankenstein analysis complete!")
    logger.info(f"   High-scoring elements: {len(high_scoring_elements)}")
    logger.info(f"   Generated strategies: {len(strategies)}")
    logger.info(f"   Ready for AiiQ-tAIq integration: {summary['ready_for_integration']}")

if __name__ == "__main__":
    main()
