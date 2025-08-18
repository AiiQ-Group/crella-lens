#!/usr/bin/env python3
"""
🧪 Test Visual Analysis with Sample Trading Content
Demonstrates how to analyze screenshots of trading videos
"""

from visual_analyzer import VisualContentAnalyzer
import json

def create_sample_trading_text():
    """Create sample text that might be extracted from a trading screenshot"""
    sample_texts = [
        """
        $322 IN JUST HOUR
        WITH POCKET OPTION
        Pocket Option AI Trading Bot from Telegram BLEW My Mind
        141K views • 3 weeks ago
        Techno Cows
        What This Intelligent Bot Delivers: — Real-time tracking of price action, news, and volatility — Delivers high-accuracy entry and ...
        4K CC
        """,
        """
        MADE $1,500 IN 24 HOURS
        Binary Options Trading Secret
        100% WIN RATE STRATEGY
        Subscribe for more!
        ⚠️ No guarantees, trading involves risk
        """,
        """
        Forex EA Robot - 99% Accurate
        Turn $100 into $10,000
        Limited Time Offer - Act Now!
        Join 50,000+ traders making daily profits
        Exclusive Telegram channel access
        """
    ]
    return sample_texts

def test_visual_analyzer():
    """Test the visual analyzer with sample data"""
    print("🧪 Testing Visual Content Analyzer")
    print("=" * 50)
    
    analyzer = VisualContentAnalyzer("test-output")
    sample_texts = create_sample_trading_text()
    
    for i, text in enumerate(sample_texts, 1):
        print(f"\n🔍 SAMPLE {i}: Testing profit claims analysis...")
        
        # Test profit claims analysis
        profit_analysis = analyzer.analyze_profit_claims(text)
        print(f"💰 Claims found: {profit_analysis['total_claims']}")
        for claim in profit_analysis['claims_found']:
            print(f"   • ${claim['amount']} - {claim['context'].strip()}")
        
        if profit_analysis['risk_indicators']:
            print(f"🚨 Risk flags: {', '.join(profit_analysis['risk_indicators'])}")
        
        # Test credibility analysis  
        credibility = analyzer.analyze_visual_credibility(text, f"sample_{i}.jpg")
        print(f"📊 Credibility score: {credibility['credibility_score']}/5.0")
        print(f"🖥️  Platform: {credibility['platform']}")
        
        # Generate pAIt score
        analysis_data = {
            "profit_claims": profit_analysis,
            "credibility": credibility
        }
        pait_score = analyzer.generate_pait_score(analysis_data)
        print(f"🎯 pAIt Score: {pait_score['overall_pait_score']}/5.0")
        print(f"📋 Recommendation: {pait_score['recommendation']}")
        
        print("-" * 40)

def demonstrate_real_world_usage():
    """Show how this would work with real screenshots"""
    print("\n🎯 REAL-WORLD USAGE EXAMPLES:")
    print("=" * 50)
    
    examples = [
        {
            "scenario": "YouTube Trading Video Screenshot",
            "command": 'python visual_analyzer.py "youtube_screenshot.png"',
            "description": "Analyze thumbnail with profit claims"
        },
        {
            "scenario": "Instagram Trading Post",
            "command": 'python visual_analyzer.py "instagram_story.jpg"',
            "description": "Check trading course advertisements"
        },
        {
            "scenario": "Telegram Bot Screenshot", 
            "command": 'python visual_analyzer.py "telegram_bot.png"',
            "description": "Verify trading bot claims"
        }
    ]
    
    for example in examples:
        print(f"\n📱 {example['scenario']}:")
        print(f"   Command: {example['command']}")
        print(f"   Purpose: {example['description']}")

if __name__ == "__main__":
    test_visual_analyzer()
    demonstrate_real_world_usage()
    
    print(f"\n🚀 VISUAL ANALYSIS IS READY!")
    print(f"✅ No video downloading needed")
    print(f"✅ Instant analysis from screenshots")  
    print(f"✅ Perfect for trading content review")
    print(f"✅ Integrates with Crella Lens pAIt system")
