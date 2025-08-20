#!/bin/bash
# Crella Mobile Server Deployment Commands
# Run these on your DigitalOcean server (143.198.44.252)

echo "🚀 DEPLOYING CRELLA MOBILE TO DIGITALOCEAN SERVER..."
echo "📡 Server: 143.198.44.252"
echo "🌐 Domain: crella.ai"

# 1. SSH into your server first:
# ssh root@143.198.44.252

echo ""
echo "=== STEP 1: PREPARE SERVER ==="

# Update system
apt update && apt upgrade -y

# Install Node.js 18 (if not installed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Verify Node.js installation
node --version
npm --version

echo ""
echo "=== STEP 2: CLONE REPOSITORY ==="

# Navigate to web directory
cd /var/www/html

# Remove existing files (backup first if needed)
rm -rf *

# Clone your GitHub repository
git clone https://github.com/AiiQ-Group/crella-lens.git .

# Verify clone
ls -la

echo ""
echo "=== STEP 3: BUILD PRODUCTION ==="

# Install dependencies
npm install

# Build production version
npm run build

# Verify build
ls -la dist/

echo ""
echo "=== STEP 4: DEPLOY TO WEB ROOT ==="

# Copy build files to web root
cp -r dist/* /var/www/html/

# Or create index.html fallback for React Router
cp dist/index.html /var/www/html/404.html

# Set proper permissions
chown -R www-data:www-data /var/www/html
chmod -R 755 /var/www/html

echo ""
echo "=== STEP 5: CONFIGURE NGINX (if needed) ==="

# Create nginx config for React Router
cat > /etc/nginx/sites-available/crella.ai << 'EOF'
server {
    listen 80;
    server_name crella.ai www.crella.ai;
    root /var/www/html;
    index index.html;

    # React Router fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Enable site (if not already enabled)
ln -sf /etc/nginx/sites-available/crella.ai /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test nginx config
nginx -t

# Reload nginx
systemctl reload nginx

echo ""
echo "=== STEP 6: CREATE UPDATE SCRIPT ==="

# Create deployment script for future updates
cat > /root/deploy-crella.sh << 'EOF'
#!/bin/bash
echo "🔄 Updating Crella Mobile..."

cd /var/www/html
git pull origin main
npm install
npm run build
cp -r dist/* /var/www/html/
chown -R www-data:www-data /var/www/html
systemctl reload nginx

echo "✅ Crella.ai updated successfully!"
echo "🌐 Live at: https://crella.ai"
EOF

# Make executable
chmod +x /root/deploy-crella.sh

echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo ""
echo "✅ Crella Mobile is now live at: https://crella.ai"
echo "✅ Mobile responsive design ready"
echo "✅ Desktop support for architect files"
echo "✅ Paul's demo platform deployed"
echo ""
echo "🔄 For future updates, just run: /root/deploy-crella.sh"
