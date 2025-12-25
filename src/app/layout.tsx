import type { Metadata } from "next";
import { Be_Vietnam_Pro, Geist, Geist_Mono, Noto_Sans_KR } from "next/font/google";
import { cookies } from "next/headers";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import GlobalHeader from "@/components/GlobalHeader";
import MaintenanceWrapper from "@/components/Mantainace/MantainaceWrapper";
import MicrosoftClarity from "@/components/MicrosoftClarity";
import { StructuredData } from "@/components/SEO";
import {
    baseSeoConfig,
    generateMetadata,
    generateOrganizationStructuredData,
} from "@/configs/seo.config";
import { getGrowthBookPayload } from "@/libs/growthbook";
import { i18nCookieName } from "@/libs/i18n/settings";

import "./globals.css";
import Provider from "./provider";

const beVietnamPro = Be_Vietnam_Pro({
    variable: "--font-be-vietnam-pro",
    subsets: ["latin", "vietnamese"],
    weight: ["300", "400", "500", "600", "700"],
    preload: true,
    display: "swap",
});

const notoSansKr = Noto_Sans_KR({
    variable: "--font-noto-sans-kr",
    subsets: ["latin"],
    weight: ["300", "400", "500", "700"],
    preload: false,
    display: "swap",
});

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
    preload: false,
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
    preload: false,
});

export const metadata: Metadata = generateMetadata({
    title: baseSeoConfig.defaultTitle,
    description: baseSeoConfig.defaultDescription,
    keywords: baseSeoConfig.defaultKeywords,
    url: "/",
});

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const growthBookPayload = await getGrowthBookPayload();
    const cookieStore = await cookies();
    const locale = cookieStore.get(i18nCookieName)?.value || "vi";
    const isKr = locale === "kr";

    return (
        <html lang={locale} className={isKr ? notoSansKr.variable : beVietnamPro.variable}>
            <head>
                <StructuredData data={generateOrganizationStructuredData()} />
            </head>
            <body
                className={`${isKr ? notoSansKr.className : beVietnamPro.className} ${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <SpeedInsights />

                <Analytics />

                <MicrosoftClarity />

                <Provider growthBookPayload={growthBookPayload}>
                    <MaintenanceWrapper>
                        <GlobalHeader />
                        {children}
                    </MaintenanceWrapper>
                </Provider>
            </body>
        </html>
    );
}
