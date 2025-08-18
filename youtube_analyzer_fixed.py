#!/usr/bin/env python3
"""
🚀 YouTube Video Analyzer - Crella Lens Integration (FIXED VERSION)
Bulletproof YouTube Shorts + Video downloader with Whisper transcription

Compatible with:
- Windows (Gringots) & Linux (Cloak)  
- Python 3.12
- YouTube Videos & Shorts
- OpenAI Whisper
- Crella Lens integration

Author: Multi-AI Collaboration - August 2025
"""

import os
import sys
import json
import argparse
import subprocess
import platform
from pathlib import Path
from datetime import datetime
from typing import Optional, Dict, Any, Tuple
import logging

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('lens-data/analyzer.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class YouTubeAnalyzer:
    """Bulletproof YouTube video downloader and analyzer"""
    
    def __init__(self, base_dir: str = "lens-data"):
        self.base_dir = Path(base_dir)
        self.downloads_dir = self.base_dir / "downloads"
        self.transcripts_dir = self.base_dir / "transcripts"
        self.analysis_dir = self.base_dir / "analysis"
        
        # Create directories
        for dir_path in [self.downloads_dir, self.transcripts_dir, self.analysis_dir]:
            dir_path.mkdir(parents=True, exist_ok=True)
        
        self.platform = platform.system().lower()
        logger.info(f"🚀 YouTube Analyzer initialized on {platform.system()}")
    
    def extract_video_id(self, url: str) -> Optional[str]:
        """Extract video ID from various YouTube URL formats"""
        import re
        
        patterns = [
            r'(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})',
            r'youtube\.com\/embed\/([a-zA-Z0-9_-]{11})',
            r'youtube\.com\/v\/([a-zA-Z0-9_-]{11})'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, url)
            if match:
                return match.group(1)
        return None
    
    def check_dependencies(self) -> Dict[str, bool]:
        """Check if required dependencies are available"""
        deps = {
            'yt-dlp': False,
            'whisper': False,
            'ffmpeg': False
        }
        
        # Check yt-dlp
        try:
            result = subprocess.run(['yt-dlp', '--version'], 
                                  capture_output=True, text=True, timeout=10)
            deps['yt-dlp'] = result.returncode == 0
            if deps['yt-dlp']:
                logger.info(f"✅ yt-dlp version: {result.stdout.strip()}")
        except (subprocess.TimeoutExpired, FileNotFoundError):
            logger.warning("⚠️  yt-dlp not found")
        
        # Check whisper
        try:
            import whisper
            deps['whisper'] = True
            logger.info("✅ OpenAI Whisper available")
        except ImportError:
            logger.warning("⚠️  OpenAI Whisper not found")
        
        # Check ffmpeg
        try:
            result = subprocess.run(['ffmpeg', '-version'], 
                                  capture_output=True, text=True, timeout=5)
            deps['ffmpeg'] = result.returncode == 0
            if deps['ffmpeg']:
                logger.info("✅ FFmpeg available")
        except (subprocess.TimeoutExpired, FileNotFoundError):
            logger.warning("⚠️  FFmpeg not found")
        
        return deps
    
    def download_video(self, url: str, attempt: int = 1) -> Tuple[bool, Optional[str], Dict[str, Any]]:
        """
        Download video using yt-dlp with multiple fallback strategies
        
        Returns: (success, file_path, metadata)
        """
        video_id = self.extract_video_id(url)
        if not video_id:
            return False, None, {"error": "Invalid YouTube URL"}
        
        output_path = self.downloads_dir / f"{video_id}.%(ext)s"
        metadata = {"video_id": video_id, "url": url, "attempt": attempt}
        
        # Strategy progression: Quality -> Compatibility -> Audio-only
        strategies = [
            {
                "name": "High Quality Video",
                "format": "best[height<=1080][ext=mp4]/best[height<=720][ext=mp4]/best[ext=mp4]",
                "extract_audio": False
            },
            {
                "name": "Any Video Format", 
                "format": "best[height<=720]/best",
                "extract_audio": False
            },
            {
                "name": "Audio Only",
                "format": "bestaudio/best",
                "extract_audio": True
            }
        ]
        
        strategy = strategies[min(attempt - 1, len(strategies) - 1)]
        logger.info(f"🎬 Attempt {attempt}: {strategy['name']} - {video_id}")
        
        try:
            cmd = [
                'yt-dlp',
                '--format', strategy['format'],
                '--output', str(output_path),
                '--write-info-json',
                '--no-playlist',
                '--extract-flat', 'false'
            ]
            
            # Add audio extraction if needed
            if strategy['extract_audio']:
                cmd.extend(['--extract-audio', '--audio-format', 'wav'])
            
            # Execute download
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
            
            if result.returncode == 0:
                # Find downloaded file
                downloaded_files = list(self.downloads_dir.glob(f"{video_id}.*"))
                video_files = [f for f in downloaded_files if f.suffix in ['.mp4', '.webm', '.mkv', '.wav']]
                
                if video_files:
                    video_file = video_files[0]
                    logger.info(f"✅ Downloaded: {video_file.name}")
                    
                    # Load metadata if available
                    info_file = self.downloads_dir / f"{video_id}.info.json"
                    if info_file.exists():
                        try:
                            with open(info_file, 'r', encoding='utf-8') as f:
                                video_info = json.load(f)
                                metadata.update({
                                    "title": video_info.get("title", "Unknown"),
                                    "duration": video_info.get("duration", 0),
                                    "uploader": video_info.get("uploader", "Unknown"),
                                    "view_count": video_info.get("view_count", 0)
                                })
                        except Exception as e:
                            logger.warning(f"⚠️  Could not read metadata: {e}")
                    
                    return True, str(video_file), metadata
                else:
                    logger.error("❌ No video file found after download")
            else:
                logger.error(f"❌ yt-dlp error: {result.stderr}")
                
        except subprocess.TimeoutExpired:
            logger.error("❌ Download timeout")
        except Exception as e:
            logger.error(f"❌ Download error: {e}")
        
        # Try next strategy
        if attempt < len(strategies):
            logger.info(f"🔄 Trying fallback strategy...")
            return self.download_video(url, attempt + 1)
        
        return False, None, {"error": "All download strategies failed"}
    
    def transcribe_audio(self, video_path: str, model: str = "base") -> Tuple[bool, Optional[str], Dict[str, Any]]:
        """Transcribe audio using OpenAI Whisper"""
        try:
            import whisper
        except ImportError:
            return False, None, {"error": "Whisper not installed"}
        
        video_file = Path(video_path)
        video_id = video_file.stem
        transcript_path = self.transcripts_dir / f"{video_id}.txt"
        json_path = self.transcripts_dir / f"{video_id}.json"
        
        logger.info(f"🎙️ Transcribing {video_file.name} with Whisper model '{model}'")
        
        try:
            # Load Whisper model
            whisper_model = whisper.load_model(model)
            
            # Transcribe
            result = whisper_model.transcribe(str(video_file))
            
            # Save plain text transcript
            with open(transcript_path, 'w', encoding='utf-8') as f:
                f.write(result["text"])
            
            # Save detailed JSON transcript
            transcript_data = {
                "video_id": video_id,
                "transcription_date": datetime.now().isoformat(),
                "model": model,
                "language": result.get("language", "unknown"),
                "text": result["text"],
                "segments": result.get("segments", [])
            }
            
            with open(json_path, 'w', encoding='utf-8') as f:
                json.dump(transcript_data, f, indent=2, ensure_ascii=False)
            
            logger.info(f"✅ Transcript saved: {transcript_path.name}")
            logger.info(f"📊 Word count: {len(result['text'].split())}")
            
            return True, str(transcript_path), {
                "model": model,
                "language": result.get("language", "unknown"),
                "duration": len(result.get("segments", [])),
                "word_count": len(result["text"].split())
            }
            
        except Exception as e:
            logger.error(f"❌ Transcription error: {e}")
            return False, None, {"error": str(e)}
    
    def analyze_video(self, url: str, whisper_model: str = "base", 
                     keep_video: bool = False) -> Dict[str, Any]:
        """Complete video analysis pipeline"""
        analysis_start = datetime.now()
        video_id = self.extract_video_id(url)
        
        results = {
            "video_id": video_id,
            "url": url,
            "analysis_date": analysis_start.isoformat(),
            "status": "started",
            "steps": {}
        }
        
        logger.info(f"🚀 Starting analysis for: {url}")
        
        # Step 1: Check dependencies
        logger.info("📋 Checking dependencies...")
        deps = self.check_dependencies()
        missing_critical = [dep for dep, available in deps.items() 
                           if not available and dep in ['yt-dlp', 'whisper']]
        
        if missing_critical:
            logger.error(f"❌ Missing critical dependencies: {missing_critical}")
            results["status"] = "failed"
            results["error"] = f"Missing dependencies: {missing_critical}"
            return results
        
        results["steps"]["dependencies"] = {"status": "passed", "available": deps}
        
        # Step 2: Download video
        logger.info("🎬 Downloading video...")
        download_success, video_path, download_metadata = self.download_video(url)
        
        results["steps"]["download"] = {
            "status": "passed" if download_success else "failed",
            "video_path": video_path,
            "metadata": download_metadata
        }
        
        if not download_success:
            results["status"] = "failed"
            results["error"] = "Video download failed"
            return results
        
        # Step 3: Transcribe audio
        logger.info("🎙️ Transcribing audio...")
        transcript_success, transcript_path, transcript_metadata = self.transcribe_audio(
            video_path, whisper_model
        )
        
        results["steps"]["transcription"] = {
            "status": "passed" if transcript_success else "failed",
            "transcript_path": transcript_path,
            "metadata": transcript_metadata
        }
        
        if not transcript_success:
            results["status"] = "failed"
            results["error"] = "Transcription failed"
        else:
            results["status"] = "completed"
        
        # Step 4: Cleanup (optional)
        if not keep_video and video_path:
            try:
                os.remove(video_path)
                logger.info(f"🗑️  Cleaned up video file: {Path(video_path).name}")
            except Exception as e:
                logger.warning(f"⚠️  Could not remove video file: {e}")
        
        # Calculate processing time
        analysis_end = datetime.now()
        results["processing_time"] = str(analysis_end - analysis_start)
        
        # Save analysis results
        analysis_file = self.analysis_dir / f"{video_id}_analysis.json"
        with open(analysis_file, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        
        logger.info(f"✅ Analysis complete: {results['processing_time']}")
        logger.info(f"📁 Results saved: {analysis_file.name}")
        
        return results

def main():
    """CLI interface for YouTube Analyzer"""
    parser = argparse.ArgumentParser(
        description="🚀 YouTube Video Analyzer - Crella Lens Integration",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s "https://youtube.com/watch?v=VIDEO_ID"
  %(prog)s "https://youtube.com/shorts/SHORT_ID" --model large
  %(prog)s "https://youtu.be/VIDEO_ID" --keep-video --model medium
  
Whisper Models (size vs accuracy vs speed):
  tiny   - Fastest, least accurate
  base   - Default, good balance  
  small  - Better accuracy
  medium - High accuracy, slower
  large  - Best accuracy, slowest
        """
    )
    
    parser.add_argument('url', nargs='?', help='YouTube URL (video or short)')
    parser.add_argument('--model', default='base', 
                       choices=['tiny', 'base', 'small', 'medium', 'large'],
                       help='Whisper model size (default: base)')
    parser.add_argument('--keep-video', action='store_true',
                       help='Keep downloaded video file after transcription')
    parser.add_argument('--output-dir', default='lens-data',
                       help='Output directory (default: lens-data)')
    parser.add_argument('--check-deps', action='store_true',
                       help='Check dependencies and exit')
    parser.add_argument('--install-deps', action='store_true',
                       help='Attempt to install missing dependencies')
    
    args = parser.parse_args()
    
    # Initialize analyzer
    analyzer = YouTubeAnalyzer(args.output_dir)
    
    # Check dependencies only
    if args.check_deps:
        print("🔍 Checking dependencies...")
        deps = analyzer.check_dependencies()
        
        print("\n📋 Dependency Status:")
        for dep, available in deps.items():
            status = "✅" if available else "❌"
            print(f"  {status} {dep}")
        
        missing = [dep for dep, available in deps.items() if not available]
        if missing:
            print(f"\n❌ Missing: {', '.join(missing)}")
            if 'ffmpeg' in missing and platform.system().lower() == 'windows':
                print("💡 Run: python install_ffmpeg_windows.py")
            else:
                print("💡 Use --install-deps to attempt automatic installation")
            sys.exit(1)
        else:
            print("\n✅ All dependencies available!")
            sys.exit(0)
    
    # Install dependencies
    if args.install_deps:
        print("📦 Installing missing dependencies...")
        deps = analyzer.check_dependencies()
        # Install Python packages only - FFmpeg needs separate installer
        missing_python = [dep for dep, available in deps.items() 
                         if not available and dep in ['yt-dlp', 'whisper']]
        
        for pkg in missing_python:
            pkg_name = 'openai-whisper' if pkg == 'whisper' else pkg
            try:
                subprocess.run([sys.executable, '-m', 'pip', 'install', pkg_name], 
                             capture_output=True, check=True, timeout=120)
                print(f"✅ {pkg} installed successfully!")
            except subprocess.CalledProcessError:
                print(f"❌ Failed to install {pkg}")
        
        sys.exit(0)
    
    # Validate URL for analysis
    if not args.url:
        parser.error("YouTube URL is required for analysis")
    
    # Analyze video
    try:
        results = analyzer.analyze_video(
            url=args.url,
            whisper_model=args.model,
            keep_video=args.keep_video
        )
        
        # Print results summary
        print("\n" + "="*50)
        print("📊 ANALYSIS RESULTS")
        print("="*50)
        
        if results["status"] == "completed":
            print(f"✅ Status: {results['status'].upper()}")
            print(f"🎯 Video ID: {results['video_id']}")
            print(f"⏱️  Processing Time: {results['processing_time']}")
            
            # Download info
            download_info = results["steps"]["download"]
            if download_info["status"] == "passed":
                metadata = download_info["metadata"]
                print(f"📺 Title: {metadata.get('title', 'Unknown')}")
                print(f"👤 Channel: {metadata.get('uploader', 'Unknown')}")
                print(f"⏰ Duration: {metadata.get('duration', 0)} seconds")
            
            # Transcription info
            transcript_info = results["steps"]["transcription"]
            if transcript_info["status"] == "passed":
                transcript_meta = transcript_info["metadata"]
                print(f"🎙️  Language: {transcript_meta.get('language', 'unknown')}")
                print(f"📝 Words: {transcript_meta.get('word_count', 0)}")
                print(f"📄 Transcript: {transcript_info['transcript_path']}")
            
        else:
            print(f"❌ Status: {results['status'].upper()}")
            print(f"💥 Error: {results.get('error', 'Unknown error')}")
            sys.exit(1)
            
    except KeyboardInterrupt:
        print("\n🛑 Analysis interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n💥 Unexpected error: {e}")
        logger.error(f"Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
