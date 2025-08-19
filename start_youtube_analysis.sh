#!/bin/bash
echo "Starting YouTube Analysis Service..."
cd "$(dirname "$0")"
python3 backend/youtube_cron_processor.py --continuous
