"use client";

import Link from "next/link";

import { useUser } from "@clerk/nextjs";
import { Button } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";

import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";
import { navigationPaths } from "@/utils/navigationPaths";

const CTASection = () => {
    const { isSignedIn } = useUser();
    const { t } = useI18nTranslate();

    if (isSignedIn) return null;

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="container max-w-5xl mx-auto px-4 relative z-10">
                <div className="bg-slate-50 rounded-[2.5rem] overflow-hidden relative shadow-xl border border-slate-200/60">
                    {/* Modern Background Effects */}
                    <div className="absolute inset-0 pointer-events-none">
                        {/* Glows */}
                        <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] bg-blue-200/40 rounded-full blur-[120px] mix-blend-multiply" />
                        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-violet-200/40 rounded-full blur-[100px] mix-blend-multiply" />
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-white/60 to-transparent mix-blend-overlay" />

                        {/* Premium Grid Pattern (Light) */}
                        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay" />
                        <div
                            className="absolute inset-0 opacity-[0.4]"
                            style={{
                                backgroundImage: `linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)`,
                                backgroundSize: "40px 40px",
                                maskImage:
                                    "radial-gradient(circle at center, black 40%, transparent 100%)",
                                WebkitMaskImage:
                                    "radial-gradient(circle at center, black 40%, transparent 100%)",
                            }}
                        />
                    </div>

                    <div className="relative p-12 md:p-20 text-center z-10 flex flex-col items-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-slate-700 text-sm font-medium mb-8">
                            <span className="font-heading uppercase tracking-wider text-xs font-bold text-blue-600">
                                Bắt đầu ngay hôm nay
                            </span>
                        </div>

                        <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-slate-900 tracking-tight text-balance">
                            {t("san_sang_bat_dau_hoc")}
                        </h2>

                        <p className="font-body text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed text-pretty">
                            {t("dang_ky_ngay_hom_nay_de_truy_cap_day_du_cac_khoa_h")}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                            <Button
                                component={Link}
                                href={navigationPaths.SIGN_UP}
                                size="xl"
                                rightSection={<IconArrowRight size={20} stroke={2.5} />}
                                className="w-full sm:w-auto bg-blue-600! hover:bg-blue-700! text-white! font-heading font-semibold rounded-2xl! shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-1 hover:shadow-blue-600/40 px-10! h-14!"
                            >
                                {t("dang_ky_mien_phi")}
                            </Button>

                            <Button
                                component={Link}
                                href={navigationPaths.SIGN_IN}
                                variant="outline"
                                size="xl"
                                className="w-full sm:w-auto border-slate-300! text-slate-700! bg-white! hover:bg-slate-50! font-heading font-semibold rounded-2xl! shadow-sm transition-all hover:-translate-y-1 h-14! px-10!"
                            >
                                Đăng nhập
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
