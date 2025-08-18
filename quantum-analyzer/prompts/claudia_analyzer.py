#!/usr/bin/env python3
# claudia_analyzer.py
# Claudia Risk Assessment Module

import json
import requests
import sys
import os
from datetime import datetime

class ClaudiaAnalyzer:
    def __init__(self, ollama_url="http://localhost:11434"):
        self.ollama_url = ollama_url
        self.model = "claudia"
        
    def analyze_segment(self, video_id, segment_data):
        """Analyze video segment using Claudia for risk assessment"""
        
        prompt = f"""You are Claudia, specialized in financial risk assessment for the Quantum Analyzer (August 2025).

MISSION: Evaluate risk disclosure and regulatory compliance in trading video segment.

VIDEO ID: {video_id}
SEGMENT: {segment_data['start']:.1f}s - {segment_data['end']:.1f}s  
DURATION: {segment_data['end'] - segment_data['start']:.1f} seconds

TRANSCRIPT SEGMENT:
{segment_data['text']}

RISK ASSESSMENT CRITERIA:
Evaluate each component on 0-5 scale where:
- 5: Excellent compliance, comprehensive risk warnings
- 4: Good compliance with minor gaps
- 3: Adequate but missing some important disclosures
- 2: Poor compliance, significant gaps
- 1: Very poor, major compliance violations
- 0: No compliance, dangerous content

1. RISK DISCLOSURE (0-5):
   - Are potential losses clearly stated?
   - Do they mention "past performance ≠ future results"?
   - Is there appropriate balance of risk vs reward discussion?
   - Are worst-case scenarios mentioned?

2. REGULATORY COMPLIANCE (0-5):
   - Are there proper disclaimers?
   - Do they avoid guaranteed return language?
   - Is educational vs advisory content clearly distinguished?
   - Are they registered/licensed if providing advice?

3. CREDIBILITY MARKERS (0-5):
   - Does speaker demonstrate genuine expertise?
   - Are claims backed by verifiable information?
   - Is there transparency about conflicts of interest?
   - Do they admit when they don't know something?

CRITICAL WARNING SIGNS:
- "Guaranteed profits" or "risk-free" trading
- Pressure to act immediately
- Testimonials without disclaimers
- Unlicensed investment advice
- Hidden fees or costs
- Emotional manipulation tactics

OUTPUT MUST BE VALID JSON in this exact format:
{{
  "segment_id": "{segment_data['start']:.1f}-{segment_data['end']:.1f}",
  "analysis_timestamp": "{datetime.now().isoformat()}",
  "risk_disclosure": {{
    "score": [0-5],
    "reasoning": "disclosure adequacy assessment",
    "missing_warnings": ["list", "of", "absent", "warnings"],
    "present_warnings": ["warnings", "that", "were", "included"],
    "balance_assessment": "risk_heavy|balanced|return_focused"
  }},
  "compliance": {{
    "score": [0-5],
    "reasoning": "regulatory compliance evaluation",
    "red_flags": ["compliance", "violations", "found"],
    "disclaimer_quality": "comprehensive|adequate|minimal|missing",
    "advice_vs_education": "clearly_educational|mixed|clearly_advice"
  }},
  "credibility": {{
    "score": [0-5],
    "reasoning": "speaker credibility assessment",
    "trust_factors": ["positive", "indicators"],
    "concern_factors": ["negative", "indicators"],
    "expertise_level": "expert|intermediate|novice|questionable",
    "transparency": "high|medium|low"
  }},
  "overall_risk_score": [0-5],
  "recommendation": "watch|caution|avoid",
  "compliance_violations": ["serious", "violations", "identified"],
  "investor_protection": "strong|moderate|weak|dangerous"
}}

Analyze the content with investor protection as the primary concern. Be strict about compliance and risk disclosure."""

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
                    analysis['analyzer'] = 'Claudia'
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
            print(f"❌ Claudia analysis error: {e}")
            return None

def main():
    if len(sys.argv) != 3:
        print("Usage: python3 claudia_analyzer.py <video_id> <segment_index>")
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
    analyzer = ClaudiaAnalyzer()
    
    print(f"⚖️  Claudia analyzing segment {segment_index}: {segment['start']:.1f}s-{segment['end']:.1f}s")
    
    # Analyze segment
    result = analyzer.analyze_segment(video_id, segment)
    
    if result:
        # Save results
        output_file = f"processing/analysis/{video_id}_claudia_{segment_index:03d}.json"
        os.makedirs("processing/analysis", exist_ok=True)
        
        with open(output_file, 'w') as f:
            json.dump(result, f, indent=2)
        
        print(f"✅ Analysis complete: {output_file}")
        print(f"📊 Overall risk score: {result['overall_risk_score']}/5.0")
        print(f"🎯 Recommendation: {result['recommendation']}")
        if result.get('compliance_violations'):
            print(f"⚠️  Compliance violations: {', '.join(result['compliance_violations'])}")
    else:
        print("❌ Analysis failed")
        sys.exit(1)

if __name__ == "__main__":
    main()
