import { NextRequest } from "next/server";

import { updateDocument } from "@/services/documents.service";
import { CreateDocumentResponse, DocumentPayload } from "@/types/documents";
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

        const body = await parseJsonBody<DocumentPayload & { id: string }>(request);

        validateRequiredFields(body, [
            "id",
            "title",
            "description",
            "type",
            "url",
            "sortNo",
            "category",
        ]);

        const { id, title, description, type, url, sortNo, category } = body;

        await updateDocument(id, {
            title,
            description,
            type,
            url,
            sortNo,
            category,
        });

        const response: CreateDocumentResponse = {
            message: "Cập nhật tài liệu thành công",
        };

        return successResponse(response, 200);
    } catch (error) {
        return handleApiError(error);
    }
}
