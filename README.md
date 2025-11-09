# Fix Choppy Video Scrubbing - Complete Guide

## Problem

When implementing scroll-controlled video playback, the video appears choppy and not smooth during scrubbing, especially after the first 2 seconds.

## Root Cause

The issue is caused by **insufficient keyframes** in the video encoding.

### What are Keyframes?

- **Keyframe (I-frame)**: A full frame of the image in a video
- **Delta frames (P/B-frames)**: Frames between keyframes that only contain differences from previous frames
- Videos with keyframes every 100+ frames cause choppy scrubbing
- Videos with keyframes every 5-10 frames provide smooth scrubbing

### The Trade-off

- **More keyframes** = Smoother scrubbing but larger file size (3-5x bigger)
- **Fewer keyframes** = Smaller file but choppy scrubbing
- For scroll-controlled videos, prioritize keyframes over file size

---

## Solution: Re-encode Video with More Keyframes

### PowerShell Command (Windows)

```powershell
ffmpeg -i ".\robo-video.mp4" -vcodec libx264 -crf 20 -g 5 -keyint_min 5 -sc_threshold 0 -pix_fmt yuv420p -movflags +faststart ".\robo-video-smooth.mp4"
```

### Multi-line Version (PowerShell)

```powershell
ffmpeg -i ".\robo-video.mp4" `
  -vcodec libx264 `
  -crf 20 `
  -g 5 `
  -keyint_min 5 `
  -sc_threshold 0 `
  -pix_fmt yuv420p `
  -movflags +faststart `
  ".\robo-video-smooth.mp4"
```

### Bash/Linux/Mac Command

```bash
ffmpeg -i ./robo-video.mp4 \
  -vcodec libx264 \
  -crf 20 \
  -g 5 \
  -keyint_min 5 \
  -sc_threshold 0 \
  -pix_fmt yuv420p \
  -movflags +faststart \
  robo-video-smooth.mp4
```

---

## Parameter Explanations

| Parameter         | Value        | Purpose                                               |
| ----------------- | ------------ | ----------------------------------------------------- |
| `-i`              | `input.mp4`  | Input video file                                      |
| `-vcodec libx264` | H.264 codec  | Standard web video codec                              |
| `-crf`            | `20`         | Quality (18-23 recommended, lower = better)           |
| `-g`              | `5`          | **Keyframe every 5 frames** (CRITICAL for smoothness) |
| `-keyint_min`     | `5`          | Minimum keyframe interval                             |
| `-sc_threshold`   | `0`          | Disable scene change detection (constant keyframes)   |
| `-pix_fmt`        | `yuv420p`    | Pixel format for browser compatibility                |
| `-movflags`       | `+faststart` | Optimize for web streaming                            |

---

## Different Quality/Size Options

### Ultra Smooth (Every 3 frames, largest file)

```powershell
ffmpeg -i ".\input.mp4" -vcodec libx264 -crf 18 -g 3 -keyint_min 3 -sc_threshold 0 -pix_fmt yuv420p -movflags +faststart ".\output-ultra.mp4"
```

### Balanced (Every 5 frames, recommended)

```powershell
ffmpeg -i ".\input.mp4" -vcodec libx264 -crf 20 -g 5 -keyint_min 5 -sc_threshold 0 -pix_fmt yuv420p -movflags +faststart ".\output-balanced.mp4"
```

### Moderate (Every 10 frames, smaller file)

```powershell
ffmpeg -i ".\input.mp4" -vcodec libx264 -crf 22 -g 10 -keyint_min 10 -sc_threshold 0 -pix_fmt yuv420p -movflags +faststart ".\output-moderate.mp4"
```

---

## Installing FFmpeg

### Windows - winget (Easiest)

```powershell
winget install ffmpeg
```

### Windows - Chocolatey

```powershell
choco install ffmpeg
```

### Windows - Manual

1. Download from: https://www.gyan.dev/ffmpeg/builds/
2. Download **ffmpeg-release-essentials.zip**
3. Extract to `C:\ffmpeg`
4. Add to PATH:
   ```powershell
   $env:Path += ";C:\ffmpeg\bin"
   [Environment]::SetEnvironmentVariable("Path", $env:Path, [System.EnvironmentVariableTarget]::User)
   ```
5. Restart PowerShell

### Mac - Homebrew

```bash
brew install ffmpeg
```

### Linux - apt

```bash
sudo apt update
sudo apt install ffmpeg
```

---

## Working React Component

```jsx
"use client";

import { useEffect, useRef, useState } from "react";

const Video = ({ src, scrollHeight }) => {
  const [duration, setDuration] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [canPlayThrough, setCanPlayThrough] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    videoRef.current.load();
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [duration]);

  const getCurrentTime = () => {
    const percentScrolled =
      window.scrollY / (scrollHeight - window.innerHeight);
    return duration * percentScrolled;
  };

  const handleScroll = () => {
    const time = getCurrentTime();
    setCurrentTime(time);

    if (time < duration) {
      videoRef.current.currentTime = time;
    }
  };

  return (
    <div style={{ height: scrollHeight, position: "relative" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "black",
        }}
      >
        {getCurrentTime() < duration && (
          <small
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              color: "white",
              zIndex: 10,
            }}
          >
            Time: {currentTime.toFixed(2)}s
          </small>
        )}

        <video
          onLoadedMetadata={(e) => setDuration(e.target.duration)}
          onLoadedData={() => videoRef.current.pause()}
          onCanPlayThrough={() => setCanPlayThrough(true)}
          ref={videoRef}
          preload="metadata"
          muted
          playsInline
          style={{
            maxWidth: "90%",
            maxHeight: "90%",
          }}
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {!canPlayThrough && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "black",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h1 style={{ color: "white" }}>Loading...</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default Video;
```

---

## Key Takeaways

✅ **For 30fps video**: Use `-g 5` for 6 keyframes per second  
✅ **For 60fps video**: Use `-g 10` for 6 keyframes per second  
✅ **File size increase**: Expect 3-5x larger files  
✅ **Worth it**: For scroll-controlled videos, smooth scrubbing is essential  
✅ **Test**: Always test the output video in your application

---

## Resources

- FFmpeg Documentation: https://ffmpeg.org/documentation.html
- FFmpeg Download: https://www.gyan.dev/ffmpeg/builds/
- Understanding Keyframes: https://en.wikipedia.org/wiki/Key_frame

---

**Result**: Butter smooth scroll-controlled video playback! 🚀
