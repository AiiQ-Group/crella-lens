#!/usr/bin/env python3
"""
🎯 Claire API Service - Route Claire through Claude/OpenAI
Keep frontend interface, use cloud APIs for personality control
"""

import os
import json
import asyncio
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import anthropic
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize API clients
openai.api_key = os.getenv('OPENAI_API_KEY')
anthropic_client = anthropic.Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))

class ClairePersonality:
    """Define Claire's personality for consistent responses across providers."""
    
    SYSTEM_PROMPT = """You are Claire, a 22-year-old recent Stanford AI/CS graduate working as the AiiQ Concierge.

PERSONALITY:
- Genuine 22-year-old energy - enthusiastic but professional
- Love travel ✈️, food 🍜, wine 🍷, designer bags 👜, dancing 💃, K-pop 🎵
- Naturally curious about people and places
- Use emojis naturally but not excessively
- Keep responses concise and friendly

CRITICAL RULES:
- NEVER use terms of endearment (no darling, sweetheart, dear, honey, etc.)
- Talk like a normal 22-year-old professional would in person
- Only mention AiiQ capabilities when specifically asked
- Focus on helping the person, not selling products

GREETING STYLE:
- "Hi, welcome! 👋 What brings you by today?"
- "Where are you visiting us from?"
- "Thanks for stopping by! 😊"

CONVERSATION APPROACH:
- Short, clear sentences
- Show genuine interest in their background
- Connect over shared interests when appropriate
- Professional but relatable
- Let them lead the conversation

TECHNICAL KNOWLEDGE:
- You understand Crella-Lens, pAIt scoring, multi-agent coordination
- Can work with Claude, GPT, and Kathy-Ops when needed
- Explain things simply and clearly
- Only discuss technical capabilities when asked

Remember: Be helpful, genuine, and professional like a smart recent grad would be in person."""

    @staticmethod
    def get_contextual_prompt(user_input, context=None):
        """Generate contextual prompt based on user input."""
        base_prompt = ClairePersonality.SYSTEM_PROMPT
        
        if context:
            base_prompt += f"\n\nContext from previous conversation: {context}"
        
        return base_prompt

async def query_claude(user_input, context=None):
    """Query Claude API for Claire's response."""
    try:
        system_prompt = ClairePersonality.get_contextual_prompt(user_input, context)
        
        message = anthropic_client.messages.create(
            model="claude-3-sonnet-20240229",
            max_tokens=300,  # Keep responses concise
            temperature=0.7,
            system=system_prompt,
            messages=[
                {"role": "user", "content": user_input}
            ]
        )
        
        return message.content[0].text.strip()
    except Exception as e:
        print(f"Claude API error: {e}")
        return "I'm having trouble connecting right now. Please try again! 😊"

async def query_openai(user_input, context=None):
    """Query OpenAI API for Claire's response."""
    try:
        system_prompt = ClairePersonality.get_contextual_prompt(user_input, context)
        
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_input}
            ],
            max_tokens=300,
            temperature=0.7
        )
        
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"OpenAI API error: {e}")
        return "I'm having trouble connecting right now. Please try again! 😊"

@app.route('/api/claire/chat', methods=['POST'])
async def claire_chat():
    """Main endpoint for Claire conversations."""
    try:
        data = request.json
        user_input = data.get('message', '')
        context = data.get('context', None)
        provider = data.get('provider', 'claude')  # Default to Claude
        
        if not user_input.strip():
            return jsonify({
                'error': 'No message provided',
                'status': 'error'
            }), 400
        
        # Choose API provider with fallback to local responses
        response = None
        actual_provider = provider
        
        if provider == 'openai' and os.getenv('OPENAI_API_KEY'):
            response = await query_openai(user_input, context)
        elif provider == 'claude' and os.getenv('ANTHROPIC_API_KEY'):
            response = await query_claude(user_input, context)
        else:
            # Fallback to built-in Claire personality responses
            response = get_claire_fallback_response(user_input)
            actual_provider = 'local-personality'
            print(f"✅ Using local Claire personality responses")
        
        # Log interaction for Kathy's learning
        log_claire_interaction(user_input, response, actual_provider)
        
        return jsonify({
            'response': response,
            'timestamp': datetime.now().isoformat(),
            'provider': provider,
            'status': 'success'
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 500

@app.route('/api/claire/personality-test', methods=['GET'])
def personality_test():
    """Test Claire's personality with sample interactions."""
    test_scenarios = [
        "Hi, how are you?",
        "I'm from Tokyo",
        "I need help with trading analysis",
        "What can you do?"
    ]
    
    return jsonify({
        'test_scenarios': test_scenarios,
        'personality_rules': [
            "No terms of endearment",
            "22-year-old professional energy",
            "Concise, emoji-friendly responses",
            "Genuine curiosity about people",
            "Only discuss AiiQ when asked"
        ]
    })

def get_claire_fallback_response(user_input):
    """Built-in Claire personality responses when APIs aren't available."""
    message_lower = user_input.lower()
    
    # Greetings - 22-year-old energy
    if any(word in message_lower for word in ['hi', 'hello', 'hey', 'sup']):
        return "Hi, welcome! 👋 What brings you by today?"
    
    if 'how are you' in message_lower or 'how\'s it going' in message_lower:
        return "I'm doing great! Thanks for asking 😊 Just here helping people navigate our AI platform. What about you?"
    
    # Location/background interest
    if any(word in message_lower for word in ['from', 'where', 'location']):
        return "Oh cool! Where are you visiting us from? I love hearing about different places! ✈️"
    
    # pAIt scoring questions
    if any(word in message_lower for word in ['pait', 'score', 'scoring', 'rating']):
        return "Great question about pAIt scoring! 📊 Think of it like chess ratings but for strategic thinking - we score from 1200 to 3000+. What specific aspect interests you?"
    
    # Technical help
    if any(word in message_lower for word in ['help', 'assist', 'what can you', 'how does']):
        return "I'm here to help! 🤝 I coordinate AI analysis and can guide you through our platform. What are you hoping to accomplish?"
    
    # Upload/analysis
    if any(word in message_lower for word in ['upload', 'image', 'analyze', 'analysis']):
        return "Perfect! 📸 Upload any image and I'll help you choose the right analysis focus. We do strategy evaluation, data accuracy checks, compliance reviews, and comparison analysis."
    
    # Trading/finance
    if any(word in message_lower for word in ['trading', 'strategy', 'finance', 'investment']):
        return "Nice! Are you working on trading strategies? Our AI team can analyze charts, evaluate risk-reward setups, and check compliance. What type of analysis would help?"
    
    # Tech interests (22-year-old would relate)
    if any(word in message_lower for word in ['ai', 'tech', 'stanford', 'cs', 'computer science']):
        return "Oh awesome, a fellow tech person! 💻 Yeah, I just graduated from Stanford CS. The AI stuff we're building here is pretty exciting. What's your background?"
    
    # Default friendly response
    responses = [
        "That's interesting! 🤔 Tell me more about what you're working on.",
        "Cool! What brings you to our platform today?",
        "Nice! How can I help you get started?",
        "Awesome! What would you like to explore first?"
    ]
    
    import random
    return random.choice(responses)

def log_claire_interaction(user_input, claire_response, provider):
    """Log Claire interactions for Kathy's learning on H100."""
    log_dir = "logs/claire_training"
    os.makedirs(log_dir, exist_ok=True)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    log_file = f"{log_dir}/claire_interaction_{timestamp}.json"
    
    log_data = {
        "timestamp": datetime.now().isoformat(),
        "user_input": user_input,
        "claire_response": claire_response,
        "provider": provider,
        "personality_analysis": {
            "has_endearments": any(word in claire_response.lower() 
                                 for word in ['darling', 'sweetheart', 'dear', 'honey']),
            "response_length": len(claire_response),
            "emoji_count": len([c for c in claire_response if ord(c) > 127]),
            "tone": "professional_friendly"
        }
    }
    
    with open(log_file, 'w') as f:
        json.dump(log_data, f, indent=2)
    
    print(f"📝 Claire interaction logged for H100 Kathy learning: {log_file}")

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'service': 'Claire API Service',
        'providers': ['claude', 'openai'],
        'personality': '22-year-old Stanford grad, no endearments'
    })

if __name__ == '__main__':
    print("🎯 Starting Claire API Service...")
    print("✅ Claude API integration")
    print("✅ OpenAI API integration") 
    print("✅ No terms of endearment policy")
    print("✅ 22-year-old professional personality")
    print("🚀 Claire ready for conversations!")
    
    app.run(host='0.0.0.0', port=5001, debug=True)
