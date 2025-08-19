# Gringots Local Demo Deployment Script
# Perfect for Paul's lunch demos and private testing

Write-Host "🏰 DEPLOYING TO GRINGOTS LOCAL SERVER..." -ForegroundColor Magenta

# Check if dist folder exists
if (!(Test-Path "dist")) {
    Write-Host "❌ No dist folder found. Running production build..." -ForegroundColor Red
    npm run build
}

Write-Host "📊 Production build ready for Gringots:" -ForegroundColor Green
$distSize = (Get-ChildItem -Path "dist" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host "   Size: $([math]::Round($distSize, 2)) MB"
$fileCount = (Get-ChildItem -Path "dist" -Recurse | Measure-Object).Count
Write-Host "   Files: $fileCount"

Write-Host ""
Write-Host "=== GRINGOTS DEPLOYMENT OPTIONS ===" -ForegroundColor Yellow

Write-Host ""
Write-Host "🏰 Option 1: Local IIS Server (Windows)" -ForegroundColor Cyan
Write-Host "   1. Copy dist/ to C:\inetpub\wwwroot\crella\"
Write-Host "   2. Access via http://localhost/crella/"

Write-Host ""
Write-Host "🐳 Option 2: Docker Container (Cross-platform)" -ForegroundColor Blue
Write-Host "   Commands:"
Write-Host "     docker run -d -p 8080:80 -v `"`$(pwd)/dist:/usr/share/nginx/html`" --name crella-local nginx:alpine"
Write-Host "     Access via http://localhost:8080/"

Write-Host ""
Write-Host "⚡ Option 3: Local Development Server" -ForegroundColor Green
Write-Host "   Command: npx serve dist -l 3000"
Write-Host "   Access via http://localhost:3000/"

Write-Host ""
Write-Host "🌐 Option 4: Network-Wide Access (for Paul's team)" -ForegroundColor Magenta
Write-Host "   Command: npx serve dist -l 3000 --host 0.0.0.0"
Write-Host "   Access via http://YOUR-IP:3000/ from any device on network"

Write-Host ""
Write-Host "=== QUICK GRINGOTS DEMO SETUP ===" -ForegroundColor Green
$deployType = Read-Host "Choose deployment type (1-4)"

switch ($deployType) {
    "1" {
        Write-Host "🏰 Setting up IIS deployment..." -ForegroundColor Cyan
        $iisPath = "C:\inetpub\wwwroot\crella"
        
        if (!(Test-Path "C:\inetpub\wwwroot")) {
            Write-Host "❌ IIS not found. Install IIS or choose option 3." -ForegroundColor Red
            exit 1
        }
        
        if (Test-Path $iisPath) {
            Remove-Item $iisPath -Recurse -Force
        }
        New-Item -ItemType Directory -Path $iisPath -Force
        Copy-Item "dist\*" $iisPath -Recurse
        
        Write-Host "✅ Deployed to IIS!" -ForegroundColor Green
        Write-Host "🔗 Access: http://localhost/crella/"
    }
    
    "2" {
        Write-Host "🐳 Setting up Docker deployment..." -ForegroundColor Blue
        
        # Check if Docker is running
        $dockerRunning = docker info 2>$null
        if (!$dockerRunning) {
            Write-Host "❌ Docker not running. Start Docker Desktop." -ForegroundColor Red
            exit 1
        }
        
        # Stop existing container if running
        docker stop crella-local 2>$null
        docker rm crella-local 2>$null
        
        # Run new container
        docker run -d -p 8080:80 -v "$((Get-Location).Path)/dist:/usr/share/nginx/html" --name crella-local nginx:alpine
        
        Write-Host "✅ Docker container running!" -ForegroundColor Green
        Write-Host "🔗 Access: http://localhost:8080/"
    }
    
    "3" {
        Write-Host "⚡ Starting local development server..." -ForegroundColor Green
        
        # Check if serve is installed
        $serveInstalled = Get-Command "serve" -ErrorAction SilentlyContinue
        if (!$serveInstalled) {
            Write-Host "📦 Installing serve..." -ForegroundColor Yellow
            npm install -g serve
        }
        
        Write-Host "🚀 Starting server on http://localhost:3000/"
        Write-Host "📱 Perfect for Paul's demo!"
        serve dist -l 3000
    }
    
    "4" {
        Write-Host "🌐 Starting network-wide server..." -ForegroundColor Magenta
        
        # Get local IP
        $localIP = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Wi-Fi" | Where-Object {$_.PrefixOrigin -eq "Dhcp"}).IPAddress
        
        # Check if serve is installed
        $serveInstalled = Get-Command "serve" -ErrorAction SilentlyContinue
        if (!$serveInstalled) {
            Write-Host "📦 Installing serve..." -ForegroundColor Yellow
            npm install -g serve
        }
        
        Write-Host "🚀 Starting network server..."
        Write-Host "🔗 Local access: http://localhost:3000/"
        Write-Host "🌐 Network access: http://$localIP:3000/"
        Write-Host "📱 Perfect for Paul's team on any device!"
        serve dist -l 3000 --host 0.0.0.0
    }
}

Write-Host ""
Write-Host "=== GRINGOTS DEMO ADVANTAGES ===" -ForegroundColor Yellow
Write-Host "✅ Immediate demo capability (no internet required)"
Write-Host "✅ Full privacy and security for sensitive architect files"
Write-Host "✅ Perfect for Paul's lunch meetings"
Write-Host "✅ Desktop support for large city plats and blueprints"
Write-Host "✅ No external dependencies or downtime"
Write-Host "✅ Full control over demo environment"

Write-Host ""
Write-Host "🎯 PAUL'S DEMO READY!" -ForegroundColor Green
