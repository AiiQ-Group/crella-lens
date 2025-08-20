#!/bin/bash
# CORRECT: Deploy to jbot@146.190.188.208
# Your actual server with jbot user

echo "🚀 DEPLOYING TO CORRECT SERVER: jbot@146.190.188.208"

# SSH Commands for your server
echo "=== SSH CONNECTION ==="
echo "ssh jbot@146.190.188.208"

echo ""
echo "=== DEPLOYMENT COMMANDS (run on your server) ==="

# Create deployment directory in jbot home
cd ~
rm -rf crella-deployment
mkdir crella-deployment
cd crella-deployment

# Clone your GitHub repository
echo "📡 Cloning from GitHub..."
git clone https://github.com/AiiQ-Group/crella-lens.git .

# Install dependencies and build
echo "📦 Installing dependencies..."
npm install

echo "🔨 Building production version..."
npm run build

# Deploy to web directory (with proper permissions)
echo "🌐 Deploying to web directory..."
sudo rm -rf /var/www/html/*
sudo cp -r dist/* /var/www/html/

# Fix the React Router issue (IMPORTANT!)
echo "⚙️ Configuring Nginx for React Router..."
sudo tee /etc/nginx/sites-available/crella.ai > /dev/null << 'EOF'
server {
    listen 80;
    server_name crella.ai www.crella.ai;
    root /var/www/html;
    index index.html;

    # CRITICAL: React Router fallback for /upload, /analyze, /vault routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache optimization for production
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/crella.ai /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Set proper permissions
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html

# Start/restart nginx
sudo systemctl start nginx
sudo systemctl enable nginx
sudo nginx -t
sudo systemctl reload nginx

echo ""
echo "✅ DEPLOYMENT COMPLETE!"
echo "🌐 Crella.ai should be live at: https://crella.ai"
echo ""
echo "🧪 Test these URLs after deployment:"
echo "   - https://crella.ai (Landing page)"
echo "   - https://crella.ai/upload (Upload screen)"
echo "   - https://crella.ai/analyze (Analysis workflow)"
echo "   - https://crella.ai/vault (Secure vault)"
echo "   - https://crella.ai/dashboard (User dashboard)"
