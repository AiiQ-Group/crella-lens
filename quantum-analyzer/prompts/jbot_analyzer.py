#!/usr/bin/env python3
# jbot_analyzer.py
# JBot Technical Analysis Module

import json
import requests
import sys
import os
from datetime import datetime

class JBotAnalyzer:
    def __init__(self, ollama_url="http://localhost:11434"):
        self.ollama_url = ollama_url
        self.model = "jbot"
        
    def analyze_segment(self, video_id, segment_data, frame_paths=None):
        """Analyze video segment using JBot for technical content"""
        
        prompt = f"""You are JBot, a specialized trading analysis AI in the Quantum Analyzer system (August 2025).

MISSION: Analyze YouTube trading video segment for pAIt scoring compatibility.

VIDEO ID: {video_id}
SEGMENT: {segment_data['start']:.1f}s - {segment_data['end']:.1f}s
DURATION: {segment_data['end'] - segment_data['start']:.1f} seconds

TRANSCRIPT CONTENT:
{segment_data['text']}

ANALYSIS FRAMEWORK:
Evaluate each component on 0-5 scale where:
- 5: Exceptional quality, fully verifiable, professional grade
- 4: High quality with minor issues
- 3: Adequate but with notable concerns  
- 2: Poor quality, significant issues
- 1: Very poor, major red flags
- 0: Fraudulent or completely unreliable

1. PROFIT CLAIMS (0-5):
   - Are profit percentages specific and verifiable?
   - Do they provide realistic timeframes?
   - Are there disclaimers about past performance?
   - Check for unrealistic promises ("guaranteed 1000% returns")

2. TECHNICAL METHODOLOGY (0-5):
   - Is the trading strategy clearly explained?
   - Are chart patterns properly identified?
   - Does the analysis show multiple timeframes?
   - Are technical indicators used correctly?

3. EVIDENCE & PROOF (0-5):
   - Are screenshots authentic and unedited?
   - Do they show complete trade details?
   - Is there consistent branding/platform?
   - Can claims be independently verified?

CRITICAL: Look for red flags like:
- Guaranteed returns or "risk-free" trading
- Pressure tactics ("limited time offer")
- Unverifiable claims
- Edited screenshots
- Inconsistent information

OUTPUT MUST BE VALID JSON in this exact format:
{{
  "segment_id": "{segment_data['start']:.1f}-{segment_data['end']:.1f}",
  "analysis_timestamp": "{datetime.now().isoformat()}",
  "profit_claims": {{
    "score": [0-5],
    "reasoning": "detailed explanation of scoring",
    "flags": ["list", "of", "specific", "issues"],
    "verified_claims": ["claims that can be verified"],
    "suspicious_claims": ["claims that are questionable"]
  }},
  "methodology": {{
    "score": [0-5], 
    "reasoning": "analysis quality assessment",
    "technical_depth": "beginner|intermediate|advanced",
    "strategies_mentioned": ["list", "of", "strategies"],
    "indicators_used": ["technical", "indicators", "mentioned"]
  }},
  "evidence": {{
    "score": [0-5],
    "reasoning": "authenticity assessment", 
    "authenticity": "verified|questionable|likely_fake",
    "screenshot_quality": "professional|amateur|suspicious",
    "consistency_check": "consistent|minor_issues|major_inconsistencies"
  }},
  "overall_segment_score": [0-5],
  "confidence": [0-1],
  "red_flags": ["critical", "issues", "found"],
  "positive_indicators": ["good", "quality", "markers"]
}}

Analyze the content critically and provide honest, objective scores."""

        try:
            # Send request to Ollama
            response = requests.post(
                f"{self.ollama_url}/api/generate",
                json={
                    "model": self.model,
                    "prompt": prompt,
                    "stream": False
                },
                timeout=120
            )
            
            if response.status_code == 200:
                result = response.json()
                analysis_text = result['response']
                
                # Extract JSON from response
                try:
                    # Find JSON block in response
                    json_start = analysis_text.find('{')
                    json_end = analysis_text.rfind('}') + 1
                    json_str = analysis_text[json_start:json_end]
                    
                    analysis = json.loads(json_str)
                    
                    # Add metadata
                    analysis['analyzer'] = 'JBot'
                    analysis['model_version'] = self.model
                    analysis['video_id'] = video_id
                    
                    return analysis
                    
                except json.JSONDecodeError as e:
                    print(f"❌ JSON parsing error: {e}")
                    print(f"Raw response: {analysis_text}")
                    return None
                    
            else:
                print(f"❌ Ollama request failed: {response.status_code}")
                return None
                
        except Exception as e:
            print(f"❌ JBot analysis error: {e}")
            return None

def main():
    if len(sys.argv) != 3:
        print("Usage: python3 jbot_analyzer.py <video_id> <segment_index>")
        sys.exit(1)
    
    video_id = sys.argv[1]
    segment_index = int(sys.argv[2])
    
    # Load analysis segments
    segments_file = f"processing/transcripts/{video_id}_analysis_segments.json"
    if not os.path.exists(segments_file):
        print(f"❌ Segments file not found: {segments_file}")
        sys.exit(1)
    
    with open(segments_file, 'r') as f:
        segments = json.load(f)
    
    if segment_index >= len(segments):
        print(f"❌ Segment index {segment_index} out of range (max: {len(segments)-1})")
        sys.exit(1)
    
    segment = segments[segment_index]
    
    # Initialize analyzer
    analyzer = JBotAnalyzer()
    
    print(f"🤖 JBot analyzing segment {segment_index}: {segment['start']:.1f}s-{segment['end']:.1f}s")
    
    # Analyze segment
    result = analyzer.analyze_segment(video_id, segment)
    
    if result:
        # Save results
        output_file = f"processing/analysis/{video_id}_jbot_{segment_index:03d}.json"
        os.makedirs("processing/analysis", exist_ok=True)
        
        with open(output_file, 'w') as f:
            json.dump(result, f, indent=2)
        
        print(f"✅ Analysis complete: {output_file}")
        print(f"📊 Overall score: {result['overall_segment_score']}/5.0")
        if result.get('red_flags'):
            print(f"⚠️  Red flags: {', '.join(result['red_flags'])}")
    else:
        print("❌ Analysis failed")
        sys.exit(1)

if __name__ == "__main__":
    main()
