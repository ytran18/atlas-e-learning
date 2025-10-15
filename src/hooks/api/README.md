# React Query Hooks Documentation

Tài liệu hướng dẫn sử dụng React Query hooks cho ATLD E-Learning Platform.

## 📚 Tổng quan

Hệ thống hooks được tổ chức theo hai nhóm chính:

- **User Hooks** (`/user`): Dành cho người học
- **Admin Hooks** (`/admin`): Dành cho quản trị viên

Tất cả hooks sử dụng `@tanstack/react-query` và được config tập trung tại `src/configs/reactQuery.config.ts`.

## 📁 Cấu trúc thư mục

```
src/hooks/api/
├── user/
│   ├── useCourseList.ts         # Lấy danh sách khóa học
│   ├── useCoursePreview.ts      # Xem chi tiết khóa học
│   ├── useStartCourse.ts        # Bắt đầu học
│   ├── useCourseProgress.ts     # Lấy tiến trình học
│   ├── useUpdateProgress.ts     # Cập nhật tiến trình
│   ├── useUploadCapture.ts      # Upload ảnh chụp
│   └── index.ts
├── admin/
│   ├── useStudentStats.ts       # Thống kê học viên
│   ├── useCreateCourse.ts       # Tạo khóa học mới
│   ├── useUpdateCourse.ts       # Cập nhật khóa học
│   ├── useDeleteCourse.ts       # Xóa khóa học
│   ├── useCourseDetail.ts       # Chi tiết khóa học (admin)
│   └── index.ts
└── index.ts                     # Export tất cả
```

## 🎯 User Hooks

### 1. useCourseList

Lấy danh sách tất cả khóa học.

```tsx
import { useCourseList } from "@/hooks/api";

function CourseListPage() {
    const { data, isLoading, error } = useCourseList("atld");

    if (isLoading) return <Loading />;
    if (error) return <Error message={error.message} />;

    return (
        <div>
            {data?.map((course) => (
                <CourseCard key={course.id} course={course} />
            ))}
        </div>
    );
}
```

**Options:**

```tsx
useCourseList("atld", {
    enabled: false, // Không tự động fetch
    refetchInterval: 5000, // Refetch mỗi 5 giây
    staleTime: 60000, // Cache 1 phút
});
```

---

### 2. useCoursePreview

Xem chi tiết khóa học trước khi bắt đầu học.

```tsx
import { useCoursePreview } from "@/hooks/api";

function CoursePreviewPage({ groupId }: { groupId: string }) {
    const { data, isLoading } = useCoursePreview("atld", groupId);

    if (isLoading) return <Loading />;

    return (
        <div>
            <h1>{data?.title}</h1>
            <p>{data?.description}</p>
            <VideoList videos={data?.theory.videos} />
            <VideoList videos={data?.practice.videos} />
        </div>
    );
}
```

---

### 3. useStartCourse

Bắt đầu học một khóa học.

```tsx
import { useRouter } from "next/navigation";

import { useStartCourse } from "@/hooks/api";

function StartButton({ groupId }: { groupId: string }) {
    const router = useRouter();
    const { mutate, isPending } = useStartCourse("atld", {
        onSuccess: (data) => {
            // Chuyển sang trang học
            router.push(`/atld/${data.groupId}/learn`);
        },
        onError: (error) => {
            alert(`Lỗi: ${error.message}`);
        },
    });

    const handleStart = async () => {
        // Chụp ảnh chân dung
        const portraitUrl = await capturePortrait();

        // Bắt đầu khóa học
        mutate({
            groupId,
            portraitUrl,
        });
    };

    return (
        <button onClick={handleStart} disabled={isPending}>
            {isPending ? "Đang bắt đầu..." : "Bắt đầu học"}
        </button>
    );
}
```

---

### 4. useCourseProgress

Lấy tiến trình học của user.

```tsx
import { useCourseProgress } from "@/hooks/api";

function LearnPage({ groupId }: { groupId: string }) {
    const { data: progress, isLoading } = useCourseProgress("atld", groupId, {
        // Refetch mỗi 30 giây để sync progress
        refetchInterval: 30000,
    });

    if (isLoading) return <Loading />;

    return (
        <div>
            <p>Section: {progress?.currentSection}</p>
            <p>Video: {progress?.currentVideoIndex}</p>
            <p>Time: {progress?.currentTime}s</p>
            <ProgressBar completed={progress?.completedVideos.length || 0} total={totalVideos} />
        </div>
    );
}
```

---

### 5. useUpdateProgress

Cập nhật tiến trình học.

```tsx
import { useUpdateProgress } from "@/hooks/api";

function VideoPlayer({ groupId, section, videoIndex }: Props) {
    const { mutate: updateProgress } = useUpdateProgress("atld");
    const videoRef = useRef<HTMLVideoElement>(null);

    // Auto-save progress mỗi 10 giây
    useEffect(() => {
        const interval = setInterval(() => {
            const currentTime = videoRef.current?.currentTime || 0;

            updateProgress({
                groupId,
                section,
                videoIndex,
                currentTime,
            });
        }, 10000);

        return () => clearInterval(interval);
    }, [groupId, section, videoIndex]);

    // Đánh dấu video đã hoàn thành
    const handleVideoEnd = () => {
        updateProgress({
            groupId,
            section,
            videoIndex,
            currentTime: 0,
            completedVideo: {
                section,
                index: videoIndex,
            },
        });
    };

    return <video ref={videoRef} onEnded={handleVideoEnd} src={videoUrl} />;
}
```

---

### 6. useUploadCapture

Upload ảnh chụp trong quá trình học.

```tsx
import { useUploadCapture } from "@/hooks/api";

function CaptureButton({ groupId, type }: Props) {
    const { mutate: upload, isPending } = useUploadCapture("atld", {
        onSuccess: (data) => {
            console.log("Uploaded:", data.imageUrl);
        },
    });

    const handleCapture = async () => {
        // Chụp ảnh từ webcam
        const imageFile = await captureFromWebcam();

        // Upload
        upload({
            file: imageFile,
            groupId,
            captureType: type, // "start" | "learning" | "finish"
        });
    };

    return (
        <button onClick={handleCapture} disabled={isPending}>
            {isPending ? "Đang upload..." : "Chụp ảnh"}
        </button>
    );
}
```

## 🔐 Admin Hooks

### 1. useStudentStats

Lấy thống kê học viên với infinite scroll.

```tsx
import { useStudentStats } from "@/hooks/api/admin";

function StudentStatsPage({ groupId }: { groupId: string }) {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useStudentStats(
        "atld",
        groupId,
        20
    );

    if (isLoading) return <Loading />;

    // Flatten all pages
    const allStudents = data?.pages.flatMap((page) => page.data) || [];

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Họ tên</th>
                        <th>Công ty</th>
                        <th>Hoàn thành</th>
                        <th>Ngày bắt đầu</th>
                    </tr>
                </thead>
                <tbody>
                    {allStudents.map((student) => (
                        <tr key={student.userId}>
                            <td>{student.fullname}</td>
                            <td>{student.companyName}</td>
                            <td>{student.isCompleted ? "✓" : "✗"}</td>
                            <td>{new Date(student.startedAt).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {hasNextPage && (
                <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                    {isFetchingNextPage ? "Loading..." : "Load More"}
                </button>
            )}
        </div>
    );
}
```

---

### 2. useCreateCourse

Tạo khóa học mới.

```tsx
import { useRouter } from "next/navigation";

import { useCreateCourse } from "@/hooks/api/admin";

function CreateCourseForm() {
    const router = useRouter();
    const { mutate, isPending } = useCreateCourse("atld", {
        onSuccess: (data) => {
            alert(`Khóa học đã được tạo với ID: ${data.id}`);
            router.push(`/admin/atld/${data.id}`);
        },
    });

    const handleSubmit = (formData: CreateCourseRequest) => {
        mutate(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Form fields */}
            <button type="submit" disabled={isPending}>
                {isPending ? "Đang tạo..." : "Tạo khóa học"}
            </button>
        </form>
    );
}
```

---

### 3. useUpdateCourse

Cập nhật khóa học.

```tsx
import { useUpdateCourse } from "@/hooks/api/admin";

function EditCourseForm({ groupId }: { groupId: string }) {
    const { mutate, isPending } = useUpdateCourse("atld", {
        onSuccess: () => {
            alert("Cập nhật thành công!");
        },
    });

    const handleUpdate = () => {
        mutate({
            groupId,
            title: "New Title",
            description: "Updated description",
        });
    };

    return (
        <button onClick={handleUpdate} disabled={isPending}>
            Lưu thay đổi
        </button>
    );
}
```

---

### 4. useDeleteCourse

Xóa khóa học.

```tsx
import { useDeleteCourse } from "@/hooks/api/admin";

function DeleteButton({ groupId }: { groupId: string }) {
    const router = useRouter();
    const { mutate, isPending } = useDeleteCourse("atld", {
        onSuccess: () => {
            alert("Đã xóa khóa học");
            router.push("/admin/courses");
        },
    });

    const handleDelete = () => {
        if (confirm("Bạn có chắc muốn xóa?")) {
            mutate({ groupId });
        }
    };

    return (
        <button onClick={handleDelete} disabled={isPending}>
            {isPending ? "Đang xóa..." : "Xóa khóa học"}
        </button>
    );
}
```

---

### 5. useCourseDetail

Lấy chi tiết đầy đủ khóa học (bao gồm exam answers).

```tsx
import { useCourseDetail } from "@/hooks/api/admin";

function CourseDetailPage({ groupId }: { groupId: string }) {
    const { data, isLoading } = useCourseDetail("atld", groupId);

    if (isLoading) return <Loading />;

    return (
        <div>
            <h1>{data?.title}</h1>
            <p>Tạo lúc: {new Date(data?.createdAt || 0).toLocaleString()}</p>
            <p>Cập nhật: {new Date(data?.updatedAt || 0).toLocaleString()}</p>

            <h2>Theory Videos: {data?.theory.videos.length}</h2>
            <h2>Practice Videos: {data?.practice.videos.length}</h2>
            <h2>Exam Questions: {data?.exam.questions.length}</h2>

            {/* Hiển thị cả answers (admin only) */}
            {data?.exam.questions.map((q) => (
                <div key={q.id}>
                    <p>{q.content}</p>
                    <p>Đáp án: {q.answer}</p>
                </div>
            ))}
        </div>
    );
}
```

## 🔑 Query Keys

Mỗi hook có query key factory để dễ dàng invalidate cache:

```tsx
import { useQueryClient } from "@tanstack/react-query";

import { courseListKeys } from "@/hooks/api/user/useCourseList";

function SomeComponent() {
    const queryClient = useQueryClient();

    // Invalidate tất cả course list queries
    queryClient.invalidateQueries({
        queryKey: courseListKeys.all,
    });

    // Invalidate chỉ ATLD course list
    queryClient.invalidateQueries({
        queryKey: courseListKeys.list("atld"),
    });
}
```

## ⚡ Best Practices

### 1. Error Handling

```tsx
const { data, error, isError } = useCourseList("atld");

if (isError) {
  return <ErrorBoundary error={error} />;
}
```

### 2. Loading States

```tsx
const { data, isLoading, isFetching } = useCourseList("atld");

return (
  <div>
    {isLoading && <Skeleton />}
    {isFetching && <RefreshIndicator />}
    {data && <Content data={data} />}
  </div>
);
```

### 3. Optimistic Updates

```tsx
const { mutate } = useUpdateProgress("atld", {
    onMutate: async (variables) => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries({
            queryKey: courseProgressKeys.progress("atld", variables.groupId),
        });

        // Snapshot previous value
        const previous = queryClient.getQueryData(
            courseProgressKeys.progress("atld", variables.groupId)
        );

        // Optimistically update
        queryClient.setQueryData(courseProgressKeys.progress("atld", variables.groupId), (old) => ({
            ...old,
            currentTime: variables.currentTime,
        }));

        return { previous };
    },
    onError: (err, variables, context) => {
        // Rollback on error
        queryClient.setQueryData(
            courseProgressKeys.progress("atld", variables.groupId),
            context?.previous
        );
    },
});
```

### 4. Conditional Fetching

```tsx
// Chỉ fetch khi user đã authenticated
const { data } = useCourseList("atld", {
  enabled: !!user,
});

// Chỉ fetch khi có groupId
const { data } = useCoursePreview("atld", groupId, {
  enabled: !!groupId,
});
```

### 5. Retry Logic

```tsx
// Custom retry cho mutation
const { mutate } = useStartCourse("atld", {
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
});
```

## 🎨 TypeScript Support

Tất cả hooks đều có full TypeScript support:

```tsx
import type { CourseType, StartCourseRequest } from "@/types/api";

// Type-safe
const { mutate } = useStartCourse("atld");

mutate({
    groupId: "test", // ✓ Type-safe
    portraitUrl: "https://...", // ✓ Type-safe
    // invalidField: "test", // ✗ TypeScript error
});
```

## 📖 Related Documentation

- [API Implementation Guide](../../../docs/API_IMPLEMENTATION.md)
- [API Documentation](../../../docs/api.document.md)
- [React Query Docs](https://tanstack.com/query/latest)

## 🚀 Migration Guide

Nếu bạn đang dùng fetch trực tiếp, migrate sang hooks:

**Before:**

```tsx
// ❌ Old way
useEffect(() => {
    setLoading(true);
    fetch("/api/v1/atld/lists")
        .then((res) => res.json())
        .then((data) => setCourses(data))
        .catch((err) => setError(err))
        .finally(() => setLoading(false));
}, []);
```

**After:**

```tsx
// ✅ New way
const { data: courses, isLoading, error } = useCourseList("atld");
```

## 🤝 Contributing

Khi thêm API mới:

1. Thêm types vào `src/types/api.ts`
2. Thêm API client vào `src/services/api.client.ts`
3. Tạo hook mới trong `src/hooks/api/`
4. Export hook trong `index.ts`
5. Update README này

---

**Happy Coding! 🎉**
