import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { StructuredData } from "@/components/SEO";
import {
    generateCourseStructuredData,
    generateMetadata as generateSeoMetadata,
} from "@/configs/seo.config";
import HocNghePreview from "@/features/hoc-nghe/pages/HocNghePreview";
import { getCoursePreviewServer } from "@/services/api.server";
import { GetCoursePreviewResponse } from "@/types/api";

interface PageProps {
    params: Promise<{ hocNgheId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { hocNgheId } = await params;

    try {
        const courseData = await getCoursePreviewServer(hocNgheId);

        return generateSeoMetadata({
            title: courseData?.title,
            description:
                courseData.description || `Khóa học ${courseData?.title} - Học nghề chuyên nghiệp`,
            keywords: ["học nghề", courseData?.title, "khóa học nghề"],
            url: `/hoc-nghe/${hocNgheId}`,
        });
    } catch {
        return generateSeoMetadata({
            title: "Khóa học Học Nghề",
            description: "Khóa học nghề nghiệp chuyên nghiệp",
            url: `/hoc-nghe/${hocNgheId}`,
        });
    }
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

    return (
        <>
            {initialData && (
                <StructuredData
                    data={generateCourseStructuredData({
                        id: hocNgheId,
                        title: initialData?.title,
                        description: initialData.description || `Khóa học ${initialData.title}`,
                        url: `/hoc-nghe/${hocNgheId}`,
                    })}
                />
            )}
            <HocNghePreview initialData={initialData} />
        </>
    );
}
