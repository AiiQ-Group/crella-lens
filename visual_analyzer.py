#!/usr/bin/env python3
"""
🔍 Visual Content Analyzer - Crella Lens Integration
Revolutionary screenshot-based analysis for trading content

Instead of downloading videos, analyze screenshots for:
- Profit claims extraction
- Visual credibility assessment  
- OCR text analysis
- Chart authenticity
- pAIt scoring from visual elements

Author: Multi-AI Collaboration - August 2025
"""

import os
import sys
import json
import argparse
import re
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any, Tuple, Optional
import logging

# Setup logging
Path('lens-data').mkdir(exist_ok=True)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('lens-data/visual_analyzer.log', encoding='utf-8'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class VisualContentAnalyzer:
    """Analyze trading content from screenshots and images"""
    
    def __init__(self, base_dir: str = "lens-data"):
        self.base_dir = Path(base_dir)
        self.analysis_dir = self.base_dir / "visual_analysis"
        self.screenshots_dir = self.base_dir / "screenshots"
        
        # Create directories
        for dir_path in [self.analysis_dir, self.screenshots_dir]:
            dir_path.mkdir(parents=True, exist_ok=True)
        
        logger.info("Visual Content Analyzer initialized")
    
    def extract_text_from_image(self, image_path: str) -> Dict[str, Any]:
        """Extract text from image using OCR"""
        try:
            # Try to import OCR libraries
            import cv2
            import pytesseract
            from PIL import Image
            
            # Load and process image
            image = cv2.imread(image_path)
            if image is None:
                return {"error": "Could not load image", "text": ""}
            
            # Convert to RGB for better OCR
            image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            pil_image = Image.fromarray(image_rgb)
            
            # Extract text with different OCR configurations
            configs = [
                '--psm 6',  # Uniform block of text
                '--psm 3',  # Fully automatic page segmentation
                '--psm 8',  # Single word
                '--psm 13'  # Raw line
            ]
            
            best_text = ""
            for config in configs:
                try:
                    text = pytesseract.image_to_string(pil_image, config=config)
                    if len(text.strip()) > len(best_text.strip()):
                        best_text = text
                except:
                    continue
            
            return {
                "text": best_text.strip(),
                "extraction_method": "tesseract_ocr",
                "success": True
            }
            
        except ImportError:
            # Fallback: try to read filename/metadata for clues
            logger.warning("OCR libraries not available, using fallback analysis")
            filename = Path(image_path).stem
            
            # Extract info from filename if it contains useful data
            fallback_text = filename.replace('_', ' ').replace('-', ' ')
            
            return {
                "text": fallback_text,
                "extraction_method": "filename_fallback",
                "success": False,
                "note": "OCR not available - install pytesseract and opencv-python"
            }
        except Exception as e:
            logger.error(f"OCR extraction failed: {e}")
            return {"error": str(e), "text": "", "success": False}
    
    def analyze_profit_claims(self, text: str) -> Dict[str, Any]:
        """Analyze profit claims in the text"""
        
        # Profit claim patterns
        profit_patterns = [
            r'\$(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:in|per|within)?\s*(?:\d+\s*(?:hour|hr|minute|min|day|week|month)s?)',
            r'(\d+)%\s*(?:profit|gain|return|roi)',
            r'(\d+)x\s*(?:profit|return|gain)',
            r'made?\s*\$(\d+(?:,\d+)*(?:\.\d+)?)',
            r'earn\s*\$(\d+(?:,\d+)*(?:\.\d+)?)',
            r'(\d+(?:,\d+)*(?:\.\d+)?)\s*dollars?\s*(?:in|per)',
        ]
        
        claims_found = []
        
        for pattern in profit_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                if isinstance(match, tuple):
                    amount = match[0] if match[0] else match[1] if len(match) > 1 else "unknown"
                else:
                    amount = match
                claims_found.append({
                    "amount": amount,
                    "context": text[max(0, text.find(str(match))-20):text.find(str(match))+50],
                    "pattern": pattern
                })
        
        # Risk indicators
        risk_flags = [
            "guaranteed", "risk-free", "100% win", "never lose", 
            "easy money", "get rich", "no risk", "sure thing",
            "blew my mind", "insane profits", "secret method"
        ]
        
        risk_indicators = []
        for flag in risk_flags:
            if flag.lower() in text.lower():
                risk_indicators.append(flag)
        
        return {
            "claims_found": claims_found,
            "total_claims": len(claims_found),
            "risk_indicators": risk_indicators,
            "risk_score": min(5.0, len(risk_indicators) * 0.8)  # Scale 0-5
        }
    
    def analyze_visual_credibility(self, text: str, image_path: str) -> Dict[str, Any]:
        """Analyze visual credibility markers"""
        
        # Platform indicators
        platform_indicators = {
            "youtube": ["views", "subscribers", "subscribe", "like"],
            "tiktok": ["followers", "likes", "@"],
            "instagram": ["followers", "posts", "@"],
            "telegram": ["telegram", "channel", "bot"],
            "discord": ["discord", "server"]
        }
        
        detected_platform = "unknown"
        for platform, keywords in platform_indicators.items():
            if any(keyword.lower() in text.lower() for keyword in keywords):
                detected_platform = platform
                break
        
        # Credibility markers
        credibility_positive = [
            "verified", "official", "licensed", "regulated", 
            "years experience", "track record", "audited",
            "risk disclosure", "past performance"
        ]
        
        credibility_negative = [
            "secret", "exclusive", "limited time", "act now",
            "before it's too late", "insiders only", "leaked"
        ]
        
        positive_markers = [marker for marker in credibility_positive if marker.lower() in text.lower()]
        negative_markers = [marker for marker in credibility_negative if marker.lower() in text.lower()]
        
        # Calculate credibility score
        base_score = 2.5  # Neutral starting point
        base_score += len(positive_markers) * 0.5
        base_score -= len(negative_markers) * 0.7
        credibility_score = max(0, min(5, base_score))
        
        return {
            "platform": detected_platform,
            "positive_markers": positive_markers,
            "negative_markers": negative_markers,
            "credibility_score": round(credibility_score, 1),
            "image_path": image_path
        }
    
    def generate_pait_score(self, analysis_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate pAIt score from visual analysis"""
        
        profit_analysis = analysis_data.get("profit_claims", {})
        credibility_analysis = analysis_data.get("credibility", {})
        
        # Component scoring (0-5 scale)
        components = {
            "profit_claims": {
                "score": max(0, min(5, 5 - profit_analysis.get("risk_score", 0))),
                "reasoning": f"Found {profit_analysis.get('total_claims', 0)} profit claims with {len(profit_analysis.get('risk_indicators', []))} risk flags",
                "claims_found": profit_analysis.get("claims_found", [])
            },
            "risk_disclosure": {
                "score": 1.0 if profit_analysis.get("risk_indicators", []) else 3.0,
                "reasoning": "High-risk language detected" if profit_analysis.get("risk_indicators", []) else "Moderate risk assessment",
                "risk_flags": profit_analysis.get("risk_indicators", [])
            },
            "visual_credibility": {
                "score": credibility_analysis.get("credibility_score", 2.5),
                "reasoning": f"Platform: {credibility_analysis.get('platform', 'unknown')}, {len(credibility_analysis.get('positive_markers', []))} positive vs {len(credibility_analysis.get('negative_markers', []))} negative markers",
                "platform": credibility_analysis.get("platform", "unknown")
            },
            "presentation_quality": {
                "score": 2.5,  # Default - could be enhanced with image analysis
                "reasoning": "Visual presentation analysis (basic)",
                "note": "Could be enhanced with advanced computer vision"
            }
        }
        
        # Calculate overall score
        weights = {
            "profit_claims": 0.35,
            "risk_disclosure": 0.25,
            "visual_credibility": 0.25,
            "presentation_quality": 0.15
        }
        
        overall_score = sum(components[comp]["score"] * weights[comp] for comp in weights)
        overall_score = round(overall_score, 2)
        
        # Generate recommendation
        if overall_score >= 4.0:
            recommendation = "HIGH CREDIBILITY - Worth investigating"
        elif overall_score >= 3.0:
            recommendation = "MODERATE - Proceed with caution"
        elif overall_score >= 2.0:
            recommendation = "LOW CREDIBILITY - High risk content"
        else:
            recommendation = "AVOID - Likely fraudulent claims"
        
        return {
            "overall_pait_score": overall_score,
            "components": components,
            "recommendation": recommendation,
            "scoring_method": "visual_analysis_v1"
        }
    
    def analyze_image(self, image_path: str) -> Dict[str, Any]:
        """Complete visual analysis pipeline"""
        
        if not os.path.exists(image_path):
            return {"error": "Image file not found", "status": "failed"}
        
        analysis_start = datetime.now()
        image_file = Path(image_path)
        
        logger.info(f"Starting visual analysis: {image_file.name}")
        
        results = {
            "image_path": str(image_path),
            "image_name": image_file.name,
            "analysis_date": analysis_start.isoformat(),
            "status": "started"
        }
        
        # Step 1: Extract text via OCR
        ocr_result = self.extract_text_from_image(image_path)
        results["ocr"] = ocr_result
        
        if not ocr_result.get("success", False):
            logger.warning("OCR extraction failed or unavailable")
            
        extracted_text = ocr_result.get("text", "")
        
        # Step 2: Analyze profit claims
        profit_analysis = self.analyze_profit_claims(extracted_text)
        results["profit_claims"] = profit_analysis
        
        # Step 3: Analyze visual credibility
        credibility_analysis = self.analyze_visual_credibility(extracted_text, image_path)
        results["credibility"] = credibility_analysis
        
        # Step 4: Generate pAIt score
        pait_score = self.generate_pait_score(results)
        results["pait_analysis"] = pait_score
        
        # Calculate processing time
        analysis_end = datetime.now()
        results["processing_time"] = str(analysis_end - analysis_start)
        results["status"] = "completed"
        
        # Save results
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        results_file = self.analysis_dir / f"{image_file.stem}_{timestamp}_analysis.json"
        
        with open(results_file, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        
        logger.info(f"Visual analysis complete: {results['processing_time']}")
        
        return results

def main():
    """CLI interface for Visual Content Analyzer"""
    parser = argparse.ArgumentParser(
        description="🔍 Visual Content Analyzer - Screenshot-based pAIt Analysis",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s screenshot.png
  %(prog)s trading_video_thumbnail.jpg  
  %(prog)s "C:/path/to/youtube_screenshot.png"
  
Perfect for analyzing:
  - YouTube video thumbnails
  - Trading bot advertisements  
  - Social media trading posts
  - Screenshot of any trading content
        """
    )
    
    parser.add_argument('image_path', help='Path to image file to analyze')
    parser.add_argument('--output-dir', default='lens-data',
                       help='Output directory (default: lens-data)')
    
    args = parser.parse_args()
    
    # Initialize analyzer
    analyzer = VisualContentAnalyzer(args.output_dir)
    
    # Analyze image
    try:
        results = analyzer.analyze_image(args.image_path)
        
        # Print results summary
        print("\n" + "="*60)
        print("🔍 VISUAL ANALYSIS RESULTS")
        print("="*60)
        
        if results.get("status") == "completed":
            print(f"✅ Status: COMPLETED")
            print(f"📁 Image: {results['image_name']}")
            print(f"⏱️  Processing Time: {results['processing_time']}")
            
            # OCR Results
            ocr = results.get("ocr", {})
            if ocr.get("success", False):
                print(f"📝 Extracted Text: {ocr['text'][:200]}..." if len(ocr['text']) > 200 else f"📝 Extracted Text: {ocr['text']}")
            else:
                print(f"⚠️  OCR: {ocr.get('note', 'Failed')}")
            
            # Profit Claims
            claims = results.get("profit_claims", {})
            print(f"💰 Profit Claims Found: {claims.get('total_claims', 0)}")
            for claim in claims.get('claims_found', [])[:3]:  # Show first 3
                print(f"   💵 {claim['amount']} - {claim['context'][:50]}...")
            
            if claims.get('risk_indicators', []):
                print(f"🚨 Risk Flags: {', '.join(claims['risk_indicators'][:5])}")
            
            # pAIt Score
            pait = results.get("pait_analysis", {})
            overall_score = pait.get("overall_pait_score", 0)
            recommendation = pait.get("recommendation", "Unknown")
            
            print(f"\n🎯 OVERALL pAIt SCORE: {overall_score}/5.0")
            print(f"📋 RECOMMENDATION: {recommendation}")
            
            # Component breakdown
            print(f"\n📊 COMPONENT SCORES:")
            components = pait.get("components", {})
            for comp_name, comp_data in components.items():
                score = comp_data.get("score", 0)
                reasoning = comp_data.get("reasoning", "")
                print(f"   {comp_name.replace('_', ' ').title()}: {score}/5.0")
                print(f"     Reason: {reasoning}")
            
            print(f"\n📁 Full results saved to: lens-data/visual_analysis/")
            
        else:
            print(f"❌ Status: FAILED")
            print(f"💥 Error: {results.get('error', 'Unknown error')}")
            sys.exit(1)
            
    except KeyboardInterrupt:
        print("\n🛑 Analysis interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n💥 Unexpected error: {e}")
        logger.error(f"Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
