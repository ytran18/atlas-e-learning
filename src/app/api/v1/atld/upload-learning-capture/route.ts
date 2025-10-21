/**
 * POST /api/v1/atld/upload-learning-capture
 *
 * Upload learning capture image (random screenshot during learning)
 * Accepts: FormData with file, groupId, type fields
 * Returns: URL of uploaded image and storage location
 */
import { NextRequest } from "next/server";

import { saveLearningCapture } from "@/services/firestore.service";
import { uploadFromFormData } from "@/services/storage.service";
import { CaptureType, UploadCaptureResponse } from "@/types/api";
import { handleApiError, requireAuth, successResponse } from "@/utils/api.utils";

export async function POST(request: NextRequest) {
    try {
        // Authenticate user
        const { userId } = await requireAuth();

        // Parse form data
        const formData = await request.formData();

        const groupId = formData.get("groupId") as string;

        const type = formData.get("type") as CaptureType;

        // Validate required fields
        if (!groupId || !type) {
            throw new Error("VALIDATION: groupId and type are required");
        }

        if (!["start", "learning", "finish"].includes(type)) {
            throw new Error('VALIDATION: type must be "start", "learning", or "finish"');
        }

        // Upload file to storage
        const imageUrl = await uploadFromFormData(formData, userId, groupId, type);

        // Save URL to Firestore progress
        const savedTo = await saveLearningCapture(userId, groupId, imageUrl, type);

        // Return response
        const response: UploadCaptureResponse = {
            imageUrl,
            savedTo,
        };

        return successResponse(response, 201);
    } catch (error) {
        return handleApiError(error);
    }
}
