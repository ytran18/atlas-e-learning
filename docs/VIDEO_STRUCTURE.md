# Video Upload Architecture

## 📁 File Structure

```
src/
├── app/api/upload/
│   └── video/
│       └── route.ts          # Main upload endpoint
│
├── hooks/
│   └── useVideoUpload.tsx    # Upload logic with progress tracking
│
└── features/videoUpload/
    ├── _components/
    │   ├── progressiveVideoPlayer.tsx   # HTML5 video player
    │   ├── videoUploadButton.tsx        # File selection button
    │   └── videoUploadProgress.tsx      # Progress bar
    │
    ├── _widgets/
    │   └── videoUploader.tsx            # Main uploader component
    │
    └── index.tsx                         # Public exports
```

## 🔄 Upload Flow

```
User selects video file
       ↓
useVideoUpload hook
       ↓
POST /api/upload/video (with FormData)
       ↓
Validate file (type, size)
       ↓
Generate unique file key: {contentType}/{date}/{uploadId}.{ext}
       ↓
Upload to Cloudflare R2
       ↓
Return public URL
       ↓
ProgressiveVideoPlayer displays video
```

## 📦 Components Usage

### Simple Upload

```tsx
import { VideoUploader } from "@/features/videoUpload";

<VideoUploader
    onUploadSuccess={(fileKey, publicUrl) => {
        console.log("Uploaded:", publicUrl);
    }}
    contentType="videos"
    maxSize={500}
    autoUpload={true}
/>;
```

### Custom Player

```tsx
import { ProgressiveVideoPlayer } from "@/features/videoUpload";

<ProgressiveVideoPlayer
    src="https://your-r2-url.r2.dev/video.mp4"
    controls
    autoPlay={false}
    onLoadProgress={(percent) => console.log(`Buffered: ${percent}%`)}
/>;
```

### Manual Upload

```tsx
import { useVideoUpload } from "@/hooks";

const { uploadProgress, uploadVideo } = useVideoUpload();

const handleUpload = async (file: File) => {
    const result = await uploadVideo(file, "my-videos");
    if (result.success) {
        console.log("URL:", result.publicUrl);
    }
};
```

## 🔧 API Endpoint

### POST /api/upload/video

**Request:**

- Method: `POST`
- Content-Type: `multipart/form-data`
- Body:
    - `file`: Video file
    - `contentType`: Folder name (optional, default: "video")

**Response:**

```json
{
    "success": true,
    "fileKey": "demo-videos/2025-01-06/abc123xyz.mp4",
    "publicUrl": "https://your-bucket.r2.dev/demo-videos/2025-01-06/abc123xyz.mp4",
    "uploadId": "abc123xyz",
    "fileName": "my-video.mp4",
    "fileSize": 50000000,
    "contentType": "video/mp4"
}
```

## 🎯 Key Features

✅ **Progressive Streaming**: Video plays while downloading
✅ **HTTP Range Requests**: Load video in chunks
✅ **No Conversion**: Upload original MP4, no FFmpeg needed
✅ **Progress Tracking**: Real-time upload progress
✅ **Multi-format**: MP4, WebM, OGG support
✅ **Large Files**: Multipart upload for files > 5MB
✅ **Serverless-Ready**: Works on Vercel, Netlify, etc.

## 📝 Configuration

### Environment Variables

```bash
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=your_bucket
R2_PUBLIC_URL=https://your-bucket.r2.dev
```

### CORS Setup

Required for Range Requests:

```bash
wrangler r2 bucket cors put YOUR_BUCKET --file=cors-config.json
```

See [R2_CORS_SETUP.md](./R2_CORS_SETUP.md) for details.

## 🐛 Troubleshooting

### Video not playing progressively

- Check CORS configuration
- Verify `Accept-Ranges` header is exposed
- Ensure R2_PUBLIC_URL is configured

### Upload fails

- Check file size (max 500MB by default)
- Verify R2 credentials in `.env.local`
- Check file type (must be `video/*`)

### Metadata errors

- Don't add custom Metadata with special characters
- Metadata has been removed to avoid encoding issues

## 📚 Related Documentation

- [VIDEO_UPLOAD_GUIDE.md](./VIDEO_UPLOAD_GUIDE.md) - Complete guide
- [R2_CORS_SETUP.md](./R2_CORS_SETUP.md) - CORS configuration
- [README.md](../README.md) - Project overview
