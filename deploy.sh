#!/bin/bash

# Crella Mobile Deployment Script to crella.ai
# Run this script from the project root directory

echo "🚀 Deploying Crella Mobile to crella.ai..."
echo "Production build size: $(du -sh dist/ | cut -f1)"

# Deployment options - choose one:

echo "=== DEPLOYMENT OPTIONS ==="

echo "Option 1: rsync to crella.ai server"
echo "rsync -avz --delete dist/ user@crella.ai:/var/www/html/crella-mobile/"

echo ""
echo "Option 2: Netlify CLI deployment"
echo "npx netlify deploy --prod --dir=dist"

echo ""
echo "Option 3: Vercel deployment"
echo "npx vercel --prod --no-confirm ./dist"

echo ""
echo "Option 4: AWS S3 + CloudFront"
echo "aws s3 sync dist/ s3://crella-ai-bucket/ --delete"
echo "aws cloudfront create-invalidation --distribution-id XXXXX --paths '/*'"

echo ""
echo "🔧 Post-deployment checklist:"
echo "1. Test https://crella.ai (or subdomain)"
echo "2. Verify VIP signup webhook"
echo "3. Check mobile responsiveness"
echo "4. Confirm API endpoints are working"

echo ""
echo "✅ Ready for Paul's HNW network demo!"
