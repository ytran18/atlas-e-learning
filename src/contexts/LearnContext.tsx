"use client";

import {
    FunctionComponent,
    PropsWithChildren,
    createContext,
    useCallback,
    useContext,
    useState,
} from "react";

import { CourseDetail, CourseProgress } from "@/types/api";

export type LearnProviderProps = PropsWithChildren<{
    learnDetail: CourseDetail;
    progress: CourseProgress;
}>;

type LearnContextType = LearnProviderProps & {
    // Client-side navigation state
    currentSection: string;
    currentVideoIndex: number;
    // Navigation functions
    navigateToVideo: (section: string, videoIndex: number) => void;
    navigateToExam: () => void;
};

const LearnContext = createContext<LearnContextType | null>(null);

export const LearnProvider: FunctionComponent<LearnProviderProps> = ({
    children,
    learnDetail,
    progress,
}) => {
    // Client-side navigation state
    const [currentSection, setCurrentSection] = useState(progress.currentSection || "theory");

    const [currentVideoIndex, setCurrentVideoIndex] = useState(progress.currentVideoIndex || 0);

    // Navigation functions
    const navigateToVideo = useCallback((section: string, videoIndex: number) => {
        setCurrentSection(section as "theory" | "practice" | "exam");

        setCurrentVideoIndex(videoIndex);
    }, []);

    const navigateToExam = useCallback(() => {
        setCurrentSection("exam");

        setCurrentVideoIndex(0);
    }, []);

    const contextValue: LearnContextType = {
        learnDetail,
        progress,
        currentSection,
        currentVideoIndex,
        navigateToVideo,
        navigateToExam,
    };

    return <LearnContext.Provider value={contextValue}>{children}</LearnContext.Provider>;
};

export const useLearnContext = () => {
    const context = useContext(LearnContext);

    if (!context) throw new Error("useLearnContext must be used within LearnProvider");

    return context;
};
