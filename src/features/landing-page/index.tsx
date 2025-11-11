import CTASection from "./components/CTASection";
import FeaturesSection from "./components/FeaturesSection";
import HeroSection from "./components/HeroSection";

const LandingPage = () => {
    return (
        <div className="min-h-screen">
            <HeroSection />

            <FeaturesSection />

            <CTASection />
        </div>
    );
};

export default LandingPage;
