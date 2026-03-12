"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@mantine/core";
import { getUA } from "react-device-detect";

import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";
import { getBaseUrl } from "@/utils/get-base-url";
import { getIsWebView } from "@/utils/get-is-webview";
import { getRedirectUrl } from "@/utils/get-redirect-url";
import { navigationPaths } from "@/utils/navigationPaths";

const HeroSection = () => {
    const { t } = useI18nTranslate();

    const router = useRouter();

    const pathname = usePathname();

    const searchParams = useSearchParams();

    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-slate-50 min-h-[650px] md:min-h-[800px] flex flex-col justify-center">
            {/* Background elements for modern SaaS look */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Subtle Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[32px_32px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

                {/* Glowing Blobs */}
                <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-blue-500 opacity-[0.15] blur-[120px]" />
                <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-orange-500 opacity-10 blur-[120px]" />
                <div className="absolute top-[10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-violet-500 opacity-10 blur-[120px]" />

                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.04] mix-blend-overlay" />
            </div>

            <div className="container max-w-6xl mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-8 shadow-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            <span className="font-heading">
                                {t("nen_tang_dao_tao_chuyen_nghiep")}
                            </span>
                        </div>
                    </div>

                    <h1 className="font-heading text-5xl! md:text-7xl! font-extrabold mb-6 text-slate-900 tracking-tight leading-tight text-balance">
                        {t("an_toan_lao_dong_cho_moi_nguoi")}
                    </h1>

                    <p className="font-body text-lg md:text-xl text-slate-600 mb-10 text-pretty max-w-2xl mx-auto leading-relaxed">
                        {t("nang_cao_kien_thuc_va_ky_nang_an_toan_lao_dong_voi")}
                    </p>

                    <div className="w-full">
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                href={navigationPaths.ATLD}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    const isWebview = getIsWebView(getUA);

                                    if (isWebview) {
                                        const iosDomain = getBaseUrl() || "";

                                        const androidDomain =
                                            getBaseUrl()?.replaceAll("https://", "") || "";

                                        const baseUrl = {
                                            android: androidDomain,
                                            ios: `${iosDomain}/`,
                                        };

                                        const updatedSearchParams = new URLSearchParams(
                                            searchParams.toString()
                                        );

                                        const href = getRedirectUrl(
                                            baseUrl,
                                            pathname || "",
                                            `?${updatedSearchParams.toString()}`
                                        );

                                        window.location.href = href;
                                    } else {
                                        router.push(navigationPaths.ATLD);
                                    }
                                }}
                                className="w-full sm:w-auto"
                            >
                                <Button
                                    size="xl"
                                    className="w-full! bg-blue-500! text-white! font-heading font-semibold rounded-xl! shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5"
                                >
                                    {t("an_toan_lao_dong")}
                                </Button>
                            </Link>

                            <Link
                                href={navigationPaths.HOC_NGHE}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    const isWebview = getIsWebView(getUA);

                                    if (isWebview) {
                                        const iosDomain = getBaseUrl() || "";

                                        const androidDomain =
                                            getBaseUrl()?.replaceAll("https://", "") || "";

                                        const baseUrl = {
                                            android: androidDomain,
                                            ios: `${iosDomain}/`,
                                        };

                                        const updatedSearchParams = new URLSearchParams(
                                            searchParams.toString()
                                        );

                                        const href = getRedirectUrl(
                                            baseUrl,
                                            pathname || "",
                                            `?${updatedSearchParams.toString()}`
                                        );

                                        window.location.href = href;
                                    } else {
                                        router.push(navigationPaths.HOC_NGHE);
                                    }
                                }}
                                className="w-full sm:w-auto"
                            >
                                <Button
                                    size="xl"
                                    variant="outline"
                                    className="w-full! bg-white! text-slate-700! border-slate-200! hover:bg-slate-50! hover:border-slate-300! font-heading font-semibold rounded-xl! shadow-xs transition-all hover:-translate-y-0.5"
                                >
                                    {t("hoc_nghe")}
                                </Button>
                            </Link>
                        </div>

                        {/* Social proof below CTA */}
                        <div className="mt-12 pt-8 border-t border-slate-200/60 flex flex-col items-center justify-center gap-4">
                            <p className="font-body text-sm text-slate-500 font-medium tracking-wide uppercase">
                                Được đánh giá cao bởi học viên trên toàn quốc
                            </p>
                            <div className="flex -space-x-3">
                                {[
                                    { id: 1, label: "T", color: "from-blue-500 to-blue-600" },
                                    { id: 2, label: "H", color: "from-emerald-500 to-emerald-600" },
                                    { id: 3, label: "K", color: "from-orange-500 to-orange-600" },
                                    { id: 4, label: "M", color: "from-violet-500 to-violet-600" },
                                    { id: 5, label: "L", color: "from-rose-500 to-rose-600" },
                                ].map((avatar, index) => (
                                    <div
                                        key={avatar.id}
                                        style={{ zIndex: 10 - index }}
                                        className="relative w-10 h-10 rounded-full border-2 border-white flex items-center justify-center shadow-sm overflow-hidden"
                                    >
                                        <div
                                            className={`absolute inset-0 bg-linear-to-br ${avatar.color}`}
                                        />
                                        <span className="relative text-white text-xs font-bold font-heading">
                                            {avatar.label}
                                        </span>
                                    </div>
                                ))}
                                <div className="relative w-10 h-10 rounded-full border-2 border-white bg-slate-50 flex items-center justify-center shadow-sm z-0">
                                    <span className="text-xs font-bold text-slate-600">5k+</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
