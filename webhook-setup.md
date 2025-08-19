# VIP Signup Webhook Integration

## 🎯 Supabase Setup (Recommended)

### 1. Create Supabase Project
```bash
# Install Supabase CLI
npm install -g supabase

# Create project at https://supabase.com
# Get your project URL and API key
```

### 2. Create VIP Signups Table
```sql
CREATE TABLE vip_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  source VARCHAR(50) DEFAULT 'crella-mobile',
  status VARCHAR(20) DEFAULT 'pending',
  tier VARCHAR(20) DEFAULT 'vip',
  metadata JSONB
);

-- Enable Row Level Security
ALTER TABLE vip_signups ENABLE ROW LEVEL SECURITY;

-- Create policy for inserts
CREATE POLICY "Allow public insert" ON vip_signups
FOR INSERT TO anon
WITH CHECK (true);
```

### 3. Environment Variables
```env
# Create .env.production file
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_OPENAI_API_KEY=sk-...
VITE_CLAUDE_API_KEY=sk-ant-api03-...
```

### 4. Update LandingPage.tsx
```typescript
const handleVIPSignup = async (email: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/vip_signups`, {
      method: 'POST',
      headers: {
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        email,
        source: 'crella-mobile',
        metadata: {
          referrer: document.referrer,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        }
      })
    })
    
    if (response.ok) {
      console.log('✅ VIP signup successful:', email)
      // Send welcome email via Supabase Edge Function
      await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-welcome-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })
    }
  } catch (error) {
    console.error('VIP signup error:', error)
  }
}
```

## 📊 Airtable Alternative

### Setup Airtable Base
1. Create base: "Crella VIP Signups"
2. Table fields: Email (Single line text), Timestamp (Date), Source (Single select)
3. Get API key from https://airtable.com/api

### Webhook Code
```typescript
const AIRTABLE_BASE_ID = 'appXXXXXXXXXXXXXX'
const AIRTABLE_TABLE_NAME = 'VIP Signups'
const AIRTABLE_API_KEY = 'patXXXXXXXXXXXXXX'

const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    records: [{
      fields: {
        'Email': email,
        'Timestamp': new Date().toISOString(),
        'Source': 'Crella Mobile Landing',
        'Status': 'VIP Pending'
      }
    }]
  })
})
```

## 🔔 Notification Setup

### Discord Webhook (Instant Notifications)
```typescript
const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/...'

await fetch(DISCORD_WEBHOOK, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    content: `🎉 **NEW VIP SIGNUP!**\n📧 ${email}\n🕒 ${new Date().toLocaleString()}\n💰 Ready for Paul's network!`
  })
})
```

## ✅ Testing Checklist
- [ ] VIP signup form submits successfully
- [ ] Data appears in Supabase/Airtable
- [ ] Welcome email is sent
- [ ] Discord notification fires
- [ ] Mobile form works perfectly
- [ ] Email validation prevents duplicates
