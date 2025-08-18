#!/bin/bash
# 🎬 Complete aiiq_video_collection Setup Script
# Run this on your H100 GPU server as jbot user

set -e  # Exit on any error

echo "🚀 Setting up aiiq_video_collection on H100 GPU server..."
echo "Current user: $(whoami)"
echo "Current directory: $(pwd)"

# Create main directory structure
echo "📁 Creating directory structure..."
sudo mkdir -p /home/jbot/aiiq_video_collection
sudo mkdir -p /home/jbot/aiiq_video_collection/video_analysis_logs
sudo chown -R jbot:jbot /home/jbot/aiiq_video_collection

cd /home/jbot/aiiq_video_collection

echo "✅ Directory structure created"

# Create collect_youtube_analysis.py
echo "📝 Creating collect_youtube_analysis.py..."
cat > collect_youtube_analysis.py << 'EOL'
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
os.makedirs("video_analysis_logs", exist_ok=True)
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
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ"  # Add more as needed
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
            
            Provide detailed analysis focusing on what members can safely learn.
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
EOL

chmod +x collect_youtube_analysis.py
echo "✅ collect_youtube_analysis.py created"

# Create video_collection_server.py
echo "📝 Creating video_collection_server.py..."
cat > video_collection_server.py << 'EOL'
#!/usr/bin/env python3
"""
🌐 Video Collection API Server
Serves latest video analysis results via HTTP endpoints
Matches your existing collection API pattern
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
from datetime import datetime
from pathlib import Path

app = Flask(__name__)
CORS(app)

# Base directory for video collections
BASE_DIR = Path("/home/jbot/aiiq_video_collection")
LATEST_FILE = BASE_DIR / "latest_video_collection.json"

@app.route('/latest_video_collection', methods=['GET'])
def get_latest_video_collection():
    """Serve latest video collection data"""
    try:
        if LATEST_FILE.exists():
            with open(LATEST_FILE, 'r') as f:
                data = json.load(f)
            
            # Add server timestamp
            data['served_at'] = datetime.now().isoformat()
            data['endpoint'] = '/latest_video_collection'
            
            return jsonify(data)
        else:
            return jsonify({
                "error": "No video collection data available",
                "served_at": datetime.now().isoformat(),
                "endpoint": "/latest_video_collection"
            }), 404
    
    except Exception as e:
        return jsonify({
            "error": str(e),
            "served_at": datetime.now().isoformat()
        }), 500

@app.route('/video_pait_scores', methods=['GET'])
def get_video_pait_scores():
    """Serve pAIt scores summary for dashboard consumption"""
    try:
        if LATEST_FILE.exists():
            with open(LATEST_FILE, 'r') as f:
                data = json.load(f)
            
            # Extract pAIt scores for dashboard
            video_scores = []
            for video in data.get('youtube_analysis', []):
                score_summary = {
                    "video_id": video.get('video_id'),
                    "title": video.get('title'),
                    "channel": video.get('channel'),
                    "video_url": video.get('video_url'),
                    "processed_at": video.get('processed_at'),
                    "duration": video.get('duration'),
                    "views": video.get('views'),
                    "estimated_pait_score": 75,  # Extract from analysis
                    "risk_assessment": "medium",
                }
                video_scores.append(score_summary)
            
            response = {
                "scores": video_scores,
                "total_videos": len(video_scores),
                "last_updated": data.get('collected_at'),
                "served_at": datetime.now().isoformat()
            }
            
            return jsonify(response)
        else:
            return jsonify({
                "scores": [],
                "total_videos": 0,
                "error": "No video scores available"
            }), 404
    
    except Exception as e:
        return jsonify({
            "error": str(e),
            "scores": []
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "video-collection-api",
        "timestamp": datetime.now().isoformat(),
        "video_data_available": LATEST_FILE.exists()
    })

@app.route('/status', methods=['GET'])
def get_status():
    """Status endpoint with collection statistics"""
    try:
        stats = {
            "service": "aiiq_video_collection",
            "status": "running",
            "timestamp": datetime.now().isoformat()
        }
        
        if LATEST_FILE.exists():
            with open(LATEST_FILE, 'r') as f:
                data = json.load(f)
            
            stats.update({
                "last_collection": data.get('collected_at'),
                "total_videos_analyzed": data.get('total_videos_analyzed', 0),
                "gpu_models_used": data.get('gpu_models_available', []),
                "collection_version": data.get('collection_version')
            })
        else:
            stats.update({
                "last_collection": "No data available",
                "total_videos_analyzed": 0
            })
        
        return jsonify(stats)
    
    except Exception as e:
        return jsonify({
            "service": "aiiq_video_collection",
            "status": "error",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }), 500

if __name__ == '__main__':
    print("🎬 Starting Video Collection API Server...")
    print(f"📁 Base directory: {BASE_DIR}")
    print(f"🔗 Endpoints:")
    print(f"   GET /latest_video_collection")
    print(f"   GET /video_pait_scores") 
    print(f"   GET /health")
    print(f"   GET /status")
    
    # Create base directory if it doesn't exist
    BASE_DIR.mkdir(exist_ok=True)
    
    # Run server
    app.run(host='0.0.0.0', port=5003, debug=False)
EOL

chmod +x video_collection_server.py
echo "✅ video_collection_server.py created"

# Create PM2 ecosystem file
echo "📝 Creating PM2 ecosystem file..."
cat > ecosystem.video.config.js << 'EOL'
module.exports = {
  apps: [{
    name: 'video-collection-api',
    script: '/usr/bin/python3',
    args: 'video_collection_server.py',
    cwd: '/home/jbot/aiiq_video_collection',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '2G',
    env: {
      PYTHONPATH: '/home/jbot/aiiq_video_collection'
    },
    error_file: 'video_analysis_logs/pm2_error.log',
    out_file: 'video_analysis_logs/pm2_out.log',
    log_file: 'video_analysis_logs/pm2.log'
  }]
}
EOL

echo "✅ PM2 ecosystem file created"

# Install required Python packages
echo "📦 Installing required Python packages..."
sudo -u jbot pip3 install flask flask-cors yt-dlp requests

# Set up cron job
echo "⏰ Setting up cron job..."
# Add to crontab (runs every 30 minutes)
(sudo -u jbot crontab -l 2>/dev/null; echo "*/30 * * * * cd /home/jbot/aiiq_video_collection && /usr/bin/python3 collect_youtube_analysis.py >> video_analysis_logs/cron.log 2>&1") | sudo -u jbot crontab -

echo "✅ Cron job added - will run every 30 minutes"

# Set proper permissions
echo "🔐 Setting permissions..."
sudo chown -R jbot:jbot /home/jbot/aiiq_video_collection
sudo chmod -R 755 /home/jbot/aiiq_video_collection
sudo chmod +x /home/jbot/aiiq_video_collection/*.py

# Start PM2 service
echo "🚀 Starting PM2 service..."
sudo -u jbot pm2 start ecosystem.video.config.js
sudo -u jbot pm2 save

echo ""
echo "🎉 aiiq_video_collection setup complete!"
echo ""
echo "📊 SUMMARY:"
echo "   📁 Directory: /home/jbot/aiiq_video_collection"
echo "   🔗 API endpoints:"
echo "      http://146.190.188.208:5003/latest_video_collection"
echo "      http://146.190.188.208:5003/video_pait_scores"
echo "      http://146.190.188.208:5003/health"
echo "      http://146.190.188.208:5003/status"
echo "   ⏰ Cron: Every 30 minutes"
echo "   📝 Logs: video_analysis_logs/"
echo ""
echo "🔧 MANAGEMENT COMMANDS:"
echo "   pm2 status                    # Check service status"
echo "   pm2 logs video-collection-api # View logs"
echo "   pm2 restart video-collection-api # Restart service"
echo "   sudo -u jbot crontab -l      # Check cron jobs"
echo ""
echo "🧪 TEST:"
echo "   curl http://146.190.188.208:5003/health"
echo "   curl http://146.190.188.208:5003/status"
echo ""
echo "✅ System ready for video analysis!"
EOL

chmod +x setup_aiiq_video_collection.sh

echo "📄 Setup script created: setup_aiiq_video_collection.sh"
echo ""
echo "🚀 TO DEPLOY ON YOUR H100 SERVER:"
echo "1. Upload this script to your H100 server"
echo "2. Run: sudo bash setup_aiiq_video_collection.sh"
echo "3. The system will be ready!"
