import type { Metadata } from "next";

import { generateMetadata, pageSeoConfigs } from "@/configs/seo.config";
import LandingPage from "@/features/landing-page";

export const metadata: Metadata = generateMetadata(pageSeoConfigs.landing);

export default function Page() {
    return <LandingPage />;
}
