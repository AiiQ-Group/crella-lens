#!/bin/bash
# run_analysis.sh
# Multi-Agent Analysis Coordination Script

VIDEO_ID="$1"

if [ -z "$VIDEO_ID" ]; then
    echo "❌ ERROR: No video ID provided"
    echo "Usage: $0 <video_id>"
    exit 1
fi

echo "🧠 RUNNING MULTI-AGENT ANALYSIS: $VIDEO_ID"

# Check for required files
SEGMENTS_FILE="processing/transcripts/${VIDEO_ID}_analysis_segments.json"
if [ ! -f "$SEGMENTS_FILE" ]; then
    echo "❌ ERROR: Analysis segments file not found: $SEGMENTS_FILE"
    exit 1
fi

# Get number of segments
SEGMENT_COUNT=$(python3 -c "import json; data=json.load(open('$SEGMENTS_FILE')); print(len(data))")
echo "📊 Found $SEGMENT_COUNT segments to analyze"

# Check if Ollama is running
if ! curl -s http://localhost:11434/api/tags > /dev/null; then
    echo "❌ ERROR: Ollama is not running. Start with: ollama serve"
    exit 1
fi

# Verify models are available
echo "🔍 Checking available models..."
AVAILABLE_MODELS=$(ollama list | grep -E "(jbot|claudia)" | wc -l)
if [ $AVAILABLE_MODELS -eq 0 ]; then
    echo "⚠️  WARNING: JBot/Claudia models not found"
    echo "Install with: ollama pull jbot && ollama pull claudia"
    echo "Continuing with available models..."
fi

# Create analysis directory
mkdir -p processing/analysis

# Function to run analysis with retry logic
run_analysis_with_retry() {
    local script="$1"
    local video_id="$2"
    local segment_index="$3"
    local max_retries=3
    
    for attempt in $(seq 1 $max_retries); do
        echo "🤖 Running $script for segment $segment_index (attempt $attempt/$max_retries)"
        
        if python3 "$script" "$video_id" "$segment_index"; then
            return 0
        else
            echo "⚠️  Analysis failed, attempt $attempt/$max_retries"
            if [ $attempt -lt $max_retries ]; then
                echo "⏳ Waiting 5 seconds before retry..."
                sleep 5
            fi
        fi
    done
    
    echo "❌ Analysis failed after $max_retries attempts"
    return 1
}

# Run analyses in parallel batches
BATCH_SIZE=3  # Process 3 segments at a time
TOTAL_SEGMENTS=$((SEGMENT_COUNT - 1))  # 0-indexed

echo "🚀 Starting batch analysis (batch size: $BATCH_SIZE)"

for start_idx in $(seq 0 $BATCH_SIZE $TOTAL_SEGMENTS); do
    echo "📦 Processing batch starting at segment $start_idx"
    
    # Start batch processes
    pids=()
    
    for i in $(seq 0 $((BATCH_SIZE - 1))); do
        segment_idx=$((start_idx + i))
        
        if [ $segment_idx -le $TOTAL_SEGMENTS ]; then
            echo "🤖 Starting analysis for segment $segment_idx"
            
            # Run JBot analysis in background
            (
                run_analysis_with_retry "prompts/jbot_analyzer.py" "$VIDEO_ID" "$segment_idx"
            ) &
            pids+=($!)
            
            # Run Claudia analysis in background  
            (
                run_analysis_with_retry "prompts/claudia_analyzer.py" "$VIDEO_ID" "$segment_idx"
            ) &
            pids+=($!)
            
            # Small delay between starting processes
            sleep 2
        fi
    done
    
    # Wait for batch to complete
    echo "⏳ Waiting for batch to complete..."
    for pid in "${pids[@]}"; do
        wait $pid
        exit_code=$?
        if [ $exit_code -ne 0 ]; then
            echo "⚠️  One analysis process failed (PID: $pid)"
        fi
    done
    
    echo "✅ Batch complete"
    
    # Brief pause between batches
    if [ $((start_idx + BATCH_SIZE)) -le $TOTAL_SEGMENTS ]; then
        echo "⏳ Cooling down before next batch..."
        sleep 10
    fi
done

# Check analysis results
JBOT_RESULTS=$(ls processing/analysis/${VIDEO_ID}_jbot_*.json 2>/dev/null | wc -l)
CLAUDIA_RESULTS=$(ls processing/analysis/${VIDEO_ID}_claudia_*.json 2>/dev/null | wc -l)

echo "📊 ANALYSIS RESULTS:"
echo "   JBot analyses: $JBOT_RESULTS / $SEGMENT_COUNT"
echo "   Claudia analyses: $CLAUDIA_RESULTS / $SEGMENT_COUNT"

if [ $JBOT_RESULTS -eq 0 ] && [ $CLAUDIA_RESULTS -eq 0 ]; then
    echo "❌ ERROR: No analysis results generated"
    exit 1
fi

echo "✅ MULTI-AGENT ANALYSIS COMPLETE"
echo "📋 Results saved in processing/analysis/"

# Update log
echo "$(date): Multi-agent analysis complete for $VIDEO_ID - JBot: $JBOT_RESULTS, Claudia: $CLAUDIA_RESULTS" >> logs/processing.log
