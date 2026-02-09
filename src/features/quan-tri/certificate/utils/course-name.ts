/**
 * Get display name for a course by its groupId
 * @param groupId - The group/course ID from Algolia (e.g., "ATLD0124", "HN0224")
 * @returns Human-readable course name
 */
export const getCourseNameFromGroupId = (groupId?: string): string => {
    if (!groupId) return "Chưa xác định";

    // Extract prefix (ATLD or HN) and format
    const upper = groupId.toUpperCase();

    if (upper.startsWith("ATLD")) {
        return `ATLD ${groupId.slice(4)}`;
    }

    if (upper.startsWith("HN")) {
        return `Học nghề ${groupId.slice(2)}`;
    }

    // Fallback to original groupId if no pattern matches
    return groupId;
};
