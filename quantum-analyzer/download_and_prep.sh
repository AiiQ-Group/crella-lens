#!/bin/bash
# download_and_prep.sh
# Video Download & Preprocessing Module

VIDEO_URL="$1"
VIDEO_ID=$(echo "$VIDEO_URL" | sed 's/.*v=\([^&]*\).*/\1/')

if [ -z "$VIDEO_URL" ]; then
    echo "❌ ERROR: No video URL provided"
    echo "Usage: $0 <youtube_url>"
    exit 1
fi

echo "🎬 DOWNLOADING: $VIDEO_URL"
echo "📋 VIDEO_ID: $VIDEO_ID"

# Create timestamp log
echo "$(date): Starting download for $VIDEO_ID" >> logs/processing.log

# Download video with metadata
echo "⬇️  Downloading video and metadata..."
yt-dlp \
  --write-info-json \
  --write-thumbnail \
  --write-description \
  --output "processing/raw/%(id)s.%(ext)s" \
  --format "best[height<=1080]" \
  "$VIDEO_URL"

if [ $? -ne 0 ]; then
    echo "❌ ERROR: Video download failed"
    exit 1
fi

# Check if video file exists
VIDEO_FILE=$(find processing/raw/ -name "${VIDEO_ID}.*" -not -name "*.json" -not -name "*.jpg" -not -name "*.webp" | head -1)
if [ ! -f "$VIDEO_FILE" ]; then
    echo "❌ ERROR: Video file not found after download"
    exit 1
fi

echo "📁 Video file: $VIDEO_FILE"

# Extract audio for transcription
echo "🎵 Extracting audio..."
ffmpeg -i "$VIDEO_FILE" \
  -vn -acodec pcm_s16le -ar 16000 -ac 1 \
  "processing/raw/${VIDEO_ID}.wav" \
  -y -loglevel error

# Extract frames (every 30 seconds)
echo "🖼️  Extracting frames..."
ffmpeg -i "$VIDEO_FILE" \
  -vf fps=1/30 \
  "processing/segments/${VIDEO_ID}_frame_%03d.png" \
  -y -loglevel error

# Count extracted frames
FRAME_COUNT=$(ls processing/segments/${VIDEO_ID}_frame_*.png 2>/dev/null | wc -l)
echo "📊 Extracted $FRAME_COUNT frames"

# Save processing metadata
cat > "processing/raw/${VIDEO_ID}_processing_meta.json" << EOF
{
  "video_id": "$VIDEO_ID",
  "video_url": "$VIDEO_URL",
  "processing_date": "$(date -Iseconds)",
  "video_file": "$VIDEO_FILE",
  "audio_file": "processing/raw/${VIDEO_ID}.wav",
  "frames_extracted": $FRAME_COUNT,
  "status": "preprocessing_complete"
}
EOF

echo "✅ PREPROCESSING COMPLETE: $VIDEO_ID"
echo "📊 Frames: $FRAME_COUNT | Audio: processing/raw/${VIDEO_ID}.wav"
echo "$(date): Preprocessing complete for $VIDEO_ID" >> logs/processing.log
