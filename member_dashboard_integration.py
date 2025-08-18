#!/usr/bin/env python3
"""
📊 Member Dashboard Integration - Latest Reviews
Integrates Ollama analysis results with your pAIt ratings system

Creates member-friendly "Latest Reviewed" feed compatible with your 
AiiQ-tAIq trading platform interface.
"""

import json
from pathlib import Path
from datetime import datetime, timedelta
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)

class MemberDashboardIntegrator:
    """Integrate Ollama analysis with member dashboard"""
    
    def __init__(self, base_dir: str = "lens-data"):
        self.base_dir = Path(base_dir)
        self.reviews_dir = self.base_dir / "member_reviews"
        self.dashboard_dir = self.base_dir / "dashboard_data"
        
        self.dashboard_dir.mkdir(exist_ok=True)
    
    def load_recent_reviews(self, days: int = 7) -> List[Dict[str, Any]]:
        """Load recent reviews for dashboard"""
        
        cutoff_date = datetime.now() - timedelta(days=days)
        recent_reviews = []
        
        if not self.reviews_dir.exists():
            return recent_reviews
        
        for review_file in self.reviews_dir.glob("*_member_review.json"):
            try:
                with open(review_file, 'r', encoding='utf-8') as f:
                    review = json.load(f)
                
                # Parse review date
                review_date = datetime.fromisoformat(review.get("analysis_date", "2025-01-01"))
                
                if review_date >= cutoff_date:
                    recent_reviews.append(review)
                    
            except Exception as e:
                logger.error(f"Error loading review {review_file}: {e}")
        
        # Sort by analysis date, newest first
        recent_reviews.sort(key=lambda x: x.get("analysis_date", ""), reverse=True)
        
        return recent_reviews
    
    def convert_to_pait_format(self, reviews: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Convert reviews to pAIt ratings format"""
        
        pait_items = []
        
        for i, review in enumerate(reviews):
            # Map to your pAIt categories
            category = self._determine_category(review)
            
            pait_item = {
                "rank": i + 1,
                "name": review.get("video_title", f"Trading Analysis #{i+1}"),
                "source": review.get("video_channel", "YouTube Analysis"),
                "monthlyReturn": self._estimate_return_potential(review),
                "aiScore": review.get("pait_score", 50),
                "riskRating": self._map_risk_rating(review.get("risk_assessment", "medium")),
                "lastUpdated": review.get("analysis_date", "2025-01-01")[:10],  # YYYY-MM-DD
                "category": category,
                "badge": review.get("badge", "🔍 Analyzed"),
                "recommendation": review.get("recommendation", "Under Review"),
                "best_takeaways": review.get("best_takeaways", []),
                "frankenstein_potential": review.get("frankenstein_potential", []),
                "educational_highlights": review.get("educational_highlights", []),
                "difficulty_level": review.get("difficulty_level", "intermediate"),
                "options_relevant": review.get("options_relevant", False)
            }
            
            pait_items.append(pait_item)
        
        return pait_items
    
    def _determine_category(self, review: Dict[str, Any]) -> str:
        """Determine which pAIt category this review belongs to"""
        
        pait_score = review.get("pait_score", 50)
        options_relevant = review.get("options_relevant", False)
        
        if pait_score >= 80:
            return "top10"  # Top performers
        elif options_relevant:
            return "socialMediaHigh"  # Options content often has high engagement
        elif pait_score >= 65:
            return "socialMediaLow"  # Quality smaller channels
        else:
            return "socialMediaHigh"  # High-engagement but risky content
    
    def _map_risk_rating(self, risk_level: str) -> str:
        """Map risk levels to pAIt format"""
        mapping = {
            "low": "Low",
            "medium": "Medium", 
            "high": "High",
            "very_high": "Very High"
        }
        return mapping.get(risk_level, "Medium")
    
    def _estimate_return_potential(self, review: Dict[str, Any]) -> float:
        """Estimate return potential based on analysis"""
        
        pait_score = review.get("pait_score", 50)
        risk_level = review.get("risk_assessment", "medium")
        
        # Base return estimation on pAIt score and risk
        if pait_score >= 80:
            base_return = 12.0  # High quality content
        elif pait_score >= 65:
            base_return = 8.5   # Good content
        elif pait_score >= 50:
            base_return = 5.5   # Mixed content
        else:
            base_return = 2.0   # Poor content
        
        # Adjust for risk (higher risk = higher potential return estimate)
        risk_multiplier = {
            "low": 0.8,
            "medium": 1.0,
            "high": 1.4,
            "very_high": 1.8
        }
        
        multiplier = risk_multiplier.get(risk_level, 1.0)
        estimated_return = base_return * multiplier
        
        return round(estimated_return, 1)
    
    def generate_dashboard_data(self, days: int = 7) -> Dict[str, Any]:
        """Generate complete dashboard data"""
        
        recent_reviews = self.load_recent_reviews(days)
        pait_items = self.convert_to_pait_format(recent_reviews)
        
        # Group by category (matching your existing structure)
        categorized_items = {
            "latestReviewed": pait_items[:10],  # Top 10 most recent
            "topRated": [item for item in pait_items if item["aiScore"] >= 80][:5],
            "optionsContent": [item for item in pait_items if item["options_relevant"]][:5],
            "frankensteins": [item for item in pait_items if item["frankenstein_potential"]][:5]
        }
        
        dashboard_data = {
            "generated_at": datetime.now().isoformat(),
            "total_reviews": len(recent_reviews),
            "days_covered": days,
            "categories": categorized_items,
            "summary_stats": {
                "average_pait_score": round(sum(item["aiScore"] for item in pait_items) / max(len(pait_items), 1), 1),
                "high_quality_count": len([item for item in pait_items if item["aiScore"] >= 80]),
                "options_relevant_count": len([item for item in pait_items if item["options_relevant"]]),
                "frankenstein_potential_count": len([item for item in pait_items if item["frankenstein_potential"]])
            }
        }
        
        # Save dashboard data
        dashboard_file = self.dashboard_dir / "latest_reviews_dashboard.json"
        with open(dashboard_file, 'w', encoding='utf-8') as f:
            json.dump(dashboard_data, f, indent=2, ensure_ascii=False)
        
        logger.info(f"Dashboard data generated: {len(recent_reviews)} reviews processed")
        
        return dashboard_data
    
    def generate_react_component_data(self) -> str:
        """Generate data format compatible with your React component"""
        
        dashboard_data = self.generate_dashboard_data()
        
        # Format for your React component
        react_data = {
            "latestReviewed": dashboard_data["categories"]["latestReviewed"],
            "metadata": {
                "lastUpdated": dashboard_data["generated_at"],
                "totalAnalyzed": dashboard_data["total_reviews"],
                "averageScore": dashboard_data["summary_stats"]["average_pait_score"]
            }
        }
        
        # Save in format for easy import
        react_file = self.dashboard_dir / "react_component_data.js"
        with open(react_file, 'w', encoding='utf-8') as f:
            f.write(f"export const latestReviewsData = {json.dumps(react_data, indent=2)};\n")
        
        return json.dumps(react_data, indent=2)

def main():
    """Generate dashboard data for member integration"""
    
    integrator = MemberDashboardIntegrator()
    
    print("📊 Generating Member Dashboard Data...")
    
    dashboard_data = integrator.generate_dashboard_data(days=30)  # Last 30 days
    
    print(f"\n📈 DASHBOARD SUMMARY:")
    print(f"   Total Reviews: {dashboard_data['total_reviews']}")
    print(f"   Average pAIt Score: {dashboard_data['summary_stats']['average_pait_score']}/100")
    print(f"   High Quality: {dashboard_data['summary_stats']['high_quality_count']} reviews")
    print(f"   Options Relevant: {dashboard_data['summary_stats']['options_relevant_count']} reviews")
    print(f"   Frankenstein Potential: {dashboard_data['summary_stats']['frankenstein_potential_count']} strategies")
    
    print(f"\n🎯 LATEST REVIEWED (Top 5):")
    for i, item in enumerate(dashboard_data['categories']['latestReviewed'][:5], 1):
        print(f"   {i}. {item['name']}")
        print(f"      pAIt Score: {item['aiScore']}/100 | Risk: {item['riskRating']}")
        print(f"      {item['badge']}: {item['recommendation']}")
        if item['best_takeaways']:
            print(f"      Key Takeaway: {item['best_takeaways'][0]}")
        print()
    
    # Generate React component data
    react_data = integrator.generate_react_component_data()
    
    print(f"📱 React component data generated!")
    print(f"📁 Files saved in: lens-data/dashboard_data/")

if __name__ == "__main__":
    main()
