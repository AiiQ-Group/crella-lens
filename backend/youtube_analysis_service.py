#!/usr/bin/env python3
"""
🎯 YouTube Shorts Analysis Service
Advanced AI-powered trading video analysis with pAIt scoring
"""

import json
import os
from datetime import datetime
from typing import Dict, List, Optional, Tuple
import requests
try:
    from PIL import Image, ExifTags
    import pytesseract
    import cv2
    import numpy as np
except ImportError as e:
    print(f"Warning: Some dependencies not available: {e}")
    print("Run: pip install pillow opencv-python pytesseract numpy")

class YouTubeAnalysisService:
    def __init__(self):
        self.analysis_data_dir = "lens-data/youtube-analysis/"
        self.claire_api_url = "http://localhost:5001/api/claire/chat"
        os.makedirs(self.analysis_data_dir, exist_ok=True)
    
    def extract_metadata(self, image_file_path: str) -> Dict:
        """Extract metadata from YouTube shorts screenshot"""
        try:
            # Basic file metadata
            metadata = {
                "processTime": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "processingDate": datetime.now().strftime("%Y-%m-%d"),
                "analysisId": f"yt_analysis_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{os.urandom(4).hex()}",
                "platform": "YouTube Shorts",
                "fileSize": os.path.getsize(image_file_path)
            }
            
            # Try to extract text from image for title/author
            text_content = self.extract_text_from_image(image_file_path)
            
            # Parse extracted text for video details
            video_details = self.parse_video_details(text_content)
            metadata.update(video_details)
            
            return metadata
            
        except Exception as e:
            print(f"Error extracting metadata: {e}")
            return {
                "processTime": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "processingDate": datetime.now().strftime("%Y-%m-%d"),
                "analysisId": f"yt_analysis_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                "platform": "YouTube Shorts",
                "title": "Unknown Trading Strategy",
                "author": "Unknown Creator",
                "views": "Unknown",
                "error": str(e)
            }
    
    def extract_text_from_image(self, image_path: str) -> str:
        """Extract text content from screenshot using OCR"""
        try:
            # Load and preprocess image
            image = cv2.imread(image_path)
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            # Apply preprocessing for better OCR
            kernel = np.ones((1,1), np.uint8)
            gray = cv2.morphologyEx(gray, cv2.MORPH_CLOSE, kernel)
            gray = cv2.medianBlur(gray, 3)
            
            # Extract text
            text = pytesseract.image_to_string(gray)
            return text.strip()
            
        except Exception as e:
            print(f"OCR extraction error: {e}")
            return ""
    
    def parse_video_details(self, text_content: str) -> Dict:
        """Parse extracted text to identify video title, author, views"""
        details = {
            "title": "Trading Strategy Analysis",
            "author": "Trading Creator",
            "views": "0"
        }
        
        lines = text_content.split('\n')
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            # Look for common patterns
            if any(keyword in line.lower() for keyword in ['strategy', 'trading', 'profit', 'signals', 'chart']):
                if len(line) > 5 and len(line) < 100:  # Reasonable title length
                    details["title"] = line
                    break
            
            # Look for view counts
            if 'k' in line.lower() or 'm' in line.lower():
                if any(char.isdigit() for char in line):
                    details["views"] = line
            
            # Look for author patterns (@ symbols, channel names)
            if '@' in line or 'channel' in line.lower():
                details["author"] = line.replace('@', '').strip()
        
        return details
    
    def calculate_pait_scores(self, metadata: Dict, text_content: str) -> Dict:
        """Calculate pAIt scores for trading video analysis"""
        
        # Define scoring categories with weights
        categories = {
            "technicalAccuracy": self.score_technical_accuracy(text_content),
            "executionFeasibility": self.score_execution_feasibility(text_content),
            "riskManagement": self.score_risk_management(text_content),
            "marketConditions": self.score_market_conditions(text_content),
            "strategyClarity": self.score_strategy_clarity(text_content),
            "profitabilityPotential": self.score_profitability_potential(text_content)
        }
        
        # Calculate weighted overall score
        weights = {
            "technicalAccuracy": 0.20,
            "executionFeasibility": 0.18,
            "riskManagement": 0.22,
            "marketConditions": 0.15,
            "strategyClarity": 0.15,
            "profitabilityPotential": 0.10
        }
        
        weighted_score = sum(categories[cat] * weights[cat] * 100 for cat in weights.keys())
        overall_score = int(weighted_score)
        
        return {
            **categories,
            "overallScore": max(200, min(1000, overall_score))  # Clamp to reasonable range
        }
    
    def score_technical_accuracy(self, text: str) -> int:
        """Score technical analysis accuracy (0-10)"""
        technical_terms = ['support', 'resistance', 'breakout', 'moving average', 'rsi', 'macd', 'bollinger', 'fibonacci']
        score = min(10, sum(2 for term in technical_terms if term in text.lower()))
        return max(3, score)  # Minimum base score
    
    def score_execution_feasibility(self, text: str) -> int:
        """Score how executable the strategy is (0-10)"""
        execution_terms = ['entry', 'exit', 'stop loss', 'take profit', 'timeframe']
        score = min(10, sum(2 for term in execution_terms if term in text.lower()))
        return max(3, score)
    
    def score_risk_management(self, text: str) -> int:
        """Score risk management quality (0-10)"""
        risk_terms = ['stop loss', 'risk', 'position size', 'money management', 'drawdown']
        score = min(10, sum(2 for term in risk_terms if term in text.lower()))
        return max(2, score)  # Risk management often lacking
    
    def score_market_conditions(self, text: str) -> int:
        """Score market condition awareness (0-10)"""
        market_terms = ['trend', 'volatility', 'volume', 'market conditions', 'economic']
        score = min(10, sum(2 for term in market_terms if term in text.lower()))
        return max(4, score)
    
    def score_strategy_clarity(self, text: str) -> int:
        """Score how clearly the strategy is explained (0-10)"""
        clarity_indicators = len(text.split()), any(word in text.lower() for word in ['step', 'first', 'then', 'next'])
        word_count_score = min(5, len(text.split()) // 20)  # More words = more detail
        structure_score = 3 if clarity_indicators[1] else 1
        return min(10, word_count_score + structure_score + 2)
    
    def score_profitability_potential(self, text: str) -> int:
        """Score profit potential claims (0-10)"""
        profit_terms = ['profit', 'gain', 'return', 'win rate', 'success']
        unrealistic_claims = ['guaranteed', '100%', 'never lose', 'easy money']
        
        profit_score = min(6, sum(1 for term in profit_terms if term in text.lower()))
        penalty = sum(2 for claim in unrealistic_claims if claim in text.lower())
        
        return max(2, min(10, profit_score + 2 - penalty))
    
    def generate_swot_analysis(self, pait_scores: Dict, text_content: str) -> Dict:
        """Generate SWOT analysis based on scores and content"""
        
        strengths = []
        weaknesses = []
        opportunities = []
        threats = []
        
        # Analyze strengths based on high scores
        if pait_scores["technicalAccuracy"] >= 7:
            strengths.append("Strong technical analysis foundation")
        if pait_scores["strategyClarity"] >= 7:
            strengths.append("Clear strategy explanation")
        if pait_scores["profitabilityPotential"] >= 7:
            strengths.append("High reward potential")
        
        # Default strengths if none found
        if not strengths:
            strengths = ["Recognizable pattern approach", "Community-backed strategy", "Visual chart examples"]
        
        # Analyze weaknesses based on low scores
        if pait_scores["riskManagement"] <= 4:
            weaknesses.append("Limited risk management details")
        if pait_scores["executionFeasibility"] <= 4:
            weaknesses.append("Unclear execution parameters")
        if pait_scores["technicalAccuracy"] <= 4:
            weaknesses.append("Weak technical foundation")
        
        # Default weaknesses
        if not weaknesses:
            weaknesses = ["Limited backtesting data", "Lacks risk parameters", "No market condition filters"]
        
        # Standard opportunities and threats
        opportunities = [
            "Trending community-driven approach",
            "Social media amplification potential", 
            "Educational content monetization"
        ]
        
        threats = [
            "Market volatility impact",
            "Overconfidence from viral content",
            "Lack of proper risk education"
        ]
        
        return {
            "strengths": strengths[:3],  # Top 3
            "weaknesses": weaknesses[:3],
            "opportunities": opportunities[:3],
            "threats": threats[:3]
        }
    
    async def activate_claire_analysis(self, metadata: Dict, pait_scores: Dict) -> str:
        """Get Claire's personality-driven analysis"""
        try:
            prompt = f"""
            Analyze this YouTube trading strategy with your warm, professional personality:
            
            Video: {metadata['title']} by {metadata['author']}
            pAIt Score: {pait_scores['overallScore']}
            
            Key scores:
            - Technical: {pait_scores['technicalAccuracy']}/10
            - Risk Mgmt: {pait_scores['riskManagement']}/10
            - Clarity: {pait_scores['strategyClarity']}/10
            
            Give a brief, encouraging but honest analysis in your natural style.
            """
            
            response = requests.post(self.claire_api_url, json={
                "message": prompt,
                "provider": "claude"
            }, timeout=10)
            
            if response.ok:
                return response.json()["response"]
            else:
                return "Hi! 👋 I'm analyzing this strategy - it shows some interesting patterns but let's look at the details together!"
                
        except Exception as e:
            return f"Hi there! 👋 I'm having trouble connecting right now, but I can see this strategy has a pAIt score of {pait_scores['overallScore']} - let's dive into what that means!"
    
    def activate_kathy_analysis(self, pait_scores: Dict, metadata: Dict) -> str:
        """Generate Kathy's technical analysis"""
        score = pait_scores["overallScore"]
        
        if score >= 800:
            return "EXCELLENT analysis! This strategy shows strong fundamentals across multiple dimensions. Technical execution looks solid with good risk awareness."
        elif score >= 600:
            return "SOLID approach! Good technical foundation with some areas for improvement. Risk management could use more detail but overall promising."
        elif score >= 400:
            return "MIXED signals here. Some good technical elements but execution needs work. Risk management is concerning - proceed with caution."
        else:
            return "CAUTION advised! This strategy has significant gaps in technical analysis and risk management. Educational value only - not for live trading."
    
    def determine_profitability_grade(self, pait_score: int) -> str:
        """Determine profitability grade based on pAIt score"""
        if pait_score >= 800:
            return "High"
        elif pait_score >= 600:
            return "Moderate" 
        elif pait_score >= 400:
            return "Low"
        else:
            return "Critical"
    
    async def process_youtube_analysis(self, image_file_path: str) -> Dict:
        """Main processing pipeline for YouTube analysis"""
        try:
            # Step 1: Extract metadata
            metadata = self.extract_metadata(image_file_path)
            
            # Step 2: Extract text content
            text_content = self.extract_text_from_image(image_file_path)
            
            # Step 3: Calculate pAIt scores
            pait_scores = self.calculate_pait_scores(metadata, text_content)
            
            # Step 4: Generate SWOT analysis
            swot = self.generate_swot_analysis(pait_scores, text_content)
            
            # Step 5: Get AI agent insights
            claire_insight = await self.activate_claire_analysis(metadata, pait_scores)
            kathy_analysis = self.activate_kathy_analysis(pait_scores, metadata)
            
            # Step 6: Determine profitability grade
            profitability_grade = self.determine_profitability_grade(pait_scores["overallScore"])
            
            # Step 7: Package results
            analysis_result = {
                "metadata": metadata,
                "paitScores": pait_scores,
                "swot": swot,
                "claireInsight": claire_insight,
                "kathyAnalysis": kathy_analysis,
                "profitabilityGrade": profitability_grade,
                "isVIPAnalysis": False,
                "textContent": text_content[:500],  # First 500 chars for debugging
                "timestamp": datetime.now().isoformat()
            }
            
            # Step 8: Save analysis to file
            self.save_analysis(analysis_result)
            
            return analysis_result
            
        except Exception as e:
            print(f"Analysis processing error: {e}")
            return {
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }
    
    def save_analysis(self, analysis_result: Dict):
        """Save analysis result to file"""
        try:
            filename = f"{analysis_result['metadata']['analysisId']}.json"
            filepath = os.path.join(self.analysis_data_dir, filename)
            
            with open(filepath, 'w') as f:
                json.dump(analysis_result, f, indent=2)
                
            print(f"✅ Analysis saved: {filepath}")
            
        except Exception as e:
            print(f"Error saving analysis: {e}")

# Example usage and testing
if __name__ == "__main__":
    service = YouTubeAnalysisService()
    print("🎯 YouTube Analysis Service initialized!")
    print("Ready to process trading video screenshots...")
