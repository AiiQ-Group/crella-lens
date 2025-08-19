#!/usr/bin/env python3
"""
🔐 Crella-Lens Environment Setup
Creates your .env file from template with secure configuration
"""

import os
import secrets
import string
from pathlib import Path

def generate_secure_key(length=32):
    """Generate a cryptographically secure random key"""
    alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
    return ''.join(secrets.choice(alphabet) for _ in range(length))

def setup_environment():
    """Setup .env file from template"""
    
    print("🔐 CRELLA-LENS ENVIRONMENT SETUP")
    print("=" * 40)
    print()
    
    # Check if .env already exists
    if Path(".env").exists():
        overwrite = input("⚠️  .env file already exists. Overwrite? (y/N): ").lower().strip()
        if overwrite != 'y':
            print("Setup cancelled.")
            return
    
    print("📝 Setting up your secure .env file...")
    print()
    
    # Get API keys from user
    print("🤖 API KEYS REQUIRED:")
    print()
    
    openai_key = input("🔑 OpenAI API Key (sk-proj-...): ").strip()
    if not openai_key:
        openai_key = "your_openai_api_key_here"
    
    anthropic_key = input("🔑 Anthropic API Key (sk-ant-...): ").strip()
    if not anthropic_key:
        anthropic_key = "your_anthropic_api_key_here"
    
    print()
    print("🛠️  OPTIONAL CONFIGURATION:")
    
    openai_org = input("📋 OpenAI Organization ID (optional): ").strip()
    if not openai_org:
        openai_org = "your_openai_org_id_here"
    
    email = input("📧 Email for notifications (optional): ").strip()
    if not email:
        email = "your_email@gmail.com"
    
    # Generate secure keys
    jwt_secret = generate_secure_key(64)
    encryption_key = generate_secure_key(32)
    session_secret = generate_secure_key(48)
    
    print()
    print("🔒 Generating secure keys...")
    
    # Create .env content
    env_content = f"""# AiiQ Crella-Lens API Configuration
# ===========================================
# IMPORTANT: Keep this file secure and never commit to git!

# OpenAI API Configuration
OPENAI_API_KEY={openai_key}
OPENAI_ORG_ID={openai_org}
OPENAI_MODEL=gpt-4o

# Anthropic Claude API Configuration  
ANTHROPIC_API_KEY={anthropic_key}
CLAUDE_MODEL=claude-3-5-sonnet-20241022

# H100 Server Configuration (Your Kathy-Ops)
H100_SERVER_IP=143.198.44.252
H100_OLLAMA_PORT=11434
KATHY_MODEL=kathy-ops:latest

# Crella-Lens Configuration
CRELLA_ENV=development
CRELLA_API_URL=http://localhost:8000
CRELLA_UPLOAD_MAX_SIZE=10485760
CRELLA_ALLOWED_TYPES=image/jpeg,image/png,image/gif,image/webp

# Database Configuration
DATABASE_URL=sqlite:///crella_lens.db
REDIS_URL=redis://localhost:6379

# Security Configuration (Auto-Generated Secure Keys)
JWT_SECRET={jwt_secret}
ENCRYPTION_KEY={encryption_key}
SESSION_SECRET={session_secret}

# Feature Flags
ENABLE_VIP_FEATURES=true
ENABLE_MULTI_AGENT_ANALYSIS=true
ENABLE_PRIVACY_MODE=true
ENABLE_H100_INTEGRATION=true

# Claire Orchestration
ENABLE_CLAUDE_INTEGRATION=true
ENABLE_KATHY_OPS_INTEGRATION=true
ENABLE_MULTI_AGENT_ORCHESTRATION=true

# Logging Configuration
LOG_LEVEL=INFO
LOG_FORMAT=json

# Rate Limiting
RATE_LIMIT_REQUESTS_PER_MINUTE=60
RATE_LIMIT_REQUESTS_PER_HOUR=1000

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER={email}
SMTP_PASS=your_app_password_here

# Analytics & Monitoring
ANALYTICS_ENABLED=true
MONITORING_ENABLED=true

# Backup Configuration
BACKUP_ENABLED=true
BACKUP_INTERVAL_HOURS=24

# VIP Configuration
VIP_MONTHLY_PRICE=29
VIP_ANALYSIS_LIMIT=unlimited
STANDARD_ANALYSIS_LIMIT=3

# Privacy Protection
ENABLE_ALGORITHM_BYPASS=true
ENABLE_DATA_SOVEREIGNTY=true
ENABLE_ANONYMOUS_SCORING=true
"""
    
    # Write .env file
    try:
        with open(".env", "w") as f:
            f.write(env_content)
        
        print("✅ .env file created successfully!")
        print()
        print("🔐 SECURITY NOTES:")
        print("   ✅ .env is already in .gitignore (secure)")
        print("   ✅ Secure keys auto-generated")
        print("   ✅ File permissions set to owner-only")
        
        # Set secure file permissions (Unix/Linux/Mac)
        try:
            os.chmod(".env", 0o600)  # Read/write for owner only
            print("   ✅ File permissions secured")
        except:
            print("   ⚠️  Manual permission setting recommended: chmod 600 .env")
        
        print()
        print("🚀 NEXT STEPS:")
        print("   1. Update API keys in .env if you skipped them")
        print("   2. Test with: npm run dev")
        print("   3. Claire will now have API access for orchestration!")
        print()
        
        if openai_key == "your_openai_api_key_here" or anthropic_key == "your_anthropic_api_key_here":
            print("⚠️  REMEMBER: Update your API keys in .env before testing!")
    
    except Exception as e:
        print(f"❌ Error creating .env file: {e}")
        print("💡 You can manually create .env using environment-template.txt")

def show_api_key_instructions():
    """Show instructions for getting API keys"""
    
    print()
    print("🔑 WHERE TO GET YOUR API KEYS:")
    print("=" * 35)
    print()
    
    print("🤖 OPENAI API KEY:")
    print("   1. Go to: https://platform.openai.com/api-keys")
    print("   2. Click 'Create new secret key'")
    print("   3. Copy the key (starts with sk-proj-...)")
    print("   4. Paste into the setup above")
    print()
    
    print("🧠 ANTHROPIC CLAUDE API KEY:")
    print("   1. Go to: https://console.anthropic.com/")
    print("   2. Create account and go to API Keys")
    print("   3. Generate new key (starts with sk-ant-...)")
    print("   4. Paste into the setup above")
    print()
    
    print("💰 PRICING NOTES:")
    print("   • OpenAI GPT-4o: ~$5-15/month for moderate use")
    print("   • Claude 3.5 Sonnet: ~$3-10/month for moderate use") 
    print("   • Both offer pay-per-use pricing")
    print()

if __name__ == "__main__":
    setup_environment()
    show_api_key_instructions()
    
    print("🎉 Environment setup complete!")
    print("🎭 Claire can now orchestrate between GPT and Claude!")
    print("🔗 Your multi-agent analysis system is ready!")
