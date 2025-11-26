import { NextRequest } from "next/server";

import { deleteDocument } from "@/services/documents.service";
import { CreateDocumentResponse } from "@/types/documents";
import {
    handleApiError,
    parseJsonBody,
    requireAuth,
    successResponse,
    validateRequiredFields,
} from "@/utils/api.utils";

export async function POST(request: NextRequest) {
    try {
        await requireAuth();

        const body = await parseJsonBody<{ id: string }>(request);

        validateRequiredFields(body, ["id"]);

        const { id } = body;

        await deleteDocument(id);

        const response: CreateDocumentResponse = {
            message: "Xóa tài liệu thành công",
        };

        return successResponse(response, 200);
    } catch (error) {
        return handleApiError(error);
    }
}
