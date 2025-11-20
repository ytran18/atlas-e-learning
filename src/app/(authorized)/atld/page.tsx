import type { Metadata } from "next";

import { generateMetadata, pageSeoConfigs } from "@/configs/seo.config";
import AtldListPage from "@/features/course/pages/atld/atld-list";

export const metadata: Metadata = generateMetadata(pageSeoConfigs.atld);

export default async function Page() {
    return <AtldListPage />;
}
