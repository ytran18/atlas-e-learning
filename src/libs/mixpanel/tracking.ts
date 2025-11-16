/**
 * Mixpanel Tracking Utilities
 *
 * Type-safe tracking functions for all events in the app.
 * All tracking calls are wrapped in try-catch to prevent breaking the app.
 */
import { useEffect } from "react";

import { useUser } from "@clerk/nextjs";

import type {
    AdminCourseCreatedEvent,
    AdminCourseDeletedEvent,
    AdminCourseUpdatedEvent,
    AdminPageViewedEvent,
    AdminUserFilteredEvent,
    ApiErrorEvent,
    AuthErrorEvent,
    CourseCompletedEvent,
    CourseListViewViewedEvent,
    CoursePreviewStartClickedEvent,
    CoursePreviewViewedEvent,
    CourseStartFailedEvent,
    CourseStartInitiatedEvent,
    CourseStartedEvent,
    ErrorOccurredEvent,
    ExamQuestionAnsweredEvent,
    ExamQuestionChangedEvent,
    ExamResultViewedEvent,
    ExamStartedEvent,
    ExamSubmittedEvent,
    FilterAppliedEvent,
    FinishPhotoCapturedEvent,
    LearningCaptureTakenEvent,
    LearningPageViewedEvent,
    MixpanelEvent,
    PageViewedEvent,
    PhotoCaptureStartedEvent,
    PhotoCapturedEvent,
    PhotoRetakenEvent,
    PhotoUploadedEvent,
    SearchPerformedEvent,
    SectionNavigatedEvent,
    SidebarToggledEvent,
    UserSignedInEvent,
    UserSignedOutEvent,
    UserSignedUpEvent,
    VideoCompletedEvent,
    VideoErrorEvent,
    VideoLoadedEvent,
    VideoNavigatedEvent,
    VideoPausedEvent,
    VideoPlayedEvent,
    VideoProgressUpdatedEvent,
    VideoSeekedEvent,
} from "./event-types";
import { dispatchTrackingEvent, identifyMixpanel } from "./mixpanel-client";

// ============================================================================
// Core Tracking Function
// ============================================================================

/**
 * Safe tracking function that wraps all events in try-catch
 */
function trackEvent<T extends MixpanelEvent>(event: T): void {
    try {
        dispatchTrackingEvent(event.event, event.properties);
    } catch (error) {
        // Silently fail to prevent breaking the app
        if (process.env.NODE_ENV === "development") {
            console.warn("[Mixpanel] Tracking failed:", error);
        }
    }
}

// ============================================================================
// Authentication Events
// ============================================================================

export const trackUserSignedUp = (properties: UserSignedUpEvent["properties"]) => {
    trackEvent<UserSignedUpEvent>({
        event: "user_signed_up",
        properties,
    });
};

export const trackUserSignedIn = (properties: UserSignedInEvent["properties"]) => {
    trackEvent<UserSignedInEvent>({
        event: "user_signed_in",
        properties,
    });
};

export const trackUserSignedOut = (properties: UserSignedOutEvent["properties"]) => {
    trackEvent<UserSignedOutEvent>({
        event: "user_signed_out",
        properties,
    });
};

export const trackAuthError = (properties: AuthErrorEvent["properties"]) => {
    trackEvent<AuthErrorEvent>({
        event: "auth_error",
        properties,
    });
};

// ============================================================================
// Course Discovery Events
// ============================================================================

export const trackCourseListViewViewed = (properties: CourseListViewViewedEvent["properties"]) => {
    trackEvent<CourseListViewViewedEvent>({
        event: "course_list_viewed",
        properties,
    });
};

export const trackCoursePreviewViewed = (properties: CoursePreviewViewedEvent["properties"]) => {
    trackEvent<CoursePreviewViewedEvent>({
        event: "course_preview_viewed",
        properties,
    });
};

export const trackCoursePreviewStartClicked = (
    properties: CoursePreviewStartClickedEvent["properties"]
) => {
    trackEvent<CoursePreviewStartClickedEvent>({
        event: "course_preview_start_clicked",
        properties,
    });
};

// ============================================================================
// Course Enrollment Events
// ============================================================================

export const trackCourseStartInitiated = (properties: CourseStartInitiatedEvent["properties"]) => {
    trackEvent<CourseStartInitiatedEvent>({
        event: "course_start_initiated",
        properties,
    });
};

export const trackPhotoCaptureStarted = (properties: PhotoCaptureStartedEvent["properties"]) => {
    trackEvent<PhotoCaptureStartedEvent>({
        event: "photo_capture_started",
        properties,
    });
};

export const trackPhotoCaptured = (properties: PhotoCapturedEvent["properties"]) => {
    trackEvent<PhotoCapturedEvent>({
        event: "photo_captured",
        properties,
    });
};

export const trackPhotoRetaken = (properties: PhotoRetakenEvent["properties"]) => {
    trackEvent<PhotoRetakenEvent>({
        event: "photo_retaken",
        properties,
    });
};

export const trackPhotoUploaded = (properties: PhotoUploadedEvent["properties"]) => {
    trackEvent<PhotoUploadedEvent>({
        event: "photo_uploaded",
        properties,
    });
};

export const trackCourseStarted = (properties: CourseStartedEvent["properties"]) => {
    trackEvent<CourseStartedEvent>({
        event: "course_started",
        properties,
    });
};

export const trackCourseStartFailed = (properties: CourseStartFailedEvent["properties"]) => {
    trackEvent<CourseStartFailedEvent>({
        event: "course_start_failed",
        properties,
    });
};

// ============================================================================
// Learning Events
// ============================================================================

export const trackLearningPageViewed = (properties: LearningPageViewedEvent["properties"]) => {
    trackEvent<LearningPageViewedEvent>({
        event: "learning_page_viewed",
        properties,
    });
};

export const trackVideoLoaded = (properties: VideoLoadedEvent["properties"]) => {
    trackEvent<VideoLoadedEvent>({
        event: "video_loaded",
        properties,
    });
};

export const trackVideoPlayed = (properties: VideoPlayedEvent["properties"]) => {
    trackEvent<VideoPlayedEvent>({
        event: "video_played",
        properties,
    });
};

export const trackVideoPaused = (properties: VideoPausedEvent["properties"]) => {
    trackEvent<VideoPausedEvent>({
        event: "video_paused",
        properties,
    });
};

export const trackVideoSeeked = (properties: VideoSeekedEvent["properties"]) => {
    trackEvent<VideoSeekedEvent>({
        event: "video_seeked",
        properties,
    });
};

export const trackVideoCompleted = (properties: VideoCompletedEvent["properties"]) => {
    trackEvent<VideoCompletedEvent>({
        event: "video_completed",
        properties,
    });
};

export const trackVideoProgressUpdated = (properties: VideoProgressUpdatedEvent["properties"]) => {
    trackEvent<VideoProgressUpdatedEvent>({
        event: "video_progress_updated",
        properties,
    });
};

export const trackSectionNavigated = (properties: SectionNavigatedEvent["properties"]) => {
    trackEvent<SectionNavigatedEvent>({
        event: "section_navigated",
        properties,
    });
};

export const trackVideoNavigated = (properties: VideoNavigatedEvent["properties"]) => {
    trackEvent<VideoNavigatedEvent>({
        event: "video_navigated",
        properties,
    });
};

export const trackLearningCaptureTaken = (properties: LearningCaptureTakenEvent["properties"]) => {
    trackEvent<LearningCaptureTakenEvent>({
        event: "learning_capture_taken",
        properties,
    });
};

// ============================================================================
// Exam Events
// ============================================================================

export const trackExamStarted = (properties: ExamStartedEvent["properties"]) => {
    trackEvent<ExamStartedEvent>({
        event: "exam_started",
        properties,
    });
};

export const trackExamQuestionAnswered = (properties: ExamQuestionAnsweredEvent["properties"]) => {
    trackEvent<ExamQuestionAnsweredEvent>({
        event: "exam_question_answered",
        properties,
    });
};

export const trackExamQuestionChanged = (properties: ExamQuestionChangedEvent["properties"]) => {
    trackEvent<ExamQuestionChangedEvent>({
        event: "exam_question_changed",
        properties,
    });
};

export const trackExamSubmitted = (properties: ExamSubmittedEvent["properties"]) => {
    trackEvent<ExamSubmittedEvent>({
        event: "exam_submitted",
        properties,
    });
};

export const trackExamResultViewed = (properties: ExamResultViewedEvent["properties"]) => {
    trackEvent<ExamResultViewedEvent>({
        event: "exam_result_viewed",
        properties,
    });
};

// ============================================================================
// Course Completion Events
// ============================================================================

export const trackCourseCompleted = (properties: CourseCompletedEvent["properties"]) => {
    trackEvent<CourseCompletedEvent>({
        event: "course_completed",
        properties,
    });
};

export const trackFinishPhotoCaptured = (properties: FinishPhotoCapturedEvent["properties"]) => {
    trackEvent<FinishPhotoCapturedEvent>({
        event: "finish_photo_captured",
        properties,
    });
};

// ============================================================================
// Navigation & UI Events
// ============================================================================

export const trackPageViewed = (properties: PageViewedEvent["properties"]) => {
    trackEvent<PageViewedEvent>({
        event: "page_viewed",
        properties,
    });
};

export const trackSidebarToggled = (properties: SidebarToggledEvent["properties"]) => {
    trackEvent<SidebarToggledEvent>({
        event: "sidebar_toggled",
        properties,
    });
};

export const trackSearchPerformed = (properties: SearchPerformedEvent["properties"]) => {
    trackEvent<SearchPerformedEvent>({
        event: "search_performed",
        properties,
    });
};

export const trackFilterApplied = (properties: FilterAppliedEvent["properties"]) => {
    trackEvent<FilterAppliedEvent>({
        event: "filter_applied",
        properties,
    });
};

// ============================================================================
// Admin Events
// ============================================================================

export const trackAdminPageViewed = (properties: AdminPageViewedEvent["properties"]) => {
    trackEvent<AdminPageViewedEvent>({
        event: "admin_page_viewed",
        properties,
    });
};

export const trackAdminUserFiltered = (properties: AdminUserFilteredEvent["properties"]) => {
    trackEvent<AdminUserFilteredEvent>({
        event: "admin_user_filtered",
        properties,
    });
};

export const trackAdminCourseCreated = (properties: AdminCourseCreatedEvent["properties"]) => {
    trackEvent<AdminCourseCreatedEvent>({
        event: "admin_course_created",
        properties,
    });
};

export const trackAdminCourseUpdated = (properties: AdminCourseUpdatedEvent["properties"]) => {
    trackEvent<AdminCourseUpdatedEvent>({
        event: "admin_course_updated",
        properties,
    });
};

export const trackAdminCourseDeleted = (properties: AdminCourseDeletedEvent["properties"]) => {
    trackEvent<AdminCourseDeletedEvent>({
        event: "admin_course_deleted",
        properties,
    });
};

// ============================================================================
// Error Events
// ============================================================================

export const trackErrorOccurred = (properties: ErrorOccurredEvent["properties"]) => {
    trackEvent<ErrorOccurredEvent>({
        event: "error_occurred",
        properties,
    });
};

export const trackApiError = (properties: ApiErrorEvent["properties"]) => {
    trackEvent<ApiErrorEvent>({
        event: "api_error",
        properties,
    });
};

export const trackVideoError = (properties: VideoErrorEvent["properties"]) => {
    trackEvent<VideoErrorEvent>({
        event: "video_error",
        properties,
    });
};

// ============================================================================
// User Identification Hook
// ============================================================================

/**
 * Hook to identify user in Mixpanel when they sign in
 * Should be used in a component that wraps authenticated routes
 */
export function useMixpanelUserIdentification() {
    const { user, isLoaded } = useUser();

    useEffect(() => {
        if (isLoaded && user?.id) {
            // Identify immediately (will be queued if Mixpanel not ready)
            identifyMixpanel(user.id);

            // Retry mechanism: check periodically if Mixpanel becomes ready
            // This handles edge cases where Mixpanel takes longer to initialize
            let retryCount = 0;
            const maxRetries = 10; // Try for up to 5 seconds (10 * 500ms)
            const retryInterval = 500; // Check every 500ms

            const retryTimer = setInterval(() => {
                retryCount++;

                // Try to identify again (will succeed if Mixpanel is now ready)
                identifyMixpanel(user.id);

                // Stop retrying after max attempts or if successful
                if (retryCount >= maxRetries) {
                    clearInterval(retryTimer);
                }
            }, retryInterval);

            return () => {
                clearInterval(retryTimer);
            };
        }
    }, [user?.id, isLoaded]);
}

// ============================================================================
// Debounce/Throttle Utilities
// ============================================================================

/**
 * Debounce function for frequent events (e.g., progress updates)
 */
export function debounce<T extends (...args: any[]) => void>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null;
            func(...args);
        };

        if (timeout) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function for frequent events
 */
export function throttle<T extends (...args: any[]) => void>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean;

    return function executedFunction(...args: Parameters<T>) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}
