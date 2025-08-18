# 🚀 Quantum Analyzer - Multi-Agent YouTube Trading Video Analysis

**Revolutionary pAIt-powered analysis pipeline for YouTube trading content - August 2025**

## 🎯 **Mission**

The Quantum Analyzer is a multi-agent AI system that downloads, transcribes, and analyzes YouTube trading videos to generate comprehensive pAIt-compatible scorecards. Built for deployment on your Digital Ocean GPU node (Cloak), it provides forensic-grade analysis of financial content.

## ⚡ **System Architecture**

```
📺 YouTube URL → 🎬 Download → 🎙️ Transcribe → 🧠 Multi-Agent Analysis → 📊 pAIt Scoring → 🎨 Visual Scorecard
```

### **🤖 Agent Roles**
- **🎯 Orchestrator (Claude)**: Workflow coordination & prompt design
- **⬇️ Downloader (yt-dlp)**: Video acquisition & preprocessing  
- **🎙️ Transcriber (Whisper)**: Audio-to-text conversion
- **🤖 JBot**: Technical analysis & methodology assessment
- **⚖️ Claudia**: Risk assessment & regulatory compliance
- **🎨 Visual Generator**: pAIt scorecards & Crella Lens integration

## 🛠️ **Quick Setup**

```bash
# Clone and setup
git clone <your-repo>
cd quantum-analyzer

# Run setup script
chmod +x *.sh
./setup.sh

# Ensure Ollama is running with required models
ollama serve &
ollama pull jbot
ollama pull claudia
```

## 🚀 **Usage**

```bash
# Analyze any YouTube trading video
./quantum_analyzer_master.sh "https://youtube.com/watch?v=VIDEO_ID"
```

## 📊 **Output Files**

- `processing/output/VIDEO_ID_pait_scorecard.json` - Complete pAIt analysis
- `processing/output/VIDEO_ID_visual_scorecard.png` - Visual scorecard (1200x800)
- `processing/output/VIDEO_ID_crella_overlay.png` - Compact overlay (600x400)
- `processing/output/VIDEO_ID_crella_compatible.json` - Crella Lens integration package

## 🔬 **Analysis Framework**

### **5-Component pAIt Scoring (0-5 scale)**

1. **📈 Profit Claims** - Verification of return promises and guarantees
2. **⚠️ Risk Disclosure** - Assessment of warnings and disclaimers  
3. **🔍 Methodology** - Technical analysis depth and explanation quality
4. **📄 Evidence & Proof** - Authenticity of screenshots and statements
5. **🏆 Credibility Markers** - Overall trustworthiness indicators

### **🎯 Recommendations Generated**
- **HIGH VALUE** (4.0+) - Recommended viewing with quality content
- **MODERATE VALUE** (3.0-3.9) - Acceptable with minor issues
- **MODERATE/HIGH RISK** (2.0-2.9) - Watch with caution, verify claims
- **AVOID** (<2.0) - High risk of fraud or misinformation

## 🔗 **Crella Lens Integration**

Generated files are fully compatible with the Crella Lens Quantum Edition system:

- **VIP Upload Ready** - Automatic metadata embedding
- **Quantum Signature** - Multi-agent verification tracking
- **Component Scores** - Detailed breakdown for enhanced results
- **Risk Assessment** - Integrated fraud detection

## 📝 **File Structure**

```
quantum-analyzer/
├── setup.sh                          # Environment setup
├── quantum_analyzer_master.sh        # Main execution script
├── download_and_prep.sh              # Video download & preprocessing
├── transcribe.sh                     # Whisper transcription
├── run_analysis.sh                   # Multi-agent coordination
├── aggregate_analysis.sh             # pAIt scoring & aggregation
├── generate_visual_scorecard.sh      # Visual scorecard generation
├── prompts/
│   ├── jbot_analyzer.py              # JBot technical analysis
│   └── claudia_analyzer.py           # Claudia risk assessment
├── config/
│   └── analyzer_config.json          # System configuration
├── processing/
│   ├── raw/                          # Downloaded videos & audio
│   ├── transcripts/                  # Whisper transcription results
│   ├── segments/                     # Video frames
│   ├── analysis/                     # Agent analysis results
│   └── output/                       # Final pAIt scorecards
└── logs/
    └── processing.log                # System logs
```

---

**🔬 Powered by Quantum Multi-Agent Architecture - August 2025**  
**🔗 Fully integrated with Crella Lens Quantum Edition**