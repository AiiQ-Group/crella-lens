#!/bin/bash
# transcribe.sh
# Audio Transcription Module using Whisper

VIDEO_ID="$1"

if [ -z "$VIDEO_ID" ]; then
    echo "❌ ERROR: No video ID provided"
    echo "Usage: $0 <video_id>"
    exit 1
fi

AUDIO_FILE="processing/raw/${VIDEO_ID}.wav"

if [ ! -f "$AUDIO_FILE" ]; then
    echo "❌ ERROR: Audio file not found: $AUDIO_FILE"
    exit 1
fi

echo "🎙️ TRANSCRIBING: $VIDEO_ID"
echo "📁 Audio file: $AUDIO_FILE"

# Create transcripts directory
mkdir -p processing/transcripts

# Run Whisper transcription
echo "🤖 Running Whisper transcription..."
whisper "$AUDIO_FILE" \
  --model large \
  --output_dir "processing/transcripts" \
  --output_format json \
  --language en \
  --verbose True

if [ $? -ne 0 ]; then
    echo "❌ ERROR: Whisper transcription failed"
    exit 1
fi

# Process transcription results
echo "📝 Processing transcript segments..."
python3 << EOF
import json
import sys
import os
from datetime import datetime

try:
    # Load transcription results
    with open('processing/transcripts/${VIDEO_ID}.json', 'r') as f:
        data = json.load(f)

    # Create timestamped transcript
    transcript = []
    segment_texts = []
    
    for segment in data['segments']:
        segment_data = {
            'id': segment['id'],
            'start': segment['start'],
            'end': segment['end'], 
            'text': segment['text'].strip(),
            'duration': segment['end'] - segment['start']
        }
        transcript.append(segment_data)
        segment_texts.append(segment['text'].strip())

    # Save detailed transcript
    with open('processing/transcripts/${VIDEO_ID}_timestamped.json', 'w') as f:
        json.dump(transcript, f, indent=2)

    # Create plain text version
    with open('processing/transcripts/${VIDEO_ID}_plain.txt', 'w') as f:
        f.write(' '.join(segment_texts))

    # Create analysis segments (group by ~60 second chunks)
    analysis_segments = []
    current_segment = {'start': 0, 'end': 0, 'text': '', 'segment_ids': []}
    
    for seg in transcript:
        if current_segment['end'] == 0:  # First segment
            current_segment['start'] = seg['start']
        
        current_segment['text'] += ' ' + seg['text']
        current_segment['segment_ids'].append(seg['id'])
        current_segment['end'] = seg['end']
        
        # If segment is ~60 seconds or more, finalize it
        if current_segment['end'] - current_segment['start'] >= 60:
            analysis_segments.append(dict(current_segment))
            current_segment = {'start': seg['end'], 'end': 0, 'text': '', 'segment_ids': []}
    
    # Add final segment if exists
    if current_segment['text']:
        analysis_segments.append(current_segment)

    # Save analysis segments
    with open('processing/transcripts/${VIDEO_ID}_analysis_segments.json', 'w') as f:
        json.dump(analysis_segments, f, indent=2)

    # Generate transcript metadata
    transcript_meta = {
        'video_id': '${VIDEO_ID}',
        'transcription_date': datetime.now().isoformat(),
        'total_segments': len(transcript),
        'total_duration': transcript[-1]['end'] if transcript else 0,
        'analysis_segments': len(analysis_segments),
        'word_count': len(' '.join(segment_texts).split()),
        'language': 'en',
        'whisper_model': 'large'
    }

    with open('processing/transcripts/${VIDEO_ID}_meta.json', 'w') as f:
        json.dump(transcript_meta, f, indent=2)

    print(f"✅ TRANSCRIPTION COMPLETE")
    print(f"📊 Total segments: {len(transcript)}")
    print(f"📊 Analysis chunks: {len(analysis_segments)}")
    print(f"📊 Total duration: {transcript[-1]['end']:.1f}s" if transcript else "Duration: 0s")
    print(f"📊 Word count: {len(' '.join(segment_texts).split())}")

except Exception as e:
    print(f"❌ ERROR: Transcription processing failed: {str(e)}")
    sys.exit(1)
EOF

if [ $? -ne 0 ]; then
    exit 1
fi

echo "$(date): Transcription complete for $VIDEO_ID" >> logs/processing.log
echo "✅ TRANSCRIPTION MODULE COMPLETE"
