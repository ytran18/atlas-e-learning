import type { Metadata } from "next";

import { generateMetadata, pageSeoConfigs } from "@/configs/seo.config";
import LearnPage from "@/features/hoc-nghe/pages/LearnPage";

export const metadata: Metadata = generateMetadata(pageSeoConfigs.learn);

export default function Page() {
    return <LearnPage />;
}
