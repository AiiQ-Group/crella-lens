#!/usr/bin/env python3
"""
🚀 YouTube Downloader - WORKING VERSION (Shorts Compatible!)
Bulletproof YouTube Shorts + Video downloader 

This version focuses on the core functionality that's working:
- YouTube Shorts download (FIXED!)
- Video metadata extraction
- File organization
- Cross-platform compatibility

Transcription can be added later once Whisper is properly installed.
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
Path('lens-data').mkdir(exist_ok=True)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('lens-data/downloader.log', encoding='utf-8'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class YouTubeDownloader:
    """Bulletproof YouTube video downloader - Shorts compatible"""
    
    def __init__(self, base_dir: str = "lens-data"):
        self.base_dir = Path(base_dir)
        self.downloads_dir = self.base_dir / "downloads"
        self.metadata_dir = self.base_dir / "metadata"
        
        # Create directories
        for dir_path in [self.downloads_dir, self.metadata_dir]:
            dir_path.mkdir(parents=True, exist_ok=True)
        
        self.platform = platform.system().lower()
        logger.info(f"YouTube Downloader initialized on {platform.system()}")
    
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
    
    def check_yt_dlp(self) -> bool:
        """Check if yt-dlp is available"""
        try:
            result = subprocess.run([sys.executable, '-m', 'yt_dlp', '--version'], 
                                  capture_output=True, text=True, timeout=10)
            if result.returncode == 0:
                logger.info(f"yt-dlp version: {result.stdout.strip()}")
                return True
            else:
                logger.warning("yt-dlp not working properly")
                return False
        except Exception as e:
            logger.warning(f"yt-dlp not found: {e}")
            return False
    
    def download_video(self, url: str, quality: str = "best", keep_video: bool = True) -> Tuple[bool, Optional[str], Dict[str, Any]]:
        """
        Download video using yt-dlp with multiple fallback strategies
        
        Args:
            url: YouTube URL
            quality: Video quality preference (best, worst, audio)
            keep_video: Whether to keep the video file
        
        Returns: (success, file_path, metadata)
        """
        video_id = self.extract_video_id(url)
        if not video_id:
            return False, None, {"error": "Invalid YouTube URL"}
        
        output_path = self.downloads_dir / f"{video_id}.%(ext)s"
        metadata = {"video_id": video_id, "url": url, "download_time": datetime.now().isoformat()}
        
        # Quality options
        if quality == "audio":
            format_selector = "bestaudio/best"
            extract_audio = True
        elif quality == "worst":
            format_selector = "worst"
            extract_audio = False
        else:  # best
            format_selector = "best[height<=1080]/best[height<=720]/best"
            extract_audio = False
        
        logger.info(f"Downloading {video_id} with quality: {quality}")
        
        try:
            cmd = [
                sys.executable, '-m', 'yt_dlp',
                '--format', format_selector,
                '--output', str(output_path),
                '--write-info-json',
                '--write-description',
                '--write-thumbnail',
                '--no-playlist',
                url
            ]
            
            # Add audio extraction if needed
            if extract_audio:
                cmd.extend(['--extract-audio', '--audio-format', 'wav'])
            
            # Execute download
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
            
            if result.returncode == 0:
                # Find downloaded file
                downloaded_files = list(self.downloads_dir.glob(f"{video_id}.*"))
                video_files = [f for f in downloaded_files if f.suffix in ['.mp4', '.webm', '.mkv', '.wav', '.m4a']]
                
                if video_files:
                    video_file = video_files[0]
                    logger.info(f"Downloaded: {video_file.name} ({video_file.stat().st_size} bytes)")
                    
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
                                    "view_count": video_info.get("view_count", 0),
                                    "upload_date": video_info.get("upload_date", "Unknown"),
                                    "description": video_info.get("description", "")[:500] + "..." if video_info.get("description", "") else "",
                                    "file_size": video_file.stat().st_size,
                                    "file_name": video_file.name
                                })
                        except Exception as e:
                            logger.warning(f"Could not read metadata: {e}")
                    
                    # Save metadata
                    metadata_file = self.metadata_dir / f"{video_id}_metadata.json"
                    with open(metadata_file, 'w', encoding='utf-8') as f:
                        json.dump(metadata, f, indent=2, ensure_ascii=False)
                    
                    return True, str(video_file), metadata
                else:
                    logger.error("No video file found after download")
            else:
                logger.error(f"yt-dlp error: {result.stderr}")
                
        except subprocess.TimeoutExpired:
            logger.error("Download timeout")
        except Exception as e:
            logger.error(f"Download error: {e}")
        
        return False, None, {"error": "Download failed"}
    
    def analyze_video(self, url: str, quality: str = "best", keep_video: bool = True) -> Dict[str, Any]:
        """Complete video download and analysis pipeline"""
        analysis_start = datetime.now()
        video_id = self.extract_video_id(url)
        
        results = {
            "video_id": video_id,
            "url": url,
            "analysis_date": analysis_start.isoformat(),
            "status": "started",
            "steps": {}
        }
        
        logger.info(f"Starting download for: {url}")
        
        # Step 1: Check yt-dlp
        if not self.check_yt_dlp():
            results["status"] = "failed"
            results["error"] = "yt-dlp not available"
            return results
        
        results["steps"]["yt_dlp_check"] = {"status": "passed"}
        
        # Step 2: Download video
        download_success, video_path, download_metadata = self.download_video(url, quality, keep_video)
        
        results["steps"]["download"] = {
            "status": "passed" if download_success else "failed",
            "video_path": video_path,
            "metadata": download_metadata
        }
        
        if not download_success:
            results["status"] = "failed"
            results["error"] = "Video download failed"
            return results
        
        results["status"] = "completed"
        
        # Calculate processing time
        analysis_end = datetime.now()
        results["processing_time"] = str(analysis_end - analysis_start)
        
        # Save results
        results_file = self.metadata_dir / f"{video_id}_results.json"
        with open(results_file, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        
        logger.info(f"Download complete: {results['processing_time']}")
        
        return results

def main():
    """CLI interface for YouTube Downloader"""
    parser = argparse.ArgumentParser(
        description="🚀 YouTube Downloader - Shorts Compatible!",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s "https://youtube.com/watch?v=VIDEO_ID"
  %(prog)s "https://youtube.com/shorts/SHORT_ID" --quality best
  %(prog)s "https://youtu.be/VIDEO_ID" --quality audio --keep-video
        """
    )
    
    parser.add_argument('url', help='YouTube URL (video or short)')
    parser.add_argument('--quality', default='best', 
                       choices=['best', 'worst', 'audio'],
                       help='Download quality (default: best)')
    parser.add_argument('--keep-video', action='store_true',
                       help='Keep downloaded video file (default: True)')
    parser.add_argument('--output-dir', default='lens-data',
                       help='Output directory (default: lens-data)')
    
    args = parser.parse_args()
    
    # Initialize downloader
    downloader = YouTubeDownloader(args.output_dir)
    
    # Download video
    try:
        results = downloader.analyze_video(
            url=args.url,
            quality=args.quality,
            keep_video=args.keep_video
        )
        
        # Print results summary
        print("\n" + "="*50)
        print("📊 DOWNLOAD RESULTS")
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
                print(f"👀 Views: {metadata.get('view_count', 'Unknown')}")
                print(f"📁 File: {metadata.get('file_name', 'Unknown')}")
                print(f"💾 Size: {metadata.get('file_size', 0)} bytes")
                print(f"📄 Video Path: {download_info['video_path']}")
            
            print(f"\n🎉 SUCCESS: YouTube Shorts download working perfectly!")
            print(f"📁 Files saved in: {args.output_dir}/")
            
        else:
            print(f"❌ Status: {results['status'].upper()}")
            print(f"💥 Error: {results.get('error', 'Unknown error')}")
            sys.exit(1)
            
    except KeyboardInterrupt:
        print("\n🛑 Download interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n💥 Unexpected error: {e}")
        logger.error(f"Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
