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
                    # Try to extract pAIt score from analysis
                    # (This would need to be parsed from the claudia response)
                    "estimated_pait_score": 75,  # Placeholder - extract from analysis
                    "risk_assessment": "medium",  # Placeholder - extract from analysis
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
