"use client";

import { FunctionComponent, PropsWithChildren, createContext, useContext } from "react";

import { CourseDetail, CourseProgress } from "@/types/api";

export type LearnProviderProps = PropsWithChildren<{
    learnDetail: CourseDetail;
    progress: CourseProgress;
}>;

const LearnContext = createContext<LearnProviderProps | null>(null);

export const LearnProvider: FunctionComponent<LearnProviderProps> = ({ children, ...props }) => {
    return <LearnContext.Provider value={props}>{children}</LearnContext.Provider>;
};

export const useLearnContext = () => {
    const context = useContext(LearnContext);

    if (!context) throw new Error("useLearnContext must be used within LearnProvider");

    return context;
};
