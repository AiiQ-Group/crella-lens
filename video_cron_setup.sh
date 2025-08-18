#!/bin/bash
# 🎬 Video Collection Cron Setup
# Matches your existing aiiq_data_collection cron pattern

# Create aiiq_video_collection directory structure
mkdir -p aiiq_video_collection
mkdir -p aiiq_video_collection/video_analysis_logs

# Set up cron job to run video collection every 30 minutes
# (Less frequent than data collection since video processing takes more time)

echo "Setting up video collection cron job..."

# Add to crontab (runs every 30 minutes)
(crontab -l 2>/dev/null; echo "*/30 * * * * cd /home/jbot/aiiq_video_collection && /usr/bin/python3 collect_youtube_analysis.py >> video_analysis_logs/cron.log 2>&1") | crontab -

echo "✅ Video collection cron job added!"
echo "🕐 Will run every 30 minutes"
echo "📁 Logs: aiiq_video_collection/video_analysis_logs/"
echo "🔗 API endpoint will be: http://146.190.188.208/latest_video_collection"

# Create PM2 ecosystem file for video collection API
cat > ecosystem.video.config.js << EOL
module.exports = {
  apps: [{
    name: 'video-collection-api',
    script: 'video_collection_server.py',
    cwd: '/home/jbot/aiiq_video_collection',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '2G',
    env: {
      NODE_ENV: 'production'
    }
  }]
}
EOL

echo "📦 PM2 config created: ecosystem.video.config.js"
echo ""
echo "🚀 To start the video collection service:"
echo "   pm2 start ecosystem.video.config.js"
echo "   pm2 save"
