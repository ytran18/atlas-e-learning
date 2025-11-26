import { NextRequest } from "next/server";

import { getListDocuments } from "@/services/documents.service";
import { DocumentType } from "@/types/documents";
import { handleApiError, requireAuth, successResponse } from "@/utils/api.utils";

export async function GET(request: NextRequest) {
    try {
        await requireAuth();

        const type = request.nextUrl.searchParams.get("type");

        if (!type) {
            throw new Error("VALIDATION: type is required");
        }

        const documentLists = await getListDocuments(type as DocumentType);

        return successResponse(documentLists);
    } catch (error) {
        return handleApiError(error);
    }
}
