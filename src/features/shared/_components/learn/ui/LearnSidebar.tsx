import { useLearnContext } from "@/contexts/LearnContext";

import { CourseType } from "../../../types";
import LearnSidebarContent from "./LearnSidebarContent";

interface VideoContent {
    id: string;
    label: string;
    description: string;
    isCompleted: boolean;
    isAccessible: boolean;
    isActive: boolean;
    section: "theory" | "practice" | "exam";
    index: number;
}

interface SectionData {
    id: string;
    label: string;
    description: string;
    isAccessible: boolean;
    content: VideoContent[];
}

interface LearnSidebarProps {
    courseType: CourseType;
}

const LearnSidebar = ({ courseType }: LearnSidebarProps) => {
    const {
        learnDetail,
        progress,
        currentSection,
        currentVideoIndex,
        navigateToVideo,
        navigateToExam,
    } = useLearnContext();

    const { title } = learnDetail;

    const { completedVideos, isCompleted } = progress;

    // Helper function to check if a video is completed
    const isVideoCompleted = (section: string, index: number) => {
        return completedVideos.some(
            (completed) => completed.section === section && completed.index === index
        );
    };

    // Helper function to check if a video is currently active
    const isVideoActive = (section: string, index: number) => {
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

    // Helper function to check if a section is accessible
    const isSectionAccessible = (sectionId: string) => {
        if (isCompleted) return true; // If course is completed, all sections are accessible

        if (sectionId === "theory") return true; // Theory is always accessible

        if (sectionId === "practice") {
            // Practice is accessible if all theory videos are completed
            return learnDetail.theory.videos.every((_, index) => isVideoCompleted("theory", index));
        }
        if (sectionId === "exam") {
            // Exam is accessible if all theory and practice videos are completed
            const allTheoryCompleted = learnDetail.theory.videos.every((_, index) =>
                isVideoCompleted("theory", index)
            );

            const allPracticeCompleted = learnDetail.practice.videos.every((_, index) =>
                isVideoCompleted("practice", index)
            );

            return allTheoryCompleted && allPracticeCompleted;
        }
        return false;
    };

    // Navigation handlers - Client-side only
    const handleViewAgain = (section: string, index: number) => {
        navigateToVideo(section, index);
    };

    const handleViewExam = () => {
        navigateToExam();
    };

    // Build sections data
    const sections: SectionData[] = [
        {
            id: "theory",
            label: "Bài học lý thuyết",
            description: "Video",
            isAccessible: isSectionAccessible("theory"),
            content: learnDetail.theory.videos.map((video, index) => ({
                id: video.url,
                label: video.title,
                description: video.description || "",
                isCompleted: isVideoCompleted("theory", index),
                isAccessible: true, // Theory videos are always accessible
                isActive: isVideoActive("theory", index),
                section: "theory" as const,
                index,
            })),
        },
        {
            id: "practice",
            label: "Bài học thực hành",
            description: "Video",
            isAccessible: isSectionAccessible("practice"),
            content: learnDetail.practice.videos.map((video, index) => ({
                id: video.url,
                label: video.title,
                description: video.description || "",
                isCompleted: isVideoCompleted("practice", index),
                isAccessible: isSectionAccessible("practice"),
                isActive: isVideoActive("practice", index),
                section: "practice" as const,
                index,
            })),
        },
        {
            id: "exam",
            label: "Bài kiểm tra",
            description: "Trắc nghiệm",
            isAccessible: isSectionAccessible("exam"),
            content: [
                {
                    id: learnDetail.exam.title,
                    label: learnDetail.exam.title,
                    description: learnDetail.exam.description || "",
                    isCompleted: isCompleted,
                    isAccessible: isSectionAccessible("exam"),
                    isActive: isVideoActive("exam", 0),
                    section: "exam" as const,
                    index: 0,
                },
            ],
        },
    ];

    return (
        <LearnSidebarContent
            title={title}
            sections={sections}
            currentSection={currentSection}
            onViewAgain={handleViewAgain}
            onViewExam={handleViewExam}
            courseType={courseType}
        />
    );
};

export default LearnSidebar;
