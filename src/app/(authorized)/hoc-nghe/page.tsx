import type { Metadata } from "next";

import { generateMetadata, pageSeoConfigs } from "@/configs/seo.config";
import HocNgheListPage from "@/features/course/pages/hoc-nghe/hoc-nghe-list";

export const metadata: Metadata = generateMetadata(pageSeoConfigs.hocNghe);

export default async function Page() {
    return <HocNgheListPage />;
}
