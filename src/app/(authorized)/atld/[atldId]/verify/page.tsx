import type { Metadata } from "next";

import { generateMetadata, pageSeoConfigs } from "@/configs/seo.config";
import VerifyPage from "@/features/atld/pages/VerifyPage";

export const metadata: Metadata = generateMetadata(pageSeoConfigs.verify);

export default function Page() {
    return <VerifyPage />;
}
