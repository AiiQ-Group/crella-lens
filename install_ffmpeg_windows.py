#!/usr/bin/env python3
"""
🛠️ FFmpeg Auto-installer for Windows
Downloads and sets up FFmpeg automatically on Windows systems
"""

import os
import sys
import requests
import zipfile
import shutil
from pathlib import Path
import subprocess

def download_file(url: str, filepath: Path) -> bool:
    """Download file with progress"""
    try:
        print(f"📥 Downloading {filepath.name}...")
        response = requests.get(url, stream=True)
        response.raise_for_status()
        
        total_size = int(response.headers.get('content-length', 0))
        downloaded = 0
        
        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
                    downloaded += len(chunk)
                    if total_size > 0:
                        percent = (downloaded / total_size) * 100
                        print(f"\r   Progress: {percent:.1f}%", end='', flush=True)
        
        print(f"\n✅ Downloaded: {filepath.name}")
        return True
        
    except Exception as e:
        print(f"\n❌ Download failed: {e}")
        return False

def install_ffmpeg_windows():
    """Install FFmpeg on Windows"""
    print("🎬 Installing FFmpeg for Windows...")
    
    # Create temp directory
    temp_dir = Path.cwd() / "temp_ffmpeg"
    temp_dir.mkdir(exist_ok=True)
    
    # FFmpeg download URL (latest release)
    ffmpeg_url = "https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip"
    zip_path = temp_dir / "ffmpeg.zip"
    
    try:
        # Download FFmpeg
        if not download_file(ffmpeg_url, zip_path):
            return False
        
        # Extract
        print("📂 Extracting FFmpeg...")
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(temp_dir)
        
        # Find extracted folder
        extracted_dirs = [d for d in temp_dir.iterdir() if d.is_dir() and 'ffmpeg' in d.name.lower()]
        if not extracted_dirs:
            print("❌ Could not find extracted FFmpeg folder")
            return False
        
        ffmpeg_dir = extracted_dirs[0]
        ffmpeg_bin = ffmpeg_dir / "bin"
        
        # Create permanent directory
        install_dir = Path.cwd() / "ffmpeg"
        if install_dir.exists():
            shutil.rmtree(install_dir)
        
        # Move to permanent location
        shutil.move(str(ffmpeg_dir), str(install_dir))
        
        # Add to PATH for current session
        current_path = os.environ.get('PATH', '')
        new_path = str(install_dir / "bin")
        
        if new_path not in current_path:
            os.environ['PATH'] = f"{new_path};{current_path}"
            print(f"✅ Added to PATH: {new_path}")
        
        # Test installation
        try:
            result = subprocess.run([str(install_dir / "bin" / "ffmpeg.exe"), "-version"], 
                                  capture_output=True, timeout=5)
            if result.returncode == 0:
                print("✅ FFmpeg installation successful!")
                
                # Instructions for permanent PATH
                print("\n💡 To make FFmpeg permanent, add this to your Windows PATH:")
                print(f"   {install_dir / 'bin'}")
                print("\n   Or run this command as administrator:")
                print(f'   setx PATH "%PATH%;{install_dir / "bin"}" /M')
                
                return True
            else:
                print("❌ FFmpeg test failed")
                
        except Exception as e:
            print(f"❌ FFmpeg test error: {e}")
        
        return False
        
    except Exception as e:
        print(f"❌ Installation failed: {e}")
        return False
        
    finally:
        # Cleanup
        if temp_dir.exists():
            try:
                shutil.rmtree(temp_dir)
            except:
                pass

def main():
    """Main installation process"""
    if sys.platform != "win32":
        print("❌ This installer is for Windows only")
        print("💡 On Linux/macOS, use your package manager:")
        print("   Linux: sudo apt install ffmpeg")
        print("   macOS: brew install ffmpeg")
        return
    
    # Check if already installed
    try:
        result = subprocess.run(['ffmpeg', '-version'], capture_output=True, timeout=5)
        if result.returncode == 0:
            print("✅ FFmpeg is already installed!")
            return
    except:
        pass
    
    print("🛠️ FFmpeg Auto-Installer for Windows")
    print("=" * 40)
    
    choice = input("📥 Download and install FFmpeg? (y/N): ")
    if choice.lower() != 'y':
        print("🛑 Installation cancelled")
        return
    
    if install_ffmpeg_windows():
        print("\n🎉 FFmpeg installation complete!")
        print("🚀 You can now run the YouTube analyzer!")
    else:
        print("\n❌ Installation failed")
        print("💡 Manual installation:")
        print("   1. Download: https://ffmpeg.org/download.html#build-windows")
        print("   2. Extract to C:\\ffmpeg\\")
        print("   3. Add C:\\ffmpeg\\bin to PATH")

if __name__ == "__main__":
    main()
