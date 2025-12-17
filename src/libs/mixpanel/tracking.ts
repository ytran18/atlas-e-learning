/**
 * Mixpanel Tracking Utilities
 *
 * Type-safe tracking functions for all events in the app.
 * All tracking calls are wrapped in try-catch to prevent breaking the app.
 */
import { useEffect } from "react";

import { useUser } from "@clerk/nextjs";

import type {
    AuthErrorEvent,
    CoursePreviewStartClickedEvent,
    CourseStartFailedEvent,
    CourseStartedEvent,
    DocumentSearchedEvent,
    ExamSubmittedEvent,
    MixpanelEvent,
    RetakeCourseErrorEvent,
    RetakeCourseSuccessEvent,
    StudentSearchedEvent,
    UserSignedInEvent,
    UserSignedOutEvent,
    UserSignedUpEvent,
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

// track retake course error
export const trackRetakeCourseError = (properties: RetakeCourseErrorEvent["properties"]) => {
    trackEvent<RetakeCourseErrorEvent>({
        event: "retake_course_error",
        properties,
    });
};

export const trackRetakeCourseSuccess = (properties: RetakeCourseSuccessEvent["properties"]) => {
    trackEvent<RetakeCourseSuccessEvent>({
        event: "retake_course_success",
        properties,
    });
};

// ============================================================================
// Course Discovery Events
// ============================================================================

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
// Exam Events
// ============================================================================

export const trackExamSubmitted = (properties: ExamSubmittedEvent["properties"]) => {
    trackEvent<ExamSubmittedEvent>({
        event: "exam_submitted",
        properties,
    });
};

// ============================================================================
// Search Events
// ============================================================================

export const trackStudentSearched = (properties: StudentSearchedEvent["properties"]) => {
    trackEvent<StudentSearchedEvent>({
        event: "student_searched",
        properties,
    });
};

export const trackDocumentSearched = (properties: DocumentSearchedEvent["properties"]) => {
    trackEvent<DocumentSearchedEvent>({
        event: "document_searched",
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
