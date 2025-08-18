#!/usr/bin/env python3
"""
🎬 H100 GPU Video Analysis Pipeline - Production Ready
Designed to run on your H100 GPU server with existing infrastructure

This script should be deployed to your H100 server alongside your existing
collection system and PM2 services.
"""

import json
import requests
import subprocess
import os
import time
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Any, Optional
import logging

# Configure logging for H100 server
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/home/jbot/video_analysis.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class H100VideoPipeline:
    """Video analysis pipeline optimized for H100 GPU server"""
    
    def __init__(self, base_dir: str = "/home/jbot/video_analysis"):
        self.base_dir = Path(base_dir)
        self.downloads_dir = self.base_dir / "downloads"
        self.transcripts_dir = self.base_dir / "transcripts"
        self.analysis_dir = self.base_dir / "analysis_results"
        self.pait_scores_dir = self.base_dir / "pait_scores"
        
        # Create directories
        for dir_path in [self.downloads_dir, self.transcripts_dir, 
                        self.analysis_dir, self.pait_scores_dir]:
            dir_path.mkdir(parents=True, exist_ok=True)
        
        # Ollama endpoint (local to H100)
        self.ollama_url = "http://localhost:11434/api/generate"
        
        # Your reliable models (excluding juliet)
        self.models = {
            "primary_analyst": "jbot:latest",           # 47GB - Main analysis
            "strategy_expert": "claudia-trader:latest", # 67GB - pAIt scoring  
            "max_trader": "trader-max:latest",          # 47GB - Max insights
            "quantum_analyst": "qwen2.5:72b",          # 47GB - Deep analysis
            "options_specialist": "kathy-ops:latest",   # 67GB - Options
            "fraud_detector": "fraud-detector:latest"  # Security
        }
        
        logger.info(f"H100 Video Pipeline initialized at {self.base_dir}")
    
    def download_video_with_ytdlp(self, youtube_url: str) -> Optional[Dict]:
        """Download video using yt-dlp (robust for Shorts)"""
        
        video_id = youtube_url.split('/')[-1] if '/' in youtube_url else youtube_url
        output_path = self.downloads_dir / f"{video_id}"
        
        try:
            # Download with metadata
            cmd = [
                "yt-dlp",
                "--write-info-json",
                "--write-auto-sub", 
                "--extract-flat", "false",
                "-o", str(output_path / "%(title)s.%(ext)s"),
                youtube_url
            ]
            
            logger.info(f"🎬 Downloading: {youtube_url}")
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
            
            if result.returncode == 0:
                # Find downloaded files
                info_files = list(output_path.glob("*.info.json"))
                if info_files:
                    with open(info_files[0], 'r') as f:
                        metadata = json.load(f)
                    
                    logger.info(f"✅ Downloaded: {metadata.get('title', 'Unknown')}")
                    return {
                        "success": True,
                        "video_id": video_id,
                        "metadata": metadata,
                        "output_dir": str(output_path)
                    }
            
            logger.error(f"❌ Download failed: {result.stderr}")
            return None
            
        except subprocess.TimeoutExpired:
            logger.error(f"⏰ Download timeout for {youtube_url}")
            return None
        except Exception as e:
            logger.error(f"💥 Download error: {e}")
            return None
    
    def transcribe_with_whisper(self, video_file: str) -> Optional[str]:
        """Transcribe video using OpenAI Whisper"""
        
        try:
            # Extract audio first if needed
            audio_file = str(Path(video_file).with_suffix('.wav'))
            
            # Extract audio using ffmpeg
            extract_cmd = [
                "ffmpeg", "-i", video_file, 
                "-vn", "-acodec", "pcm_s16le", 
                "-ar", "16000", "-ac", "1",
                audio_file, "-y"
            ]
            
            subprocess.run(extract_cmd, capture_output=True, timeout=120)
            
            # Transcribe with Whisper
            logger.info(f"🎙️ Transcribing audio...")
            whisper_cmd = [
                "whisper", audio_file,
                "--model", "base",
                "--output_format", "txt",
                "--output_dir", str(self.transcripts_dir)
            ]
            
            result = subprocess.run(whisper_cmd, capture_output=True, text=True, timeout=300)
            
            if result.returncode == 0:
                # Find transcript file
                transcript_file = self.transcripts_dir / f"{Path(audio_file).stem}.txt"
                if transcript_file.exists():
                    with open(transcript_file, 'r', encoding='utf-8') as f:
                        transcript = f.read().strip()
                    
                    logger.info(f"✅ Transcription complete ({len(transcript)} chars)")
                    return transcript
            
            logger.error(f"❌ Transcription failed: {result.stderr}")
            return None
            
        except Exception as e:
            logger.error(f"💥 Transcription error: {e}")
            return None
    
    def analyze_with_gpu_model(self, model_name: str, prompt: str, timeout: int = 120) -> Optional[str]:
        """Query GPU model via Ollama"""
        
        payload = {
            "model": model_name,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": 0.7,
                "top_p": 0.9
            }
        }
        
        try:
            logger.info(f"🤖 Querying {model_name}...")
            response = requests.post(self.ollama_url, json=payload, timeout=timeout)
            
            if response.status_code == 200:
                result = response.json()
                response_text = result.get('response', '').strip()
                
                if response_text:
                    logger.info(f"✅ {model_name} analysis complete ({len(response_text)} chars)")
                    return response_text
                
            logger.error(f"❌ {model_name} error: HTTP {response.status_code}")
            return None
            
        except Exception as e:
            logger.error(f"💥 {model_name} error: {e}")
            return None
    
    def generate_pait_score(self, video_content: str, metadata: Dict) -> Dict[str, Any]:
        """Generate pAIt score using Claudia-Trader"""
        
        pait_prompt = f"""You are Claudia-Trader, providing pAIt (Proof of AI Technology) scoring for trading content.

VIDEO CONTENT:
Title: {metadata.get('title', 'Unknown')}
Channel: {metadata.get('uploader', 'Unknown')}
Views: {metadata.get('view_count', 'Unknown')}
Duration: {metadata.get('duration', 'Unknown')} seconds

TRANSCRIPT:
{video_content}

PAIT SCORING FRAMEWORK:
Analyze this trading content across 4 components (0-25 points each):

1. **Strategy Logic** (0-25): Does the strategy have sound reasoning?
2. **Risk Transparency** (0-25): Are risks properly disclosed?
3. **Proof Quality** (0-25): Is evidence credible and verifiable?
4. **Educational Merit** (0-25): Does this teach valuable concepts?

ADDITIONAL ANALYSIS:
- **Profit Claims Assessment**: Are claims realistic or inflated?
- **Frankenstein Potential**: What elements could be safely adapted?
- **Member Safety Rating**: How safe is this for beginners?

OUTPUT (JSON):
{{
  "pait_components": {{
    "strategy_logic": 0-25,
    "risk_transparency": 0-25,
    "proof_quality": 0-25,
    "educational_merit": 0-25
  }},
  "total_pait_score": 0-100,
  "profit_claims": {{
    "realism_score": 0-10,
    "red_flags": ["list any concerns"]
  }},
  "educational_assessment": {{
    "skill_level": "beginner|intermediate|advanced",
    "key_learnings": ["valuable concepts"],
    "safety_warnings": ["precautions needed"]
  }},
  "frankenstein_potential": {{
    "extractable_techniques": ["useful methods"],
    "safety_modifications": ["risk reduction approaches"],
    "combination_ideas": ["integration possibilities"]
  }},
  "member_recommendation": {{
    "verdict": "recommend|caution|avoid",
    "reasoning": "concise explanation",
    "target_audience": "who should watch this"
  }}
}}

Respond with ONLY the JSON object."""

        response = self.analyze_with_gpu_model("claudia-trader:latest", pait_prompt, timeout=180)
        
        if response:
            try:
                # Extract JSON from response
                json_start = response.find('{')
                json_end = response.rfind('}') + 1
                if json_start >= 0 and json_end > json_start:
                    pait_data = json.loads(response[json_start:json_end])
                    logger.info(f"✅ pAIt scoring complete: {pait_data.get('total_pait_score', 'N/A')}/100")
                    return pait_data
            except json.JSONDecodeError:
                logger.warning("⚠️ Could not parse pAIt JSON response")
        
        # Fallback scoring
        return {
            "pait_components": {
                "strategy_logic": 15,
                "risk_transparency": 10, 
                "proof_quality": 12,
                "educational_merit": 13
            },
            "total_pait_score": 50,
            "member_recommendation": {
                "verdict": "caution",
                "reasoning": "Analysis incomplete - manual review recommended"
            }
        }
    
    def process_video_complete(self, youtube_url: str) -> Dict[str, Any]:
        """Complete video processing pipeline"""
        
        processing_start = datetime.now()
        
        results = {
            "youtube_url": youtube_url,
            "processing_start": processing_start.isoformat(),
            "pipeline_steps": {},
            "success": False
        }
        
        # Step 1: Download
        logger.info(f"📥 Step 1: Downloading video...")
        download_result = self.download_video_with_ytdlp(youtube_url)
        results["pipeline_steps"]["download"] = download_result
        
        if not download_result or not download_result.get("success"):
            results["error"] = "Download failed"
            return results
        
        # Step 2: Find video file
        output_dir = Path(download_result["output_dir"])
        video_files = list(output_dir.glob("*.mp4")) + list(output_dir.glob("*.webm"))
        
        if not video_files:
            results["error"] = "No video file found after download"
            return results
        
        video_file = str(video_files[0])
        
        # Step 3: Transcribe
        logger.info(f"🎙️ Step 2: Transcribing...")
        transcript = self.transcribe_with_whisper(video_file)
        results["pipeline_steps"]["transcription"] = {
            "success": transcript is not None,
            "transcript_length": len(transcript) if transcript else 0
        }
        
        if not transcript:
            results["error"] = "Transcription failed"
            return results
        
        # Step 4: pAIt Analysis
        logger.info(f"🎯 Step 3: pAIt Scoring...")
        metadata = download_result.get("metadata", {})
        pait_scores = self.generate_pait_score(transcript, metadata)
        results["pipeline_steps"]["pait_analysis"] = pait_scores
        
        # Final processing
        processing_end = datetime.now()
        processing_time = processing_end - processing_start
        
        results.update({
            "processing_end": processing_end.isoformat(),
            "processing_time": str(processing_time),
            "success": True,
            "video_metadata": metadata,
            "transcript": transcript,
            "pait_results": pait_scores
        })
        
        # Save results
        self._save_analysis_results(results)
        
        logger.info(f"✅ Complete pipeline finished in {processing_time}")
        return results
    
    def _save_analysis_results(self, results: Dict) -> None:
        """Save analysis results to files"""
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        video_id = results.get("video_metadata", {}).get("id", "unknown")
        
        # Full results
        full_file = self.analysis_dir / f"video_analysis_{video_id}_{timestamp}.json"
        with open(full_file, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        
        # pAIt score summary (for API consumption)
        pait_summary = {
            "video_id": video_id,
            "video_url": results.get("youtube_url"),
            "title": results.get("video_metadata", {}).get("title", "Unknown"),
            "channel": results.get("video_metadata", {}).get("uploader", "Unknown"),
            "pait_score": results.get("pait_results", {}).get("total_pait_score", 50),
            "recommendation": results.get("pait_results", {}).get("member_recommendation", {}),
            "processed_at": results.get("processing_end"),
            "processing_time": results.get("processing_time")
        }
        
        pait_file = self.pait_scores_dir / f"pait_score_{video_id}_{timestamp}.json"
        with open(pait_file, 'w', encoding='utf-8') as f:
            json.dump(pait_summary, f, indent=2, ensure_ascii=False)
        
        # Update latest scores (for API)
        latest_file = self.pait_scores_dir / "latest_video_scores.json"
        
        try:
            with open(latest_file, 'r', encoding='utf-8') as f:
                latest_scores = json.load(f)
        except:
            latest_scores = {"scores": []}
        
        latest_scores["scores"].insert(0, pait_summary)
        latest_scores["scores"] = latest_scores["scores"][:50]  # Keep last 50
        latest_scores["last_updated"] = datetime.now().isoformat()
        
        with open(latest_file, 'w', encoding='utf-8') as f:
            json.dump(latest_scores, f, indent=2, ensure_ascii=False)
        
        logger.info(f"📊 Results saved: {full_file.name}")

def main():
    """CLI interface for H100 video pipeline"""
    import argparse
    
    parser = argparse.ArgumentParser(description="🎬 H100 Video Analysis Pipeline")
    parser.add_argument('--url', type=str, help='YouTube URL to process')
    parser.add_argument('--batch-file', type=str, help='File with multiple URLs')
    parser.add_argument('--test-models', action='store_true', help='Test model availability')
    
    args = parser.parse_args()
    
    pipeline = H100VideoPipeline()
    
    if args.test_models:
        print("🤖 Testing H100 GPU Models...")
        for role, model in pipeline.models.items():
            if "juliet" not in model:  # Skip juliet
                test_response = pipeline.analyze_with_gpu_model(
                    model, "Respond with: Model test successful", timeout=30
                )
                status = "✅" if test_response else "❌"
                print(f"  {status} {role}: {model}")
        return
    
    if args.url:
        print(f"🎬 Processing single video: {args.url}")
        results = pipeline.process_video_complete(args.url)
        
        if results.get("success"):
            pait_score = results.get("pait_results", {}).get("total_pait_score", "N/A")
            print(f"✅ Processing complete!")
            print(f"🎯 pAIt Score: {pait_score}/100")
            print(f"⏱️ Time: {results.get('processing_time')}")
        else:
            print(f"❌ Processing failed: {results.get('error')}")
    
    elif args.batch_file:
        print(f"📋 Processing batch file: {args.batch_file}")
        with open(args.batch_file, 'r') as f:
            urls = [line.strip() for line in f if line.strip()]
        
        for i, url in enumerate(urls, 1):
            print(f"\n📹 Processing {i}/{len(urls)}: {url}")
            results = pipeline.process_video_complete(url)
            
            if results.get("success"):
                pait_score = results.get("pait_results", {}).get("total_pait_score", "N/A")
                print(f"  ✅ pAIt Score: {pait_score}/100")
            else:
                print(f"  ❌ Failed: {results.get('error')}")
            
            # Brief pause between videos
            time.sleep(2)
    
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
