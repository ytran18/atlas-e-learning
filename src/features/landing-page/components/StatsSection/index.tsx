"use client";

import { lazy } from "react";

import CountUp from "react-countup";

import { fadeInUp, staggerContainer } from "@/animations/landing-page";

const AnimatedDiv = lazy(() => import("../../animations/AnimatedDiv"));

const StatsSection = () => {
    const stats = [
        { id: 1, end: 10, suffix: "K+", label: "Học viên", subLabel: "Đã và đang theo học" },
        { id: 2, end: 10, suffix: "+", label: "Khóa học", subLabel: "Đa dạng ngành nghề" },
        { id: 3, end: 98, suffix: "%", label: "Tỷ lệ đỗ", subLabel: "Trong kỳ thi sát hạch" },
    ];

    return (
        <section className="py-16 md:py-20 bg-slate-50 relative overflow-hidden md:min-h-[280px]">
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
                <AnimatedDiv
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                >
                    {stats.map((stat) => (
                        <AnimatedDiv
                            key={stat.id}
                            variants={fadeInUp}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col items-center text-center group"
                        >
                            <div className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-blue-600 mb-2 group-hover:scale-110 group-hover:text-blue-700 transition-all duration-300">
                                <CountUp
                                    end={stat.end}
                                    suffix={stat.suffix}
                                    duration={2.5}
                                    enableScrollSpy
                                    scrollSpyOnce
                                />
                            </div>
                            <div className="font-heading text-lg md:text-xl font-bold text-slate-800 mb-1">
                                {stat.label}
                            </div>
                            <div className="font-body text-sm text-slate-500">{stat.subLabel}</div>
                        </AnimatedDiv>
                    ))}
                </AnimatedDiv>
            </div>
        </section>
    );
};

export default StatsSection;
