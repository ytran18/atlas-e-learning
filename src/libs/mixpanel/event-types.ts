/**
 * Mixpanel Event Types
 *
 * Định nghĩa types cho tất cả events được track trong app.
 * Giúp đảm bảo type safety và consistency khi implement tracking.
 */

// ============================================================================
// Common Types
// ============================================================================

export type CourseType = "atld" | "hoc-nghe";
export type SectionType = "theory" | "practice";
export type CaptureType = "start" | "learning" | "finish";

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

export interface CourseListViewViewedEvent {
    event: "course_list_viewed";
    properties: {
        course_type: CourseType;
        total_courses: number;
    };
}

export interface CoursePreviewViewedEvent {
    event: "course_preview_viewed";
    properties: {
        course_type: CourseType;
        course_id: string;
        course_name: string;
        video_count: number;
        exam_question_count: number;
        is_joined: boolean;
        is_completed: boolean;
    };
}

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

export interface CourseStartInitiatedEvent {
    event: "course_start_initiated";
    properties: {
        course_type: CourseType;
        course_id: string;
        course_name: string;
    };
}

export interface PhotoCaptureStartedEvent {
    event: "photo_capture_started";
    properties: {
        course_type: CourseType;
        course_id: string;
        capture_type: "start";
    };
}

export interface PhotoCapturedEvent {
    event: "photo_captured";
    properties: {
        course_type: CourseType;
        course_id: string;
        capture_type: CaptureType;
    };
}

export interface PhotoRetakenEvent {
    event: "photo_retaken";
    properties: {
        course_type: CourseType;
        course_id: string;
        capture_type: CaptureType;
        retake_count: number;
    };
}

export interface PhotoUploadedEvent {
    event: "photo_uploaded";
    properties: {
        course_type: CourseType;
        course_id: string;
        capture_type: CaptureType;
        upload_duration_ms: number;
    };
}

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

export interface CourseStartFailedEvent {
    event: "course_start_failed";
    properties: {
        course_type: CourseType;
        course_id: string;
        error_type: "upload_failed" | "api_error" | "validation_error";
        error_message: string;
    };
}

// ============================================================================
// Learning Events
// ============================================================================

export interface LearningPageViewedEvent {
    event: "learning_page_viewed";
    properties: {
        course_type: CourseType;
        course_id: string;
        current_section: SectionType;
        current_video_index: number;
        is_resuming: boolean;
    };
}

export interface VideoLoadedEvent {
    event: "video_loaded";
    properties: {
        course_type: CourseType;
        course_id: string;
        section: SectionType;
        video_index: number;
        video_title?: string;
        load_duration_ms: number;
    };
}

export interface VideoPlayedEvent {
    event: "video_played";
    properties: {
        course_type: CourseType;
        course_id: string;
        section: SectionType;
        video_index: number;
        video_title?: string;
        resume_time?: number; // seconds
    };
}

export interface VideoPausedEvent {
    event: "video_paused";
    properties: {
        course_type: CourseType;
        course_id: string;
        section: SectionType;
        video_index: number;
        current_time: number; // seconds
        video_duration: number; // seconds
        watch_percentage: number;
    };
}

export interface VideoSeekedEvent {
    event: "video_seeked";
    properties: {
        course_type: CourseType;
        course_id: string;
        section: SectionType;
        video_index: number;
        from_time: number; // seconds
        to_time: number; // seconds
    };
}

export interface VideoCompletedEvent {
    event: "video_completed";
    properties: {
        course_type: CourseType;
        course_id: string;
        section: SectionType;
        video_index: number;
        video_title?: string;
        watch_duration: number; // seconds
        video_duration: number; // seconds
        completion_percentage: number;
    };
}

export interface VideoProgressUpdatedEvent {
    event: "video_progress_updated";
    properties: {
        course_type: CourseType;
        course_id: string;
        section: SectionType;
        video_index: number;
        current_time: number; // seconds
        video_duration: number; // seconds
        watch_percentage: number;
    };
}

export interface SectionNavigatedEvent {
    event: "section_navigated";
    properties: {
        course_type: CourseType;
        course_id: string;
        from_section: SectionType;
        to_section: SectionType;
    };
}

export interface VideoNavigatedEvent {
    event: "video_navigated";
    properties: {
        course_type: CourseType;
        course_id: string;
        from_section: SectionType;
        from_video_index: number;
        to_section: SectionType;
        to_video_index: number;
        navigation_method: "next" | "previous" | "sidebar" | "hash";
    };
}

export interface LearningCaptureTakenEvent {
    event: "learning_capture_taken";
    properties: {
        course_type: CourseType;
        course_id: string;
        capture_type: "learning";
        section: SectionType;
        video_index: number;
        current_time: number; // seconds
    };
}

// ============================================================================
// Exam Events
// ============================================================================

export interface ExamStartedEvent {
    event: "exam_started";
    properties: {
        course_type: CourseType;
        course_id: string;
        course_name: string;
        total_questions: number;
    };
}

export interface ExamQuestionAnsweredEvent {
    event: "exam_question_answered";
    properties: {
        course_type: CourseType;
        course_id: string;
        question_id: string;
        question_index: number; // 1-based
        answer_selected: string;
        is_correct?: boolean; // Only after submit
        time_spent_ms?: number;
    };
}

export interface ExamQuestionChangedEvent {
    event: "exam_question_changed";
    properties: {
        course_type: CourseType;
        course_id: string;
        question_id: string;
        question_index: number;
        previous_answer: string;
        new_answer: string;
        change_count: number;
    };
}

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

export interface ExamResultViewedEvent {
    event: "exam_result_viewed";
    properties: {
        course_type: CourseType;
        course_id: string;
        score: number;
        total_questions: number;
        percentage: number;
        passed: boolean;
    };
}

// ============================================================================
// Course Completion Events
// ============================================================================

export interface CourseCompletedEvent {
    event: "course_completed";
    properties: {
        course_type: CourseType;
        course_id: string;
        course_name: string;
        exam_score: number;
        exam_percentage: number;
        total_videos: number;
        completed_videos: number;
        total_learning_time_ms: number;
        started_at: number; // timestamp
        completed_at: number; // timestamp
        days_to_complete: number;
    };
}

export interface FinishPhotoCapturedEvent {
    event: "finish_photo_captured";
    properties: {
        course_type: CourseType;
        course_id: string;
        capture_type: "finish";
    };
}

// ============================================================================
// Navigation & UI Events
// ============================================================================

export interface PageViewedEvent {
    event: "page_viewed";
    properties: {
        page_path: string;
        page_title?: string;
        referrer?: string;
    };
}

export interface SidebarToggledEvent {
    event: "sidebar_toggled";
    properties: {
        course_type: CourseType;
        course_id: string;
        is_open: boolean;
    };
}

export interface SearchPerformedEvent {
    event: "search_performed";
    properties: {
        search_term: string;
        search_type?: "course" | "user" | "admin";
        results_count: number;
    };
}

export interface FilterAppliedEvent {
    event: "filter_applied";
    properties: {
        filter_type: string;
        filter_value: string;
        context: "course_list" | "admin_user" | "admin_course";
    };
}

// ============================================================================
// Admin Events
// ============================================================================

export interface AdminPageViewedEvent {
    event: "admin_page_viewed";
    properties: {
        admin_page: "user" | "atld_course" | "hoc_nghe_course";
    };
}

export interface AdminUserFilteredEvent {
    event: "admin_user_filtered";
    properties: {
        course_type?: CourseType;
        course_id?: string;
        search_term?: string;
        page: number;
        page_size: number;
    };
}

export interface AdminCourseCreatedEvent {
    event: "admin_course_created";
    properties: {
        course_type: CourseType;
        course_id: string;
        course_name: string;
        video_count: number;
        exam_question_count: number;
    };
}

export interface AdminCourseUpdatedEvent {
    event: "admin_course_updated";
    properties: {
        course_type: CourseType;
        course_id: string;
        fields_updated: string[];
    };
}

export interface AdminCourseDeletedEvent {
    event: "admin_course_deleted";
    properties: {
        course_type: CourseType;
        course_id: string;
        course_name: string;
    };
}

// ============================================================================
// Error Events
// ============================================================================

export interface ErrorOccurredEvent {
    event: "error_occurred";
    properties: {
        error_type: "api_error" | "video_error" | "upload_error" | "validation_error" | "unknown";
        error_message: string;
        error_stack?: string;
        page_path: string;
        user_action?: string;
    };
}

export interface ApiErrorEvent {
    event: "api_error";
    properties: {
        endpoint: string;
        method: "GET" | "POST" | "PATCH" | "DELETE";
        status_code?: number;
        error_message: string;
        request_body?: object; // Mask sensitive data
    };
}

export interface VideoErrorEvent {
    event: "video_error";
    properties: {
        course_type: CourseType;
        course_id: string;
        video_index: number;
        error_type: "load_error" | "play_error" | "network_error";
        error_message: string;
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
    | CourseListViewViewedEvent
    | CoursePreviewViewedEvent
    | CoursePreviewStartClickedEvent
    | CourseStartInitiatedEvent
    | PhotoCaptureStartedEvent
    | PhotoCapturedEvent
    | PhotoRetakenEvent
    | PhotoUploadedEvent
    | CourseStartedEvent
    | CourseStartFailedEvent
    | LearningPageViewedEvent
    | VideoLoadedEvent
    | VideoPlayedEvent
    | VideoPausedEvent
    | VideoSeekedEvent
    | VideoCompletedEvent
    | VideoProgressUpdatedEvent
    | SectionNavigatedEvent
    | VideoNavigatedEvent
    | LearningCaptureTakenEvent
    | ExamStartedEvent
    | ExamQuestionAnsweredEvent
    | ExamQuestionChangedEvent
    | ExamSubmittedEvent
    | ExamResultViewedEvent
    | CourseCompletedEvent
    | FinishPhotoCapturedEvent
    | PageViewedEvent
    | SidebarToggledEvent
    | SearchPerformedEvent
    | FilterAppliedEvent
    | AdminPageViewedEvent
    | AdminUserFilteredEvent
    | AdminCourseCreatedEvent
    | AdminCourseUpdatedEvent
    | AdminCourseDeletedEvent
    | ErrorOccurredEvent
    | ApiErrorEvent
    | VideoErrorEvent;
