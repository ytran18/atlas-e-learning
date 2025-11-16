# 📊 Mixpanel Event Tracking Design

## Tổng quan

Document này mô tả toàn bộ hệ thống event tracking cho ứng dụng học tập ATLD/Học Nghề. Tất cả events sẽ được gửi đến Mixpanel để phân tích hành vi người dùng, tối ưu trải nghiệm và đo lường hiệu quả.

---

## 🎯 Nguyên tắc thiết kế

1. **Naming Convention**: Sử dụng format `[Category]_[Action]` (snake_case)
    - Ví dụ: `course_started`, `video_played`, `exam_submitted`

2. **Consistent Properties**: Mỗi event category có properties cố định để dễ phân tích
    - `course_type`: "atld" | "hoc-nghe"
    - `course_id`: ID của khóa học
    - `user_id`: ID của user (từ Clerk)
    - `timestamp`: Thời gian event (Mixpanel tự động thêm)

3. **User Identification**: Identify user ngay sau khi sign-in/sign-up thành công

4. **Error Tracking**: Track tất cả errors để debug và cải thiện

---

## 📋 Danh sách Events

### 🔐 1. Authentication Events

#### `user_signed_up`

**Khi nào track**: Sau khi user đăng ký thành công

**Properties**:

```typescript
{
  user_id: string;           // Clerk user ID
  full_name?: string;         // Tên đầy đủ
  is_vietnamese: boolean;    // Có phải công dân VN không
  has_company: boolean;      // Có nhập tên công ty không
  signup_method: string;     // "cccd" | "passport"
  timestamp: number;          // Mixpanel tự động
}
```

**Mục đích**:

- Theo dõi conversion rate từ landing page → sign-up
- Phân tích user demographics
- Measure sign-up funnel

---

#### `user_signed_in`

**Khi nào track**: Sau khi user đăng nhập thành công

**Properties**:

```typescript
{
    user_id: string;
    signin_method: string; // "cccd" | "passport"
    timestamp: number;
}
```

**Mục đích**:

- Track user retention
- Measure login frequency
- Identify active users

---

#### `user_signed_out`

**Khi nào track**: Khi user click đăng xuất

**Properties**:

```typescript
{
  user_id: string;
  session_duration?: number; // Thời gian session (seconds)
  timestamp: number;
}
```

**Mục đích**:

- Measure session duration
- Track logout patterns

---

#### `auth_error`

**Khi nào track**: Khi có lỗi trong quá trình authentication

**Properties**:

```typescript
{
  error_type: string;         // "signin_failed" | "signup_failed" | "captcha_failed"
  error_message: string;
  user_input?: string;        // CCCD/Passport (masked)
  timestamp: number;
}
```

**Mục đích**:

- Debug authentication issues
- Identify common errors
- Improve UX

---

### 📚 2. Course Discovery Events

#### `course_list_viewed`

**Khi nào track**: Khi user xem trang danh sách khóa học

**Properties**:

```typescript
{
    course_type: "atld" | "hoc-nghe";
    total_courses: number; // Số lượng khóa học hiển thị
    timestamp: number;
}
```

**Mục đích**:

- Measure engagement với course listing
- Track popular course types

---

#### `course_preview_viewed`

**Khi nào track**: Khi user xem trang preview của một khóa học

**Properties**:

```typescript
{
    course_type: "atld" | "hoc-nghe";
    course_id: string;
    course_name: string;
    video_count: number;
    exam_question_count: number;
    is_joined: boolean; // Đã tham gia chưa
    is_completed: boolean; // Đã hoàn thành chưa
    timestamp: number;
}
```

**Mục đích**:

- Measure conversion từ preview → start course
- Track popular courses
- Identify drop-off points

---

#### `course_preview_start_clicked`

**Khi nào track**: Khi user click nút "Bắt đầu học" ở trang preview

**Properties**:

```typescript
{
    course_type: "atld" | "hoc-nghe";
    course_id: string;
    course_name: string;
    timestamp: number;
}
```

**Mục đích**:

- Measure conversion rate
- Track user intent

---

### 🎓 3. Course Enrollment Events

#### `course_start_initiated`

**Khi nào track**: Khi user bắt đầu flow "Bắt đầu khóa học" (vào trang photo capture)

**Properties**:

```typescript
{
    course_type: "atld" | "hoc-nghe";
    course_id: string;
    course_name: string;
    timestamp: number;
}
```

**Mục đích**:

- Track enrollment funnel
- Identify drop-off points

---

#### `photo_capture_started`

**Khi nào track**: Khi camera được mở để chụp ảnh verification

**Properties**:

```typescript
{
    course_type: "atld" | "hoc-nghe";
    course_id: string;
    capture_type: "start"; // Luôn là "start" ở đây
    timestamp: number;
}
```

**Mục đích**:

- Track photo capture flow
- Measure camera permission issues

---

#### `photo_captured`

**Khi nào track**: Khi user chụp ảnh thành công

**Properties**:

```typescript
{
    course_type: "atld" | "hoc-nghe";
    course_id: string;
    capture_type: "start";
    timestamp: number;
}
```

**Mục đích**:

- Measure success rate của photo capture

---

#### `photo_retaken`

**Khi nào track**: Khi user click "Chụp lại"

**Properties**:

```typescript
{
    course_type: "atld" | "hoc-nghe";
    course_id: string;
    capture_type: "start";
    retake_count: number; // Số lần retake
    timestamp: number;
}
```

**Mục đích**:

- Measure user satisfaction với ảnh chụp
- Identify UX issues

---

#### `photo_uploaded`

**Khi nào track**: Khi ảnh được upload thành công lên storage

**Properties**:

```typescript
{
    course_type: "atld" | "hoc-nghe";
    course_id: string;
    capture_type: "start" | "learning" | "finish";
    upload_duration_ms: number; // Thời gian upload (milliseconds)
    timestamp: number;
}
```

**Mục đích**:

- Track upload performance
- Identify slow uploads

---

#### `course_started`

**Khi nào track**: Sau khi course được tạo thành công trong database

**Properties**:

```typescript
{
    course_type: "atld" | "hoc-nghe";
    course_id: string;
    course_name: string;
    user_fullname: string;
    user_has_company: boolean;
    timestamp: number;
}
```

**Mục đích**:

- Measure enrollment success rate
- Track new course starts
- Calculate conversion funnel

---

#### `course_start_failed`

**Khi nào track**: Khi có lỗi trong quá trình start course

**Properties**:

```typescript
{
    course_type: "atld" | "hoc-nghe";
    course_id: string;
    error_type: string; // "upload_failed" | "api_error" | "validation_error"
    error_message: string;
    timestamp: number;
}
```

**Mục đích**:

- Debug enrollment issues
- Identify technical problems

---

### 📹 4. Learning Events

#### `learning_page_viewed`

**Khi nào track**: Khi user vào trang learning

**Properties**:

```typescript
{
    course_type: "atld" | "hoc-nghe";
    course_id: string;
    current_section: string; // "theory" | "practice"
    current_video_index: number;
    is_resuming: boolean; // Có phải đang resume không
    timestamp: number;
}
```

**Mục đích**:

- Track learning session starts
- Measure engagement

---

#### `video_loaded`

**Khi nào track**: Khi video được load vào player

**Properties**:

```typescript
{
  course_type: "atld" | "hoc-nghe";
  course_id: string;
  section: "theory" | "practice";
  video_index: number;
  video_title?: string;
  load_duration_ms: number;  // Thời gian load video
  timestamp: number;
}
```

**Mục đích**:

- Measure video load performance
- Identify slow-loading videos

---

#### `video_played`

**Khi nào track**: Khi user click play video

**Properties**:

```typescript
{
  course_type: "atld" | "hoc-nghe";
  course_id: string;
  section: "theory" | "practice";
  video_index: number;
  video_title?: string;
  resume_time?: number;       // Thời gian resume (seconds)
  timestamp: number;
}
```

**Mục đích**:

- Track video engagement
- Measure play rate

---

#### `video_paused`

**Khi nào track**: Khi user pause video

**Properties**:

```typescript
{
    course_type: "atld" | "hoc-nghe";
    course_id: string;
    section: "theory" | "practice";
    video_index: number;
    current_time: number; // Thời gian hiện tại (seconds)
    video_duration: number; // Tổng thời gian video (seconds)
    watch_percentage: number; // Phần trăm đã xem
    timestamp: number;
}
```

**Mục đích**:

- Track viewing patterns
- Identify where users pause

---

#### `video_seeked`

**Khi nào track**: Khi user seek video (tua nhanh/lùi)

**Properties**:

```typescript
{
    course_type: "atld" | "hoc-nghe";
    course_id: string;
    section: "theory" | "practice";
    video_index: number;
    from_time: number; // Thời gian trước khi seek
    to_time: number; // Thời gian sau khi seek
    timestamp: number;
}
```

**Mục đích**:

- Understand viewing behavior
- Identify skipped sections

---

#### `video_completed`

**Khi nào track**: Khi user xem hết một video (đạt 90%+ hoặc đến cuối)

**Properties**:

```typescript
{
  course_type: "atld" | "hoc-nghe";
  course_id: string;
  section: "theory" | "practice";
  video_index: number;
  video_title?: string;
  watch_duration: number;     // Tổng thời gian xem (seconds)
  video_duration: number;     // Tổng thời gian video (seconds)
  completion_percentage: number; // Phần trăm hoàn thành
  timestamp: number;
}
```

**Mục đích**:

- Measure video completion rate
- Track learning progress
- Identify engaging vs boring content

---

#### `video_progress_updated`

**Khi nào track**: Khi progress được cập nhật (mỗi 10-30 seconds hoặc khi có thay đổi đáng kể)

**Properties**:

```typescript
{
    course_type: "atld" | "hoc-nghe";
    course_id: string;
    section: "theory" | "practice";
    video_index: number;
    current_time: number;
    video_duration: number;
    watch_percentage: number;
    timestamp: number;
}
```

**Mục đích**:

- Track detailed viewing progress
- Measure engagement depth

---

#### `section_navigated`

**Khi nào track**: Khi user chuyển section (theory ↔ practice)

**Properties**:

```typescript
{
    course_type: "atld" | "hoc-nghe";
    course_id: string;
    from_section: "theory" | "practice";
    to_section: "theory" | "practice";
    timestamp: number;
}
```

**Mục đích**:

- Track navigation patterns
- Understand user flow

---

#### `video_navigated`

**Khi nào track**: Khi user chuyển sang video khác (next/previous hoặc click từ sidebar)

**Properties**:

```typescript
{
    course_type: "atld" | "hoc-nghe";
    course_id: string;
    from_section: "theory" | "practice";
    from_video_index: number;
    to_section: "theory" | "practice";
    to_video_index: number;
    navigation_method: "next" | "previous" | "sidebar" | "hash";
    timestamp: number;
}
```

**Mục đích**:

- Track navigation behavior
- Measure content consumption

---

#### `learning_capture_taken`

**Khi nào track**: Khi ảnh random capture được chụp trong quá trình học

**Properties**:

```typescript
{
    course_type: "atld" | "hoc-nghe";
    course_id: string;
    capture_type: "learning";
    section: "theory" | "practice";
    video_index: number;
    current_time: number;
    timestamp: number;
}
```

**Mục đích**:

- Track learning verification
- Measure active learning time

---

### 📝 5. Exam Events

#### `exam_started`

**Khi nào track**: Khi user vào trang exam và bắt đầu làm bài

**Properties**:

```typescript
{
    course_type: "atld" | "hoc-nghe";
    course_id: string;
    course_name: string;
    total_questions: number;
    timestamp: number;
}
```

**Mục đích**:

- Measure exam start rate
- Track completion funnel

---

#### `exam_question_answered`

**Khi nào track**: Khi user chọn đáp án cho một câu hỏi

**Properties**:

```typescript
{
  course_type: "atld" | "hoc-nghe";
  course_id: string;
  question_id: string;
  question_index: number;     // Thứ tự câu hỏi (1-based)
  answer_selected: string;    // Đáp án user chọn
  is_correct?: boolean;       // Chỉ có sau khi submit
  time_spent_ms?: number;    // Thời gian suy nghĩ (milliseconds)
  timestamp: number;
}
```

**Mục đích**:

- Track answer patterns
- Identify difficult questions
- Measure time per question

---

#### `exam_question_changed`

**Khi nào track**: Khi user thay đổi đáp án của một câu hỏi

**Properties**:

```typescript
{
    course_type: "atld" | "hoc-nghe";
    course_id: string;
    question_id: string;
    question_index: number;
    previous_answer: string;
    new_answer: string;
    change_count: number; // Số lần thay đổi cho câu này
    timestamp: number;
}
```

**Mục đích**:

- Track answer confidence
- Measure uncertainty

---

#### `exam_submitted`

**Khi nào track**: Khi user submit bài thi

**Properties**:

```typescript
{
    course_type: "atld" | "hoc-nghe";
    course_id: string;
    course_name: string;
    total_questions: number;
    score: number;
    percentage: number; // Điểm phần trăm
    passed: boolean;
    exam_duration_ms: number; // Tổng thời gian làm bài (milliseconds)
    average_time_per_question_ms: number;
    timestamp: number;
}
```

**Mục đích**:

- Measure exam performance
- Track pass rate
- Calculate average scores

---

#### `exam_result_viewed`

**Khi nào track**: Khi user xem kết quả thi

**Properties**:

```typescript
{
    course_type: "atld" | "hoc-nghe";
    course_id: string;
    score: number;
    total_questions: number;
    percentage: number;
    passed: boolean;
    timestamp: number;
}
```

**Mục đích**:

- Track result engagement

---

### ✅ 6. Course Completion Events

#### `course_completed`

**Khi nào track**: Khi user hoàn thành khóa học (submit exam thành công và passed)

**Properties**:

```typescript
{
    course_type: "atld" | "hoc-nghe";
    course_id: string;
    course_name: string;
    exam_score: number;
    exam_percentage: number;
    total_videos: number;
    completed_videos: number;
    total_learning_time_ms: number; // Tổng thời gian học (milliseconds)
    started_at: number; // Timestamp khi bắt đầu
    completed_at: number; // Timestamp khi hoàn thành
    days_to_complete: number; // Số ngày để hoàn thành
    timestamp: number;
}
```

**Mục đích**:

- Measure completion rate
- Track time to completion
- Calculate success metrics

---

#### `finish_photo_captured`

**Khi nào track**: Khi ảnh finish được chụp (sau khi hoàn thành)

**Properties**:

```typescript
{
    course_type: "atld" | "hoc-nghe";
    course_id: string;
    capture_type: "finish";
    timestamp: number;
}
```

**Mục đích**:

- Track completion verification

---

### 🔍 7. Navigation & UI Events

#### `page_viewed`

**Khi nào track**: Khi user vào một page mới (client-side navigation)

**Properties**:

```typescript
{
  page_path: string;          // "/atld", "/atld/[id]", "/quan-tri/user", etc.
  page_title?: string;
  referrer?: string;          // Trang trước đó
  timestamp: number;
}
```

**Mục đích**:

- Track page views
- Measure navigation patterns
- Build user journey maps

---

#### `sidebar_toggled`

**Khi nào track**: Khi user mở/đóng sidebar (mobile)

**Properties**:

```typescript
{
    course_type: "atld" | "hoc-nghe";
    course_id: string;
    is_open: boolean;
    timestamp: number;
}
```

**Mục đích**:

- Track mobile UX patterns

---

#### `search_performed`

**Khi nào track**: Khi user search trong admin panel hoặc course list

**Properties**:

```typescript
{
  search_term: string;
  search_type?: "course" | "user" | "admin";
  results_count: number;
  timestamp: number;
}
```

**Mục đích**:

- Track search behavior
- Identify popular search terms

---

#### `filter_applied`

**Khi nào track**: Khi user apply filter

**Properties**:

```typescript
{
    filter_type: string; // "course_type", "status", etc.
    filter_value: string;
    context: "course_list" | "admin_user" | "admin_course";
    timestamp: number;
}
```

**Mục đích**:

- Track filter usage
- Understand user preferences

---

### 👨‍💼 8. Admin Events

#### `admin_page_viewed`

**Khi nào track**: Khi admin vào trang admin

**Properties**:

```typescript
{
    admin_page: "user" | "atld_course" | "hoc_nghe_course";
    timestamp: number;
}
```

**Mục đích**:

- Track admin activity
- Measure admin engagement

---

#### `admin_user_filtered`

**Khi nào track**: Khi admin filter users

**Properties**:

```typescript
{
  course_type?: "atld" | "hoc-nghe";
  course_id?: string;
  search_term?: string;
  page: number;
  page_size: number;
  timestamp: number;
}
```

**Mục đích**:

- Track admin search patterns

---

#### `admin_course_created`

**Khi nào track**: Khi admin tạo khóa học mới

**Properties**:

```typescript
{
    course_type: "atld" | "hoc-nghe";
    course_id: string;
    course_name: string;
    video_count: number;
    exam_question_count: number;
    timestamp: number;
}
```

**Mục đích**:

- Track content creation
- Measure admin productivity

---

#### `admin_course_updated`

**Khi nào track**: Khi admin cập nhật khóa học

**Properties**:

```typescript
{
  course_type: "atld" | "hoc-nghe";
  course_id: string;
  fields_updated: string[];   // ["title", "description", "videos", etc.]
  timestamp: number;
}
```

**Mục đích**:

- Track content updates

---

#### `admin_course_deleted`

**Khi nào track**: Khi admin xóa khóa học

**Properties**:

```typescript
{
    course_type: "atld" | "hoc-nghe";
    course_id: string;
    course_name: string;
    timestamp: number;
}
```

**Mục đích**:

- Track content deletion
- Audit trail

---

### ⚠️ 9. Error Events

#### `error_occurred`

**Khi nào track**: Khi có lỗi xảy ra trong app (catch errors)

**Properties**:

```typescript
{
  error_type: string;         // "api_error" | "video_error" | "upload_error" | "validation_error"
  error_message: string;
  error_stack?: string;       // Stack trace (trong dev mode)
  page_path: string;
  user_action?: string;       // Hành động user đang làm khi lỗi xảy ra
  timestamp: number;
}
```

**Mục đích**:

- Debug issues
- Identify common errors
- Improve stability

---

#### `api_error`

**Khi nào track**: Khi API call thất bại

**Properties**:

```typescript
{
  endpoint: string;           // "/api/v1/atld/progress/..."
  method: "GET" | "POST" | "PATCH" | "DELETE";
  status_code?: number;
  error_message: string;
  request_body?: object;      // Mask sensitive data
  timestamp: number;
}
```

**Mục đích**:

- Track API reliability
- Identify failing endpoints

---

#### `video_error`

**Khi nào track**: Khi có lỗi với video player

**Properties**:

```typescript
{
    course_type: "atld" | "hoc-nghe";
    course_id: string;
    video_index: number;
    error_type: string; // "load_error" | "play_error" | "network_error"
    error_message: string;
    timestamp: number;
}
```

**Mục đích**:

- Debug video playback issues
- Identify problematic videos

---

## 🔧 Implementation Plan

### Phase 1: Core Infrastructure

1. Tạo event tracking utilities và constants
2. Setup user identification
3. Implement error tracking wrapper

### Phase 2: Authentication & Enrollment

1. Track sign-up/sign-in events
2. Track course enrollment flow
3. Track photo capture events

### Phase 3: Learning & Progress

1. Track video events
2. Track progress updates
3. Track navigation events

### Phase 4: Exam & Completion

1. Track exam events
2. Track completion events
3. Track finish photo capture

### Phase 5: Admin & Analytics

1. Track admin events
2. Track search/filter events
3. Track page views

---

## 📝 Notes

1. **Privacy**: Không track thông tin nhạy cảm (CCCD, passwords, etc.)
2. **Performance**: Debounce/throttle các events thường xuyên (progress updates)
3. **Error Handling**: Tất cả tracking calls phải có try-catch để không break app
4. **Testing**: Test tracking trong development environment trước khi deploy
5. **User Consent**: Đảm bảo tuân thủ privacy regulations

---

## ✅ Review Checklist

- [ ] Event names rõ ràng và nhất quán
- [ ] Properties đầy đủ và hữu ích cho phân tích
- [ ] Không track thông tin nhạy cảm
- [ ] Có error handling cho tất cả tracking calls
- [ ] Performance được tối ưu (debounce/throttle)
- [ ] User identification được setup đúng
- [ ] Tất cả user flows quan trọng đều được track

---

**Ngày tạo**: [Date]
**Người review**: [Name]
**Status**: ⏳ Pending Review
