# Video Upload & Progressive Streaming Guide

## 🎯 Overview

This project uses **Progressive Video Streaming** with HTTP Range Requests to provide a smooth video playback experience without needing HLS conversion.

## ✨ Key Features

- ✅ **Progressive Loading**: Video starts playing immediately, loads as you watch
- ✅ **HTTP Range Requests**: Browser requests only the video chunks needed
- ✅ **Cost-Effective**: No conversion costs, only R2 storage fees
- ✅ **Serverless-Friendly**: Works on Vercel, Netlify, AWS Lambda, etc.
- ✅ **No External Dependencies**: No FFmpeg or Cloudflare Stream needed
- ✅ **Multi-Format Support**: MP4, WebM, OGG, etc.

## 🔧 How It Works

```
User selects video file
       ↓
Upload to /api/upload/hls
       ↓
Upload original video to Cloudflare R2
       ↓
Return public URL
       ↓
Browser plays with Range Requests
       ↓
Loads video in chunks (progressive streaming)
```

### HTTP Range Requests Explained

When you play a video:

1. **Initial Request**: Browser requests first 1-2MB

    ```
    GET /video.mp4
    Range: bytes=0-1048576
    ```

2. **Server Response**: R2 returns requested chunk

    ```
    206 Partial Content
    Content-Range: bytes 0-1048576/50000000
    Accept-Ranges: bytes
    ```

3. **Subsequent Requests**: Browser automatically requests more chunks as needed

    ```
    Range: bytes=1048577-2097152
    Range: bytes=2097153-3145728
    ...
    ```

4. **Seeking**: When user skips ahead, browser requests that specific range
    ```
    Range: bytes=25000000-26048576
    ```

## 📋 Setup Requirements

### 1. Cloudflare R2 Configuration

Your R2 bucket must:

- Have a public URL configured
- Have CORS enabled for Range Requests

### 2. CORS Setup

Run this command to apply CORS configuration:

```bash
wrangler r2 bucket cors put YOUR_BUCKET_NAME --file=cors-config.json
```

See [R2_CORS_SETUP.md](./R2_CORS_SETUP.md) for detailed instructions.

### 3. Environment Variables

```bash
# .env.local
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_BUCKET_NAME=your_bucket_name
R2_PUBLIC_URL=https://your-public-url.r2.dev
```

## 💻 Usage

### Upload Video

```typescript
import { HlsVideoUploader } from "@/features/videoUpload";

<HlsVideoUploader
    onUploadSuccess={(fileKey, publicUrl) => {
        console.log("Video uploaded:", publicUrl);
    }}
    onUploadError={(error) => {
        console.error("Upload failed:", error);
    }}
    contentType="videos"
    maxSize={500}
    accept="video/mp4,video/webm,video/ogg"
    autoUpload={true}
/>
```

### Play Video with Progressive Loading

```typescript
import { ProgressiveVideoPlayer } from "@/features/videoUpload";

<ProgressiveVideoPlayer
    src="https://your-r2-url.r2.dev/video.mp4"
    controls
    onLoadProgress={(percent) => {
        console.log(`Buffered: ${percent}%`);
    }}
/>
```

## 🎬 Video Format Recommendations

### Best Practices

1. **MP4 with H.264/AAC** (Most compatible)
    - Video Codec: H.264
    - Audio Codec: AAC
    - Container: MP4

2. **WebM with VP9/Opus** (Modern browsers)
    - Video Codec: VP9
    - Audio Codec: Opus
    - Container: WebM

### Optimize Video for Streaming

For best progressive streaming performance, ensure your MP4 files have **"fast start"** (moov atom at beginning):

```bash
# Using FFmpeg (if you want to pre-optimize)
ffmpeg -i input.mp4 -movflags faststart -c copy output.mp4
```

This moves metadata to the beginning of the file so playback can start immediately.

## 📊 Performance Characteristics

### Upload

| File Size | Upload Time (100 Mbps) | Storage Cost (R2) |
| --------- | ---------------------- | ----------------- |
| 10 MB     | ~1 second              | $0.0002/month     |
| 100 MB    | ~10 seconds            | $0.002/month      |
| 1 GB      | ~80 seconds            | $0.015/month      |

### Streaming

| Action         | Network Request | Data Transfer         |
| -------------- | --------------- | --------------------- |
| Start playback | 1-2 MB          | Only initial chunk    |
| 10 min watch   | 5-10 requests   | Only watched portions |
| Skip to middle | 1 request       | Only that portion     |

### Cost Comparison

**Progressive Streaming (Current Solution):**

- Storage: $0.015/GB/month
- Transfer: FREE (R2 has no egress fees)
- Total: **~$0.015/GB/month**

**Cloudflare Stream:**

- Storage: $5/1000 minutes
- Delivery: $1/1000 minutes delivered
- Total: **$6/1000 min (variable)**

**Example**: 100 videos × 10 min each = 1000 minutes

- Progressive: ~$0.15/month (storage only)
- Cloudflare Stream: ~$6/month

## 🔍 Debugging

### Check if Range Requests Work

```bash
curl -I "https://your-r2-url.r2.dev/video.mp4" \
  -H "Range: bytes=0-1000"
```

Expected response:

```
HTTP/2 206
accept-ranges: bytes
content-range: bytes 0-1000/50000000
content-length: 1001
```

### Browser DevTools

1. Open DevTools → Network tab
2. Play video
3. Look for requests with:
    - Request header: `Range: bytes=...`
    - Response status: `206 Partial Content`
    - Response header: `Content-Range: bytes ...`

### Common Issues

**Video loads slowly:**

- Check if video has fast start metadata
- Verify CORS headers are exposed
- Check network speed

**Video downloads entire file:**

- CORS not configured properly
- `Accept-Ranges` header not exposed
- Video file doesn't have fast start

**CORS errors:**

- Check `AllowedOrigins` includes your domain
- Verify CORS configuration applied to R2 bucket
- See [R2_CORS_SETUP.md](./R2_CORS_SETUP.md)

## 🚀 Deployment

### Vercel

1. Set environment variables in Vercel dashboard
2. Deploy normally - no special configuration needed

### Other Platforms

Progressive streaming works on any platform that supports:

- Next.js API routes
- AWS S3-compatible client libraries

Tested on:

- ✅ Vercel
- ✅ Netlify
- ✅ AWS Lambda
- ✅ Docker
- ✅ VPS

## 📚 Additional Resources

- [HTTP Range Requests (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Range_requests)
- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [Video Optimization Guide](https://web.dev/fast-playback-with-preload/)

## 🎯 Future Enhancements

Potential improvements:

1. **Thumbnail Generation**: Generate video thumbnails on upload
2. **Multiple Qualities**: Upload multiple quality versions
3. **Analytics**: Track watch time, completion rate
4. **CDN Caching**: Add CloudFront/Cloudflare Workers cache
5. **Subtitle Support**: WebVTT subtitles upload and display
