#!/bin/bash

echo "🚀 Deploying FULL Crella-Lens with Claire API to GPU Server"
echo "📡 Connecting to 146.190.188.208 as jbot..."

# SSH to server and deploy
ssh jbot@146.190.188.208 << 'ENDSSH'
  echo "✅ Connected to GPU server"
  
  # Go to deployment directory
  cd ~/crella-deployment/
  
  # Pull latest changes from GitHub
  echo "📥 Pulling latest changes from GitHub..."
  git pull origin main
  
  # Install Python dependencies for Claire API
  echo "🐍 Installing Claire API dependencies..."
  pip3 install flask flask-cors requests python-dotenv openai anthropic
  
  # Install Node dependencies and build
  echo "📦 Installing Node dependencies..."
  npm install
  
  echo "🔨 Building production version..."
  npm run build
  
  # Copy Claire API service to deployment folder
  echo "🤖 Setting up Claire API service..."
  cp claire_api_service.py ~/crella-deployment/
  
  # Start Claire API service in background
  echo "🚀 Starting Claire API service on port 5002..."
  nohup python3 claire_api_service.py > claire_api.log 2>&1 &
  
  # Copy dist to web directory
  echo "📂 Copying built files to web directory..."
  sudo cp -r dist/* ~/crella-deployment/
  
  # Restart web server (if using Caddy)
  echo "🔄 Restarting Caddy..."
  sudo systemctl restart caddy
  
  echo "🎉 Deployment complete!"
  echo "🌐 Full version should be live at https://crella.ai"
  echo "🤖 Claire API running on port 5002 with sophisticated personality"
ENDSSH

echo "✅ Deployment script completed"
echo "🔗 Check https://crella.ai for the full version"
