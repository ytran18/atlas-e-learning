import type { Metadata } from "next";
import { Be_Vietnam_Pro, Geist, Geist_Mono } from "next/font/google";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import GlobalHeader from "@/components/GlobalHeader";

import "./globals.css";
import Provider from "./provider";

const beVietnamPro = Be_Vietnam_Pro({
    variable: "--font-be-vietnam-pro",
    subsets: ["latin", "vietnamese"],
    weight: ["300", "400", "500", "600", "700"],
    display: "swap",
});

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Hệ thống đào tạo An Toàn Lao Động",
    description: "Hệ thống đào tạo An Toàn Lao Động",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="vi" className={beVietnamPro.variable}>
            <body
                className={`${beVietnamPro.className} ${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <SpeedInsights />

                <Analytics />

                <Provider>
                    <GlobalHeader />
                    {children}
                </Provider>
            </body>
        </html>
    );
}
