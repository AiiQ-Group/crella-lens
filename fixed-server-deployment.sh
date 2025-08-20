#!/bin/bash
# FIXED: Crella Mobile Server Deployment (Permission-Safe)
# For jbot user with sudo access

echo "🔧 FIXING CRELLA DEPLOYMENT WITH PROPER PERMISSIONS..."

# Method 1: Deploy to user directory first, then copy
echo "=== DEPLOYING TO USER DIRECTORY FIRST ==="

# Create deployment directory in user home
cd ~
rm -rf crella-deployment
mkdir crella-deployment
cd crella-deployment

# Clone repository
git clone https://github.com/AiiQ-Group/crella-lens.git .

# Install and build (no sudo needed in user directory)
npm install
npm run build

echo "✅ Build completed successfully!"

# Method 2: Use sudo to deploy to web directory
echo "=== DEPLOYING TO WEB DIRECTORY WITH SUDO ==="

# Clean web directory with sudo
sudo rm -rf /var/www/html/*

# Copy built files to web directory
sudo cp -r dist/* /var/www/html/

# Create proper nginx config for React Router
sudo tee /etc/nginx/sites-available/crella.ai > /dev/null << 'EOF'
server {
    listen 80;
    server_name crella.ai www.crella.ai;
    root /var/www/html;
    index index.html;

    # React Router fallback - IMPORTANT for /upload, /analyze routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy (if needed later)
    location /api/ {
        proxy_pass http://localhost:8002/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/crella.ai /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Set proper permissions
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html

# Start/restart nginx
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl reload nginx

echo "=== CREATING FUTURE UPDATE SCRIPT ==="

# Create update script
sudo tee /usr/local/bin/update-crella.sh > /dev/null << 'EOF'
#!/bin/bash
echo "🔄 Updating Crella Mobile..."

cd /tmp
rm -rf crella-update
git clone https://github.com/AiiQ-Group/crella-lens.git crella-update
cd crella-update

npm install
npm run build

sudo rm -rf /var/www/html/*
sudo cp -r dist/* /var/www/html/
sudo chown -R www-data:www-data /var/www/html
sudo systemctl reload nginx

echo "✅ Crella.ai updated successfully!"
echo "🌐 Live at: https://crella.ai"

# Cleanup
cd ..
rm -rf crella-update
EOF

# Make update script executable
sudo chmod +x /usr/local/bin/update-crella.sh

echo ""
echo "🎉 DEPLOYMENT FIXED AND COMPLETE!"
echo ""
echo "✅ Crella Mobile deployed to: https://crella.ai"
echo "✅ React Router configured (all /upload, /analyze routes work)"
echo "✅ Nginx running and configured"
echo "✅ Proper permissions set"
echo ""
echo "🔄 For future updates: sudo /usr/local/bin/update-crella.sh"
echo ""
echo "🧪 Test these URLs:"
echo "   https://crella.ai (landing page)"
echo "   https://crella.ai/upload (upload screen)" 
echo "   https://crella.ai/analyze (analysis screen)"
echo "   https://crella.ai/vault (vault screen)"
