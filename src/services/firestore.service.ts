/**
 * Firestore Service
 *
 * Centralized service for Firestore operations.
 * Provides type-safe methods for database operations.
 */
import { admin, adminDb } from "@/libs/firebase/firebaseAdmin.config";
import {
    CategorizedCourse,
    CompletedVideo,
    CourseDetail,
    CourseProgress,
    ExamAnswer,
    StudentStats,
    UserCourseCompleted,
    UserCourseProgress,
} from "@/types/api";

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
    SEARCH_INDEX: "search_index",
    PROGRESS: "progress",
} as const;

// ============================================================================
// Groups (Courses) Operations
// ============================================================================

/**
 * Get all active groups/courses
 */
export async function getAllGroups(type: "atld" | "hoc-nghe" | "all"): Promise<FirestoreData[]> {
    if (type === "all") {
        const snapshot = await adminDb
            .collection(COLLECTIONS.GROUPS)
            .where("isActive", "==", true)
            .get();

        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    }

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

    const data = doc.data() as Omit<CourseProgress, "groupId">;

    // Ensure completedVideos is always an array
    return {
        groupId: doc.id,
        ...data,
        completedVideos: data.completedVideos || [],
    };
}

/**
 * Batch get user progress for multiple groups
 * More efficient than calling getUserProgress multiple times
 * Path: users/{userId}/progress/{groupId}
 */
export async function getUserProgresses(
    userId: string,
    groupIds: string[]
): Promise<Record<string, CourseProgress>> {
    if (groupIds.length === 0) {
        return {};
    }

    // Firestore batch read using Promise.all for parallel reads
    const progressPromises = groupIds.map(async (groupId) => {
        const doc = await adminDb
            .collection(COLLECTIONS.USERS)
            .doc(userId)
            .collection(COLLECTIONS.PROGRESS)
            .doc(groupId)
            .get();

        if (!doc.exists) {
            return null;
        }

        const data = doc.data() as Omit<CourseProgress, "groupId">;

        // Ensure completedVideos is always an array
        return {
            groupId: doc.id,
            ...data,
            completedVideos: data.completedVideos || [],
        } as CourseProgress;
    });

    const results = await Promise.all(progressPromises);

    // Convert array to object for easier lookup
    const progressMap: Record<string, CourseProgress> = {};
    groupIds.forEach((groupId, index) => {
        if (results[index]) {
            progressMap[groupId] = results[index]!;
        }
    });

    return progressMap;
}

/**
 * Create initial progress when user starts a course
 */
export async function createUserProgress(
    userId: string,
    groupId: string,
    portraitUrl: string,
    courseName: string,
    userFullname: string,
    userBirthDate: string,
    userCompanyName: string,
    userIdCard: string
): Promise<CourseProgress> {
    const now = Date.now();

    const objectId = `${userId}_${groupId}`;

    const progressData: CourseProgress = {
        groupId,
        currentSection: "theory",
        currentVideoIndex: 0,
        currentTime: 0,
        completedVideos: [],
        isCompleted: false,
        startedAt: now,
        lastUpdatedAt: now,
        startImageUrl: portraitUrl,
        courseName,
        userFullname,
        userBirthDate,
        userCompanyName,
        userIdCard,
    };

    const progressGroupRef = adminDb.collection(COLLECTIONS.SEARCH_INDEX).doc(objectId);

    const userRef = adminDb
        .collection(COLLECTIONS.USERS)
        .doc(userId)
        .collection(COLLECTIONS.PROGRESS)
        .doc(groupId);

    const docSnap = await progressGroupRef.get();

    // set vào collection search_index để sync qua algolia
    if (!docSnap.exists) {
        await progressGroupRef.set({
            objectID: objectId,
            userId: userId,
            ...progressData,
        });
    }

    // set thêm 1 document vào subcollection users
    await userRef.set(progressData);

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
        finishImageUrl?: string;
        examResult?: {
            score: number;
            totalQuestions: number;
            passed: boolean;
            completedAt: number;
            answers?: ExamAnswer[];
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

    const searchIndexRef = adminDb.collection(COLLECTIONS.SEARCH_INDEX).doc(`${userId}_${groupId}`);

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

    // If finish image URL is provided, save it
    if (updates.finishImageUrl !== undefined) {
        updateData.finishImageUrl = updates.finishImageUrl;
    }

    // If exam result is provided, save it
    if (updates.examResult) {
        updateData.examResult = updates.examResult;
    }

    await progressRef.update(updateData);

    await searchIndexRef.update(updateData);

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
 * Optimized: Count query is now optional and can be skipped for better performance
 * Supports searching by: userFullname, userIdCard (cccd), and userCompanyName
 */
export async function getGroupStats(
    groupId: string,
    pageSize: number = 20,
    cursor?: string,
    searchName?: string,
    includeCount: boolean = false
) {
    // Build base query
    let queryRef: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = adminDb
        .collection(COLLECTIONS.PROGRESS)
        .doc(groupId)
        .collection(COLLECTIONS.USERS);

    // Determine search strategy based on search term
    const isNumericSearch = searchName && /^\d+$/.test(searchName.trim());
    const searchTerm = searchName?.trim().toLowerCase() || "";

    if (searchName) {
        if (isNumericSearch) {
            // For numeric search (ID card), order by lastUpdatedAt and filter by ID card in memory
            // This avoids potential index issues with cccd/userIdCard fields
            queryRef = queryRef.orderBy("lastUpdatedAt", "desc");
        } else {
            // For text search, order by userFullname (supports name and company name filtering)
            const searchEnd = searchName + "\uf8ff";
            queryRef = queryRef.orderBy("userFullname").startAt(searchName).endAt(searchEnd);
        }
    } else {
        queryRef = queryRef.orderBy("lastUpdatedAt", "desc");
    }

    // When searching, fetch more results to filter by multiple fields
    // This allows us to search across name, ID card, and company name
    // Optimized: Use pageSize * 2 instead of * 3 to reduce read operations
    // while still providing enough results for filtering
    const fetchLimit = searchName ? Math.max(pageSize * 2, 50) : pageSize + 1;

    // Optimize cursor pagination: only fetch cursor doc if needed
    let query = queryRef.limit(fetchLimit);

    if (cursor) {
        // Try to use cursor directly without fetching the document first
        // This works if cursor is the document ID and we're using startAfter
        // For better performance, we'll fetch the cursor doc only when necessary
        try {
            const cursorDoc = await adminDb
                .collection(COLLECTIONS.PROGRESS)
                .doc(groupId)
                .collection(COLLECTIONS.USERS)
                .doc(cursor)
                .get();

            if (cursorDoc.exists) {
                query = query.startAfter(cursorDoc);
            }
        } catch (error) {
            console.warn("Failed to fetch cursor document:", error);
            // Continue without cursor if fetch fails
        }
    }

    // Execute queries in parallel for better performance
    const [snapshot, countResult] = await Promise.allSettled([
        query.get(),
        // Only fetch count if explicitly requested (for first page or when needed)
        includeCount
            ? adminDb
                  .collection(COLLECTIONS.PROGRESS)
                  .doc(groupId)
                  .collection(COLLECTIONS.USERS)
                  .count()
                  .get()
            : Promise.resolve(null),
    ]);

    const snapshotData =
        snapshot.status === "fulfilled" ? snapshot.value : { docs: [], empty: true };

    const countData =
        countResult.status === "fulfilled" && countResult.value
            ? countResult.value.data().count || 0
            : 0;

    // Map all documents first
    const allDocs = snapshotData.docs.map((doc) => {
        const d = doc.data();

        return {
            doc,
            data: {
                userId: doc.id,
                fullname: d.userFullname || "",
                companyName: d.userCompanyName || "",
                isCompleted: d.isCompleted || false,
                startedAt: d.startedAt || 0,
                lastUpdatedAt: d.lastUpdatedAt || 0,
                startImageUrl: d.startImageUrl,
                finishImageUrl: d.finishImageUrl,
                completedVideos: d.completedVideos || [],
                courseName: d.courseName || "",
                currentSection: d.currentSection || "",
                currentVideoIndex: d.currentVideoIndex || 0,
                birthDate: d.userBirthDate || "",
                examResult: d.examResult || {},
                userIdCard: String(d.cccd ?? d.userIdCard ?? ""),
                cccd: String(d.cccd ?? ""),
            },
        };
    });

    // Filter results if searching (to support searching by name, ID card, and company name)
    let filteredDocs = allDocs;
    if (searchName) {
        if (isNumericSearch) {
            // For numeric search, filter by ID card (cccd or userIdCard)
            filteredDocs = allDocs.filter((item) => {
                return item.data.userIdCard.includes(searchName.trim());
            });
        } else {
            // For text search, filter by name or company name
            filteredDocs = allDocs.filter((item) => {
                const fullnameMatch = item.data.fullname.toLowerCase().includes(searchTerm);
                const companyMatch = item.data.companyName.toLowerCase().includes(searchTerm);
                return fullnameMatch || companyMatch;
            });
        }
    }

    // Apply pagination to filtered results
    const hasMore = filteredDocs.length > pageSize;
    const paginatedDocs = hasMore ? filteredDocs.slice(0, pageSize) : filteredDocs;

    const data: StudentStats[] = paginatedDocs.map((item) => item.data);

    const nextCursor = hasMore ? paginatedDocs[paginatedDocs.length - 1].doc.id : undefined;

    const totalDocs = includeCount ? countData : 0;

    const totalPages = includeCount ? Math.ceil(totalDocs / pageSize) : 0;

    return {
        data,
        nextCursor,
        hasMore,
        totalDocs,
        totalPages,
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

/**
 * Update user info
 */
export async function updateUserInfo(userId: string, updates: Partial<FirestoreData>) {
    await adminDb.collection(COLLECTIONS.USERS).doc(userId).update(updates);
}

/**
 * Get user progress detail from progress/{groupId}/users/{userId}
 * Returns full user document with all fields
 */
export async function getUserProgressDetail(
    groupId: string,
    userId: string
): Promise<StudentStats | null> {
    const doc = await adminDb.collection(COLLECTIONS.SEARCH_INDEX).doc(userId).get();

    if (!doc.exists) {
        return null;
    }

    const d = doc.data();

    return {
        userId: (doc?.id as string).split("_").slice(0, 2).join("_"),
        fullname: d?.userFullname || "",
        birthDate: d?.userBirthDate || "",
        companyName: d?.userCompanyName || "",
        isCompleted: d?.isCompleted || false,
        startedAt: d?.startedAt || 0,
        lastUpdatedAt: d?.lastUpdatedAt || 0,
        startImageUrl: d?.startImageUrl,
        finishImageUrl: d?.finishImageUrl,
        completedVideos: d?.completedVideos || [],
        courseName: d?.courseName || "",
        currentSection: d?.currentSection || "theory",
        currentVideoIndex: d?.currentVideoIndex || 0,
        examResult: d?.examResult || undefined,
        userIdCard: String(d?.cccd ?? d?.userIdCard ?? ""),
    };
}

/**
 * Get student stats by list of user IDs (from Algolia results)
 * This is more efficient than pagination when we already have the objectIDs
 */
export async function getGroupStatsByUserIds(
    groupId: string,
    userIds: string[]
): Promise<StudentStats[]> {
    if (userIds.length === 0) {
        return [];
    }

    // Firestore 'in' queries are limited to 10 items, so we need to batch
    const batchSize = 10;
    const batches: string[][] = [];

    for (let i = 0; i < userIds.length; i += batchSize) {
        batches.push(userIds.slice(i, i + batchSize));
    }

    // Fetch all batches in parallel
    const batchPromises = batches.map((batch) => {
        const queryRef = adminDb
            .collection(COLLECTIONS.SEARCH_INDEX)
            .where(admin.firestore.FieldPath.documentId(), "in", batch);

        return queryRef.get();
    });

    const batchResults = await Promise.all(batchPromises);

    // Combine all results and map to StudentStats
    const allDocs: StudentStats[] = [];

    batchResults.forEach((snapshot) => {
        snapshot.docs.forEach((doc) => {
            const d = doc.data();

            allDocs.push({
                userId: doc.id,
                fullname: d.userFullname || "",
                userIdCard: String(d.cccd ?? d.userIdCard ?? ""),
                birthDate: d.userBirthDate || "",
                companyName: d.userCompanyName || "",
                isCompleted: d.isCompleted || false,
                startedAt: d.startedAt
                    ? new Date(d.startedAt)
                          .toLocaleString("vi-VN", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                          })
                          .replace(",", "")
                    : "",
                courseName: d.courseName || "",
                lastUpdatedAt: d.lastUpdatedAt
                    ? new Date(d.lastUpdatedAt)
                          .toLocaleString("vi-VN", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                          })
                          .replace(",", "")
                    : "",
                currentSection: d.currentSection || "",
                finishImageUrl: d.finishImageUrl,
            });
        });
    });

    // Maintain the order of userIds as provided (matching Algolia results order)
    const orderedDocs = userIds
        .map((userId) => allDocs.find((doc) => doc.userId === userId))
        .filter((doc): doc is StudentStats => doc !== undefined);

    return orderedDocs;
}

export async function getUserCourseProgress(
    userId: string,
    type: "atld" | "hoc-nghe"
): Promise<UserCourseProgress> {
    const userCourseProgress = await adminDb
        .collection(COLLECTIONS.USERS)
        .doc(userId)
        .collection(COLLECTIONS.PROGRESS)
        .get();

    const allCourses = await getAllGroups(type);

    // Build list with proper CategorizedCourse props and logic for CourseStatus assignment
    const allCourseProgressData: CategorizedCourse[] = allCourses.map((course: any) => {
        const progressDoc = userCourseProgress.docs.find((doc) => doc.id === course.id);

        const progressData = progressDoc?.data();

        // Determine course status
        let status: "not-started" | "in-progress" | "incomplete" | "completed" = "not-started";

        if (progressData) {
            if (progressData.isCompleted) {
                status = "completed";
            } else if (progressData.completedVideos && progressData.completedVideos.length > 0) {
                status = "in-progress";
            } else {
                status = "incomplete";
            }
        }

        return {
            id: course?.id,
            sortNo: course?.sortNo,
            type: course?.type,
            title: course?.title || "",
            description: course?.description || "",
            numberOfTheory: course?.theory?.videos?.length || 0,
            numberOfPractice: course?.practice?.videos?.length || 0,
            totalQuestionOfExam: course?.exam?.questions?.length || 0,
            status,
            progress: progressData as CourseProgress | undefined,
        };
    });

    // sort by sortNo
    allCourseProgressData?.sort((a, b) => {
        const aHas = typeof a.sortNo === "number";

        const bHas = typeof b.sortNo === "number";

        if (aHas && bHas) return (a.sortNo as number) - (b.sortNo as number);

        if (aHas) return -1; // a comes before b

        if (bHas) return 1; // b comes before a

        return 0; // both missing
    });

    const inProgress = allCourseProgressData.filter((course) => course.status === "in-progress");
    const notStarted = allCourseProgressData.filter((course) => course.status === "not-started");
    const incomplete = allCourseProgressData.filter((course) => course.status === "incomplete");
    const completed = allCourseProgressData.filter((course) => course.status === "completed");

    return {
        inProgress,
        notStarted,
        incomplete,
        completed,
    };
}

// delete user progress
export async function deleteUserProgress(userId: string, groupId: string): Promise<boolean> {
    const userCollectionProgressRef = adminDb
        .collection(COLLECTIONS.USERS)
        .doc(userId)
        .collection(COLLECTIONS.PROGRESS)
        .doc(groupId);

    const searchIndexCollectionRef = adminDb
        .collection(COLLECTIONS.SEARCH_INDEX)
        .doc(`${userId}_${groupId}`);

    const [userCollectionProgressSnapshot, searchIndexCollectionSnapshot] = await Promise.all([
        userCollectionProgressRef.get(),
        searchIndexCollectionRef.get(),
    ]);

    if (!userCollectionProgressSnapshot.exists || !searchIndexCollectionSnapshot.exists) {
        return false;
    }

    await userCollectionProgressRef.delete();
    await searchIndexCollectionRef.delete();

    return true;
}

// get user completed courses
export async function getUserCourseCompleted(userId: string): Promise<UserCourseCompleted[]> {
    const snapshot = await adminDb
        .collection(COLLECTIONS.SEARCH_INDEX)
        .where("userIdCard", "==", userId)
        .get();

    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            userIdCard: data.userIdCard || "",
            startedAt: data.startedAt || 0,
            lastUpdatedAt: data.lastUpdatedAt || 0,
            startImageUrl: data.startImageUrl || "",
            finishImageUrl: data.finishImageUrl || "",
            groupId: data?.groupId ?? "",
            examResult: data.examResult,
            isCompleted: data.isCompleted || true,
            currentSection: data.currentSection || "exam",
            courseName: data.courseName || "",
        } as UserCourseCompleted;
    });
}

// retake the exam
export async function retakeCourseExam(userId: string, groupId: string) {
    const objectId = `${userId}_${groupId}`;

    const userCollectionRef = adminDb
        .collection(COLLECTIONS.USERS)
        .doc(userId)
        .collection(COLLECTIONS.PROGRESS)
        .doc(groupId);

    const searchIndexRef = adminDb.collection(COLLECTIONS.SEARCH_INDEX).doc(objectId);

    const updateData = {
        isCompleted: false,
    };

    await Promise.all([userCollectionRef.update(updateData), searchIndexRef.update(updateData)]);

    return { success: true };
}
