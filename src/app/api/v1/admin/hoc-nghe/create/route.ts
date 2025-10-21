/**
 * POST /api/v1/admin/hoc-nghe/create
 *
 * Create a new Học Nghề course (admin only)
 * Request body: Course data including title, description, theory, practice, exam
 * Returns: Created course ID and success message
 */
import { NextRequest } from "next/server";

import { nanoid } from "nanoid";

import { admin, adminDb } from "@/libs/firebase/firebaseAdmin.config";
import { CreateCourseRequest, CreateCourseResponse } from "@/types/api";
import {
    handleApiError,
    parseJsonBody,
    requireAuth,
    successResponse,
    validateRequiredFields,
} from "@/utils/api.utils";

export async function POST(request: NextRequest) {
    try {
        // Authenticate admin user
        // TODO: Add admin role check here
        await requireAuth();

        // Parse and validate request body
        const body = await parseJsonBody<CreateCourseRequest>(request);

        validateRequiredFields(body, ["title", "description", "theory", "practice", "exam"]);

        const { title, description, theory, practice, exam } = body;

        // Generate unique ID for the course
        const groupId = nanoid(10);

        // Prepare course data
        const courseData = {
            title,
            type: "hoc-nghe",
            description,
            theory,
            practice,
            exam,
            isActive: true,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        // Create course in Firestore
        await adminDb.collection("groups").doc(groupId).set(courseData);

        // Return success response
        const response: CreateCourseResponse = {
            id: groupId,
            message: "Tạo khóa học thành công.",
        };

        return successResponse(response, 201);
    } catch (error) {
        return handleApiError(error);
    }
}
