import type { Metadata } from "next";

import { generateMetadata, pageSeoConfigs } from "@/configs/seo.config";
import SignUpPage from "@/features/auth/pages/signUp";

export const metadata: Metadata = generateMetadata(pageSeoConfigs.signUp);

export default function Page() {
    return <SignUpPage />;
}
