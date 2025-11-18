/**
 * API Client Service
 *
 * Client-side utilities for making API calls to the backend.
 * Provides type-safe methods for all API endpoints.
 */
import {
    ApiErrorResponse,
    ApiSuccessResponse,
    CaptureType,
    CourseType,
    CreateCourseRequest,
    CreateCourseResponse,
    DeleteCourseResponse,
    GetCourseDetailResponse,
    GetCourseListResponse,
    GetCoursePreviewResponse,
    GetExamResponse,
    GetProgressResponse,
    GetStatsResponse,
    StartCourseRequest,
    StartCourseResponse,
    StudentStats,
    SubmitExamRequest,
    SubmitExamResponse,
    UpdateCourseRequest,
    UpdateCourseResponse,
    UpdateProgressRequest,
    UpdateProgressResponse,
    UploadCaptureResponse,
} from "@/types/api";

// ============================================================================
// Base API Configuration
// ============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

/**
 * Base fetch wrapper with error handling
 */
async function apiFetch<T>(
    endpoint: string,
    options?: RequestInit
): Promise<ApiSuccessResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        const error = data as ApiErrorResponse;
        throw new Error(error.error || "API request failed");
    }

    return data as ApiSuccessResponse<T>;
}

// ============================================================================
// User API Methods
// ============================================================================

/**
 * Get list of all courses
 */
export async function getCourseList(type: CourseType | "all"): Promise<GetCourseListResponse> {
    const endpoint =
        type === "atld"
            ? "/api/v1/atld/lists"
            : type === "hoc-nghe"
              ? "/api/v1/hoc-nghe/lists"
              : "/api/v1/course/all";

    const response = await apiFetch<GetCourseListResponse>(endpoint);

    return response.data;
}

/**
 * Get course preview details
 */
export async function getCoursePreview(
    type: CourseType,
    groupId: string
): Promise<GetCoursePreviewResponse> {
    const endpoint =
        type === "atld" ? `/api/v1/atld/preview/${groupId}` : `/api/v1/hoc-nghe/preview/${groupId}`;
    const response = await apiFetch<GetCoursePreviewResponse>(endpoint);
    return response.data;
}

/**
 * Start a course
 */
export async function startCourse(
    type: CourseType,
    data: StartCourseRequest
): Promise<StartCourseResponse> {
    const endpoint = type === "atld" ? "/api/v1/atld/start" : "/api/v1/hoc-nghe/start";
    const response = await apiFetch<StartCourseResponse>(endpoint, {
        method: "POST",
        body: JSON.stringify(data),
    });
    return response.data;
}

/**
 * Get user progress for a course
 */
export async function getCourseProgress(
    type: CourseType,
    groupId: string
): Promise<GetProgressResponse> {
    const endpoint =
        type === "atld"
            ? `/api/v1/atld/progress/${groupId}`
            : `/api/v1/hoc-nghe/progress/${groupId}`;
    const response = await apiFetch<GetProgressResponse>(endpoint);
    return response.data;
}

/**
 * Update user progress
 */
export async function updateCourseProgress(
    type: CourseType,
    groupId: string,
    data: UpdateProgressRequest
): Promise<UpdateProgressResponse> {
    const endpoint =
        type === "atld"
            ? `/api/v1/atld/progress/${groupId}`
            : `/api/v1/hoc-nghe/progress/${groupId}`;
    const response = await apiFetch<UpdateProgressResponse>(endpoint, {
        method: "PATCH",
        body: JSON.stringify(data),
    });
    return response.data;
}

/**
 * Upload learning capture image
 */
export async function uploadLearningCapture(
    type: CourseType,
    file: File,
    groupId: string,
    captureType: CaptureType
): Promise<UploadCaptureResponse> {
    const endpoint =
        type === "atld"
            ? "/api/v1/atld/upload-learning-capture"
            : "/api/v1/hoc-nghe/upload-learning-capture";

    const formData = new FormData();

    formData.append("file", file);

    formData.append("groupId", groupId);

    formData.append("type", captureType);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        body: formData,
        // Don't set Content-Type header - browser will set it with boundary
    });

    const data = await response.json();

    if (!response.ok) {
        const error = data as ApiErrorResponse;
        throw new Error(error.error || "Upload failed");
    }

    return (data as ApiSuccessResponse<UploadCaptureResponse>).data;
}

/**
 * Get exam questions for a course
 */
export async function getExamQuestions(
    type: CourseType,
    groupId: string
): Promise<GetExamResponse> {
    const endpoint =
        type === "atld" ? `/api/v1/atld/exam/${groupId}` : `/api/v1/hoc-nghe/exam/${groupId}`;
    const response = await apiFetch<GetExamResponse>(endpoint);
    return response.data;
}

/**
 * Submit exam answers
 */
export async function submitExamAnswers(
    type: CourseType,
    data: SubmitExamRequest
): Promise<SubmitExamResponse> {
    const endpoint = type === "atld" ? "/api/v1/atld/exam/submit" : "/api/v1/hoc-nghe/exam/submit";
    const response = await apiFetch<SubmitExamResponse>(endpoint, {
        method: "POST",
        body: JSON.stringify(data),
    });
    return response.data;
}

// ============================================================================
// Admin API Methods
// ============================================================================

/**
 * Get student statistics (admin only)
 */
export async function getStudentStats(
    type: CourseType,
    groupId: string,
    pageSize?: number,
    cursor?: string,
    search?: string
): Promise<GetStatsResponse> {
    const params = new URLSearchParams({ groupId });

    if (pageSize) params.append("pageSize", pageSize.toString());

    if (cursor) params.append("cursor", cursor);

    if (search) params.append("search", search);

    const endpoint =
        type === "atld"
            ? `/api/v1/admin/atld/stats?${params}`
            : `/api/v1/admin/hoc-nghe/stats?${params}`;

    const response = await apiFetch<GetStatsResponse>(endpoint);

    return response.data;
}

/**
 * Create a new course (admin only)
 */
export async function createCourse(
    type: CourseType,
    data: CreateCourseRequest
): Promise<CreateCourseResponse> {
    const endpoint =
        type === "atld" ? "/api/v1/admin/atld/create" : "/api/v1/admin/hoc-nghe/create";

    const response = await apiFetch<CreateCourseResponse>(endpoint, {
        method: "POST",
        body: JSON.stringify(data),
    });
    return response.data;
}

/**
 * Update course (admin only)
 */
export async function updateCourse(
    type: CourseType,
    groupId: string,
    data: UpdateCourseRequest
): Promise<UpdateCourseResponse> {
    const endpoint =
        type === "atld" ? `/api/v1/admin/atld/${groupId}` : `/api/v1/admin/hoc-nghe/${groupId}`;

    const response = await apiFetch<UpdateCourseResponse>(endpoint, {
        method: "PATCH",
        body: JSON.stringify(data),
    });
    return response.data;
}

/**
 * Delete course (admin only)
 */
export async function deleteCourse(
    type: CourseType,
    groupId: string
): Promise<DeleteCourseResponse> {
    const endpoint =
        type === "atld" ? `/api/v1/admin/atld/${groupId}` : `/api/v1/admin/hoc-nghe/${groupId}`;

    const response = await apiFetch<DeleteCourseResponse>(endpoint, {
        method: "DELETE",
    });
    return response.data;
}

/**
 * Get course detail (admin only)
 */
export async function getCourseDetail(
    type: CourseType,
    groupId: string
): Promise<GetCourseDetailResponse> {
    const endpoint =
        type === "atld" ? `/api/v1/atld/detail/${groupId}` : `/api/v1/hoc-nghe/detail/${groupId}`;

    console.log("endpoint", endpoint);

    const response = await apiFetch<GetCourseDetailResponse>(endpoint);
    return response.data;
}

/**
 * Get user progress detail (admin only)
 */
export async function getUserDetail(
    type: CourseType,
    groupId: string,
    userId: string
): Promise<StudentStats> {
    const endpoint =
        type === "atld"
            ? `/api/v1/admin/atld/user/${groupId}/${userId}`
            : `/api/v1/admin/hoc-nghe/user/${groupId}/${userId}`;

    const response = await apiFetch<StudentStats>(endpoint);
    return response.data;
}
