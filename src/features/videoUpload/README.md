# Video Upload to Cloudflare R2

Luồng upload video lên Cloudflare R2 sử dụng presigned URLs theo kiến trúc Composition/Presentation Components.

## 📁 Cấu trúc

```
src/features/videoUpload/
├── _components/          # Presentation Components (dumb, stateless)
│   ├── videoUploadButton.tsx
│   ├── videoUploadProgress.tsx
│   └── videoPreview.tsx
├── _widgets/            # Composition Components (smart, stateful)
│   └── videoUploader.tsx
└── index.tsx            # Public exports
```

## 🚀 Cách sử dụng

### 1. Auto Upload (Default)

Video tự động upload ngay khi chọn file:

```tsx
import { VideoUploader } from "@/features/videoUpload";

export default function MyPage() {
    const handleSuccess = (fileKey: string, publicUrl?: string) => {
        console.log("Upload success!", { fileKey, publicUrl });
        // TODO: Lưu vào database
    };

    const handleError = (error: string) => {
        console.error("Upload failed:", error);
    };

    return <VideoUploader onUploadSuccess={handleSuccess} onUploadError={handleError} />;
}
```

### 2. Manual Upload

User chọn file trước, sau đó bấm nút Upload:

```tsx
<VideoUploader onUploadSuccess={handleSuccess} onUploadError={handleError} autoUpload={false} />
```

### 3. Custom Configuration

```tsx
<VideoUploader
    onUploadSuccess={handleSuccess}
    onUploadError={handleError}
    maxSize={100} // Giới hạn 100MB
    accept="video/mp4,video/webm" // Chỉ accept mp4 và webm
    contentType="lesson-video" // Folder name trong R2
/>
```

## 🔧 Props của VideoUploader

| Prop              | Type                                            | Default     | Description                    |
| ----------------- | ----------------------------------------------- | ----------- | ------------------------------ |
| `onUploadSuccess` | `(fileKey: string, publicUrl?: string) => void` | -           | Callback khi upload thành công |
| `onUploadError`   | `(error: string) => void`                       | -           | Callback khi upload thất bại   |
| `contentType`     | `string`                                        | `"video"`   | Tên folder trong R2 bucket     |
| `maxSize`         | `number`                                        | `500`       | Giới hạn size file (MB)        |
| `accept`          | `string`                                        | `"video/*"` | File types được accept         |
| `autoUpload`      | `boolean`                                       | `true`      | Tự động upload khi chọn file   |

## 🎯 Custom Hook

Nếu bạn muốn tự custom UI, có thể dùng hook `useVideoUpload`:

```tsx
import { useVideoUpload } from "@/hooks";

export function MyCustomUploader() {
    const { uploadProgress, uploadVideo, resetUpload } = useVideoUpload();

    const handleUpload = async (file: File) => {
        const result = await uploadVideo(file, "my-content");

        if (result.success) {
            console.log("Success:", result.publicUrl);
        } else {
            console.error("Error:", result.error);
        }
    };

    return (
        <div>
            <input
                type="file"
                accept="video/*"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(file);
                }}
            />

            {uploadProgress.status === "uploading" && (
                <div>Uploading... {uploadProgress.progress}%</div>
            )}
        </div>
    );
}
```

## 📡 API Endpoints

### POST `/api/upload/direct` (Recommended - No CORS Issues)

Upload file directly qua server, không có CORS issues.

Request (FormData):

```
file: File
contentType: string (optional, default: "video")
```

Response (success):

```json
{
    "success": true,
    "fileKey": "video/2024-01-15/abc123.mp4",
    "publicUrl": "https://pub-xxx.r2.dev/video/2024-01-15/abc123.mp4"
}
```

Response (error):

```json
{
    "success": false,
    "error": "File too large. Maximum size is 500MB"
}
```

**Features:**

- ✅ Không có CORS issues
- ✅ Hỗ trợ multipart upload cho file > 5MB
- ✅ Progress tracking real-time
- ✅ Server-side validation

---

### POST `/api/upload/presigned-url` (Alternative - Requires CORS Config)

Request body:

```json
{
    "fileName": "video.mp4",
    "fileType": "video/mp4",
    "fileSize": 52428800,
    "contentType": "lesson-video"
}
```

Response (success):

```json
{
    "success": true,
    "presignedUrl": "https://...",
    "fileKey": "video/2024-01-15/abc123.mp4",
    "publicUrl": "https://pub-xxx.r2.dev/video/2024-01-15/abc123.mp4",
    "expiresAt": 1705324800000
}
```

Response (error):

```json
{
    "success": false,
    "error": "File too large. Maximum size is 500MB"
}
```

## 🔐 Environment Variables

Đã setup sẵn trong `.env`:

```bash
NEXT_PUBLIC_R2_ACCOUNT_ID=xxx
NEXT_PUBLIC_R2_ACCESS_KEY_ID=xxx
NEXT_PUBLIC_R2_SECRET_ACCESS_KEY=xxx
NEXT_PUBLIC_R2_BUCKET_NAME=atld
NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-xxx.r2.dev
```

## 📝 File Organization trong R2

Files được organize theo cấu trúc:

```
bucket/
└── {contentType}/
    └── {YYYY-MM-DD}/
        └── {uniqueId}.{extension}

Ví dụ:
- video/2024-01-15/abc123.mp4
- lesson-video/2024-01-15/def456.webm
```

## ⚡ Features

- ✅ Upload video lên Cloudflare R2 qua presigned URLs
- ✅ Progress tracking real-time
- ✅ File validation (size, type)
- ✅ Video preview trước và sau khi upload
- ✅ Auto upload hoặc manual upload
- ✅ Error handling
- ✅ Theo đúng architecture (Composition/Presentation)
- ✅ Type-safe với TypeScript

## 🎨 Styling

Components hiện tại chưa có styling. Bạn có thể:

1. Thêm CSS/Tailwind classes vào các components
2. Hoặc wrap components trong custom styled wrappers
3. Hoặc sử dụng CSS modules

## 📚 Example Page

Xem ví dụ đầy đủ tại: `/src/app/example-upload/page.tsx`

Hoặc chạy:

```bash
npm run dev
```

Mở: `http://localhost:3000/example-upload`

## 🛠️ CORS Issues & Solutions

### Problem: CORS Error khi upload

Nếu bạn gặp lỗi:

```
Access to XMLHttpRequest has been blocked by CORS policy
```

### Solution 1: Server-Side Upload (✅ Default - Already Implemented)

App đã dùng server-side upload route (`/api/upload/direct`) nên **không có CORS issues**. File sẽ:

1. Upload từ browser → Next.js API route
2. Next.js API → Cloudflare R2
3. Return public URL về browser

**Ưu điểm:**

- ✅ Không cần config CORS
- ✅ Multipart upload cho file lớn
- ✅ Server-side validation
- ✅ Hoạt động ngay lập tức

**Nhược điểm:**

- ⚠️ File đi qua server (bandwidth)
- ⚠️ Giới hạn bởi serverless timeout

### Solution 2: Config CORS cho R2 (Alternative)

Nếu muốn dùng presigned URLs (upload trực tiếp từ browser → R2):

1. Install Wrangler CLI:

```bash
npm install -g wrangler
```

2. Login:

```bash
wrangler login
```

3. Apply CORS config:

```bash
wrangler r2 bucket cors put atld --file cors-config.json
```

File `cors-config.json` đã có sẵn trong root project.

4. Verify:

```bash
wrangler r2 bucket cors get atld
```

**Ưu điểm:**

- ✅ Upload trực tiếp từ browser → R2
- ✅ Không qua server (tiết kiệm bandwidth)
- ✅ Nhanh hơn với file lớn

**Nhược điểm:**

- ⚠️ Cần config CORS trước
- ⚠️ Phức tạp hơn

## 🔗 References

- [Tài liệu tham khảo](https://www.buildwithmatija.com/blog/how-to-upload-files-to-cloudflare-r2-nextjs)
- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- [AWS SDK for JavaScript](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
