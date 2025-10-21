/**
 * API Hooks
 *
 * Central export point cho tất cả React Query hooks
 *
 * @module hooks/api
 *
 * @example
 * // Import từ main index
 * import { useCourseList, useStartCourse } from "@/hooks/api";
 *
 * // Hoặc import từ subfolder
 * import { useCourseList } from "@/hooks/api/user";
 * import { useCreateCourse } from "@/hooks/api/admin";
 */

// User hooks
export * from "./user";

// Admin hooks
export * from "./admin";
