import { useRouter, useSearchParams } from "next/navigation";

import { useLearnContext } from "@/contexts/LearnContext";
import { CourseType } from "@/features/course/types";
import { isVideoActive } from "@/features/course/utils/check-is-video-active";
import { isVideoCompleted } from "@/features/course/utils/check-is-video-completed";
import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";

import LearnSidebarContent from "./learn-sidebar-content";

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
    isVisible: boolean;
}

interface LearnSidebarProps {
    courseType: CourseType;
}

const LearnSidebar = ({ courseType }: LearnSidebarProps) => {
    const { t } = useI18nTranslate();

    const {
        learnDetail,
        progress,
        currentSection,
        currentVideoIndex,
        navigateToVideo,
        navigateToExam,
    } = useLearnContext();

    const { title } = learnDetail;

    const searchParams = useSearchParams();

    const router = useRouter();

    const { completedVideos, isCompleted } = progress;

    // Helper function to check if a section is accessible
    const isSectionAccessible = (sectionId: string) => {
        if (isCompleted) return true; // If course is completed, all sections are accessible

        if (sectionId === "theory") return true; // Theory is always accessible

        if (sectionId === "practice") {
            // Practice is accessible if all theory videos are completed
            return learnDetail.theory.videos.every((_, index) =>
                isVideoCompleted(completedVideos, "theory", index)
            );
        }
        if (sectionId === "exam") {
            // Exam is accessible if all theory and practice videos are completed
            const allTheoryCompleted = learnDetail.theory.videos.every((_, index) =>
                isVideoCompleted(completedVideos, "theory", index)
            );

            const allPracticeCompleted = learnDetail.practice.videos.every((_, index) =>
                isVideoCompleted(completedVideos, "practice", index)
            );

            return allTheoryCompleted && allPracticeCompleted;
        }
        return false;
    };

    // Navigation handlers - Client-side only
    const handleViewAgain = (section: string, index: number) => {
        navigateToVideo(section, index);

        const params = new URLSearchParams(searchParams.toString());

        params.set("viewAgain", "true");

        router.push(`?${params.toString()}`);
    };

    const handleViewExam = () => {
        const params = new URLSearchParams(searchParams.toString());

        params.set("viewAgain", "true");

        router.push(`?${params.toString()}`);

        navigateToExam();
    };

    // Build sections data
    const sections: SectionData[] = [
        {
            id: "theory",
            label: t("bai_hoc_ly_thuyet"),
            description: "Video",
            isAccessible: isSectionAccessible("theory"),
            isVisible: learnDetail?.theory?.videos?.length > 0,
            content: learnDetail?.theory?.videos?.map((video, index) => ({
                id: video?.url,
                label: video?.title,
                description: video?.description || "",
                isCompleted: isVideoCompleted(completedVideos, "theory", index),
                isAccessible: true, // Theory videos are always accessible
                isActive: isVideoActive("theory", index, currentSection, currentVideoIndex),
                section: "theory" as const,
                index,
            })),
        },
        {
            id: "practice",
            label: t("bai_hoc_thuc_hanh"),
            description: "Video",
            isAccessible: isSectionAccessible("practice"),
            isVisible: learnDetail?.practice?.videos?.length > 0,
            content: learnDetail?.practice?.videos?.map((video, index) => ({
                id: video?.url,
                label: video?.title,
                description: video?.description || "",
                isCompleted: isVideoCompleted(completedVideos, "practice", index),
                isAccessible: isSectionAccessible("practice"),
                isActive: isVideoActive("practice", index, currentSection, currentVideoIndex),
                section: "practice" as const,
                index,
            })),
        },
        {
            id: "exam",
            label: t("bai_kiem_tra"),
            description: t("trac_nghiem"),
            isVisible: learnDetail?.exam?.questions?.length > 0,
            isAccessible: isSectionAccessible("exam"),
            content: [
                {
                    id: learnDetail?.exam?.title,
                    label: learnDetail?.exam?.title,
                    description: learnDetail?.exam?.description || "",
                    isCompleted: isCompleted,
                    isAccessible: isSectionAccessible("exam"),
                    isActive: isVideoActive("exam", 0, currentSection, currentVideoIndex),
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
