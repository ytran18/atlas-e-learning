import HocNghePage from "@/features/hoc-nghe/pages";
import { getCourseListServer } from "@/services/api.server";
import { GetCourseListResponse } from "@/types/api";

export default async function Page() {
    let initialData: GetCourseListResponse | undefined;

    try {
        initialData = await getCourseListServer("hoc-nghe");
    } catch (error) {
        console.error("Failed to fetch course list on server:", error);
        // initialData will remain undefined, client will handle the error
    }

    return <HocNghePage initialData={initialData} />;
}
