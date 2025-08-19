#!/usr/bin/env python3
"""
🔧 Tesseract OCR Windows Installation Helper
Downloads and provides instructions for installing Tesseract on Windows
"""

import os
import sys
import webbrowser

def install_tesseract_windows():
    print("🔍 Installing Tesseract OCR for Windows...")
    print("=" * 50)
    
    # Check if already installed
    tesseract_paths = [
        r"C:\Program Files\Tesseract-OCR\tesseract.exe",
        r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
        r"C:\Users\{}\AppData\Local\Programs\Tesseract-OCR\tesseract.exe".format(os.getenv('USERNAME', ''))
    ]
    
    for path in tesseract_paths:
        if os.path.exists(path):
            print(f"✅ Tesseract found at: {path}")
            
            # Add to pytesseract config
            config_content = f'''
# Tesseract configuration for pytesseract
import pytesseract
pytesseract.pytesseract.tesseract_cmd = r"{path}"
'''
            
            with open("backend/tesseract_config.py", "w") as f:
                f.write(config_content)
            
            print("✅ Configuration file created: backend/tesseract_config.py")
            return True
    
    print("❌ Tesseract not found. Opening download page...")
    
    # Open download page
    download_url = "https://github.com/UB-Mannheim/tesseract/wiki"
    webbrowser.open(download_url)
    
    print(f"""
📋 TESSERACT INSTALLATION INSTRUCTIONS:

1. Download Tesseract from: {download_url}
2. Choose: tesseract-ocr-w64-setup-v5.3.0.20221214.exe (or latest)
3. Install to default location: C:\\Program Files\\Tesseract-OCR\\
4. After installation, run this script again to configure

💡 ALTERNATIVE: Use Windows Package Manager
   winget install --id UB-Mannheim.TesseractOCR

🔧 MANUAL PATH SETUP:
   If installed elsewhere, update backend/tesseract_config.py with correct path

Run this script again after installation to verify setup!
""")
    
    return False

def test_tesseract():
    """Test Tesseract installation"""
    try:
        # Try to import configuration
        try:
            from backend.tesseract_config import pytesseract
        except ImportError:
            import pytesseract
        
        # Test basic OCR
        version = pytesseract.get_tesseract_version()
        print(f"✅ Tesseract version: {version}")
        return True
        
    except Exception as e:
        print(f"❌ Tesseract test failed: {e}")
        return False

def main():
    print("🚀 Tesseract OCR Setup for Crella-Lens")
    print("=" * 40)
    
    if install_tesseract_windows():
        print("\n🧪 Testing Tesseract...")
        if test_tesseract():
            print("\n🎉 Tesseract setup complete!")
            print("Ready to run: python backend/youtube_cron_processor.py --continuous")
        else:
            print("\n⚠️ Tesseract installed but test failed")
            print("Check installation and try again")
    else:
        print("\n⏳ Please install Tesseract and run this script again")

if __name__ == "__main__":
    main()
