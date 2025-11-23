import { CompletedVideo } from "@/types/api";

// Helper function to check if a video is completed
export const isVideoCompleted = (videos: CompletedVideo[], section: string, index: number) => {
    return videos.some((completed) => completed.section === section && completed.index === index);
};
