# download_video.py (Shorts-compatible)
from pytube import YouTube

# Convert Shorts URL to regular video format
original_url = "https://www.youtube.com/shorts/xyvqJdyUVIA"
video_id = original_url.split("/")[-1]
url = f"https://www.youtube.com/watch?v={video_id}"

print(f"🎥 Converted URL: {url}")

yt = YouTube(url)
stream = yt.streams.filter(only_audio=True).first()
stream.download(filename="short_clip.mp4")

print("✅ Download complete: short_clip.mp4")
