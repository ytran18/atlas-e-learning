import type { Metadata } from "next";

import { generateMetadata, pageSeoConfigs } from "@/configs/seo.config";
import SignInPage from "@/features/auth/pages/signIn";

export const metadata: Metadata = generateMetadata(pageSeoConfigs.signIn);

export default function Page() {
    return <SignInPage />;
}
