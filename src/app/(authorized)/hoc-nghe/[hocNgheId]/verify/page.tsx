import type { Metadata } from "next";

import { generateMetadata, pageSeoConfigs } from "@/configs/seo.config";
import HocNgheVerifyPage from "@/features/course/pages/hoc-nghe/hoc-nghe-verify";

export const metadata: Metadata = generateMetadata(pageSeoConfigs.verify);

export default function Page() {
    return <HocNgheVerifyPage />;
}
