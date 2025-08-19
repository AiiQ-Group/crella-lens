# Deploy Crella Mobile to DigitalOcean Server
# Server IP: 143.198.44.252 (from your DNS records)

Write-Host "🌊 DEPLOYING CRELLA MOBILE TO DIGITALOCEAN..." -ForegroundColor Cyan
Write-Host "   🌐 Domain: crella.ai" -ForegroundColor Green
Write-Host "   📡 Server: 143.198.44.252" -ForegroundColor Blue

# Check if dist folder exists
if (!(Test-Path "dist")) {
    Write-Host "❌ No dist folder found. Running production build..." -ForegroundColor Red
    npm run build
}

Write-Host ""
Write-Host "📊 Production build ready:" -ForegroundColor Green
$distSize = (Get-ChildItem -Path "dist" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host "   Size: $([math]::Round($distSize, 2)) MB"
$fileCount = (Get-ChildItem -Path "dist" -Recurse | Measure-Object).Count
Write-Host "   Files: $fileCount"

Write-Host ""
Write-Host "=== DIGITALOCEAN DEPLOYMENT OPTIONS ===" -ForegroundColor Yellow

Write-Host ""
Write-Host "🚀 Option 1: rsync (Recommended)" -ForegroundColor Green
Write-Host "   Command: rsync -avz --delete dist/ root@143.198.44.252:/var/www/html/"
Write-Host "   Requires: SSH key setup to your DigitalOcean droplet"

Write-Host ""
Write-Host "📂 Option 2: scp (Simple file copy)" -ForegroundColor Blue
Write-Host "   Command: scp -r dist/* root@143.198.44.252:/var/www/html/"
Write-Host "   Requires: SSH access to your droplet"

Write-Host ""
Write-Host "🖥️ Option 3: DigitalOcean App Platform" -ForegroundColor Magenta
Write-Host "   1. Create new App on DigitalOcean"
Write-Host "   2. Connect to GitHub repo"
Write-Host "   3. Auto-deploy from main branch"
Write-Host "   4. Custom domain: crella.ai"

Write-Host ""
Write-Host "💻 Option 4: Manual Upload via SFTP" -ForegroundColor Cyan
Write-Host "   1. Use FileZilla/WinSCP"
Write-Host "   2. Connect to 143.198.44.252"
Write-Host "   3. Upload dist/ contents to /var/www/html/"

Write-Host ""
$deployChoice = Read-Host "Choose deployment method (1-4)"

switch ($deployChoice) {
    "1" {
        Write-Host "🚀 Setting up rsync deployment..." -ForegroundColor Green
        
        # Check if rsync is available (Windows Subsystem for Linux or Git Bash)
        $rsyncAvailable = Get-Command "rsync" -ErrorAction SilentlyContinue
        
        if ($rsyncAvailable) {
            Write-Host "📡 Deploying to DigitalOcean server..."
            Write-Host "Command: rsync -avz --delete dist/ root@143.198.44.252:/var/www/html/"
            Write-Host ""
            Write-Host "⚠️  Make sure your SSH key is configured for root@143.198.44.252"
            
            $confirm = Read-Host "Execute rsync deployment? (y/n)"
            if ($confirm -eq "y" -or $confirm -eq "Y") {
                rsync -avz --delete dist/ root@143.198.44.252:/var/www/html/
                Write-Host "✅ Deployed to https://crella.ai!" -ForegroundColor Green
            }
        } else {
            Write-Host "❌ rsync not available. Try Option 2 (scp) or Option 4 (SFTP)" -ForegroundColor Red
        }
    }
    
    "2" {
        Write-Host "📂 Setting up scp deployment..." -ForegroundColor Blue
        
        $scpAvailable = Get-Command "scp" -ErrorAction SilentlyContinue
        
        if ($scpAvailable) {
            Write-Host "📡 Deploying via scp..."
            Write-Host "Command: scp -r dist/* root@143.198.44.252:/var/www/html/"
            
            $confirm = Read-Host "Execute scp deployment? (y/n)"
            if ($confirm -eq "y" -or $confirm -eq "Y") {
                scp -r dist/* root@143.198.44.252:/var/www/html/
                Write-Host "✅ Deployed to https://crella.ai!" -ForegroundColor Green
            }
        } else {
            Write-Host "❌ scp not available. Try Option 4 (SFTP)" -ForegroundColor Red
        }
    }
    
    "3" {
        Write-Host "🖥️ DigitalOcean App Platform setup:" -ForegroundColor Magenta
        Write-Host ""
        Write-Host "Steps:"
        Write-Host "1. Go to https://cloud.digitalocean.com/apps"
        Write-Host "2. Click 'Create App'"
        Write-Host "3. Connect your GitHub repo"
        Write-Host "4. Select 'Static Site' as app type"
        Write-Host "5. Build command: npm run build"
        Write-Host "6. Output directory: dist"
        Write-Host "7. Add custom domain: crella.ai"
        Write-Host ""
        Write-Host "✅ This will auto-deploy on every git push!"
    }
    
    "4" {
        Write-Host "💻 Manual SFTP upload instructions:" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Using FileZilla:"
        Write-Host "1. Host: 143.198.44.252"
        Write-Host "2. Username: root"
        Write-Host "3. Port: 22"
        Write-Host "4. Protocol: SFTP"
        Write-Host "5. Upload all files from dist/ to /var/www/html/"
        Write-Host ""
        Write-Host "Using WinSCP:"
        Write-Host "1. New Session → SFTP"
        Write-Host "2. Host: 143.198.44.252"
        Write-Host "3. Username: root"
        Write-Host "4. Drag dist/ contents to /var/www/html/"
    }
}

Write-Host ""
Write-Host "=== POST-DEPLOYMENT VERIFICATION ===" -ForegroundColor Yellow
Write-Host "□ Visit https://crella.ai to verify deployment"
Write-Host "□ Test mobile responsiveness"
Write-Host "□ Check VIP signup form works"
Write-Host "□ Verify all assets load properly"
Write-Host "□ Test on different devices"

Write-Host ""
Write-Host "🎯 CRELLA.AI IS READY FOR PAUL'S NETWORK!" -ForegroundColor Green
