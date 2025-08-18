#!/usr/bin/env python3
"""
🧪 YouTube Analyzer Test Suite
Tests the analyzer with various YouTube URL types and edge cases
"""

import sys
from pathlib import Path
from youtube_analyzer import YouTubeAnalyzer

def test_url_extraction():
    """Test video ID extraction from various URL formats"""
    analyzer = YouTubeAnalyzer()
    
    test_urls = [
        ("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "dQw4w9WgXcQ"),
        ("https://youtu.be/dQw4w9WgXcQ", "dQw4w9WgXcQ"),
        ("https://youtube.com/shorts/dQw4w9WgXcQ", "dQw4w9WgXcQ"),
        ("https://www.youtube.com/embed/dQw4w9WgXcQ", "dQw4w9WgXcQ"),
        ("https://www.youtube.com/v/dQw4w9WgXcQ", "dQw4w9WgXcQ"),
        ("invalid_url", None),
        ("https://not-youtube.com/watch?v=test", None)
    ]
    
    print("🧪 Testing URL extraction...")
    for url, expected in test_urls:
        result = analyzer.extract_video_id(url)
        status = "✅" if result == expected else "❌"
        print(f"  {status} {url[:50]}... → {result}")
    
def test_dependencies():
    """Test dependency checking"""
    analyzer = YouTubeAnalyzer()
    
    print("\n🔍 Testing dependency check...")
    deps = analyzer.check_dependencies()
    
    for dep, available in deps.items():
        status = "✅" if available else "❌"
        print(f"  {status} {dep}")
    
    return all(deps.values())

def test_sample_analysis(url: str = "https://youtu.be/dQw4w9WgXcQ"):
    """Test complete analysis pipeline with a sample video"""
    if not url:
        print("⚠️  No test URL provided, skipping analysis test")
        return
    
    analyzer = YouTubeAnalyzer("test-output")
    
    print(f"\n🚀 Testing complete analysis pipeline...")
    print(f"📺 URL: {url}")
    
    try:
        results = analyzer.analyze_video(url, whisper_model="tiny", keep_video=False)
        
        if results["status"] == "completed":
            print("✅ Analysis completed successfully!")
            print(f"📄 Transcript path: {results['steps']['transcription']['transcript_path']}")
            return True
        else:
            print(f"❌ Analysis failed: {results.get('error', 'Unknown error')}")
            return False
            
    except Exception as e:
        print(f"💥 Test failed: {e}")
        return False

def main():
    """Run test suite"""
    print("🧪 YouTube Analyzer Test Suite")
    print("=" * 40)
    
    # Test 1: URL extraction
    test_url_extraction()
    
    # Test 2: Dependencies
    deps_ok = test_dependencies()
    
    if not deps_ok:
        print("\n⚠️  Some dependencies missing. Run with --install-deps to fix.")
        print("💡 Or install manually:")
        print("   pip install yt-dlp openai-whisper")
        
        choice = input("\n🤔 Continue with analysis test anyway? (y/N): ")
        if choice.lower() != 'y':
            print("🛑 Test suite stopped")
            return
    
    # Test 3: Sample analysis (optional)
    test_url = input("\n🎯 Enter YouTube URL to test (or press Enter to skip): ").strip()
    if test_url:
        success = test_sample_analysis(test_url)
        if success:
            print("\n🎉 All tests passed!")
        else:
            print("\n⚠️  Some tests failed - check logs for details")
    else:
        print("\n✅ Basic tests completed")

if __name__ == "__main__":
    main()
