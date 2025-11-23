/**
 * Mixpanel Event Types
 *
 * Định nghĩa types cho tất cả events được track trong app.
 * Giúp đảm bảo type safety và consistency khi implement tracking.
 */

// ============================================================================
// Common Types
// ============================================================================

type CourseType = "atld" | "hoc-nghe";

// ============================================================================
// Authentication Events
// ============================================================================

export interface UserSignedUpEvent {
    event: "user_signed_up";
    properties: {
        user_id: string;
        full_name?: string;
        is_vietnamese: boolean;
        has_company: boolean;
        signup_method: "cccd" | "passport";
    };
}

export interface UserSignedInEvent {
    event: "user_signed_in";
    properties: {
        user_id: string;
        signin_method: "cccd" | "passport";
    };
}

export interface UserSignedOutEvent {
    event: "user_signed_out";
    properties: {
        user_id: string;
        session_duration?: number; // seconds
    };
}

export interface AuthErrorEvent {
    event: "auth_error";
    properties: {
        error_type: "signin_failed" | "signup_failed" | "captcha_failed";
        error_message: string;
        user_input?: string; // masked
    };
}

// ============================================================================
// Course Discovery Events
// ============================================================================

export interface CoursePreviewStartClickedEvent {
    event: "course_preview_start_clicked";
    properties: {
        course_type: CourseType;
        course_id: string;
        course_name: string;
    };
}

// ============================================================================
// Course Enrollment Events
// ============================================================================

export interface CourseStartedEvent {
    event: "course_started";
    properties: {
        course_type: CourseType;
        course_id: string;
        course_name: string;
        user_fullname: string;
        user_has_company: boolean;
    };
}

// ============================================================================
// Exam Events
// ============================================================================

export interface ExamSubmittedEvent {
    event: "exam_submitted";
    properties: {
        course_type: CourseType;
        course_id: string;
        total_questions: number;
        score: number;
        percentage: number;
        passed: boolean;
    };
}

// ============================================================================
// Error Events
// ============================================================================

interface ApiErrorEvent {
    event: "api_error";
    properties: {
        endpoint: string;
        method: "GET" | "POST" | "PATCH" | "DELETE";
        status_code?: number;
        error_message: string;
        request_body?: object; // Mask sensitive data
    };
}

// ============================================================================
// Union Type for All Events
// ============================================================================

export type MixpanelEvent =
    | UserSignedUpEvent
    | UserSignedInEvent
    | UserSignedOutEvent
    | AuthErrorEvent
    | CoursePreviewStartClickedEvent
    | CourseStartedEvent
    | ExamSubmittedEvent
    | ApiErrorEvent;
