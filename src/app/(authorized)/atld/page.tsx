import type { Metadata } from "next";

import { generateMetadata, pageSeoConfigs } from "@/configs/seo.config";
import AtldPage from "@/features/atld/pages";
import { getCourseListServer } from "@/services/api.server";
import { GetCourseListResponse } from "@/types/api";

export const metadata: Metadata = generateMetadata(pageSeoConfigs.atld);

export default async function Page() {
    let initialData: GetCourseListResponse | undefined;

    try {
        initialData = await getCourseListServer("atld");
    } catch (error) {
        console.error("Failed to fetch course list on server:", error);
        // initialData will remain undefined, client will handle the error
    }

    return <AtldPage initialData={initialData} />;
}
