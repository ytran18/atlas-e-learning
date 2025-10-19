import { notFound } from "next/navigation";

import HocNghePreview from "@/features/hoc-nghe/pages/HocNghePreview";
import { getCoursePreviewServer } from "@/services/api.server";
import { GetCoursePreviewResponse } from "@/types/api";

interface PageProps {
    params: Promise<{ hocNgheId: string }>;
}

export default async function Page({ params }: PageProps) {
    const { hocNgheId } = await params;

    let initialData: GetCoursePreviewResponse | undefined;

    try {
        initialData = await getCoursePreviewServer(hocNgheId);
    } catch {
        // If course not found, return 404
        notFound();
    }

    return <HocNghePreview initialData={initialData} />;
}
