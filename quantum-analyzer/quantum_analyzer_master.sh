#!/bin/bash
# quantum_analyzer_master.sh
# Master execution script for complete YouTube video analysis

VIDEO_URL="$1"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

if [ -z "$VIDEO_URL" ]; then
    echo -e "${RED}❌ ERROR: No YouTube URL provided${NC}"
    echo "Usage: $0 <youtube_url>"
    echo ""
    echo "Example:"
    echo "  $0 https://youtube.com/watch?v=VIDEO_ID"
    exit 1
fi

# Extract video ID
VIDEO_ID=$(echo "$VIDEO_URL" | sed 's/.*v=\([^&]*\).*/\1/')

echo -e "${PURPLE}🚀 QUANTUM TRADER ANALYZER - AUGUST 2025${NC}"
echo -e "${CYAN}📺 TARGET: $VIDEO_URL${NC}"
echo -e "${CYAN}🆔 VIDEO ID: $VIDEO_ID${NC}"
echo ""

# Create logs directory
mkdir -p logs

# Start timing
START_TIME=$(date +%s)

# Log start
echo "$(date): Starting analysis for $VIDEO_ID ($VIDEO_URL)" >> logs/processing.log

# Phase 1: Download & Preprocessing
echo -e "${BLUE}🎬 PHASE 1: Download & Preprocessing${NC}"
if ./download_and_prep.sh "$VIDEO_URL"; then
    echo -e "${GREEN}✅ Download and preprocessing complete${NC}"
else
    echo -e "${RED}❌ Download failed${NC}"
    exit 1
fi

echo ""

# Phase 2: Transcription
echo -e "${BLUE}🎙️ PHASE 2: Transcription${NC}"
if ./transcribe.sh "$VIDEO_ID"; then
    echo -e "${GREEN}✅ Transcription complete${NC}"
else
    echo -e "${RED}❌ Transcription failed${NC}"
    exit 1
fi

echo ""

# Phase 3: Multi-Agent Analysis
echo -e "${BLUE}🧠 PHASE 3: Multi-Agent Analysis${NC}"
if ./run_analysis.sh "$VIDEO_ID"; then
    echo -e "${GREEN}✅ Multi-agent analysis complete${NC}"
else
    echo -e "${RED}❌ Analysis failed${NC}"
    exit 1
fi

echo ""

# Phase 4: Aggregation & Scoring
echo -e "${BLUE}📊 PHASE 4: Aggregation & Scoring${NC}"
if ./aggregate_analysis.sh "$VIDEO_ID"; then
    echo -e "${GREEN}✅ pAIt scoring complete${NC}"
else
    echo -e "${RED}❌ Aggregation failed${NC}"
    exit 1
fi

echo ""

# Phase 5: Visual Scorecard Generation
echo -e "${BLUE}🎨 PHASE 5: Visual Scorecard Generation${NC}"
if ./generate_visual_scorecard.sh "$VIDEO_ID"; then
    echo -e "${GREEN}✅ Visual scorecard generated${NC}"
else
    echo -e "${RED}❌ Visual generation failed${NC}"
    exit 1
fi

# Calculate processing time
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
MINUTES=$((DURATION / 60))
SECONDS=$((DURATION % 60))

echo ""
echo -e "${GREEN}✅ ANALYSIS COMPLETE!${NC}"
echo -e "${YELLOW}⏱️  Total processing time: ${MINUTES}m ${SECONDS}s${NC}"
echo ""
echo -e "${CYAN}📋 Generated Files:${NC}"
echo "   📊 pAIt Scorecard: processing/output/${VIDEO_ID}_pait_scorecard.json"
echo "   🎨 Visual Scorecard: processing/output/${VIDEO_ID}_visual_scorecard.png"
echo "   🔲 Crella Overlay: processing/output/${VIDEO_ID}_crella_overlay.png"
echo "   🔐 Crella Compatible: processing/output/${VIDEO_ID}_crella_compatible.json"
echo ""

# Display quick results
if [ -f "processing/output/${VIDEO_ID}_pait_scorecard.json" ]; then
    echo -e "${CYAN}📊 QUICK RESULTS:${NC}"
    
    python3 << EOF
import json

try:
    with open('processing/output/${VIDEO_ID}_pait_scorecard.json', 'r') as f:
        data = json.load(f)
    
    score = data['overall_pait_score']
    recommendation = data['recommendation']
    red_flags = data['risk_assessment']['red_flags_identified']
    
    # Color coding for score
    if score >= 4:
        color = '\033[0;32m'  # Green
    elif score >= 3:
        color = '\033[1;33m'  # Yellow
    elif score >= 2:
        color = '\033[0;33m'  # Orange
    else:
        color = '\033[0;31m'  # Red
    
    print(f"   {color}🎯 Overall pAIt Score: {score}/5.0\033[0m")
    print(f"   📋 Recommendation: {recommendation}")
    print(f"   ⚠️  Red Flags: {red_flags}")
    
    # Component breakdown
    print("   📊 Component Scores:")
    components = data['component_scores']
    for comp, details in components.items():
        if details['segments_analyzed'] > 0:
            comp_score = details['score']
            comp_color = '\033[0;32m' if comp_score >= 4 else '\033[1;33m' if comp_score >= 3 else '\033[0;33m' if comp_score >= 2 else '\033[0;31m'
            comp_name = comp.replace('_', ' ').title()
            print(f"      {comp_color}{comp_name}: {comp_score}/5.0\033[0m ({details['segments_analyzed']} segments)")

except Exception as e:
    print(f"Error displaying results: {e}")
EOF

fi

echo ""
echo -e "${PURPLE}🔗 CRELLA LENS INTEGRATION:${NC}"
echo "   Upload the generated files to your Crella Lens VIP system"
echo "   The scorecard is fully compatible with quantum metadata embedding"
echo ""

# Log completion
echo "$(date): Analysis complete for $VIDEO_ID - Duration: ${MINUTES}m ${SECONDS}s" >> logs/processing.log

echo -e "${GREEN}🚀 Ready for Crella Lens integration!${NC}"
