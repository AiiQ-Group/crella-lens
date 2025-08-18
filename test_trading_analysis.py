#!/usr/bin/env python3
"""
🧪 Test Your Trading Analysis with Available Models
Demonstrates analysis with your "$322 in 1 Hour" example
"""

from ollama_video_analyzer import OllamaVideoAnalyzer
import json

def test_with_your_example():
    """Test with your actual trading video content"""
    
    # Your screenshot content
    trading_content = """
    $322 IN JUST HOUR
    WITH POCKET OPTION
    $322 in 1 Hour?! Pocket Option AI Trading Bot from Telegram BLEW My Mind
    141K views • 3 weeks ago
    Techno Cows
    What This Intelligent Bot Delivers: — Real-time tracking of price action, news, and volatility — Delivers high-accuracy entry and ...
    4K CC
    5:52
    Binary Options Trading Bot
    Telegram Channel: @PocketOptionBot
    Success Rate: 99.2%
    Profit Tracking Dashboard
    Real-time Signals
    """
    
    video_metadata = {
        "title": "$322 in 1 Hour?! Pocket Option AI Trading Bot from Telegram BLEW My Mind",
        "uploader": "Techno Cows",
        "duration": "5:52",
        "view_count": "141K",
        "upload_date": "3 weeks ago"
    }
    
    print("🤖 TESTING OLLAMA ANALYSIS WITH YOUR CONTENT")
    print("=" * 60)
    
    analyzer = OllamaVideoAnalyzer()
    
    # Run analysis
    results = analyzer.analyze_video_content(trading_content, video_metadata)
    
    # Display results
    print_analysis_results(results)
    
    return results

def print_analysis_results(results):
    """Print formatted analysis results"""
    
    member_review = results.get("member_review", {})
    
    print(f"🎯 pAIt SCORE: {member_review.get('pait_score', 'N/A')}/100")
    print(f"📋 {member_review.get('badge', 'N/A')}")
    print(f"🎖️  RECOMMENDATION: {member_review.get('recommendation', 'N/A')}")
    print(f"⏱️  PROCESSING TIME: {results.get('processing_time', 'N/A')}")
    
    # Models used
    models_used = results.get("models_used", {})
    print(f"\n🤖 MODELS USED:")
    for role, available in models_used.items():
        status = "✅" if available else "❌"
        print(f"   {status} {role}")
    
    # Best practices found (JBot analysis)
    jbot_analysis = results.get("jbot_analysis", {})
    if jbot_analysis:
        best_practices = jbot_analysis.get("best_practices_found", [])
        if best_practices:
            print(f"\n✅ BEST PRACTICES EXTRACTED:")
            for practice in best_practices[:3]:
                print(f"   • {practice}")
        
        frankenstein = jbot_analysis.get("frankenstein_potential", {})
        if frankenstein.get("extractable_techniques"):
            print(f"\n🔬 FRANKENSTEIN POTENTIAL:")
            for technique in frankenstein["extractable_techniques"][:2]:
                print(f"   • {technique}")
    
    # Strategy analysis (Claudia)
    claudia_analysis = results.get("claudia_analysis", {})
    if claudia_analysis:
        pait_scores = claudia_analysis.get("pait_scores", {})
        if pait_scores:
            print(f"\n📊 COMPONENT SCORES:")
            for component, score in pait_scores.items():
                if component != "total_score":
                    print(f"   {component.replace('_', ' ').title()}: {score}/25")
    
    # Fraud detection
    fraud_analysis = results.get("fraud_analysis", {})
    if fraud_analysis:
        red_flags = fraud_analysis.get("red_flags", [])
        if red_flags:
            print(f"\n🚨 RED FLAGS DETECTED:")
            for flag in red_flags[:3]:
                print(f"   ⚠️  {flag}")
    
    # Member summary
    member_summary = member_review.get("member_summary", "")
    if member_summary:
        print(f"\n📝 MEMBER SUMMARY:")
        print(f"   {member_summary}")

def demonstrate_member_integration():
    """Show how this integrates with your pAIt system"""
    
    print(f"\n🔗 INTEGRATION WITH YOUR pAIt SYSTEM:")
    print(f"=" * 60)
    
    integration_points = [
        "📊 pAIt Scores → Your existing rating categories",
        "🏆 Top performers → 'Top 10 Indicators' section", 
        "📺 Social media analysis → 'Social Media High/Low' categories",
        "🎯 Frankenstein strategies → New strategy combinations",
        "⚠️  Risk assessment → Member safety warnings",
        "📱 Latest reviewed → Member dashboard feed"
    ]
    
    for point in integration_points:
        print(f"   {point}")
    
    print(f"\n💡 MEMBER VALUE PROPOSITION:")
    print(f"   Instead of watching 5+ minute videos to see if they're worth it,")
    print(f"   members get instant pAIt analysis and know what to focus on!")

if __name__ == "__main__":
    # Test with your example
    results = test_with_your_example()
    
    # Show integration possibilities
    demonstrate_member_integration()
    
    print(f"\n🚀 NEXT STEPS:")
    print(f"   1. Connect to your GPU server for full model access")
    print(f"   2. Process batch of recent trading videos")  
    print(f"   3. Generate 'Latest Reviewed' feed for members")
    print(f"   4. Extract best practices for Frankenstein strategies")
    print(f"\n🎯 This approach saves members time and protects from scams!")
