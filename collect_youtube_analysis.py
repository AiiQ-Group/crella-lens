#!/usr/bin/env python3
"""
🎬 YouTube Video Analysis Collection
Part of aiiq_video_collection - matches your aiiq_data_collection pattern
"""

import json
import requests
import subprocess
from datetime import datetime
import os
import time
import logging

# Setup logging to match your existing pattern
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('video_analysis_logs/youtube_analysis.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# GPU Models available (matching your reliable models, excluding juliet)
GPU_MODELS = {
    "jbot": "http://localhost:11434/api/generate",
    "claudia-trader": "http://localhost:11434/api/generate", 
    "trader-max": "http://localhost:11434/api/generate",
    "kathy-ops": "http://localhost:11434/api/generate",
    "qwen2.5:72b": "http://localhost:11434/api/generate",
    "fraud-detector": "http://localhost:11434/api/generate"
}

def query_gpu_model(model_name, prompt, timeout=120):
    """Query a GPU model with a prompt - matches your existing function"""
    payload = {
        "model": model_name,
        "prompt": prompt,
        "stream": False
    }
    
    try:
        logger.info(f"🤖 Querying {model_name}...")
        response = requests.post(GPU_MODELS[model_name], json=payload, timeout=timeout)
        
        if response.status_code == 200:
            result = response.json()
            logger.info(f"✅ {model_name} responded successfully")
            return result.get("response", "")
        else:
            logger.error(f"❌ {model_name} HTTP error: {response.status_code}")
            return None
            
    except requests.exceptions.Timeout:
        logger.error(f"⏰ {model_name} timed out after {timeout}s")
        return None
    except Exception as e:
        logger.error(f"❌ {model_name} error: {e}")
        return None

def download_youtube_metadata(youtube_url):
    """Download metadata without full video (faster for analysis)"""
    try:
        cmd = [
            "yt-dlp", "--dump-json", "--no-download", youtube_url
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
        
        if result.returncode == 0:
            metadata = json.loads(result.stdout)
            logger.info(f"✅ Metadata extracted: {metadata.get('title', 'Unknown')}")
            return metadata
        else:
            logger.error(f"❌ Metadata extraction failed: {result.stderr}")
            return None
            
    except Exception as e:
        logger.error(f"💥 Metadata error: {e}")
        return None

def collect_youtube_pait_analysis():
    """Collect YouTube analysis using your GPU models"""
    logger.info("🎬 Starting YouTube pAIt analysis collection...")
    
    # Example URLs to analyze (you can modify this list or make it dynamic)
    youtube_urls = [
        "https://youtube.com/shorts/xyvqJdyUVIA",  # Your example
        "https://www.youtube.com/watch?v=SAMPLE_VIDEO_ID"  # Add more as needed
    ]
    
    analysis_results = []
    
    for url in youtube_urls:
        try:
            logger.info(f"📹 Processing: {url}")
            
            # Get metadata
            metadata = download_youtube_metadata(url)
            if not metadata:
                continue
            
            # Create analysis prompt (similar to your VWAP analysis style)
            video_content = f"""
            Title: {metadata.get('title', 'Unknown')}
            Channel: {metadata.get('uploader', 'Unknown')}
            Duration: {metadata.get('duration', 0)} seconds
            Views: {metadata.get('view_count', 0)}
            Description: {metadata.get('description', '')[:500]}...
            """
            
            pait_prompt = f"""
            You are analyzing YouTube trading content for pAIt (Proof of AI Technology) scoring.
            
            VIDEO CONTENT:
            {video_content}
            
            Analyze this trading content and provide pAIt component scores (0-25 each):
            1. Strategy Logic - Does the strategy have sound reasoning?
            2. Risk Transparency - Are risks properly disclosed?
            3. Proof Quality - Is evidence credible and verifiable?
            4. Educational Merit - Does this teach valuable concepts?
            
            Also assess:
            - Profit claims realism (0-10 scale)
            - Fraud risk indicators
            - Member safety rating
            - Educational value for different skill levels
            
            Provide detailed analysis in JSON format focusing on what members can safely learn.
            """
            
            # Query Claudia for pAIt analysis
            claudia_response = query_gpu_model("claudia-trader", pait_prompt, timeout=180)
            
            if claudia_response:
                # Process and structure the response
                video_analysis = {
                    "video_url": url,
                    "video_id": metadata.get('id', 'unknown'),
                    "title": metadata.get('title', 'Unknown'),
                    "channel": metadata.get('uploader', 'Unknown'),
                    "duration": metadata.get('duration', 0),
                    "views": metadata.get('view_count', 0),
                    "upload_date": metadata.get('upload_date', ''),
                    "model_used": "claudia-trader",
                    "analysis": claudia_response,
                    "processed_at": datetime.now().isoformat(),
                    "collection_type": "youtube_pait_analysis"
                }
                
                analysis_results.append(video_analysis)
                logger.info(f"✅ Analysis complete for: {metadata.get('title', 'Unknown')}")
            
            # Brief pause between videos
            time.sleep(5)
            
        except Exception as e:
            logger.error(f"💥 Error processing {url}: {e}")
            continue
    
    # Create collection data (matching your existing format)
    collection_data = {
        "youtube_analysis": analysis_results,
        "collected_at": datetime.now().isoformat(),
        "gpu_models_available": list(GPU_MODELS.keys()),
        "data_source": "GPU YouTube Collection",
        "collection_version": "1.0",
        "total_videos_analyzed": len(analysis_results)
    }
    
    # Save with timestamp (matching your pattern)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"youtube_collection_{timestamp}.json"
    
    with open(filename, "w") as f:
        json.dump(collection_data, f, indent=2)
    
    logger.info(f"✅ YouTube collection complete! Saved to {filename}")
    
    # Also save as latest (for API consumption)
    with open("latest_video_collection.json", "w") as f:
        json.dump(collection_data, f, indent=2)
    
    logger.info("✅ Latest video collection updated for API access")
    
    return collection_data

def main():
    """Main collection function - matches your existing pattern"""
    logger.info(f"🚀 Starting YouTube video collection at {datetime.now()}")
    
    # Ensure log directory exists
    os.makedirs("video_analysis_logs", exist_ok=True)
    
    try:
        # Run collection
        results = collect_youtube_pait_analysis()
        
        logger.info(f"📊 Collection Summary:")
        logger.info(f"   Videos Analyzed: {results['total_videos_analyzed']}")
        logger.info(f"   Models Used: {', '.join(results['gpu_models_available'])}")
        logger.info(f"   Collection Time: {results['collected_at']}")
        
        return results
        
    except Exception as e:
        logger.error(f"💥 Collection failed: {e}")
        return None

if __name__ == "__main__":
    main()
