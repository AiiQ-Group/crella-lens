#!/bin/bash
# aggregate_analysis.sh
# Analysis Aggregation and pAIt Scoring Module

VIDEO_ID="$1"

if [ -z "$VIDEO_ID" ]; then
    echo "❌ ERROR: No video ID provided"
    echo "Usage: $0 <video_id>"
    exit 1
fi

echo "📊 AGGREGATING ANALYSIS: $VIDEO_ID"

# Check if analysis files exist
JBOT_FILES=$(ls processing/analysis/${VIDEO_ID}_jbot_*.json 2>/dev/null | wc -l)
CLAUDIA_FILES=$(ls processing/analysis/${VIDEO_ID}_claudia_*.json 2>/dev/null | wc -l)

if [ $JBOT_FILES -eq 0 ] && [ $CLAUDIA_FILES -eq 0 ]; then
    echo "❌ ERROR: No analysis files found for $VIDEO_ID"
    exit 1
fi

echo "📋 Found $JBOT_FILES JBot analyses, $CLAUDIA_FILES Claudia analyses"

# Load configuration
python3 << EOF
import json
import glob
import os
from datetime import datetime

# Load configuration
with open('config/analyzer_config.json', 'r') as f:
    config = json.load(f)

component_weights = config['scoring']['component_weights']
video_id = '${VIDEO_ID}'

print(f"🔍 Processing analyses for {video_id}")

# Load all segment analyses
jbot_files = sorted(glob.glob(f'processing/analysis/{video_id}_jbot_*.json'))
claudia_files = sorted(glob.glob(f'processing/analysis/{video_id}_claudia_*.json'))

print(f"📊 JBot files: {len(jbot_files)}")
print(f"📊 Claudia files: {len(claudia_files)}")

# Initialize component scores
component_scores = {
    'profit_claims': [],
    'risk_disclosure': [], 
    'methodology': [],
    'evidence': [],
    'credibility': []
}

# Store detailed segment analysis
segment_details = []
red_flags_total = []
positive_indicators = []

# Process JBot analyses
for file_path in jbot_files:
    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
        
        component_scores['profit_claims'].append(data['profit_claims']['score'])
        component_scores['methodology'].append(data['methodology']['score'])
        component_scores['evidence'].append(data['evidence']['score'])
        
        # Collect red flags and positive indicators
        red_flags_total.extend(data.get('red_flags', []))
        positive_indicators.extend(data.get('positive_indicators', []))
        
        segment_details.append({
            'segment_id': data['segment_id'],
            'analyzer': 'JBot',
            'scores': {
                'profit_claims': data['profit_claims']['score'],
                'methodology': data['methodology']['score'],
                'evidence': data['evidence']['score']
            },
            'confidence': data.get('confidence', 0.8)
        })
        
    except Exception as e:
        print(f"⚠️  Error processing {file_path}: {e}")

# Process Claudia analyses  
for file_path in claudia_files:
    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
        
        component_scores['risk_disclosure'].append(data['risk_disclosure']['score'])
        component_scores['credibility'].append(data['credibility']['score'])
        
        segment_details.append({
            'segment_id': data['segment_id'],
            'analyzer': 'Claudia',
            'scores': {
                'risk_disclosure': data['risk_disclosure']['score'],
                'credibility': data['credibility']['score']
            },
            'recommendation': data.get('recommendation', 'unknown'),
            'investor_protection': data.get('investor_protection', 'unknown')
        })
        
        # Collect compliance violations
        red_flags_total.extend(data.get('compliance_violations', []))
        
    except Exception as e:
        print(f"⚠️  Error processing {file_path}: {e}")

# Calculate component averages
component_averages = {}
for component, scores in component_scores.items():
    if scores:
        component_averages[component] = {
            'score': round(sum(scores) / len(scores), 2),
            'segments_analyzed': len(scores),
            'min_score': min(scores),
            'max_score': max(scores)
        }
    else:
        component_averages[component] = {
            'score': 0.0,
            'segments_analyzed': 0,
            'min_score': 0,
            'max_score': 0
        }

# Calculate weighted overall score
overall_score = 0
total_weight = 0

for component, weight in component_weights.items():
    if component in component_averages and component_averages[component]['segments_analyzed'] > 0:
        overall_score += component_averages[component]['score'] * weight
        total_weight += weight

if total_weight > 0:
    overall_score = round(overall_score / total_weight, 2)
else:
    overall_score = 0.0

# Generate recommendation based on score and red flags
def generate_recommendation(score, red_flags):
    red_flag_count = len(set(red_flags))  # Unique red flags
    
    if red_flag_count >= 5 or score <= 1.5:
        return "AVOID - High risk of fraud", "Dangerous content with multiple red flags"
    elif red_flag_count >= 3 or score <= 2.5:
        return "HIGH RISK - Not recommended", "Significant concerns about credibility"
    elif red_flag_count >= 2 or score <= 3.5:
        return "MODERATE RISK - Watch with caution", "Some concerns, verify all claims independently"
    elif score >= 4.0:
        return "HIGH VALUE - Recommended viewing", "Quality educational content with proper disclosures"
    else:
        return "MODERATE VALUE - Generally acceptable", "Acceptable content with minor issues"

recommendation, watch_time_value = generate_recommendation(overall_score, red_flags_total)

# Load video metadata
video_meta_file = f'processing/raw/{video_id}.info.json'
video_metadata = {}
if os.path.exists(video_meta_file):
    try:
        with open(video_meta_file, 'r', encoding='utf-8') as f:
            video_info = json.load(f)
            video_metadata = {
                'title': video_info.get('title', 'Unknown'),
                'uploader': video_info.get('uploader', 'Unknown'),
                'duration': video_info.get('duration', 0),
                'view_count': video_info.get('view_count', 0),
                'upload_date': video_info.get('upload_date', 'Unknown'),
                'description': video_info.get('description', '')[:500] + '...' if video_info.get('description', '') else ''
            }
    except Exception as e:
        print(f"⚠️  Could not load video metadata: {e}")

# Create final pAIt scorecard
pait_scorecard = {
    'video_id': video_id,
    'analysis_date': datetime.now().isoformat(),
    'quantum_analyzer_version': config['system_info']['version'],
    
    'video_metadata': video_metadata,
    
    'analysis_summary': {
        'total_segments_analyzed': len(jbot_files) + len(claudia_files),
        'jbot_segments': len(jbot_files),
        'claudia_segments': len(claudia_files),
        'analysis_coverage': f"{((len(jbot_files) + len(claudia_files)) / max(len(jbot_files), len(claudia_files), 1) * 50):.0f}%" if jbot_files or claudia_files else "0%"
    },
    
    'component_scores': component_averages,
    
    'overall_pait_score': overall_score,
    'overall_confidence': round(sum([s.get('confidence', 0.8) for s in segment_details]) / max(len(segment_details), 1), 2),
    
    'recommendation': recommendation,
    'watch_time_value': watch_time_value,
    
    'risk_assessment': {
        'red_flags_identified': len(set(red_flags_total)),
        'unique_red_flags': list(set(red_flags_total)),
        'positive_indicators': len(set(positive_indicators)),
        'unique_positive_indicators': list(set(positive_indicators))
    },
    
    'segment_details': segment_details,
    
    'quantum_metadata': {
        'analyzer_version': config['system_info']['version'],
        'processing_node': config['system_info']['deployment'],
        'agents_used': config['system_info']['agents'],
        'component_weights': component_weights,
        'processing_timestamp': datetime.now().isoformat()
    }
}

# Save pAIt scorecard
os.makedirs('processing/output', exist_ok=True)
output_file = f'processing/output/{video_id}_pait_scorecard.json'

with open(output_file, 'w') as f:
    json.dump(pait_scorecard, f, indent=2)

print(f"✅ pAIt SCORECARD GENERATED")
print(f"📊 Overall Score: {pait_scorecard['overall_pait_score']}/5.0")
print(f"🎯 Recommendation: {pait_scorecard['recommendation']}")
print(f"📋 Red Flags: {pait_scorecard['risk_assessment']['red_flags_identified']}")
print(f"💾 Saved to: {output_file}")

# Update processing log
with open('logs/processing.log', 'a') as f:
    f.write(f"$(date): Aggregation complete for {video_id} - Score: {overall_score}/5.0\n")

EOF

if [ $? -eq 0 ]; then
    echo "✅ AGGREGATION COMPLETE"
else
    echo "❌ AGGREGATION FAILED"
    exit 1
fi
