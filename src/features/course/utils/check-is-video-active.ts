// Helper function to check if a video is currently active
export const isVideoActive = (
    section: string,
    index: number,
    currentSection: string,
    currentVideoIndex: number
) => {
    // Check if this is the current section and video
    const isCurrentVideo =
        (currentSection || "theory") === section && (currentVideoIndex || 0) === index;

    // Fallback: if currentVideoIndex is 0 or undefined, highlight first video of current section
    const isFirstVideoOfCurrentSection =
        currentSection === section &&
        (currentVideoIndex === 0 || currentVideoIndex === undefined) &&
        index === 0;

    return isCurrentVideo || isFirstVideoOfCurrentSection;
};
