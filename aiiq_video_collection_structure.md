# 🎬 aiiq_video_collection Directory Structure

Following your existing `aiiq_data_collection` pattern:

```
aiiq_video_collection/
├── collect_youtube_analysis.py     # Main YouTube video collector
├── collect_tiktok_analysis.py      # TikTok video collector  
├── collect_instagram_reels.py      # Instagram Reels collector
├── collect_twitter_videos.py       # Twitter video collector
├── query_video_models.py           # Video-specific model queries
├── video_pait_scoring.py          # pAIt scoring for video content
├── batch_video_processor.py       # Batch processing multiple videos
├── latest_video_collection.json   # Latest results (like your existing pattern)
└── video_analysis_logs/            # Processing logs
    ├── youtube_analysis_YYYYMMDD.log
    ├── tiktok_analysis_YYYYMMDD.log
    └── processing_errors.log
```

## 📊 Integration with Existing System

- **Same PM2 structure**: Run alongside your current collection services
- **Same API pattern**: Expose via `/latest_video_collection` endpoint  
- **Same cron pattern**: Your Windows system can query every minute
- **Same model usage**: Uses your reliable models (jbot, claudia-trader, etc.)
- **No Juliet**: Excluded from all video analysis

## 🔗 Connection Points

1. **Your existing cron job** can query both:
   - `http://146.190.188.208/latest_collection` (current data)
   - `http://146.190.188.208/latest_video_collection` (video analysis)

2. **Your Windows dashboard** pulls from both sources

3. **Same JSON format** as your current collections for consistency
