import { notFound } from "next/navigation";

import AtldPreview from "@/features/atld/pages/AtldPreview";
import { getCoursePreviewServer } from "@/services/api.server";
import { GetCoursePreviewResponse } from "@/types/api";

interface PageProps {
    params: Promise<{ atldId: string }>;
}

export default async function Page({ params }: PageProps) {
    const { atldId } = await params;

    let initialData: GetCoursePreviewResponse | undefined;

    try {
        initialData = await getCoursePreviewServer(atldId);
    } catch {
        // If course not found, return 404
        notFound();
    }

    return <AtldPreview initialData={initialData} />;
}
