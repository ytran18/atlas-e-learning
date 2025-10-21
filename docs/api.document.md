# 🧩 Thiết kế API — ATLD E-Learning Platform

## Base URL

- **ATLD User:** `/api/v1/atld`
- **Học Nghề User:** `/api/v1/hoc-nghe`
- **ATLD Admin:** `/api/v1/admin/atld`
- **Học Nghề Admin:** `/api/v1/admin/hoc-nghe`

> 🔹 Hai nhóm API (`/atld/...` và `/hoc-nghe/...`) có cấu trúc và logic tương tự nhau,  
> chỉ khác ở loại khóa học (`type`).  
> Việc tách riêng nhằm tránh phụ thuộc query params và dễ mở rộng trong tương lai.

---

## 🟢 1. GET /api/v1/atld/lists

**Tương tự:** `/api/v1/hoc-nghe/lists`

**Mục đích:** Lấy danh sách các khóa học đang hoạt động.

**Response:**

```json
[
    {
        "id": "group_001",
        "title": "An Toàn Lao Động Cơ Bản",
        "description": "Khóa học nền tảng về an toàn lao động.",
        "numberOfTheory": 10,
        "numberOfPractice": 5,
        "totalQuestionOfExam": 20
    }
]
```

### 🧠 Logic Implement

1. Query Firestore: `groups` collection
2. Map dữ liệu trả về:
    - `numberOfTheory` = `theory.videos.length`
    - `numberOfPractice` = `practice.videos.length`
    - `totalQuestionOfExam` = `exam.questions.length`
3. Trả JSON response như ví dụ trên.

---

## 🟢 2. GET /api/v1/atld/preview/:groupId

**Tương tự:** `/api/v1/hoc-nghe/preview/:groupId`

**Mục đích:** Lấy thông tin chi tiết khóa học (trước khi học).

**Response:**

```json
{
    "id": "group_001",
    "title": "An Toàn Lao Động Cơ Bản",
    "description": "Khóa học ATLD với video hướng dẫn chi tiết.",
    "theory": {
        "title": "Phần lý thuyết",
        "description": "Nội dung học cơ bản về ATLD.",
        "videos": [
            { "sortNo": 1, "title": "Giới thiệu ATLD", "length": 120 },
            { "sortNo": 2, "title": "Các nguyên tắc cơ bản", "length": 300 }
        ]
    },
    "practice": {
        "title": "Phần thực hành",
        "description": "Hướng dẫn thao tác an toàn tại nơi làm việc.",
        "videos": [{ "sortNo": 1, "title": "Thực hành với thiết bị", "length": 180 }]
    },
    "totalQuestionOfExam": 20
}
```

### 🧠 Logic Implement

1. Lấy `groupId` từ route params (`req.params.groupId`).
2. Truy vấn Firestore collection `groups` lấy document theo `groupId`.
3. Lấy các trường `id`, `title`, `description`, `theory`, `practice`.
4. Tính `totalQuestionOfExam` = `exam.questions.length`.
5. Trả về JSON response như ví dụ.

---

## 🟢 3. POST /api/v1/atld/start

**Tương tự:** `/api/v1/hoc-nghe/start`

**Mục đích:** User bắt đầu học một khóa, upload ảnh chân dung.

**Request:**

```json
{
    "groupId": "group_001",
    "portraitUrl": "https://.../portrait.jpg"
}
```

**Response:**

```json
{
    "groupId": "group_001",
    "currentSection": "theory",
    "currentVideoIndex": 0,
    "currentTime": 0,
    "startedAt": 1739584821000,
    "isCompleted": false
}
```

### 🧠 Logic Implement

1. Nhận `groupId` và `portraitUrl` từ body request.
2. Tạo mới document trong Firestore collection `progress` hoặc subcollection user progress với key `groupId`.
3. Khởi tạo tiến trình học:
    - `currentSection` = `"theory"`
    - `currentVideoIndex` = 0
    - `currentTime` = 0
    - `startedAt` = timestamp hiện tại
    - `isCompleted` = false
    - Lưu `portraitUrl` vào trường tương ứng (ví dụ: startImageUrl).
4. Trả về JSON response với dữ liệu tiến trình mới.

---

## 🟢 4. GET /api/v1/atld/progress/:groupId

**Tương tự:** `/api/v1/hoc-nghe/progress/:groupId`

**Mục đích:** Lấy tiến trình học của user.

**Response:**

```json
{
    "groupId": "group_001",
    "currentSection": "theory",
    "currentVideoIndex": 3,
    "currentTime": 142,
    "completedVideos": [
        { "section": "theory", "index": 0 },
        { "section": "theory", "index": 1 },
        { "section": "theory", "index": 2 }
    ],
    "isCompleted": false,
    "startedAt": 1739584821000,
    "lastUpdatedAt": 1739585421000
}
```

### 🧠 Logic Implement

1. Lấy `groupId` từ route params (`req.params.groupId`).
2. Lấy userId từ authentication context.
3. Truy vấn Firestore collection `progress` hoặc subcollection user để lấy tiến trình học của user với `groupId`.
4. Trả về JSON response với dữ liệu tiến trình học.

---

## 🟢 5. PATCH /api/v1/atld/progress/:groupId

**Tương tự:** `/api/v1/hoc-nghe/progress/:groupId`

**Mục đích:** Cập nhật tiến trình học.

**Request:**

```json
{
    "section": "theory",
    "videoIndex": 3,
    "currentTime": 155,
    "isCompleted": false
}
```

**Response:**

```json
{
    "success": true,
    "lastUpdatedAt": 1739585670000
}
```

### 🧠 Logic Implement

1. Lấy `groupId` từ route params.
2. Lấy userId từ authentication context.
3. Nhận dữ liệu cập nhật: `section`, `videoIndex`, `currentTime`, `isCompleted` từ body request.
4. Cập nhật document tiến trình học trong Firestore với các trường tương ứng.
5. Cập nhật `lastUpdatedAt` timestamp.
6. Trả về JSON `{ success: true, lastUpdatedAt }`.

---

## 🟢 6. POST /api/v1/atld/upload-learning-capture

**Tương tự:** `/api/v1/hoc-nghe/upload-learning-capture`

**Mục đích:** Upload ảnh chụp ngẫu nhiên trong quá trình học.

**Form Data:**
| field | type | description |
|-------|------|--------------|
| file | string | Ảnh capture |
| groupId | string | ID khóa học |
| type | string | "start" \| "learning" \| "finish" |

**Response:**

```json
{
    "imageUrl": "https://.../learning_1739585321.jpg",
    "savedTo": "learningCaptureUrls"
}
```

### 🧠 Logic Implement

1. Nhận file upload, `groupId` và `type` từ form-data.
2. Lưu file ảnh lên Cloudflare R2 với tên file chứa timestamp.
3. Lấy URL public của ảnh đã upload.
4. Lưu URL ảnh vào Firestore document tương ứng trong mảng `learningCaptureUrls` hoặc trường phù hợp.
5. Trả về JSON với `imageUrl` và `savedTo`.

---

## 🔵 7. GET /api/v1/admin/atld/stats

**Tương tự:** `/api/v1/admin/hoc-nghe/stats`

**Mục đích:** Liệt kê học viên của 1 khóa (phân trang).

**Query:**
`?groupId=group_001&pageSize=20&cursor=users/uid/progress/group_001`

**Response:**

```json
{
    "data": [
        {
            "userId": "user_001",
            "fullname": "Nguyễn Văn A",
            "companyName": "Công ty ABC",
            "isCompleted": true,
            "startedAt": 1739584821000,
            "lastUpdatedAt": 1739585821000,
            "startImageUrl": "...",
            "finishImageUrl": "..."
        }
    ],
    "nextCursor": "users/user_002/progress/group_001",
    "hasMore": true
}
```

### 🧠 Logic Implement

1. Lấy `groupId`, `pageSize`, `cursor` từ query params.
2. Query Firestore collection `progress` hoặc subcollection theo `groupId` với phân trang (limit, startAfter cursor).
3. Join hoặc truy vấn thêm thông tin user (fullname, companyName) từ collection `users`.
4. Trả về danh sách học viên với thông tin tiến trình học.
5. Trả về `nextCursor` và `hasMore` để client thực hiện phân trang.

---

## 🔵 8. POST /api/v1/admin/atld/create

**Tương tự:** `/api/v1/admin/hoc-nghe/create`

**Mục đích:** Tạo khóa học mới và subcollections.

**Request:**

```json
{
    "title": "An Toàn Lao Động Nâng Cao",
    "type": "atld",
    "description": "Khóa học nâng cao.",
    "theory": { "title": "Phần lý thuyết", "description": "Các kiến thức nâng cao.", "videos": [] },
    "practice": {
        "title": "Phần thực hành",
        "description": "Các tình huống thực tế.",
        "videos": []
    },
    "exam": { "title": "Bài kiểm tra tổng hợp", "timeLimit": 900, "questions": [] }
}
```

**Response:**

```json
{
    "id": "group_002",
    "message": "Tạo khóa học thành công."
}
```

### 🧠 Logic Implement

1. Nhận dữ liệu khóa học từ body request.
2. Tạo mới document trong Firestore collection `groups` với dữ liệu nhận được.
3. Tạo các subcollections hoặc trường con cho `theory`, `practice`, `exam` theo dữ liệu.
4. Trả về `id` của khóa học mới tạo cùng message thành công.

---

## 🔵 9. PATCH /api/v1/admin/atld/[groupId]

**Tương tự:** `/api/v1/admin/hoc-nghe/[groupId]`

**Mục đích:** Cập nhật thông tin khóa học.

**Request:**

```json
{
    "title": "An Toàn Lao Động Cơ Bản (Cập nhật)",
    "description": "Phiên bản cập nhật."
}
```

**Response:**

```json
{ "success": true }
```

### 🧠 Logic Implement

1. Lấy `groupId` từ route params.
2. Nhận dữ liệu cập nhật từ body request.
3. Cập nhật document `groups/{groupId}` với dữ liệu mới.
4. Trả về JSON `{ success: true }`.

---

## 🔵 10. DELETE /api/v1/admin/atld/[groupId]

**Tương tự:** `/api/v1/admin/hoc-nghe/[groupId]`

**Mục đích:** Xóa khóa học.

**Response:**

```json
{ "success": true, "deleted": "group_001" }
```

### 🧠 Logic Implement

1. Lấy `groupId` từ route params.
2. Xóa document `groups/{groupId}` trong Firestore.
3. Xóa các subcollections liên quan nếu cần.
4. Trả về JSON `{ success: true, deleted: groupId }`.

---

## 🔵 11. GET /api/v1/admin/atld/detail/:groupId

**Tương tự:** `/api/v1/admin/hoc-nghe/detail/:groupId`

**Mục đích:** Lấy đầy đủ thông tin 1 khóa học.

**Response:**

```json
{
  "id": "group_001",
  "title": "ATLD Cơ Bản",
  "description": "...",
  "theory": { "videos": [...] },
  "practice": { "videos": [...] },
  "exam": { "questions": [...] },
  "createdAt": 1739584000000,
  "updatedAt": 1739585200000
}
```

### 🧠 Logic Implement

1. Lấy `groupId` từ route params.
2. Truy vấn Firestore collection `groups` lấy document theo `groupId`.
3. Lấy đầy đủ các trường: `id`, `title`, `description`, `theory`, `practice`, `exam`, `createdAt`, `updatedAt`.
4. Trả về JSON response với dữ liệu chi tiết khóa học.

---

## 🟢 12. GET /api/v1/atld/exam/:groupId

**Tương tự:** `/api/v1/hoc-nghe/exam/:groupId`

**Mục đích:** Lấy danh sách câu hỏi của bài thi cuối khóa.

**Response:**

```json
{
    "groupId": "group_001",
    "exam": {
        "title": "Bài kiểm tra cuối khóa",
        "description": "Đánh giá kiến thức an toàn lao động.",
        "timeLimit": 900,
        "questions": [
            {
                "id": "q1",
                "content": "Thiết bị nào bắt buộc khi làm việc ở độ cao?",
                "options": [
                    { "id": "a", "content": "Mũ bảo hộ" },
                    { "id": "b", "content": "Giày thể thao" },
                    { "id": "c", "content": "Găng tay vải" }
                ]
            }
        ]
    }
}
```

### 🧠 Logic Implement

1. Lấy `groupId` từ route params.
2. Truy vấn Firestore `groups/{groupId}` để lấy trường `exam`.
3. Xóa các trường `answer` khỏi mỗi câu hỏi trước khi trả response.
4. Trả về JSON chứa thông tin bài thi và danh sách câu hỏi.

---

## 🟢 13. POST /api/v1/atld/exam/submit

**Tương tự:** `/api/v1/hoc-nghe/exam/submit`

**Mục đích:** Nộp bài thi, chấm điểm và cập nhật tiến trình học của user.

**Request:**

```json
{
    "groupId": "group_001",
    "answers": [
        { "questionId": "q1", "answer": "a" },
        { "questionId": "q2", "answer": "b" }
    ]
}
```

**Response:**

```json
{
    "score": 9,
    "totalQuestions": 10,
    "passed": true,
    "completedAt": 1739587854000
}
```

### 🧠 Logic Implement

1. Lấy `groupId` từ body request và userId từ authentication context.
2. Query Firestore `groups/{groupId}` để lấy danh sách câu hỏi cùng đáp án.
3. So sánh từng câu trả lời của user với đáp án đúng để tính `score`.
4. Tính `passed = score >= 70%`.
5. Cập nhật document tiến trình học (`progress/{userId}_{groupId}`):
    - `isCompleted = true`
    - `examResult = { score, passed, completedAt }`
6. Trả về JSON response như ví dụ.

---

# 🔄 Flow hoạt động tổng thể của hệ thống

## 👨‍🎓 Flow User (Người học)

> Hệ thống có hai loại khóa học độc lập:
>
> - **ATLD** (An Toàn Lao Động)
> - **Học Nghề**
>
> Cả hai luồng hoạt động tương tự nhau — chỉ khác base URL (`/api/v1/atld/...` và `/api/v1/hoc-nghe/...`).

### 1. Truy cập danh sách khóa học

- User mở trang danh sách khóa học.
- FE gọi API: `GET /api/v1/atld/lists`.
- Hiển thị danh sách khóa học theo `type` (ATLD / Học nghề).

### 2. Xem chi tiết khóa học

- Khi user click vào 1 khóa học, gọi API:  
  `GET /api/v1/atld/preview/:groupId`
- Hiển thị thông tin: tiêu đề, mô tả, số lượng video, tổng số câu hỏi.

### 3. Bắt đầu học

- User nhấn “Bắt đầu học”.
- FE yêu cầu user **chụp ảnh chân dung** → upload qua `POST /api/v1/atld/start`.
- BE tạo document tiến trình học trong Firestore:
    - Lưu `portraitUrl`, `startedAt`.
    - `currentSection` = `"theory"`, `currentVideoIndex` = 0.

### 4. Quá trình học

- Khi user xem video:
    - FE lưu `progress` cục bộ (localStorage mỗi 10s).
    - Mỗi 3 phút (hoặc khi tắt tab), FE gọi `PATCH /api/v1/atld/progress/:groupId` để đồng bộ.
- BE lưu `currentSection`, `currentVideoIndex`, `currentTime`, `lastUpdatedAt`.
- Ngẫu nhiên BE yêu cầu capture màn hình học viên → `POST /api/v1/atld/upload-learning-capture` (ảnh được lưu trên Storage và log trong Firestore).

### 5. Thi và hoàn thành

- Khi user hoàn thành toàn bộ video lý thuyết + thực hành:
    - Hệ thống mở phần `exam`.
    - Sau khi hoàn thành bài thi, cập nhật `isCompleted: true` trong progress.
    - Gửi ảnh xác nhận hoàn thành (ảnh chụp cuối buổi).

---

## 🧑‍💼 Flow Admin

### 1. Quản lý khóa học

- Admin tạo khóa học mới:  
  `POST /api/v1/admin/atld/create`
- Có thể chỉnh sửa thông tin:  
  `PATCH /api/v1/admin/atld/[groupId]`
- Xóa khóa học khi cần:  
  `DELETE /api/v1/admin/atld/[groupId]`

### 2. Xem danh sách học viên

- Gọi API: `GET /api/v1/admin/atld/stats?groupId=xxx`
- Firestore trả về danh sách phân trang học viên, gồm:
    - `fullname`, `companyName`, `isCompleted`, `startedAt`, `lastUpdatedAt`.
- Admin có thể xem ảnh chân dung, ảnh trong quá trình học và ảnh hoàn thành.

### 3. Theo dõi tiến trình học viên

- Admin có thể xem chi tiết khóa học hoặc tiến trình từng người qua:
    - `GET /api/v1/atld/progress/:groupId`
    - `GET /api/v1/admin/atld/detail/:groupId`

---

## ⚙️ Firestore Trigger (tùy chọn)

- Khi user hoàn thành khóa (`isCompleted: true`):
    - Tự động cập nhật tổng số học viên hoàn thành trong `groups/{groupId}`.
    - Gửi thông báo / email xác nhận hoàn thành.

---

## 📊 Tối ưu

- Dữ liệu học viên được phân trang bằng cursor (`startAfter`).
- Index composite dùng cho:
    - `groupId + isCompleted`
    - `groupId + lastUpdatedAt`
- Giảm write cost bằng cách:
    - Lưu local progress rồi batch update định kỳ.
- Ảnh học viên được lưu ở Storage theo cấu trúc:
    ```
    users/{userId}/learning/{groupId}/{timestamp}.jpg
    ```

---

# ✅ Tổng kết

Tài liệu này mô tả chi tiết toàn bộ:

- Cấu trúc API
- Logic xử lý
- Quy trình hoạt động giữa FE ↔ BE ↔ Firestore
- Cách tối ưu hiệu năng và chi phí Firestore.

Hệ thống được thiết kế linh hoạt, có thể mở rộng cho nhiều loại khóa học khác nhau (`atld`, `hoc-nghe`, ...).
