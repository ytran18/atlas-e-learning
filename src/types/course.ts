export enum CourseType {
    ATLD = "ATLD",
    NGHE = "NGHE",
}

export enum CourseStatus {
    DRAFT = "DRAFT",
    PUBLISHED = "PUBLISHED",
}

export enum LessionType {
    PRACTICE = "PRACTICE",
    THEORY = "THEORY",
}

export interface Question {
    id: string;
    title: string;
    description: string;
    options: {
        id: string;
        content: string;
    }[];
    answer: string;
    createdAt: string;
    updatedAt: string;
}

export interface Exam {
    id: string;
    title: string;
    description: string;
    passScore: number;
    questions: Question[];
    createdAt: string;
    updatedAt: string;
}

export interface Lession {
    id: string;
    courseId: string;
    title: string;
    description: string;
    type: LessionType;
    videoUrl: string;
    sequenceNo: number;
}

export interface Course {
    id: string;
    title: string;
    description: string;
    type: CourseType;
    lessons: Lession[];
    examId: string;
    createdAt: string;
    updatedAt: string;
}
