# Crella Mobile Deployment Script for Windows PowerShell
# Run from project root: .\deploy-crella.ps1

Write-Host "🚀 DEPLOYING CRELLA MOBILE TO PRODUCTION..." -ForegroundColor Cyan

# Check if dist folder exists
if (!(Test-Path "dist")) {
    Write-Host "❌ No dist folder found. Running production build..." -ForegroundColor Red
    npm run build
}

Write-Host "📊 Production build ready:" -ForegroundColor Green
$distSize = (Get-ChildItem -Path "dist" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host "   Size: $([math]::Round($distSize, 2)) MB"
$fileCount = (Get-ChildItem -Path "dist" -Recurse | Measure-Object).Count
Write-Host "   Files: $fileCount"

Write-Host ""
Write-Host "=== DEPLOYMENT OPTIONS ===" -ForegroundColor Yellow

Write-Host ""
Write-Host "🌐 Option 1: Deploy to Netlify (RECOMMENDED)" -ForegroundColor Green
Write-Host "   Command: npx netlify deploy --prod --dir=dist"

Write-Host ""
Write-Host "⚡ Option 2: Deploy to Vercel" -ForegroundColor Blue  
Write-Host "   Command: npx vercel --prod dist"

Write-Host ""
Write-Host "🔗 Option 3: Deploy via rsync to crella.ai server" -ForegroundColor Magenta
Write-Host "   Command: rsync -avz --delete dist/ user@crella.ai:/var/www/html/"

Write-Host ""
Write-Host "☁️ Option 4: Deploy to AWS S3" -ForegroundColor Cyan
Write-Host "   Command: aws s3 sync dist/ s3://crella-ai-bucket/ --delete"

Write-Host ""
Write-Host "=== QUICK DEPLOY TO NETLIFY ===" -ForegroundColor Green
$deploy = Read-Host "Deploy to Netlify now? (y/n)"

if ($deploy -eq "y" -or $deploy -eq "Y") {
    Write-Host "🚀 Deploying to Netlify..." -ForegroundColor Cyan
    
    # Check if Netlify CLI is installed
    $netlifyInstalled = Get-Command "netlify" -ErrorAction SilentlyContinue
    if (!$netlifyInstalled) {
        Write-Host "📦 Installing Netlify CLI..." -ForegroundColor Yellow
        npm install -g netlify-cli
    }
    
    # Deploy to Netlify
    netlify deploy --prod --dir=dist
    
    Write-Host "✅ DEPLOYMENT COMPLETE!" -ForegroundColor Green
    Write-Host "📱 Your Crella Mobile app is now live!"
    Write-Host "🔗 Visit your Netlify dashboard for the live URL"
}

Write-Host ""
Write-Host "=== POST-DEPLOYMENT CHECKLIST ===" -ForegroundColor Yellow
Write-Host "□ Test the live URL on mobile device"
Write-Host "□ Verify VIP signup form works"
Write-Host "□ Check all animations and orbs load"
Write-Host "□ Test image upload workflow"
Write-Host "□ Confirm responsive design works"
Write-Host "□ Schedule Paul's group demo"

Write-Host ""
Write-Host "🎉 READY FOR PAUL'S HNW NETWORK DEMO!" -ForegroundColor Green
