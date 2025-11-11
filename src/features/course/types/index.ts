export type CourseType = "atld" | "hoc-nghe";

export interface CourseTheme {
    primary: string;
    secondary: string;
    gradient: string;
    accent: string;
}

export const COURSE_THEMES: Record<CourseType, CourseTheme> = {
    atld: {
        primary: "blue",
        secondary: "indigo",
        gradient: "from-blue-50/30 via-white to-indigo-50/20",
        accent: "blue-400",
    },
    "hoc-nghe": {
        primary: "green",
        secondary: "emerald",
        gradient: "from-green-50/30 via-white to-emerald-50/20",
        accent: "green-400",
    },
};

export interface VideoSection {
    videos: Array<{
        url: string;
        title: string;
        description?: string;
        canSeek: boolean;
    }>;
}

export interface LearnDetail {
    id: string;
    theory: VideoSection;
    practice: VideoSection;
    exam: VideoSection;
}

export interface Progress {
    currentVideoIndex: number;
    completedVideos: Array<{
        section: string;
        index: number;
    }>;
}
