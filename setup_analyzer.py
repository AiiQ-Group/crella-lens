#!/usr/bin/env python3
"""
🛠️ YouTube Analyzer Setup Script
Automatically installs dependencies and sets up the environment
"""

import os
import sys
import subprocess
import platform
from pathlib import Path

def run_command(cmd: list, description: str) -> bool:
    """Run a command and return success status"""
    print(f"📦 {description}...")
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
        if result.returncode == 0:
            print(f"✅ {description} completed")
            return True
        else:
            print(f"❌ {description} failed: {result.stderr}")
            return False
    except subprocess.TimeoutExpired:
        print(f"❌ {description} timed out")
        return False
    except Exception as e:
        print(f"❌ {description} error: {e}")
        return False

def check_python_version():
    """Check if Python version is compatible"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print(f"❌ Python {version.major}.{version.minor} is too old")
        print("💡 Please upgrade to Python 3.8+ (recommended: 3.12+)")
        return False
    
    print(f"✅ Python {version.major}.{version.minor}.{version.micro} is compatible")
    return True

def setup_directories():
    """Create necessary directories"""
    directories = [
        "lens-data",
        "lens-data/downloads", 
        "lens-data/transcripts",
        "lens-data/analysis"
    ]
    
    print("📁 Setting up directories...")
    for directory in directories:
        Path(directory).mkdir(parents=True, exist_ok=True)
        print(f"   ✅ {directory}")

def install_python_packages():
    """Install required Python packages"""
    packages = [
        "yt-dlp",
        "openai-whisper"
    ]
    
    success = True
    for package in packages:
        if not run_command([sys.executable, "-m", "pip", "install", package],
                          f"Installing {package}"):
            success = False
    
    return success

def check_ffmpeg():
    """Check if FFmpeg is available and provide installation instructions"""
    try:
        result = subprocess.run(['ffmpeg', '-version'], capture_output=True, timeout=5)
        if result.returncode == 0:
            print("✅ FFmpeg is available")
            return True
    except (subprocess.TimeoutExpired, FileNotFoundError):
        pass
    
    print("⚠️  FFmpeg not found")
    
    system = platform.system().lower()
    if system == 'windows':
        print("💡 Install FFmpeg on Windows:")
        print("   1. Download from: https://ffmpeg.org/download.html#build-windows")
        print("   2. Extract and add to PATH")
        print("   3. Or use chocolatey: choco install ffmpeg")
    elif system == 'darwin':  # macOS
        print("💡 Install FFmpeg on macOS:")
        print("   brew install ffmpeg")
    else:  # Linux
        print("💡 Install FFmpeg on Linux:")
        print("   sudo apt install ffmpeg  # Debian/Ubuntu")
        print("   sudo yum install ffmpeg  # RHEL/CentOS") 
        print("   sudo pacman -S ffmpeg   # Arch Linux")
    
    return False

def test_installation():
    """Test the installation by importing modules"""
    print("🧪 Testing installation...")
    
    try:
        import yt_dlp
        print("   ✅ yt-dlp import successful")
    except ImportError:
        print("   ❌ yt-dlp import failed")
        return False
    
    try:
        import whisper
        print("   ✅ whisper import successful")
    except ImportError:
        print("   ❌ whisper import failed")
        return False
    
    return True

def create_example_script():
    """Create an example usage script"""
    example_content = '''#!/usr/bin/env python3
"""
🎯 Example usage of YouTube Analyzer
"""

from youtube_analyzer import YouTubeAnalyzer

def main():
    # Initialize analyzer
    analyzer = YouTubeAnalyzer()
    
    # Example URLs to test
    test_urls = [
        "https://youtube.com/watch?v=dQw4w9WgXcQ",  # Regular video
        "https://youtube.com/shorts/SHORT_ID_HERE", # YouTube Short
    ]
    
    for url in test_urls:
        print(f"🎬 Analyzing: {url}")
        
        # Run complete analysis
        results = analyzer.analyze_video(
            url=url,
            whisper_model="base",  # or "tiny" for speed, "large" for accuracy
            keep_video=False       # Delete video after transcription
        )
        
        if results["status"] == "completed":
            print(f"✅ Success! Transcript saved to: {results['steps']['transcription']['transcript_path']}")
        else:
            print(f"❌ Failed: {results.get('error', 'Unknown error')}")
        
        print("-" * 50)

if __name__ == "__main__":
    main()
'''
    
    with open("example_usage.py", "w", encoding='utf-8') as f:
        f.write(example_content)
    
    print("✅ Created example_usage.py")

def main():
    """Main setup process"""
    print("🚀 YouTube Analyzer Setup")
    print("=" * 30)
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Create directories
    setup_directories()
    
    # Install Python packages
    print("\n📦 Installing Python packages...")
    if not install_python_packages():
        print("⚠️  Some packages failed to install")
        choice = input("🤔 Continue anyway? (y/N): ")
        if choice.lower() != 'y':
            sys.exit(1)
    
    # Check FFmpeg
    print("\n🎬 Checking video dependencies...")
    ffmpeg_ok = check_ffmpeg()
    
    # Test installation
    print("\n🧪 Testing installation...")
    if test_installation():
        print("✅ All Python packages installed correctly")
    else:
        print("❌ Some packages are not working correctly")
    
    # Create example script
    create_example_script()
    
    # Final status
    print("\n" + "=" * 50)
    print("🎉 SETUP COMPLETE!")
    
    if ffmpeg_ok:
        print("✅ All dependencies are ready")
    else:
        print("⚠️  Install FFmpeg manually to enable video processing")
    
    print("\n🚀 Ready to use:")
    print("   python youtube_analyzer.py --check-deps")
    print("   python youtube_analyzer.py 'https://youtube.com/watch?v=VIDEO_ID'")
    print("   python test_analyzer.py")
    
    print("\n📚 Files created:")
    print("   📁 lens-data/          # Output directory")
    print("   🐍 youtube_analyzer.py # Main analyzer")
    print("   🧪 test_analyzer.py    # Test suite") 
    print("   📝 example_usage.py    # Usage examples")

if __name__ == "__main__":
    main()
