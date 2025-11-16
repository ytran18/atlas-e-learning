/**
 * API Types for ATLD E-Learning Platform
 *
 * This file contains all request/response types for the API endpoints
 * to ensure type safety between frontend and backend.
 */

// ============================================================================
// Common Types
// ============================================================================

export type CourseType = "atld" | "hoc-nghe";
export type SectionType = "theory" | "practice" | "exam";
export type CaptureType = "start" | "learning" | "finish";

// ============================================================================
// Video Types
// ============================================================================

export interface Video {
    id: string;
    sortNo: number;
    title: string;
    description?: string;
    url: string;
    length: number; // duration in seconds
    canSeek?: boolean;
    shouldCompleteToPassed?: boolean;
    thumbnailUrl?: string;
    isUsingLink?: boolean;
}

// ============================================================================
// Section Types
// ============================================================================

export interface TheorySection {
    title: string;
    description: string;
    videos: Video[];
}

export interface PracticeSection {
    title: string;
    description: string;
    videos: Video[];
}

export interface ExamQuestion {
    id: string;
    content: string;
    options: {
        id: string;
        content: string;
    }[];
    answer: string; // ID of correct option
}

export interface ExamSection {
    title: string;
    description?: string;
    timeLimit: number; // in seconds
    questions: ExamQuestion[];
    passScore?: number;
}

// ============================================================================
// 1. GET /api/v1/atld/lists - List all courses
// ============================================================================

export interface CourseListItem {
    sortNo?: number;
    id: string;
    type?: CourseType;
    title: string;
    description: string;
    numberOfTheory: number;
    numberOfPractice: number;
    totalQuestionOfExam: number;
}

export type GetCourseListResponse = CourseListItem[];

// ============================================================================
// 2. GET /api/v1/atld/preview/:groupId - Course preview
// ============================================================================

export interface CoursePreview {
    id: string;
    title: string;
    description: string;
    theory: TheorySection;
    practice: PracticeSection;
    totalQuestionOfExam: number;
}

export type GetCoursePreviewResponse = CoursePreview;

// ============================================================================
// 3. POST /api/v1/atld/start - Start course
// ============================================================================

export interface StartCourseRequest {
    groupId: string;
    portraitUrl: string;
    courseName: string;
    userFullname: string;
    userBirthDate: string;
    userCompanyName: string;
    userIdCard: string;
}

export interface StartCourseResponse {
    groupId: string;
    currentSection: SectionType;
    currentVideoIndex: number;
    currentTime: number;
    startedAt: number; // timestamp
    isCompleted: boolean;
}

// ============================================================================
// 4. GET /api/v1/atld/progress/:groupId - Get progress
// ============================================================================

export interface CompletedVideo {
    section: SectionType;
    index: number;
}

export interface CourseProgress {
    groupId: string;
    currentSection: SectionType;
    currentVideoIndex: number;
    currentTime: number;
    completedVideos: CompletedVideo[];
    isCompleted: boolean;
    startedAt: number; // timestamp
    lastUpdatedAt: number; // timestamp
    finishImageUrl?: string; // Auto-captured finish image URL
    examResult?: {
        score: number;
        totalQuestions: number;
        passed: boolean;
        completedAt: number;
        answers?: ExamAnswer[];
    };
    courseName?: string;
    userFullname?: string;
    userBirthDate?: string;
    userCompanyName?: string;
}

export type GetProgressResponse = CourseProgress;

// ============================================================================
// 5. PATCH /api/v1/atld/progress/:groupId - Update progress
// ============================================================================

export interface UpdateProgressRequest {
    section: SectionType;
    videoIndex: number;
    currentTime: number;
    isCompleted?: boolean;
    completedVideo?: CompletedVideo; // Mark a video as completed
    finishImageUrl?: string; // Auto-captured finish image URL
}

export interface UpdateProgressResponse {
    success: boolean;
    lastUpdatedAt: number;
}

// ============================================================================
// 6. POST /api/v1/atld/upload-learning-capture - Upload capture image
// ============================================================================

export interface UploadCaptureRequest {
    groupId: string;
    type: CaptureType;
    // file is sent as FormData
}

export interface UploadCaptureResponse {
    imageUrl: string;
    savedTo: string;
}

// ============================================================================
// 7. GET /api/v1/admin/atld/stats - Get student stats (admin)
// ============================================================================

export interface GetStatsQueryParams {
    groupId: string;
    pageSize?: number;
    cursor?: string;
}

export interface StudentStats {
    userId: string;
    fullname: string;
    birthDate: string;
    companyName?: string;
    isCompleted: boolean;
    startedAt: number;
    lastUpdatedAt: number;
    startImageUrl?: string;
    finishImageUrl?: string;
    completedVideos: CompletedVideo[];
    courseName: string;
    currentSection: SectionType;
    currentVideoIndex: number;
    examResult?: {
        score: number;
        totalQuestions: number;
        passed: boolean;
        completedAt: number;
        answers?: ExamAnswer[];
    };
}

export interface GetStatsResponse {
    data: StudentStats[];
    nextCursor?: string;
    hasMore: boolean;
    totalDocs: number;
    totalPages: number;
}

// ============================================================================
// 8. POST /api/v1/admin/atld/create - Create course (admin)
// ============================================================================

export interface CreateCourseRequest {
    title: string;
    type: CourseType;
    description: string;
    theory: TheorySection;
    practice: PracticeSection;
    exam: ExamSection;
}

export interface CreateCourseResponse {
    id: string;
    message: string;
}

// ============================================================================
// 9. PATCH /api/v1/admin/atld/[groupId] - Update course (admin)
// ============================================================================

export interface UpdateCourseRequest {
    title?: string;
    description?: string;
    theory?: TheorySection;
    practice?: PracticeSection;
    exam?: ExamSection;
}

export interface UpdateCourseResponse {
    success: boolean;
}

// ============================================================================
// 10. DELETE /api/v1/admin/atld/[groupId] - Delete course (admin)
// ============================================================================

export interface DeleteCourseResponse {
    success: boolean;
    deleted: string;
}

// ============================================================================
// 11. GET /api/v1/admin/atld/detail/:groupId - Get course detail (admin)
// ============================================================================

export interface CourseDetail {
    id: string;
    title: string;
    description: string;
    type: CourseType;
    theory: TheorySection;
    practice: PracticeSection;
    exam: ExamSection;
    createdAt: number;
    updatedAt: number;
}

export type GetCourseDetailResponse = CourseDetail;

// ============================================================================
// 12. GET /api/v1/atld/exam/:groupId - Get exam questions
// ============================================================================

export interface ExamQuestionForUser {
    id: string;
    content: string;
    options: {
        id: string;
        content: string;
    }[];
    // Note: answer field is removed for user-facing API
}

export interface ExamForUser {
    title: string;
    description?: string;
    timeLimit: number; // in seconds
    questions: ExamQuestionForUser[];
}

export interface GetExamResponse {
    groupId: string;
    exam: ExamForUser;
}

// ============================================================================
// 13. POST /api/v1/atld/exam/submit - Submit exam answers
// ============================================================================

export interface ExamAnswer {
    questionId: string;
    answer: string; // ID of selected option
}

export interface SubmitExamRequest {
    groupId: string;
    answers: ExamAnswer[];
}

export interface SubmitExamResponse {
    score: number;
    totalQuestions: number;
    passed: boolean;
    completedAt: number; // timestamp
}

// ============================================================================
// Error Response
// ============================================================================

export interface ApiErrorResponse {
    success: false;
    error: string;
    details?: string;
}

// ============================================================================
// Success Response Wrapper
// ============================================================================

export interface ApiSuccessResponse<T> {
    success: true;
    data: T;
}
