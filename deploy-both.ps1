# Dual Deployment Script - Crella.ai + Gringots
# Deploy to both public web and local demo server

Write-Host "🚀 CRELLA MOBILE DUAL DEPLOYMENT SYSTEM" -ForegroundColor Cyan
Write-Host "   🌐 Public: crella.ai (splash page)"  
Write-Host "   🏰 Private: Gringots (Paul's demos)" -ForegroundColor Magenta

# Ensure production build exists
if (!(Test-Path "dist")) {
    Write-Host "📦 Building production version..." -ForegroundColor Yellow
    npm run build
    Write-Host "✅ Production build complete!" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== DEPLOYMENT STRATEGY ===" -ForegroundColor Yellow

Write-Host ""
Write-Host "🌐 CRELLA.AI DEPLOYMENT (Public Splash)"
Write-Host "   Purpose: Public presence, VIP signups, brand awareness"
Write-Host "   Audience: General visitors, Paul's network discovery"
Write-Host "   Features: Landing page, signup form, mobile responsive"

Write-Host ""
Write-Host "🏰 GRINGOTS DEPLOYMENT (Private Demos)" 
Write-Host "   Purpose: Live demos, architect files, city plats"
Write-Host "   Audience: Paul's lunch meetings, private testing"
Write-Host "   Features: Full app, desktop support, offline capable"

Write-Host ""
$deployChoice = Read-Host "Deploy to: (1) Crella.ai only (2) Gringots only (3) Both"

switch ($deployChoice) {
    "1" {
        Write-Host "🌐 DEPLOYING TO CRELLA.AI..." -ForegroundColor Green
        
        Write-Host "Available hosting options:"
        Write-Host "  A) Netlify (Recommended - instant)"
        Write-Host "  B) Vercel (Fast deployment)"  
        Write-Host "  C) Manual rsync to server"
        
        $hostChoice = Read-Host "Choose hosting (A/B/C)"
        
        switch ($hostChoice.ToUpper()) {
            "A" {
                Write-Host "📡 Deploying to Netlify..." -ForegroundColor Blue
                
                # Check Netlify CLI
                $netlifyInstalled = Get-Command "netlify" -ErrorAction SilentlyContinue
                if (!$netlifyInstalled) {
                    Write-Host "📦 Installing Netlify CLI..."
                    npm install -g netlify-cli
                }
                
                # Deploy
                netlify deploy --prod --dir=dist
                Write-Host "✅ Crella.ai deployed via Netlify!"
            }
            
            "B" {
                Write-Host "⚡ Deploying to Vercel..." -ForegroundColor Blue
                
                # Check Vercel CLI
                $vercelInstalled = Get-Command "vercel" -ErrorAction SilentlyContinue
                if (!$vercelInstalled) {
                    Write-Host "📦 Installing Vercel CLI..."
                    npm install -g vercel
                }
                
                # Deploy
                vercel --prod dist
                Write-Host "✅ Crella.ai deployed via Vercel!"
            }
            
            "C" {
                Write-Host "📋 Manual deployment commands:" -ForegroundColor Yellow
                Write-Host "   rsync -avz --delete dist/ user@crella.ai:/var/www/html/"
                Write-Host "   OR upload dist/ folder to your web host"
            }
        }
    }
    
    "2" {
        Write-Host "🏰 SETTING UP GRINGOTS DEMO SERVER..." -ForegroundColor Magenta
        
        Write-Host "Perfect for:"
        Write-Host "  ✅ Paul's immediate lunch demos"
        Write-Host "  ✅ Large architect files and city plats"
        Write-Host "  ✅ Private testing before public launch"
        Write-Host "  ✅ Desktop + mobile support"
        Write-Host "  ✅ No internet dependency"
        
        # Quick local server setup
        $serveInstalled = Get-Command "serve" -ErrorAction SilentlyContinue
        if (!$serveInstalled) {
            Write-Host "📦 Installing local server..."
            npm install -g serve
        }
        
        Write-Host ""
        Write-Host "🚀 Starting Gringots demo server..."
        Write-Host "🔗 Access: http://localhost:3000/"
        Write-Host "📱 Mobile responsive for phones/tablets"
        Write-Host "🖥️ Desktop optimized for architect files"
        Write-Host ""
        Write-Host "Press Ctrl+C to stop server"
        serve dist -l 3000
    }
    
    "3" {
        Write-Host "🚀 DEPLOYING TO BOTH LOCATIONS..." -ForegroundColor Cyan
        
        # First, deploy to public (Netlify recommended)
        Write-Host "📡 Step 1: Deploying to crella.ai..."
        
        $netlifyInstalled = Get-Command "netlify" -ErrorAction SilentlyContinue
        if (!$netlifyInstalled) {
            Write-Host "📦 Installing Netlify CLI..."
            npm install -g netlify-cli
        }
        
        netlify deploy --prod --dir=dist
        Write-Host "✅ Public deployment complete!"
        
        Write-Host ""
        Write-Host "🏰 Step 2: Setting up Gringots demo server..."
        
        $serveInstalled = Get-Command "serve" -ErrorAction SilentlyContinue
        if (!$serveInstalled) {
            npm install -g serve
        }
        
        Write-Host ""
        Write-Host "🎯 DUAL DEPLOYMENT COMPLETE!" -ForegroundColor Green
        Write-Host "   🌐 Public: Check your Netlify dashboard for URL"
        Write-Host "   🏰 Private: Starting local server now..."
        Write-Host ""
        Write-Host "Perfect setup for Paul's demo strategy!"
        serve dist -l 3000
    }
}

Write-Host ""
Write-Host "=== POST-DEPLOYMENT CHECKLIST ===" -ForegroundColor Yellow
Write-Host "□ Test public URL on mobile device"
Write-Host "□ Test Gringots server with architect file upload"
Write-Host "□ Verify responsive design on desktop"
Write-Host "□ Confirm VIP signup form works"
Write-Host "□ Schedule Paul's demo meeting"
