export interface Video {
    id: string;
    title: string;
    description: string;
    url: string;
    length: number;
    progress: number;
    canSeek: boolean;
    shouldCompleteToPassed: boolean;
}

export interface Question {
    id: string;
    content: string;
    options: {
        id: string;
        content: string;
    }[];
    answer: string;
}

export interface Theory {
    id: string;
    videos: Video[];
}

export interface Practice {
    id: string;
    videos: Video[];
}

export interface Exam {
    id: string;
    title: string;
    description: string;
    timeLimit: number;
    questions: Question[];
}

export interface LearnDetail {
    id: string;
    title: string;
    description: string;
    theory: Theory;
    practice: Practice;
    exam: Exam[];
}
