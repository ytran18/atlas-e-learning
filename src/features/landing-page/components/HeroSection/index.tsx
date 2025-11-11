"use client";

import { lazy } from "react";

import Link from "next/link";

import { Badge, Button } from "@mantine/core";

import { fadeInUp, staggerContainer } from "@/animations/landing-page";
import { navigationPaths } from "@/utils/navigationPaths";

const AnimatedDiv = lazy(() => import("../../animations/AnimatedDiv"));

const AnimatedH1 = lazy(() => import("../../animations/AnimatedH1"));

const AnimatedParagraph = lazy(() => import("../../animations/AnimatedParagraph"));

const HeroSection = () => {
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
                            <span className="leading-[22px]">Nền tảng đào tạo chuyên nghiệp</span>
                        </Badge>
                    </AnimatedDiv>

                    <AnimatedH1
                        className="text-4xl! md:text-6xl! font-bold mb-6 text-balance"
                        variants={fadeInUp}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        An toàn lao động cho mọi người
                    </AnimatedH1>

                    <AnimatedParagraph
                        className="text-lg md:text-xl text-[#495057] mb-8 text-pretty max-w-2xl mx-auto"
                        variants={fadeInUp}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        Nâng cao kiến thức và kỹ năng an toàn lao động với các khóa học chuyên
                        nghiệp, được thiết kế phù hợp với từng nhóm ngành nghề
                    </AnimatedParagraph>

                    <AnimatedDiv variants={fadeInUp} transition={{ duration: 0.5, delay: 0.3 }}>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href={navigationPaths.ATLD}>
                                <Button size="lg">An Toàn Lao Động</Button>
                            </Link>

                            <Link href={navigationPaths.HOC_NGHE}>
                                <Button size="lg" variant="outline">
                                    Học Nghề
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
