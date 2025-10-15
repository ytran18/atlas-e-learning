# API Implementation Guide

## 📋 Tổng quan

API đã được implement đầy đủ theo document `api.document.md` với cấu trúc clean, type-safe và dễ bảo trì. Hệ thống hỗ trợ hai loại khóa học:

- **ATLD** (An Toàn Lao Động): `/api/v1/atld/*`
- **Học Nghề**: `/api/v1/hoc-nghe/*`

## 🗂️ Cấu trúc thư mục

```
src/
├── types/
│   └── api.ts                    # Tất cả types cho API (request/response)
├── services/
│   ├── firestore.service.ts     # Firestore operations
│   ├── storage.service.ts       # Cloudflare R2 upload
│   └── api.client.ts            # Client-side API utilities
├── utils/
│   └── api.utils.ts             # API helpers (auth, validation, response)
└── app/api/v1/
    ├── atld/                     # ATLD endpoints
    │   ├── lists/
    │   ├── preview/[groupId]/
    │   ├── start/
    │   ├── progress/[groupId]/
    │   └── upload-learning-capture/
    ├── hoc-nghe/                 # Học Nghề endpoints (same structure)
    │   └── ...
    └── admin/
        ├── atld/                 # Admin ATLD endpoints
        │   ├── create/
        │   ├── stats/
        │   ├── detail/[groupId]/
        │   └── [groupId]/        # Update/Delete
        └── hoc-nghe/             # Admin Học Nghề endpoints
            └── ...
```

## 🎯 API Endpoints

### User Endpoints

#### 1. **GET** `/api/v1/atld/lists`

Lấy danh sách khóa học ATLD

**Response:**

```typescript
{
  success: true,
  data: [
    {
      id: string,
      title: string,
      description: string,
      numberOfTheory: number,
      numberOfPractice: number,
      totalQuestionOfExam: number
    }
  ]
}
```

#### 2. **GET** `/api/v1/atld/preview/:groupId`

Xem chi tiết khóa học trước khi bắt đầu

**Response:**

```typescript
{
  success: true,
  data: {
    id: string,
    title: string,
    description: string,
    theory: {
      title: string,
      description: string,
      videos: Video[]
    },
    practice: {
      title: string,
      description: string,
      videos: Video[]
    },
    totalQuestionOfExam: number
  }
}
```

#### 3. **POST** `/api/v1/atld/start`

Bắt đầu học khóa học

**Request Body:**

```typescript
{
  groupId: string,
  portraitUrl: string
}
```

**Response:**

```typescript
{
  success: true,
  data: {
    groupId: string,
    currentSection: "theory" | "practice" | "exam",
    currentVideoIndex: number,
    currentTime: number,
    startedAt: number,
    isCompleted: boolean
  }
}
```

#### 4. **GET** `/api/v1/atld/progress/:groupId`

Lấy tiến trình học

**Response:**

```typescript
{
  success: true,
  data: {
    groupId: string,
    currentSection: string,
    currentVideoIndex: number,
    currentTime: number,
    completedVideos: CompletedVideo[],
    isCompleted: boolean,
    startedAt: number,
    lastUpdatedAt: number
  }
}
```

#### 5. **PATCH** `/api/v1/atld/progress/:groupId`

Cập nhật tiến trình học

**Request Body:**

```typescript
{
  section: "theory" | "practice" | "exam",
  videoIndex: number,
  currentTime: number,
  isCompleted?: boolean,
  completedVideo?: {
    section: string,
    index: number
  }
}
```

#### 6. **POST** `/api/v1/atld/upload-learning-capture`

Upload ảnh chụp trong quá trình học

**Form Data:**

- `file`: File (image)
- `groupId`: string
- `type`: "start" | "learning" | "finish"

**Response:**

```typescript
{
  success: true,
  data: {
    imageUrl: string,
    savedTo: string
  }
}
```

### Admin Endpoints

#### 7. **GET** `/api/v1/admin/atld/stats`

Lấy thống kê học viên (phân trang)

**Query Params:**

- `groupId`: string (required)
- `pageSize`: number (optional, default: 20)
- `cursor`: string (optional)

**Response:**

```typescript
{
  success: true,
  data: {
    data: StudentStats[],
    nextCursor?: string,
    hasMore: boolean
  }
}
```

#### 8. **POST** `/api/v1/admin/atld/create`

Tạo khóa học mới

**Request Body:**

```typescript
{
  title: string,
  type: "atld" | "hoc-nghe",
  description: string,
  theory: TheorySection,
  practice: PracticeSection,
  exam: ExamSection
}
```

#### 9. **PATCH** `/api/v1/admin/atld/:groupId`

Cập nhật khóa học

#### 10. **DELETE** `/api/v1/admin/atld/:groupId`

Xóa khóa học

#### 11. **GET** `/api/v1/admin/atld/detail/:groupId`

Lấy chi tiết đầy đủ khóa học

## 💻 Sử dụng trong Frontend

### Import types và client

```typescript
import { getCourseList, startCourse, updateCourseProgress } from "@/services/api.client";
import type { CourseListItem, StartCourseRequest } from "@/types/api";
```

### Ví dụ: Lấy danh sách khóa học

```typescript
async function loadCourses() {
    try {
        const courses = await getCourseList("atld");
        console.log(courses);
    } catch (error) {
        console.error("Failed to load courses:", error);
    }
}
```

### Ví dụ: Bắt đầu khóa học

```typescript
async function handleStartCourse(groupId: string, portraitUrl: string) {
    try {
        const progress = await startCourse("atld", {
            groupId,
            portraitUrl,
        });
        console.log("Course started:", progress);
    } catch (error) {
        console.error("Failed to start course:", error);
    }
}
```

### Ví dụ: Cập nhật tiến trình

```typescript
async function saveProgress(groupId: string, videoIndex: number, currentTime: number) {
    try {
        const result = await updateCourseProgress("atld", groupId, {
            section: "theory",
            videoIndex,
            currentTime,
            isCompleted: false,
        });
        console.log("Progress saved at:", result.lastUpdatedAt);
    } catch (error) {
        console.error("Failed to save progress:", error);
    }
}
```

### Ví dụ: Upload ảnh capture

```typescript
async function uploadCapture(file: File, groupId: string) {
    try {
        const result = await uploadLearningCapture("atld", file, groupId, "learning");
        console.log("Image uploaded:", result.imageUrl);
    } catch (error) {
        console.error("Failed to upload image:", error);
    }
}
```

## 🔐 Authentication

Tất cả API đều yêu cầu authentication thông qua Clerk. API tự động lấy userId từ session.

**Admin endpoints** có TODO comment để thêm admin role check:

```typescript
// TODO: Add admin role check here
await requireAuth();
```

## 🗄️ Database Structure

### Firestore Collections

```
groups/
  {groupId}/
    - title: string
    - type: "atld" | "hoc-nghe"
    - description: string
    - theory: { title, description, videos[] }
    - practice: { title, description, videos[] }
    - exam: { title, description, timeLimit, questions[] }
    - isActive: boolean
    - createdAt: timestamp
    - updatedAt: timestamp

users/
  {userId}/
    - fullname: string
    - companyName: string
    - ...

    progress/
      {groupId}/
        - groupId: string
        - currentSection: "theory" | "practice" | "exam"
        - currentVideoIndex: number
        - currentTime: number
        - completedVideos: []
        - isCompleted: boolean
        - startedAt: timestamp
        - lastUpdatedAt: timestamp
        - startImageUrl: string
        - finishImageUrl: string
        - learningCaptureUrls: string[]
```

## 📦 Storage Structure (Cloudflare R2)

```
users/{userId}/learning/{groupId}/
  - start_1234567890_abc123.jpg
  - learning_1234567891_def456.jpg
  - finish_1234567892_ghi789.jpg
```

## ⚙️ Environment Variables

Cần thiết lập các environment variables sau:

```env
# Firebase Admin
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY=your-private-key

# Cloudflare R2
CLOUDFLARE_R2_ENDPOINT=https://...
CLOUDFLARE_R2_ACCESS_KEY_ID=...
CLOUDFLARE_R2_SECRET_ACCESS_KEY=...
CLOUDFLARE_R2_BUCKET_NAME=...
CLOUDFLARE_R2_PUBLIC_URL=https://...

# API (optional for client)
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 🧪 Testing

Để test các endpoint:

1. **Local development:**

```bash
npm run dev
```

2. **Test với curl:**

```bash
# Get course list
curl http://localhost:3000/api/v1/atld/lists

# Get course preview
curl http://localhost:3000/api/v1/atld/preview/{groupId}

# Start course (requires auth)
curl -X POST http://localhost:3000/api/v1/atld/start \
  -H "Content-Type: application/json" \
  -d '{"groupId":"xxx","portraitUrl":"https://..."}'
```

3. **Test với Postman/Thunder Client:**
   Import các endpoint từ document này.

## 🎨 Code Style & Best Practices

### ✅ Clean Code

- Mỗi API route có comment rõ ràng
- Types được export từ `@/types/api`
- Services tách riêng, dễ test
- Error handling thống nhất

### ✅ Type Safety

- Request/Response types đầy đủ
- Client-side có types cho mọi API call
- Firestore data có type guards

### ✅ Separation of Concerns

- **Routes**: Handle HTTP request/response
- **Services**: Business logic & database operations
- **Utils**: Helper functions
- **Types**: Type definitions

### ✅ Reusability

- `firestore.service.ts`: Tái sử dụng cho cả ATLD và Học Nghề
- `api.client.ts`: Client-side utilities
- `api.utils.ts`: Shared helpers

## 🚀 Next Steps

1. **Add admin role check** trong admin endpoints
2. **Add rate limiting** cho API
3. **Add request validation** với Zod
4. **Add API logging** với Mixpanel hoặc similar
5. **Add caching** cho course lists
6. **Add WebSocket** cho real-time progress updates (optional)

## 📝 Notes

- Tất cả API đều trả về format thống nhất: `{ success: true/false, data/error }`
- Pagination sử dụng cursor-based (Firestore best practice)
- Image upload sử dụng FormData (không phải JSON)
- Timestamps đều sử dụng Unix timestamp (milliseconds)

## 🐛 Troubleshooting

### Firebase Admin SDK not initialized

- Check environment variables
- Verify service account credentials

### Clerk authentication failed

- Check middleware configuration
- Verify user is logged in

### Cloudflare R2 upload failed

- Check R2 credentials
- Verify bucket permissions
- Check CORS configuration

---

**Tác giả:** AI Assistant  
**Ngày tạo:** October 15, 2025  
**Version:** 1.0.0
