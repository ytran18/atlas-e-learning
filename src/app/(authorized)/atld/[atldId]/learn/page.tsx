import type { Metadata } from "next";

import { generateMetadata, pageSeoConfigs } from "@/configs/seo.config";
import AtldLearnPage from "@/features/course/pages/atld/atld-learn";

export const metadata: Metadata = generateMetadata(pageSeoConfigs.learn);

export default function Page() {
    return <AtldLearnPage />;
}
