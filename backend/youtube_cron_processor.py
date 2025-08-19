#!/usr/bin/env python3
"""
⏰ YouTube Analysis Cron Processor
Automated background processing for YouTube trading analysis
"""

import os
import json
import time
import asyncio
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict
from youtube_analysis_service import YouTubeAnalysisService

class YouTubeCronProcessor:
    def __init__(self):
        self.service = YouTubeAnalysisService()
        self.watch_dir = "lens-data/uploads/"
        self.processed_dir = "lens-data/processed/"
        self.log_file = "lens-data/cron_logs/youtube_processor.log"
        
        # Create directories
        os.makedirs(self.watch_dir, exist_ok=True)
        os.makedirs(self.processed_dir, exist_ok=True)
        os.makedirs(os.path.dirname(self.log_file), exist_ok=True)
    
    def log_message(self, message: str):
        """Log processing messages"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_entry = f"[{timestamp}] {message}\n"
        
        print(log_entry.strip())
        
        try:
            with open(self.log_file, 'a', encoding='utf-8') as f:
                f.write(log_entry)
        except Exception as e:
            # Fallback: write without emojis if Unicode fails
            clean_message = message.encode('ascii', 'ignore').decode('ascii')
            clean_entry = f"[{timestamp}] {clean_message}\n"
            with open(self.log_file, 'a') as f:
                f.write(clean_entry)
    
    def find_new_uploads(self) -> list:
        """Find new image uploads to process"""
        try:
            supported_formats = {'.jpg', '.jpeg', '.png', '.bmp', '.tiff'}
            new_files = []
            
            for file_path in Path(self.watch_dir).iterdir():
                if file_path.is_file() and file_path.suffix.lower() in supported_formats:
                    # Check if already processed
                    processed_file = Path(self.processed_dir) / file_path.name
                    if not processed_file.exists():
                        new_files.append(str(file_path))
            
            return new_files
            
        except Exception as e:
            self.log_message(f"Error finding uploads: {e}")
            return []
    
    async def process_file(self, file_path: str) -> bool:
        """Process a single uploaded file"""
        try:
            self.log_message(f"Processing: {os.path.basename(file_path)}")
            
            # Run analysis
            result = await self.service.process_youtube_analysis(file_path)
            
            if "error" in result:
                self.log_message(f"Analysis failed: {result['error']}")
                return False
            
            # Move file to processed directory
            processed_path = os.path.join(self.processed_dir, os.path.basename(file_path))
            os.rename(file_path, processed_path)
            
            # Log success
            pait_score = result.get('paitScores', {}).get('overallScore', 'Unknown')
            title = result.get('metadata', {}).get('title', 'Unknown')
            
            self.log_message(f"✅ Completed: {title} (pAIt: {pait_score})")
            
            # Update processing statistics
            self.update_stats(result)
            
            return True
            
        except Exception as e:
            self.log_message(f"Error processing {file_path}: {e}")
            return False
    
    def update_stats(self, analysis_result: Dict):
        """Update processing statistics"""
        try:
            stats_file = "lens-data/processing_stats.json"
            
            # Load existing stats
            if os.path.exists(stats_file):
                with open(stats_file, 'r') as f:
                    stats = json.load(f)
            else:
                stats = {
                    "totalProcessed": 0,
                    "averagePAItScore": 0,
                    "scoreDistribution": {"high": 0, "moderate": 0, "low": 0, "critical": 0},
                    "lastProcessed": None,
                    "dailyStats": {}
                }
            
            # Update stats
            pait_score = analysis_result.get('paitScores', {}).get('overallScore', 0)
            grade = analysis_result.get('profitabilityGrade', 'Unknown').lower()
            today = datetime.now().strftime('%Y-%m-%d')
            
            stats["totalProcessed"] += 1
            stats["lastProcessed"] = datetime.now().isoformat()
            
            # Update average score
            if stats["totalProcessed"] == 1:
                stats["averagePAItScore"] = pait_score
            else:
                stats["averagePAItScore"] = (stats["averagePAItScore"] * (stats["totalProcessed"] - 1) + pait_score) / stats["totalProcessed"]
            
            # Update distribution
            if grade in stats["scoreDistribution"]:
                stats["scoreDistribution"][grade] += 1
            
            # Daily stats
            if today not in stats["dailyStats"]:
                stats["dailyStats"][today] = 0
            stats["dailyStats"][today] += 1
            
            # Save updated stats
            with open(stats_file, 'w') as f:
                json.dump(stats, f, indent=2)
                
        except Exception as e:
            self.log_message(f"Error updating stats: {e}")
    
    async def process_batch(self):
        """Process all pending files"""
        new_files = self.find_new_uploads()
        
        if not new_files:
            return 0
        
        self.log_message(f"Found {len(new_files)} files to process")
        
        processed_count = 0
        for file_path in new_files:
            success = await self.process_file(file_path)
            if success:
                processed_count += 1
            
            # Small delay between files
            await asyncio.sleep(1)
        
        self.log_message(f"Batch complete: {processed_count}/{len(new_files)} successful")
        return processed_count
    
    def cleanup_old_logs(self, days_to_keep: int = 30):
        """Clean up old log files"""
        try:
            cutoff_date = datetime.now() - timedelta(days=days_to_keep)
            
            # Clean processed files older than cutoff
            for file_path in Path(self.processed_dir).iterdir():
                if file_path.is_file():
                    file_age = datetime.fromtimestamp(file_path.stat().st_mtime)
                    if file_age < cutoff_date:
                        file_path.unlink()
                        self.log_message(f"Cleaned up old file: {file_path.name}")
            
        except Exception as e:
            self.log_message(f"Cleanup error: {e}")
    
    async def run_continuous(self, interval_seconds: int = 60):
        """Run continuous monitoring"""
        self.log_message(f"🚀 Starting continuous YouTube analysis processor (interval: {interval_seconds}s)")
        
        while True:
            try:
                await self.process_batch()
                
                # Cleanup old files once per day
                if datetime.now().hour == 2 and datetime.now().minute < 5:  # 2 AM cleanup
                    self.cleanup_old_logs()
                
                await asyncio.sleep(interval_seconds)
                
            except KeyboardInterrupt:
                self.log_message("👋 Shutdown requested")
                break
            except Exception as e:
                self.log_message(f"Unexpected error: {e}")
                await asyncio.sleep(interval_seconds)  # Continue despite errors
    
    async def run_once(self):
        """Run one-time batch processing"""
        self.log_message("🎯 Running one-time YouTube analysis batch")
        processed = await self.process_batch()
        self.log_message(f"✅ One-time processing complete: {processed} files")
        return processed

# CLI interface
if __name__ == "__main__":
    import sys
    
    processor = YouTubeCronProcessor()
    
    if len(sys.argv) > 1 and sys.argv[1] == "--once":
        # Run once
        asyncio.run(processor.run_once())
    elif len(sys.argv) > 1 and sys.argv[1] == "--interval":
        # Run with custom interval
        interval = int(sys.argv[2]) if len(sys.argv) > 2 else 60
        asyncio.run(processor.run_continuous(interval))
    else:
        # Default continuous mode
        asyncio.run(processor.run_continuous())
