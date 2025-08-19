#!/usr/bin/env python3
"""
🧪 Test Claire API Setup
Test the new Claire API service with Claude/OpenAI integration
"""

import requests
import json
import time

def test_claire_api():
    """Test the Claire API service."""
    base_url = "http://localhost:5001"
    
    print("🧪 Testing Claire API Service...")
    print("=" * 50)
    
    # Test health endpoint
    print("1. Testing health endpoint...")
    try:
        response = requests.get(f"{base_url}/api/health")
        if response.status_code == 200:
            health_data = response.json()
            print("✅ Health check passed")
            print(f"   Service: {health_data.get('service')}")
            print(f"   Personality: {health_data.get('personality')}")
        else:
            print("❌ Health check failed")
            return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False
    
    print("\n2. Testing Claire personality...")
    
    # Test conversations
    test_messages = [
        "Hi, how are you?",
        "I'm from Tokyo", 
        "I need help with trading analysis",
        "What can you do?",
        "Thanks for your help"
    ]
    
    for i, message in enumerate(test_messages, 1):
        print(f"\n   Test {i}: '{message}'")
        try:
            response = requests.post(f"{base_url}/api/claire/chat", json={
                "message": message,
                "provider": "claude"
            })
            
            if response.status_code == 200:
                data = response.json()
                claire_response = data.get('response', '')
                provider = data.get('provider', '')
                
                print(f"   Claire ({provider}): {claire_response}")
                
                # Check for personality compliance
                has_endearments = any(word in claire_response.lower() 
                                    for word in ['darling', 'sweetheart', 'dear', 'honey'])
                
                if has_endearments:
                    print("   ⚠️  WARNING: Contains terms of endearment!")
                else:
                    print("   ✅ No inappropriate terms of endearment")
                    
            else:
                print(f"   ❌ API error: {response.status_code}")
                
        except Exception as e:
            print(f"   ❌ Request error: {e}")
        
        time.sleep(1)  # Be nice to the APIs
    
    print("\n" + "=" * 50)
    print("🎉 Claire API testing complete!")
    print("\nNext steps:")
    print("1. Start the Claire API service: python backend/claire_api_service.py")
    print("2. Start your frontend: npm run dev")
    print("3. Test Claire in the web interface")
    print("4. Check logs/claire_training/ for H100 Kathy learning data")

if __name__ == "__main__":
    test_claire_api()
