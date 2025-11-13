import type { Metadata } from "next";

import { generateMetadata, pageSeoConfigs } from "@/configs/seo.config";
import HocNgheLearnPage from "@/features/course/pages/hoc-nghe/hoc-nghe-learn";

export const metadata: Metadata = generateMetadata(pageSeoConfigs.learn);

export default function Page() {
    return <HocNgheLearnPage />;
}
