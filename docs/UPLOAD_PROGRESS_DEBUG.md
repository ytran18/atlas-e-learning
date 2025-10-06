# Upload Progress Debugging Guide

## 🐛 Issue: Progress Always Shows 100%

### Root Causes

1. **Browser DevTools Throttling**: Disable network throttling
2. **File Too Small**: Small files upload instantly
3. **Missing Content-Length**: Server not sending total size
4. **Axios Configuration**: Progress callback not configured properly

### ✅ Fixes Applied

#### 1. Enhanced Progress Tracking (`axiosClient.ts`)

```typescript
onUploadProgress: (progressEvent) => {
    const total = progressEvent.total || 0;
    const loaded = progressEvent.loaded || 0;
    const progress = total > 0 ? (loaded / total) * 100 : 0;

    console.log("Upload progress:", {
        loaded,
        total,
        progress: `${Math.round(progress)}%`,
    });

    onUploadProgress({ loaded, total, progress });
};
```

**Changes:**

- ✅ Handle undefined `total` value
- ✅ Calculate progress safely (avoid NaN)
- ✅ Add console logging for debugging

#### 2. Simplified Hook Usage (`useVideoUpload.tsx`)

```typescript
const response = await uploadFile("/api/upload/video", formData, (progressEvent) => {
    const percentComplete = Math.round(progressEvent.progress);

    console.log("Video upload progress:", {
        loaded: progressEvent.loaded,
        total: progressEvent.total,
        percent: `${percentComplete}%`,
    });

    setUploadProgress({
        progress: percentComplete,
        status: "uploading",
    });
});
```

**Changes:**

- ✅ Use pre-calculated `progress` value
- ✅ Add detailed logging
- ✅ Safer percentage calculation

#### 3. Next.js Configuration

```typescript
// next.config.ts
experimental: {
    serverActions: {
        bodySizeLimit: "500mb"
    }
},
api: {
    bodyParser: {
        sizeLimit: "500mb"
    }
}
```

#### 4. API Route Configuration

```typescript
// route.ts
export const runtime = "nodejs";
export const maxDuration = 300; // 5 minutes
```

## 🧪 How to Test Progress

### 1. Use Network Throttling

**Chrome DevTools:**

1. Open DevTools (F12)
2. Go to Network tab
3. Click "No throttling" dropdown
4. Select "Slow 3G" or "Fast 3G"
5. Upload video and watch progress

### 2. Upload Large File

- Small files (< 5MB) upload too fast to see progress
- Test with files > 50MB to see gradual progress

### 3. Check Console Logs

You should see logs like:

```
Upload progress: { loaded: 1048576, total: 52428800, progress: '2%' }
Video upload progress: { loaded: 1048576, total: 52428800, percent: '2%' }
Upload progress: { loaded: 5242880, total: 52428800, progress: '10%' }
Video upload progress: { loaded: 5242880, total: 52428800, percent: '10%' }
...
```

### 4. Visual Progress Bar

Watch the progress bar in the UI:

- Should start at 0%
- Gradually increase (5%, 10%, 20%, ...)
- Reach 100% when complete

## 🔍 Debug Checklist

If progress still shows 100% immediately:

- [ ] Check DevTools Console for "Upload progress" logs
- [ ] Verify `total` value is not 0 or undefined
- [ ] Test with network throttling enabled
- [ ] Use file > 50MB for testing
- [ ] Check browser console for errors
- [ ] Verify axios version (should be latest)
- [ ] Clear browser cache and reload

## 📊 Expected Behavior

### Small File (< 5MB)

```
Upload progress: { loaded: 2048576, total: 2048576, progress: '100%' }
```

**Result:** Progress may appear instant (this is normal)

### Large File (> 50MB)

```
Upload progress: { loaded: 1048576, total: 52428800, progress: '2%' }
Upload progress: { loaded: 5242880, total: 52428800, progress: '10%' }
Upload progress: { loaded: 10485760, total: 52428800, progress: '20%' }
Upload progress: { loaded: 26214400, total: 52428800, progress: '50%' }
Upload progress: { loaded: 52428800, total: 52428800, progress: '100%' }
```

**Result:** Should see gradual progress updates

## 🛠️ Temporary Debugging Code

Add this to `videoUploader.tsx` for detailed debugging:

```typescript
const handleFileSelect = async (file: File) => {
    console.log("File selected:", {
        name: file.name,
        size: file.size,
        type: file.type,
        sizeInMB: (file.size / 1024 / 1024).toFixed(2) + " MB",
    });

    setSelectedFile(file);
    setUploadedUrl(undefined);
    resetUpload();

    if (autoUpload) {
        await handleUpload(file);
    }
};
```

## 🎯 Production Cleanup

After confirming progress works:

1. **Remove console.log statements** from:
    - `src/libs/axios/axiosClient.ts` (line 93-97)
    - `src/hooks/useVideoUpload.tsx` (line 58-62)

2. **Or keep them with environment check**:

```typescript
if (process.env.NODE_ENV === 'development') {
    console.log("Upload progress:", ...);
}
```

## 📚 Related Files

- `src/libs/axios/axiosClient.ts` - Axios configuration
- `src/hooks/useVideoUpload.tsx` - Upload hook with progress
- `src/features/videoUpload/_components/videoUploadProgress.tsx` - Progress UI
- `next.config.ts` - Body size limits
- `src/app/api/upload/video/route.ts` - Upload API endpoint
