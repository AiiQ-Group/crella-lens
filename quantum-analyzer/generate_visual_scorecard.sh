#!/bin/bash
# generate_visual_scorecard.sh
# Visual Scorecard Generation Module

VIDEO_ID="$1"

if [ -z "$VIDEO_ID" ]; then
    echo "❌ ERROR: No video ID provided"
    echo "Usage: $0 <video_id>"
    exit 1
fi

SCORECARD_FILE="processing/output/${VIDEO_ID}_pait_scorecard.json"

if [ ! -f "$SCORECARD_FILE" ]; then
    echo "❌ ERROR: pAIt scorecard not found: $SCORECARD_FILE"
    exit 1
fi

echo "🎨 GENERATING VISUAL SCORECARD: $VIDEO_ID"

python3 << EOF
import json
import os
from PIL import Image, ImageDraw, ImageFont
from datetime import datetime
import requests

# Load pAIt scorecard
with open('$SCORECARD_FILE', 'r') as f:
    scorecard = json.load(f)

def create_scorecard_image(data):
    """Generate comprehensive visual scorecard"""
    
    # Create large scorecard (1200x800)
    img = Image.new('RGB', (1200, 800), color='#0a0a0a')
    draw = ImageDraw.Draw(img)
    
    # Try to load fonts (fallback to default if not available)
    try:
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 28)
        header_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 18)
        normal_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 14)
        small_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 12)
    except:
        # Fallback to default font
        title_font = ImageFont.load_default()
        header_font = ImageFont.load_default()
        normal_font = ImageFont.load_default()
        small_font = ImageFont.load_default()
    
    # Header section
    draw.text((40, 30), "pAIt QUANTUM SCORECARD", fill='#00ff88', font=title_font)
    draw.text((40, 70), f"Video Analysis Report - August 2025", fill='#ffffff', font=header_font)
    
    # Video info
    video_meta = data.get('video_metadata', {})
    video_title = video_meta.get('title', 'Unknown Title')[:60] + '...' if len(video_meta.get('title', '')) > 60 else video_meta.get('title', 'Unknown Title')
    
    draw.text((40, 110), f"Title: {video_title}", fill='#cccccc', font=normal_font)
    draw.text((40, 135), f"Channel: {video_meta.get('uploader', 'Unknown')}", fill='#cccccc', font=normal_font)
    draw.text((40, 160), f"Duration: {video_meta.get('duration', 0)//60}:{video_meta.get('duration', 0)%60:02d}", fill='#cccccc', font=normal_font)
    
    # Overall score (prominent display)
    overall_score = data['overall_pait_score']
    score_color = '#00ff88' if overall_score >= 4 else '#ffaa00' if overall_score >= 3 else '#ff6644' if overall_score >= 2 else '#ff0000'
    
    # Large score circle
    center_x, center_y = 950, 200
    radius = 80
    
    # Draw circle background
    draw.ellipse([center_x-radius, center_y-radius, center_x+radius, center_y+radius], 
                outline=score_color, width=6, fill='#1a1a1a')
    
    # Score text
    draw.text((center_x-30, center_y-20), f"{overall_score}", fill=score_color, font=title_font)
    draw.text((center_x-25, center_y+10), "/5.0", fill='#ffffff', font=header_font)
    
    # Component scores section
    draw.text((40, 220), "COMPONENT ANALYSIS", fill='#00ff88', font=header_font)
    
    y_pos = 260
    components = data['component_scores']
    
    for comp_name, details in components.items():
        if details['segments_analyzed'] > 0:
            score = details['score']
            display_name = comp_name.replace('_', ' ').title()
            
            # Color coding
            color = '#00ff88' if score >= 4 else '#ffaa00' if score >= 3 else '#ff6644' if score >= 2 else '#ff0000'
            
            # Component name and score
            draw.text((40, y_pos), f"{display_name}:", fill='#ffffff', font=normal_font)
            draw.text((250, y_pos), f"{score}/5.0", fill=color, font=header_font)
            
            # Progress bar
            bar_width = int((score / 5.0) * 300)
            draw.rectangle([(320, y_pos + 3), (320 + bar_width, y_pos + 18)], fill=color)
            draw.rectangle([(320, y_pos + 3), (620, y_pos + 18)], outline='#444444', width=1)
            
            # Segments analyzed
            draw.text((640, y_pos), f"({details['segments_analyzed']} segments)", fill='#888888', font=small_font)
            
            y_pos += 35
        else:
            # No data available
            display_name = comp_name.replace('_', ' ').title()
            draw.text((40, y_pos), f"{display_name}: No Data", fill='#666666', font=normal_font)
            y_pos += 35
    
    # Risk assessment section
    y_pos += 20
    draw.text((40, y_pos), "RISK ASSESSMENT", fill='#ffaa00', font=header_font)
    
    risk_data = data['risk_assessment']
    red_flags = risk_data['red_flags_identified']
    
    y_pos += 40
    risk_color = '#ff0000' if red_flags >= 5 else '#ff6644' if red_flags >= 3 else '#ffaa00' if red_flags >= 1 else '#00ff88'
    draw.text((40, y_pos), f"Red Flags Identified: {red_flags}", fill=risk_color, font=normal_font)
    
    if red_flags > 0 and len(risk_data.get('unique_red_flags', [])) > 0:
        y_pos += 25
        flags_text = ', '.join(risk_data['unique_red_flags'][:3])  # Show first 3 flags
        if len(flags_text) > 80:
            flags_text = flags_text[:80] + '...'
        draw.text((40, y_pos), f"Issues: {flags_text}", fill='#ff6644', font=small_font)
    
    # Recommendation section
    y_pos += 50
    draw.text((40, y_pos), "RECOMMENDATION", fill='#ffffff', font=header_font)
    
    recommendation = data['recommendation']
    rec_color = '#00ff88' if 'HIGH VALUE' in recommendation else '#ffaa00' if 'MODERATE' in recommendation else '#ff6644' if 'RISK' in recommendation else '#ff0000'
    
    y_pos += 35
    # Split long recommendation text
    rec_lines = []
    words = recommendation.split(' ')
    current_line = ''
    for word in words:
        if len(current_line + ' ' + word) > 50:
            rec_lines.append(current_line)
            current_line = word
        else:
            current_line += ' ' + word if current_line else word
    rec_lines.append(current_line)
    
    for line in rec_lines:
        draw.text((40, y_pos), line, fill=rec_color, font=normal_font)
        y_pos += 25
    
    # Watch time value
    y_pos += 10
    watch_value = data['watch_time_value']
    value_lines = []
    words = watch_value.split(' ')
    current_line = ''
    for word in words:
        if len(current_line + ' ' + word) > 60:
            value_lines.append(current_line)
            current_line = word
        else:
            current_line += ' ' + word if current_line else word
    value_lines.append(current_line)
    
    for line in value_lines:
        draw.text((40, y_pos), line, fill='#cccccc', font=small_font)
        y_pos += 20
    
    # Analysis metadata (bottom section)
    draw.text((40, 720), f"Analyzed: {data['analysis_date'][:19].replace('T', ' ')}", fill='#666666', font=small_font)
    draw.text((40, 740), f"Segments: {data['analysis_summary']['total_segments_analyzed']} | " +
              f"Confidence: {data.get('overall_confidence', 0.8):.1%}", fill='#666666', font=small_font)
    
    # Quantum signature
    draw.text((40, 760), "Generated by Quantum Analyzer - Multi-Agent Analysis System", fill='#444444', font=small_font)
    
    # Right side - Analysis summary
    draw.text((700, 350), "ANALYSIS SUMMARY", fill='#00ff88', font=header_font)
    
    analysis_summary = data['analysis_summary']
    y_pos = 390
    
    summary_items = [
        f"Total Segments: {analysis_summary['total_segments_analyzed']}",
        f"JBot Analysis: {analysis_summary['jbot_segments']} segments",
        f"Claudia Analysis: {analysis_summary['claudia_segments']} segments",
        f"Coverage: {analysis_summary.get('analysis_coverage', 'N/A')}",
        f"Processing Node: {data['quantum_metadata']['processing_node']}",
        f"Agent Version: {data['quantum_metadata']['analyzer_version']}"
    ]
    
    for item in summary_items:
        draw.text((700, y_pos), item, fill='#ffffff', font=small_font)
        y_pos += 20
    
    return img

def create_crella_compatible_overlay(data):
    """Create Crella Lens compatible overlay image"""
    
    # Create compact overlay (600x400)
    img = Image.new('RGBA', (600, 400), color=(0, 0, 0, 180))  # Semi-transparent
    draw = ImageDraw.Draw(img)
    
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 16)
        small_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 12)
    except:
        font = ImageFont.load_default()
        small_font = ImageFont.load_default()
    
    # Header
    draw.text((20, 20), "pAIt Score", fill=(0, 255, 136, 255), font=font)
    
    # Overall score
    overall_score = data['overall_pait_score']
    score_color = (0, 255, 136, 255) if overall_score >= 4 else (255, 170, 0, 255) if overall_score >= 3 else (255, 102, 68, 255) if overall_score >= 2 else (255, 0, 0, 255)
    
    draw.text((20, 50), f"{overall_score}/5.0", fill=score_color, font=font)
    
    # Quick components
    components = ['profit_claims', 'risk_disclosure', 'methodology']
    y_pos = 90
    
    for comp in components:
        if comp in data['component_scores'] and data['component_scores'][comp]['segments_analyzed'] > 0:
            score = data['component_scores'][comp]['score']
            color = (0, 255, 136, 255) if score >= 3 else (255, 170, 0, 255) if score >= 2 else (255, 0, 0, 255)
            name = comp.replace('_', ' ').title()[:12]
            draw.text((20, y_pos), f"{name}: {score:.1f}", fill=color, font=small_font)
            y_pos += 25
    
    # Quick recommendation
    recommendation = data['recommendation'].split(' - ')[0]  # Just the first part
    rec_color = (0, 255, 136, 255) if 'HIGH VALUE' in recommendation else (255, 170, 0, 255) if 'MODERATE' in recommendation else (255, 0, 0, 255)
    draw.text((20, y_pos + 20), recommendation, fill=rec_color, font=small_font)
    
    return img

# Generate main scorecard
print("🎨 Generating main visual scorecard...")
scorecard_img = create_scorecard_image(scorecard)
scorecard_path = f'processing/output/${VIDEO_ID}_visual_scorecard.png'
scorecard_img.save(scorecard_path)

# Generate Crella overlay
print("🔲 Generating Crella Lens overlay...")
overlay_img = create_crella_compatible_overlay(scorecard)
overlay_path = f'processing/output/${VIDEO_ID}_crella_overlay.png'
overlay_img.save(overlay_path)

# Create Crella Lens integration package
crella_package = {
    **scorecard,
    'crella_lens_integration': {
        'visual_scorecard_path': scorecard_path,
        'overlay_path': overlay_path,
        'quantum_signature': f'QTA-{datetime.now().strftime("%Y-%m-%d")}',
        'multi_agent_verification': True,
        'compatible_version': 'Crella-Quantum-v1.0',
        'upload_ready': True,
        'vip_analysis': True,
        'metadata_embedding': {
            'analyzer_agents': scorecard['quantum_metadata']['agents_used'],
            'processing_timestamp': scorecard['quantum_metadata']['processing_timestamp'],
            'confidence_score': scorecard.get('overall_confidence', 0.8),
            'risk_level': 'high' if scorecard['risk_assessment']['red_flags_identified'] >= 3 else 'medium' if scorecard['risk_assessment']['red_flags_identified'] >= 1 else 'low'
        }
    }
}

crella_path = f'processing/output/${VIDEO_ID}_crella_compatible.json'
with open(crella_path, 'w') as f:
    json.dump(crella_package, f, indent=2)

print("✅ VISUAL SCORECARD GENERATION COMPLETE")
print(f"📊 Main scorecard: {scorecard_path}")
print(f"🔲 Crella overlay: {overlay_path}")
print(f"🔐 Crella package: {crella_path}")

# Update processing log
with open('logs/processing.log', 'a') as f:
    f.write(f"{datetime.now()}: Visual scorecard generated for ${VIDEO_ID}\n")

EOF

if [ $? -eq 0 ]; then
    echo "✅ VISUAL GENERATION COMPLETE"
else
    echo "❌ VISUAL GENERATION FAILED"
    exit 1
fi
