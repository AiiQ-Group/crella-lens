#!/usr/bin/env python3
"""
Simple test to verify YouTube download and transcription work
"""

import subprocess
import sys
from pathlib import Path

def test_yt_dlp():
    """Test if we can use yt-dlp via subprocess"""
    print("🧪 Testing yt-dlp...")
    try:
        # Try to get version
        result = subprocess.run([sys.executable, '-m', 'yt_dlp', '--version'], 
                               capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            print(f"✅ yt-dlp working: {result.stdout.strip()}")
            return True
        else:
            print(f"❌ yt-dlp error: {result.stderr}")
            return False
    except Exception as e:
        print(f"❌ yt-dlp test failed: {e}")
        return False

def test_whisper():
    """Test if we can import whisper"""
    print("🧪 Testing Whisper...")
    try:
        import whisper
        print("✅ Whisper import successful")
        return True
    except ImportError as e:
        print(f"❌ Whisper import failed: {e}")
        return False

def download_test_video():
    """Try to download a short video"""
    print("🧪 Testing video download...")
    
    # Create output directory
    Path('test-output').mkdir(exist_ok=True)
    
    url = "https://youtube.com/shorts/xyvqJdyUVIA"
    output_path = "test-output/%(id)s.%(ext)s"
    
    try:
        cmd = [
            sys.executable, '-m', 'yt_dlp',
            '--format', 'worst',  # Download smallest format for testing
            '--output', output_path,
            '--no-playlist',
            url
        ]
        
        print(f"🎬 Downloading: {url}")
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
        
        if result.returncode == 0:
            print("✅ Download successful!")
            # Find downloaded file
            downloaded_files = list(Path('test-output').glob('*'))
            if downloaded_files:
                print(f"📁 Downloaded: {downloaded_files[0].name}")
                return str(downloaded_files[0])
            else:
                print("❌ No files found after download")
                return None
        else:
            print(f"❌ Download failed: {result.stderr}")
            return None
            
    except Exception as e:
        print(f"❌ Download error: {e}")
        return None

def main():
    print("🚀 Simple YouTube Analyzer Test")
    print("=" * 40)
    
    # Test individual components
    yt_dlp_works = test_yt_dlp()
    whisper_works = test_whisper()
    
    if not yt_dlp_works:
        print("\n💡 Try: pip install yt-dlp")
    
    if not whisper_works:
        print("\n💡 Try: pip install openai-whisper")
    
    if yt_dlp_works:
        print("\n🎬 Testing actual download...")
        video_file = download_test_video()
        
        if video_file and whisper_works:
            print(f"\n🎙️ Testing transcription of {video_file}...")
            try:
                import whisper
                model = whisper.load_model("tiny")
                result = model.transcribe(video_file)
                print(f"✅ Transcription successful!")
                print(f"📝 Text: {result['text'][:100]}...")
                print(f"🌐 Language: {result.get('language', 'unknown')}")
            except Exception as e:
                print(f"❌ Transcription failed: {e}")

if __name__ == "__main__":
    main()
