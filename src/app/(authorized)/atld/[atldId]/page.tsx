import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { StructuredData } from "@/components/SEO";
import {
    generateCourseStructuredData,
    generateMetadata as generateSeoMetadata,
} from "@/configs/seo.config";
import AtldPreview from "@/features/atld/pages/AtldPreview";
import { getCoursePreviewServer } from "@/services/api.server";
import { GetCoursePreviewResponse } from "@/types/api";

interface PageProps {
    params: Promise<{ atldId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { atldId } = await params;

    try {
        const courseData = await getCoursePreviewServer(atldId);

        return generateSeoMetadata({
            title: courseData?.title,
            description:
                courseData.description ||
                `Khóa học ${courseData?.title} - An Toàn Lao Động chuyên nghiệp`,
            keywords: ["khóa học ATLD", courseData?.title, "an toàn lao động"],
            url: `/atld/${atldId}`,
        });
    } catch {
        return generateSeoMetadata({
            title: "Khóa học An Toàn Lao Động",
            description: "Khóa học An Toàn Lao Động chuyên nghiệp",
            url: `/atld/${atldId}`,
        });
    }
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

    return (
        <>
            {initialData && (
                <StructuredData
                    data={generateCourseStructuredData({
                        id: atldId,
                        title: initialData?.title,
                        description: initialData.description || `Khóa học ${initialData.title}`,
                        url: `/atld/${atldId}`,
                    })}
                />
            )}
            <AtldPreview initialData={initialData} />
        </>
    );
}
