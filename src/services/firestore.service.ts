/**
 * Firestore Service
 *
 * Centralized service for Firestore operations.
 * Provides type-safe methods for database operations.
 */
import { admin, adminDb } from "@/libs/firebase/firebaseAdmin.config";
import { CompletedVideo, CourseDetail, CourseProgress, StudentStats } from "@/types/api";

// ============================================================================
// Internal Types
// ============================================================================

type FirestoreData = Record<string, any>;

// ============================================================================
// Collections
// ============================================================================

const COLLECTIONS = {
    GROUPS: "groups",
    USERS: "users",
    PROGRESS: "progress",
} as const;

// ============================================================================
// Groups (Courses) Operations
// ============================================================================

/**
 * Get all active groups/courses
 */
export async function getAllGroups(type: "atld" | "hoc-nghe"): Promise<FirestoreData[]> {
    const snapshot = await adminDb
        .collection(COLLECTIONS.GROUPS)
        .where("isActive", "==", true)
        .where("type", "==", type)
        .get();

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
}

/**
 * Get a single group by ID
 */
export async function getGroupById(groupId: string): Promise<FirestoreData | null> {
    const doc = await adminDb.collection(COLLECTIONS.GROUPS).doc(groupId).get();

    if (!doc.exists) {
        return null;
    }

    return {
        id: doc.id,
        ...doc.data(),
    };
}

/**
 * Create a new group
 */
export async function createGroup(groupId: string, data: FirestoreData) {
    await adminDb.collection(COLLECTIONS.GROUPS).doc(groupId).set(data);
    return groupId;
}

/**
 * Update an existing group
 */
export async function updateGroup(groupId: string, data: Partial<CourseDetail>) {
    await adminDb
        .collection(COLLECTIONS.GROUPS)
        .doc(groupId)
        .update({
            ...data,
            updatedAt: Date.now(),
        });
}

/**
 * Delete a group
 */
export async function deleteGroup(groupId: string) {
    await adminDb.collection(COLLECTIONS.GROUPS).doc(groupId).delete();
}

// ============================================================================
// Progress Operations
// ============================================================================

/**
 * Get user progress for a specific group
 * Path: users/{userId}/progress/{groupId}
 */
export async function getUserProgress(
    userId: string,
    groupId: string
): Promise<CourseProgress | null> {
    const doc = await adminDb
        .collection(COLLECTIONS.USERS)
        .doc(userId)
        .collection(COLLECTIONS.PROGRESS)
        .doc(groupId)
        .get();

    if (!doc.exists) {
        return null;
    }

    return {
        groupId: doc.id,
        ...(doc.data() as Omit<CourseProgress, "groupId">),
    };
}

/**
 * Create initial progress when user starts a course
 */
export async function createUserProgress(
    userId: string,
    groupId: string,
    portraitUrl: string
): Promise<CourseProgress> {
    const now = Date.now();

    const progressData: CourseProgress = {
        groupId,
        currentSection: "theory",
        currentVideoIndex: 0,
        currentTime: 0,
        completedVideos: [],
        isCompleted: false,
        startedAt: now,
        lastUpdatedAt: now,
    };

    await adminDb
        .collection(COLLECTIONS.USERS)
        .doc(userId)
        .collection(COLLECTIONS.PROGRESS)
        .doc(groupId)
        .set({
            ...progressData,
            startImageUrl: portraitUrl,
        });

    return progressData;
}

/**
 * Update user progress
 */
export async function updateUserProgress(
    userId: string,
    groupId: string,
    updates: {
        section?: string;
        videoIndex?: number;
        currentTime?: number;
        isCompleted?: boolean;
        completedVideo?: CompletedVideo;
        examResult?: {
            score: number;
            totalQuestions: number;
            passed: boolean;
            completedAt: number;
        };
        lastUpdatedAt?: number;
    }
) {
    const now = Date.now();

    const progressRef = adminDb
        .collection(COLLECTIONS.USERS)
        .doc(userId)
        .collection(COLLECTIONS.PROGRESS)
        .doc(groupId);

    const updateData: FirestoreData = {
        lastUpdatedAt: updates.lastUpdatedAt || now,
    };

    // Only update these fields if they are provided
    if (updates.section !== undefined) {
        updateData.currentSection = updates.section;
    }

    if (updates.videoIndex !== undefined) {
        updateData.currentVideoIndex = updates.videoIndex;
    }

    if (updates.currentTime !== undefined) {
        updateData.currentTime = updates.currentTime;
    }

    if (updates.isCompleted !== undefined) {
        updateData.isCompleted = updates.isCompleted;
    }

    // If a video is marked as completed, add it to completedVideos array
    if (updates.completedVideo) {
        updateData.completedVideos = admin.firestore.FieldValue.arrayUnion(updates.completedVideo);
    }

    // If exam result is provided, save it
    if (updates.examResult) {
        updateData.examResult = updates.examResult;
    }

    await progressRef.update(updateData);

    return { success: true, lastUpdatedAt: now };
}

/**
 * Save learning capture image URL
 */
export async function saveLearningCapture(
    userId: string,
    groupId: string,
    imageUrl: string,
    type: "start" | "learning" | "finish"
) {
    const progressRef = adminDb
        .collection(COLLECTIONS.USERS)
        .doc(userId)
        .collection(COLLECTIONS.PROGRESS)
        .doc(groupId);

    if (type === "start") {
        // Use set with merge to create document if it doesn't exist
        await progressRef.set(
            {
                startImageUrl: imageUrl,
            },
            { merge: true }
        );

        return "startImageUrl";
    } else if (type === "finish") {
        await progressRef.set(
            {
                finishImageUrl: imageUrl,
            },
            { merge: true }
        );

        return "finishImageUrl";
    } else {
        // learning captures go to an array
        await progressRef.set(
            {
                learningCaptureUrls: admin.firestore.FieldValue.arrayUnion(imageUrl),
            },
            { merge: true }
        );

        return "learningCaptureUrls";
    }
}

// ============================================================================
// Admin Operations
// ============================================================================

/**
 * Get all students progress for a specific group (with pagination)
 */
export async function getGroupStats(groupId: string, pageSize: number = 20, cursor?: string) {
    let query = adminDb
        .collectionGroup(COLLECTIONS.PROGRESS)
        .where("groupId", "==", groupId)
        .orderBy("lastUpdatedAt", "desc")
        .limit(pageSize + 1); // +1 to check if there are more

    if (cursor) {
        const cursorDoc = await adminDb.doc(cursor).get();

        if (cursorDoc.exists) {
            query = query.startAfter(cursorDoc);
        }
    }

    const snapshot = await query.get();

    const hasMore = snapshot.docs.length > pageSize;

    const docs = hasMore ? snapshot.docs.slice(0, pageSize) : snapshot.docs;

    // Get user info for each progress
    const data: StudentStats[] = await Promise.all(
        docs.map(async (doc) => {
            const progressData = doc.data();

            const userId = doc.ref.parent.parent?.id;

            // Get user info
            let userInfo = { fullname: "Unknown", companyName: "" };

            if (userId) {
                const userDoc = await adminDb.collection(COLLECTIONS.USERS).doc(userId).get();

                if (userDoc.exists) {
                    const userData = userDoc.data();

                    userInfo = {
                        fullname: userData?.fullname || userData?.displayName || "Unknown",
                        companyName: userData?.companyName || "",
                    };
                }
            }

            return {
                userId: userId || "",
                fullname: userInfo.fullname,
                companyName: userInfo.companyName,
                isCompleted: progressData.isCompleted || false,
                startedAt: progressData.startedAt || 0,
                lastUpdatedAt: progressData.lastUpdatedAt || 0,
                startImageUrl: progressData.startImageUrl,
                finishImageUrl: progressData.finishImageUrl,
            };
        })
    );

    const nextCursor = hasMore ? docs[docs.length - 1].ref.path : undefined;

    return {
        data,
        nextCursor,
        hasMore,
    };
}

// ============================================================================
// User Operations
// ============================================================================

/**
 * Get user info by ID
 */
export async function getUserById(userId: string): Promise<FirestoreData | null> {
    const doc = await adminDb.collection(COLLECTIONS.USERS).doc(userId).get();

    if (!doc.exists) {
        return null;
    }

    return {
        id: doc.id,
        ...doc.data(),
    };
}
