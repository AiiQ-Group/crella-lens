#!/usr/bin/env python3
"""
🚀 YouTube Analysis System Deployment Script
Sets up the complete YouTube trading shorts analysis pipeline
"""

import os
import sys
import subprocess
import json
from pathlib import Path

def print_step(step, description):
    print(f"\n{'='*50}")
    print(f"Step {step}: {description}")
    print('='*50)

def run_command(cmd, description):
    print(f"Running: {description}")
    print(f"Command: {cmd}")
    try:
        result = subprocess.run(cmd, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ Success: {description}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed: {description}")
        print(f"Error: {e.stderr}")
        return False

def create_directories():
    """Create necessary directories"""
    directories = [
        "lens-data/uploads",
        "lens-data/processed", 
        "lens-data/youtube-analysis",
        "lens-data/cron_logs",
        "backend/logs"
    ]
    
    for directory in directories:
        Path(directory).mkdir(parents=True, exist_ok=True)
        print(f"📁 Created: {directory}")

def install_python_dependencies():
    """Install required Python packages"""
    requirements = [
        "pillow>=9.0.0",
        "opencv-python>=4.5.0", 
        "pytesseract>=0.3.8",
        "requests>=2.28.0",
        "numpy>=1.21.0"
    ]
    
    print("📦 Installing Python dependencies...")
    for req in requirements:
        success = run_command(f"pip install {req}", f"Installing {req}")
        if not success:
            print(f"⚠️ Warning: Failed to install {req}")

def setup_tesseract():
    """Setup Tesseract OCR"""
    print("🔍 Setting up Tesseract OCR...")
    
    # Check if tesseract is already installed
    try:
        subprocess.run(["tesseract", "--version"], check=True, capture_output=True)
        print("✅ Tesseract already installed")
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ Tesseract not found")
        
    # Platform-specific installation instructions
    if sys.platform.startswith('win'):
        print("📋 Windows: Download Tesseract from https://github.com/UB-Mannheim/tesseract/wiki")
        print("📋 Add tesseract.exe to your PATH")
    elif sys.platform.startswith('darwin'):
        run_command("brew install tesseract", "Installing Tesseract via Homebrew")
    else:  # Linux
        run_command("sudo apt-get update && sudo apt-get install tesseract-ocr", "Installing Tesseract via apt")
    
    return True

def create_configuration():
    """Create configuration files"""
    config = {
        "youtube_analysis": {
            "watch_directory": "lens-data/uploads",
            "processed_directory": "lens-data/processed",
            "analysis_directory": "lens-data/youtube-analysis",
            "supported_formats": [".jpg", ".jpeg", ".png", ".bmp", ".tiff"],
            "processing_interval": 60,
            "cleanup_days": 30
        },
        "pait_scoring": {
            "score_range": [200, 1000],
            "categories": {
                "technical_accuracy": 0.20,
                "execution_feasibility": 0.18, 
                "risk_management": 0.22,
                "market_conditions": 0.15,
                "strategy_clarity": 0.15,
                "profitability_potential": 0.10
            }
        },
        "api_endpoints": {
            "claire_api": "http://localhost:5001/api/claire/chat",
            "analysis_webhook": "http://localhost:3000/api/analysis/webhook"
        }
    }
    
    config_file = "backend/youtube_analysis_config.json"
    with open(config_file, 'w') as f:
        json.dump(config, f, indent=2)
    
    print(f"⚙️ Configuration saved to {config_file}")

def create_service_scripts():
    """Create service management scripts"""
    
    # Windows batch script
    windows_script = """@echo off
echo Starting YouTube Analysis Service...
cd /d "%~dp0"
python backend/youtube_cron_processor.py --continuous
pause
"""
    
    with open("start_youtube_analysis.bat", 'w') as f:
        f.write(windows_script)
    
    # Linux/Mac shell script
    unix_script = """#!/bin/bash
echo "Starting YouTube Analysis Service..."
cd "$(dirname "$0")"
python3 backend/youtube_cron_processor.py --continuous
"""
    
    with open("start_youtube_analysis.sh", 'w') as f:
        f.write(unix_script)
    
    # Make shell script executable
    if not sys.platform.startswith('win'):
        os.chmod("start_youtube_analysis.sh", 0o755)
    
    print("🔧 Service scripts created")

def test_system():
    """Test the YouTube analysis system"""
    print("🧪 Testing system components...")
    
    # Test Python imports
    test_imports = [
        "import PIL",
        "import cv2", 
        "import pytesseract",
        "import requests",
        "import numpy"
    ]
    
    for test_import in test_imports:
        try:
            exec(test_import)
            module_name = test_import.split()[1]
            print(f"✅ {module_name} import successful")
        except ImportError as e:
            print(f"❌ {test_import} failed: {e}")
    
    # Test directory structure
    required_dirs = ["lens-data/uploads", "backend"]
    for directory in required_dirs:
        if Path(directory).exists():
            print(f"✅ Directory exists: {directory}")
        else:
            print(f"❌ Missing directory: {directory}")

def show_usage_instructions():
    """Show usage instructions"""
    print("\n" + "="*60)
    print("🎉 YouTube Analysis System Deployed Successfully!")
    print("="*60)
    
    print("""
📋 USAGE INSTRUCTIONS:

1. START THE SYSTEM:
   Windows: double-click start_youtube_analysis.bat
   Linux/Mac: ./start_youtube_analysis.sh
   
2. UPLOAD IMAGES:
   - Place YouTube screenshot images in: lens-data/uploads/
   - Supported formats: JPG, PNG, BMP, TIFF
   - Files will be automatically processed
   
3. VIEW RESULTS:
   - Analysis results: lens-data/youtube-analysis/
   - Processing logs: lens-data/cron_logs/
   - Processed images: lens-data/processed/
   
4. WEB INTERFACE:
   - Start your React app: npm start
   - Toggle "YouTube Shorts Analysis" in the controls bar
   - Drag & drop images for instant analysis
   
5. MONITOR SYSTEM:
   - Check logs: lens-data/cron_logs/youtube_processor.log
   - Statistics: lens-data/processing_stats.json
   
🔧 CONFIGURATION:
   - Edit: backend/youtube_analysis_config.json
   - Adjust processing intervals, directories, scoring weights
   
💡 TROUBLESHOOTING:
   - Ensure Tesseract OCR is installed and in PATH
   - Check Claire API is running on port 5001
   - Verify file permissions for uploads directory
   
🚀 READY TO ANALYZE YOUTUBE TRADING SHORTS!
""")

def main():
    """Main deployment function"""
    print("🚀 YouTube Analysis System Deployment")
    print("=====================================")
    
    try:
        print_step(1, "Creating Directories")
        create_directories()
        
        print_step(2, "Installing Python Dependencies") 
        install_python_dependencies()
        
        print_step(3, "Setting up Tesseract OCR")
        setup_tesseract()
        
        print_step(4, "Creating Configuration")
        create_configuration()
        
        print_step(5, "Creating Service Scripts")
        create_service_scripts()
        
        print_step(6, "Testing System Components")
        test_system()
        
        print_step(7, "Deployment Complete")
        show_usage_instructions()
        
    except Exception as e:
        print(f"❌ Deployment failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
