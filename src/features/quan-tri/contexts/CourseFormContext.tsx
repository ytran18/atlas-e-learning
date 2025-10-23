import { ReactNode, createContext, useContext } from "react";

import { useCourseForm } from "@/features/shared/hooks/useCourseForm";
import { CourseDetail } from "@/types/api";

interface CourseFormContextType {
    form: ReturnType<typeof useCourseForm>["form"];
    isLoading: boolean;
    error: string | null;
    editVideos: any[];
    editTheory: any;
    editPractice: any;
    editExam: any;
    handleEditToggle: () => Promise<void>;
    handleCancelEdit: () => void;
    handleTheoryDragEnd: (result: any) => void;
    handlePracticeDragEnd: (result: any) => void;
    handleAddVideo: (data: {
        title: string;
        description: string;
        file: File | null;
        section: "theory" | "practice";
    }) => Promise<void>;
    handleUpdateVideo: (videoId: string, data: { title: string; description: string }) => void;
    setEditTitle: (value: string) => void;
    setEditDescription: (value: string) => void;
    setEditTheory: (value: any) => void;
    setEditPractice: (value: any) => void;
    setEditExam: (value: any) => void;
}

const CourseFormContext = createContext<CourseFormContextType | undefined>(undefined);

interface CourseFormProviderProps {
    children: ReactNode;
    courseDetail: CourseDetail;
    courseType: "atld" | "hoc-nghe";
}

export const CourseFormProvider = ({
    children,
    courseDetail,
    courseType,
}: CourseFormProviderProps) => {
    const courseForm = useCourseForm({ courseDetail, courseType });

    return <CourseFormContext.Provider value={courseForm}>{children}</CourseFormContext.Provider>;
};

export const useCourseFormContext = () => {
    const context = useContext(CourseFormContext);
    if (context === undefined) {
        throw new Error("useCourseFormContext must be used within a CourseFormProvider");
    }
    return context;
};
