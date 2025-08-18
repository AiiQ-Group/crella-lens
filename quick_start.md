# 🚀 YouTube Analyzer Quick Start

**Bulletproof YouTube Shorts + Video downloader with Whisper transcription**

## ⚡ Ultra-Quick Setup

```bash
# 1. Run setup (installs everything)
python setup_analyzer.py

# 2. Test your setup
python youtube_analyzer.py --check-deps

# 3. Analyze any YouTube video or Short
python youtube_analyzer.py "https://youtube.com/watch?v=VIDEO_ID"
python youtube_analyzer.py "https://youtube.com/shorts/SHORT_ID"
```

## 🎯 Key Features

✅ **YouTube Shorts Support** - No more 400 errors!  
✅ **Multiple Fallback Strategies** - If one method fails, tries others  
✅ **Cross-Platform** - Windows (Gringots) & Linux (Cloak)  
✅ **Python 3.12 Compatible** - Future-proof  
✅ **Whisper Integration** - AI-powered transcription  
✅ **Auto-Organization** - Files go to `lens-data/`  
✅ **CLI Friendly** - Easy to script and automate  

## 📂 Output Structure

```
lens-data/
├── downloads/           # Downloaded videos (optional to keep)
├── transcripts/         # Text transcriptions (.txt + .json)
├── analysis/           # Analysis results and metadata
└── analyzer.log       # Processing logs
```

## 🔧 Command Options

```bash
# Basic usage
python youtube_analyzer.py "YOUTUBE_URL"

# Use better Whisper model (slower but more accurate)
python youtube_analyzer.py "URL" --model large

# Keep video file after transcription  
python youtube_analyzer.py "URL" --keep-video

# Check what's installed
python youtube_analyzer.py --check-deps

# Auto-install missing dependencies
python youtube_analyzer.py --install-deps
```

## 🎥 Whisper Model Guide

| Model  | Speed | Accuracy | Use Case |
|--------|-------|----------|----------|
| tiny   | ⚡⚡⚡ | ⭐⭐ | Quick tests, short clips |
| base   | ⚡⚡ | ⭐⭐⭐ | **Default - good balance** |
| small  | ⚡ | ⭐⭐⭐⭐ | Better accuracy |
| medium | 🐌 | ⭐⭐⭐⭐⭐ | High accuracy |
| large  | 🐌🐌 | ⭐⭐⭐⭐⭐⭐ | Best quality, production use |

## 🚨 Troubleshooting

### "yt-dlp not found"
```bash
pip install yt-dlp
```

### "whisper not available" 
```bash
pip install openai-whisper
```

### "FFmpeg not found"
**Windows:** Download from https://ffmpeg.org/download.html  
**Linux:** `sudo apt install ffmpeg`  
**macOS:** `brew install ffmpeg`

### "400 error on Shorts"
✅ **This is exactly what this tool fixes!** The analyzer tries multiple strategies automatically.

## 🔗 Integration with Crella Lens

This analyzer generates JSON files that are **fully compatible** with your Crella Lens system:

1. **Upload the transcript** to Crella Lens for pAIt analysis
2. **Use with your quantum-analyzer** pipeline for complete video scoring
3. **Embed in VIP system** for automated trading video assessment

## 🧪 Test Suite

```bash
# Run comprehensive tests
python test_analyzer.py

# Test specific URL formats
python test_analyzer.py  # Follow prompts
```

## 💡 Pro Tips

1. **Use `base` model** for most content - great speed/accuracy balance
2. **Keep videos** only if you need them later (`--keep-video`)  
3. **Check logs** in `lens-data/analyzer.log` if something fails
4. **Test first** with `--check-deps` before running on important content

## 🚀 Ready for Production

This tool is built for **reliability** and **compatibility**:

- ✅ Handles YouTube API changes gracefully
- ✅ Multiple fallback download strategies  
- ✅ Cross-platform compatibility
- ✅ Comprehensive error handling
- ✅ Detailed logging for debugging
- ✅ Future-proof architecture

**Perfect for your Crella Lens pipeline! 🔬⚡**
