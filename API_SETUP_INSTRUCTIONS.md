# 🔐 API Keys Setup for Crella-Lens

## Quick Setup (Recommended)

Run the automated setup script:

```bash
python setup_env.py
```

This will:
- ✅ Create your `.env` file securely
- ✅ Generate secure encryption keys automatically  
- ✅ Guide you through API key entry
- ✅ Set proper file permissions
- ✅ Configure all Claire orchestration settings

## Manual Setup

If you prefer manual setup:

1. **Copy the template:**
   ```bash
   cp environment-template.txt .env
   ```

2. **Edit `.env` and add your API keys:**
   ```bash
   nano .env  # or use your preferred editor
   ```

3. **Replace placeholders with your actual keys:**
   ```
   OPENAI_API_KEY=sk-proj-your_actual_key_here
   ANTHROPIC_API_KEY=sk-ant-your_actual_key_here
   ```

## 🔑 Where to Get API Keys

### OpenAI API Key
1. Go to: https://platform.openai.com/api-keys
2. Sign up/login to your OpenAI account
3. Click **"Create new secret key"**
4. Copy the key (starts with `sk-proj-...`)
5. Paste into your `.env` file

### Anthropic Claude API Key  
1. Go to: https://console.anthropic.com/
2. Create account and verify email
3. Navigate to **"API Keys"** section
4. Click **"Create Key"**
5. Copy the key (starts with `sk-ant-...`)
6. Paste into your `.env` file

## 💰 Pricing Information

**OpenAI GPT-4o:**
- ~$5-15/month for moderate usage
- Pay-per-token pricing
- Great for strategic reasoning

**Anthropic Claude 3.5 Sonnet:**
- ~$3-10/month for moderate usage  
- Pay-per-token pricing
- Excellent for nuanced analysis

Both services offer:
- ✅ Pay-as-you-go (no monthly minimums)
- ✅ Usage tracking and limits
- ✅ Free trial credits for new users

## 🔒 Security Best Practices

**Your `.env` file:**
- ✅ Already in `.gitignore` (won't be committed to git)
- ✅ Contains sensitive API keys - keep secure
- ✅ Set to owner-read-only permissions (600)
- ✅ Never share or commit to repositories

**Generated secure keys:**
- ✅ JWT_SECRET - for session authentication
- ✅ ENCRYPTION_KEY - for data encryption  
- ✅ SESSION_SECRET - for session security

## 🎭 Claire Orchestration Features

Once your API keys are configured, Claire will be able to:

- 🧠 **Multi-Agent Analysis**: Coordinate between Claude and GPT
- 📊 **Enhanced pAIt Scoring**: Use multiple models for accuracy
- 🎯 **Model Attribution**: "Claude suggests X, but GPT recommends Y"
- 🔄 **Intelligent Routing**: Route queries to best-suited model
- 🏆 **VIP Orchestration**: Premium multi-model analysis

## ✅ Testing Your Setup

After configuration, test with:

```bash
# Start the development server
npm run dev

# Test Claire's new capabilities:
# - Ask about pAIt scoring
# - Request multi-agent analysis  
# - Test VIP orchestration features
```

## 🚨 Troubleshooting

**API Key Issues:**
- Ensure keys are properly formatted (no extra spaces)
- Check API key permissions and usage limits
- Verify account billing status

**Connection Issues:**
- Check your internet connection
- Verify API endpoints are accessible
- Review rate limiting settings in `.env`

**Still having issues?** 
Check the browser console for specific error messages.

---

## 🎉 You're Ready!

Once configured, your Crella-Lens system will have full API access for:
- 🎭 Claire's AI orchestration capabilities
- 🔬 Multi-agent pAIt analysis  
- 🎯 Enhanced VIP features
- 🛡️ Privacy-protected AI interactions

Claire can now truly serve as your **AiiQ Concierge & Orchestration Assistant**!
