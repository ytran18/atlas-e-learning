"use client";

import { useEffect } from "react";

import { useLearnContext } from "@/contexts/LearnContext";

// Component to handle URL hash navigation
const HashNavigationHandler = () => {
    const { navigateToVideo, navigateToExam } = useLearnContext();

    useEffect(() => {
        const hash = window.location.hash.substring(1); // Remove # from hash

        if (!hash) return;

        // Parse hash format: "section-index" or "exam"
        if (hash === "exam") {
            navigateToExam();
        } else {
            const [section, indexStr] = hash.split("-");

            const index = parseInt(indexStr, 10);

            if (section && !isNaN(index)) {
                navigateToVideo(section, index);
            }
        }
    }, [navigateToVideo, navigateToExam]);

    return null;
};

export default HashNavigationHandler;
