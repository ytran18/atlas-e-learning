import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { SpeedInsights } from "@vercel/speed-insights/next";

import GlobalHeader from "@/components/GlobalHeader";

import "./globals.css";
import Provider from "./provider";

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
        <html lang="vi">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <SpeedInsights />
                <Provider>
                    <GlobalHeader />
                    {children}
                </Provider>
            </body>
        </html>
    );
}
