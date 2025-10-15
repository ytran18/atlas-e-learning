/**
 * PATCH /api/v1/admin/hoc-nghe/:groupId
 * Update Học Nghề course information (admin only)
 *
 * DELETE /api/v1/admin/hoc-nghe/:groupId
 * Delete a Học Nghề course (admin only)
 */
import { NextRequest } from "next/server";

import { deleteGroup, getGroupById, updateGroup } from "@/services/firestore.service";
import { DeleteCourseResponse, UpdateCourseRequest, UpdateCourseResponse } from "@/types/api";
import { handleApiError, parseJsonBody, requireAuth, successResponse } from "@/utils/api.utils";

/**
 * PATCH - Update course
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ groupId: string }> }
) {
    try {
        // Authenticate admin user
        // TODO: Add admin role check here
        await requireAuth();

        const { groupId } = await params;

        // Check if group exists
        const existingGroup = await getGroupById(groupId);

        if (!existingGroup) {
            throw new Error("NOT_FOUND");
        }

        // Parse request body
        const body = await parseJsonBody<UpdateCourseRequest>(request);

        // Update group in Firestore
        await updateGroup(groupId, body);

        // Return success response
        const response: UpdateCourseResponse = {
            success: true,
        };

        return successResponse(response);
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * DELETE - Delete course
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ groupId: string }> }
) {
    try {
        // Authenticate admin user
        // TODO: Add admin role check here
        await requireAuth();

        const { groupId } = await params;

        // Check if group exists
        const existingGroup = await getGroupById(groupId);

        if (!existingGroup) {
            throw new Error("NOT_FOUND");
        }

        // Delete group from Firestore
        await deleteGroup(groupId);

        // Return success response
        const response: DeleteCourseResponse = {
            success: true,
            deleted: groupId,
        };

        return successResponse(response);
    } catch (error) {
        return handleApiError(error);
    }
}
