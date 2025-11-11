import type { Metadata } from "next";

import { generateMetadata, pageSeoConfigs } from "@/configs/seo.config";
import AtldVerifyPage from "@/features/course/pages/atld/atld-verify";

export const metadata: Metadata = generateMetadata(pageSeoConfigs.verify);

export default function Page() {
    return <AtldVerifyPage />;
}
