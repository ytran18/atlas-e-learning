"use client";

import CTASection from "./components/CTASection";
import FeaturesSection from "./components/FeaturesSection";
import HeroSection from "./components/HeroSection";

const LandingPage = () => {
    const version = process.env.NEXT_PUBLIC_APP_VERSION;

    return (
        <div className="min-h-screen">
            <HeroSection />

            <FeaturesSection />

            <CTASection />

            {version && (
                <div className="fixed bottom-5 left-5 z-50 print:hidden">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/50 backdrop-blur-md border border-gray-200/50 rounded-full shadow-sm transition-all hover:opacity-100 opacity-50 hover:bg-white/80 cursor-default select-none group">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 group-hover:bg-emerald-500"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 group-hover:scale-110 transition-transform"></span>
                        </span>
                        <span className="text-[10px] font-medium text-gray-500 group-hover:text-gray-800 font-mono tracking-wider transition-colors">
                            v{version}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LandingPage;
