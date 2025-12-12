import { NextRequest } from "next/server";

import { createDocument } from "@/services/documents.service";
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

        const body = await parseJsonBody<DocumentPayload>(request);

        validateRequiredFields(body, ["title", "description", "type", "url", "category"]);

        const { title, description, type, url, category } = body;

        await createDocument({
            title,
            description,
            type,
            url,
            category,
        });

        const response: CreateDocumentResponse = {
            message: "Tạo tài liệu thành công",
        };

        return successResponse(response, 201);
    } catch (error) {
        return handleApiError(error);
    }
}
