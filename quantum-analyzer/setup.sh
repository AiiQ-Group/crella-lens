#!/bin/bash
# quantum_trader_setup.sh
# Multi-Agent YouTube Video Analysis Pipeline - August 2025

echo "🚀 QUANTUM ANALYZER SETUP - AUGUST 2025"

# Create project structure
mkdir -p ~/quantum_analyzer/{videos,transcripts,frames,analysis,scorecards}
cd ~/quantum_analyzer

echo "📁 Creating processing directories..."
mkdir -p processing/{raw,segments,analysis,output}
mkdir -p logs
mkdir -p config

# Install Python dependencies
echo "📦 Installing dependencies..."
pip install yt-dlp whisper-cpp opencv-python pillow requests numpy

# Check for ffmpeg
if ! command -v ffmpeg &> /dev/null; then
    echo "⚠️  ffmpeg not found - installing..."
    sudo apt update && sudo apt install -y ffmpeg
fi

# Verify Ollama models
echo "🤖 Checking Ollama models..."
ollama list | grep -E "(jbot|claudia|llava)" || echo "⚠️  Install JBot/Claudia models with: ollama pull jbot && ollama pull claudia"

# Create config files
cat > config/analyzer_config.json << 'EOF'
{
  "system_info": {
    "version": "Quantum-v2.1-August2025",
    "deployment": "DigitalOcean-GPU-Cloak",
    "agents": ["Claude-Orchestrator", "JBot-Technical", "Claudia-Risk"]
  },
  "processing": {
    "frame_extraction_interval": 30,
    "max_video_duration": 3600,
    "segment_length": 60
  },
  "scoring": {
    "component_weights": {
      "profit_claims": 0.25,
      "risk_disclosure": 0.25, 
      "methodology": 0.20,
      "evidence": 0.15,
      "credibility": 0.15
    }
  },
  "ollama": {
    "base_url": "http://localhost:11434",
    "technical_model": "jbot",
    "risk_model": "claudia",
    "fallback_model": "llava"
  }
}
EOF

# Set permissions
chmod +x *.sh

echo "✅ SETUP COMPLETE!"
echo "🎯 Ready for video analysis pipeline deployment"
echo ""
echo "Next steps:"
echo "1. Ensure Ollama is running: ollama serve"
echo "2. Pull required models: ollama pull jbot && ollama pull claudia"
echo "3. Test with: ./quantum_analyzer_master.sh <youtube_url>"
