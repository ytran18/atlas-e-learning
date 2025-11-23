"use client";

import { lazy } from "react";

import Link from "next/link";

import { Badge, Button } from "@mantine/core";

import { fadeInUp, staggerContainer } from "@/animations/landing-page";
import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";
import { navigationPaths } from "@/utils/navigationPaths";

const AnimatedDiv = lazy(() => import("../../animations/AnimatedDiv"));

const AnimatedH1 = lazy(() => import("../../animations/AnimatedH1"));

const AnimatedParagraph = lazy(() => import("../../animations/AnimatedParagraph"));

const HeroSection = () => {
    const { t } = useI18nTranslate();

    return (
        <section className="relative py-20 md:py-32 overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-b from-(--primary)/10 to-background" />

            <div className="container mx-auto px-4 relative">
                <AnimatedDiv
                    className="max-w-4xl mx-auto text-center"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                >
                    <AnimatedDiv variants={fadeInUp} transition={{ duration: 0.5 }}>
                        <Badge
                            className="mb-2"
                            variant="gradient"
                            gradient={{ from: "blue", to: "cyan", deg: 90 }}
                        >
                            <span className="leading-[22px]">
                                {t("nen_tang_dao_tao_chuyen_nghiep")}
                            </span>
                        </Badge>
                    </AnimatedDiv>

                    <AnimatedH1
                        className="text-4xl! md:text-6xl! font-bold mb-6 text-balance"
                        variants={fadeInUp}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        {t("an_toan_lao_dong_cho_moi_nguoi")}
                    </AnimatedH1>

                    <AnimatedParagraph
                        className="text-lg md:text-xl text-[#495057] mb-8 text-pretty max-w-2xl mx-auto"
                        variants={fadeInUp}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {t("nang_cao_kien_thuc_va_ky_nang_an_toan_lao_dong_voi")}
                    </AnimatedParagraph>

                    <AnimatedDiv variants={fadeInUp} transition={{ duration: 0.5, delay: 0.3 }}>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href={navigationPaths.ATLD}>
                                <Button size="lg">{t("an_toan_lao_dong")}</Button>
                            </Link>

                            <Link href={navigationPaths.HOC_NGHE}>
                                <Button size="lg" variant="outline">
                                    {t("hoc_nghe")}
                                </Button>
                            </Link>
                        </div>
                    </AnimatedDiv>
                </AnimatedDiv>
            </div>
        </section>
    );
};

export default HeroSection;
