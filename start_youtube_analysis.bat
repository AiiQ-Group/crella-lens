@echo off
echo Starting YouTube Analysis Service...
cd /d "%~dp0"
python backend/youtube_cron_processor.py --continuous
pause
