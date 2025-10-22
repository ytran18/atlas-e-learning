import { useState } from "react";

import { useFieldArray, useForm } from "react-hook-form";

import { updateCourse } from "@/services/api.client";
import {
    CourseDetail,
    ExamSection,
    PracticeSection,
    TheorySection,
    UpdateCourseRequest,
    Video,
} from "@/types/api";

interface UseCourseFormProps {
    courseDetail: CourseDetail;
    courseType: "atld" | "hoc-nghe";
}

// Using CourseDetail as the form type
type FormData = CourseDetail;

export const useCourseForm = ({ courseDetail, courseType }: UseCourseFormProps) => {
    // Loading and error state
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // React Hook Form setup
    const form = useForm<FormData>({
        defaultValues: {
            id: courseDetail.id,
            title: courseDetail.title,
            description: courseDetail.description,
            type: courseDetail.type,
            theory: courseDetail.theory,
            practice: courseDetail.practice,
            exam: courseDetail.exam,
            createdAt: courseDetail.createdAt,
            updatedAt: courseDetail.updatedAt,
        },
    });

    const { control, handleSubmit, reset, watch, setValue } = form;

    // Field arrays for videos (we don't use move functions, just setValue)
    useFieldArray({
        control,
        name: "theory.videos",
    });

    useFieldArray({
        control,
        name: "practice.videos",
    });

    // Watch form values
    const watchedValues = watch();

    // Handle save changes
    const handleEditToggle = async () => {
        await handleSubmit(handleSave)();
    };

    // Handle cancel edit
    const handleCancelEdit = () => {
        reset({
            id: courseDetail.id,
            title: courseDetail.title,
            description: courseDetail.description,
            type: courseDetail.type,
            theory: courseDetail.theory,
            practice: courseDetail.practice,
            exam: courseDetail.exam,
            createdAt: courseDetail.createdAt,
            updatedAt: courseDetail.updatedAt,
        });
        setError(null);
    };

    // Handle save changes
    const handleSave = async (data: FormData) => {
        try {
            setIsLoading(true);
            setError(null);

            const updateData: UpdateCourseRequest = {
                title: data.title,
                description: data.description,
                theory: data.theory,
                practice: data.practice,
                exam: data.exam,
            };

            await updateCourse(courseType, courseDetail.id, updateData);

            // Update the original course detail
            Object.assign(courseDetail, data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Có lỗi xảy ra khi lưu thay đổi");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle drag end for theory video reordering
    const handleTheoryDragEnd = (result: any) => {
        if (!result.destination) return;

        const sourceIndex = result.source.index;
        const destinationIndex = result.destination.index;

        // Get current videos and reorder them
        const currentVideos = [...watchedValues.theory.videos];
        const [movedVideo] = currentVideos.splice(sourceIndex, 1);
        currentVideos.splice(destinationIndex, 0, movedVideo);

        // Update sortNo for each video after reordering
        const reorderedVideos = currentVideos.map((video, index) => ({
            ...video,
            sortNo: index + 1,
        }));

        // Update the form value directly
        setValue("theory.videos", reorderedVideos, { shouldDirty: true });
    };

    // Handle drag end for practice video reordering
    const handlePracticeDragEnd = (result: any) => {
        if (!result.destination) return;

        const sourceIndex = result.source.index;
        const destinationIndex = result.destination.index;

        // Get current videos and reorder them
        const currentVideos = [...watchedValues.practice.videos];
        const [movedVideo] = currentVideos.splice(sourceIndex, 1);
        currentVideos.splice(destinationIndex, 0, movedVideo);

        // Update sortNo for each video after reordering
        const reorderedVideos = currentVideos.map((video, index) => ({
            ...video,
            sortNo: index + 1,
        }));

        // Update the form value directly
        setValue("practice.videos", reorderedVideos, { shouldDirty: true });
    };

    // Handle add new video
    const handleAddVideo = async (data: {
        title: string;
        description: string;
        file: File | null;
    }) => {
        if (!data.file) return;

        try {
            setIsLoading(true);
            setError(null);

            // Upload video file
            const formData = new FormData();
            formData.append("file", data.file);
            formData.append("contentType", "video");

            const uploadResponse = await fetch("/api/upload/direct", {
                method: "POST",
                body: formData,
            });

            if (!uploadResponse.ok) {
                throw new Error("Upload video thất bại");
            }

            const uploadResult = await uploadResponse.json();

            const newVideo: Video = {
                sortNo: watchedValues.theory.videos.length + 1,
                title: data.title,
                description: data.description,
                url: uploadResult.publicUrl || uploadResult.fileKey,
                length: 0, // TODO: Get actual video duration
                canSeek: true,
                shouldCompleteToPassed: false,
            };

            const currentVideos = watchedValues.theory.videos;
            setValue("theory.videos", [...currentVideos, newVideo], { shouldDirty: true });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Có lỗi xảy ra khi thêm video");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        // Form instance
        form,

        // State
        isLoading,
        error,

        // Form values (using watch for reactivity)
        editTitle: watchedValues.title,
        editDescription: watchedValues.description,
        editVideos: watchedValues.theory.videos,
        editTheory: watchedValues.theory,
        editPractice: watchedValues.practice,
        editExam: watchedValues.exam,

        // Actions
        handleEditToggle,
        handleCancelEdit,
        handleTheoryDragEnd,
        handlePracticeDragEnd,
        handleAddVideo,

        // Form methods
        setEditTitle: (value: string) => setValue("title", value),
        setEditDescription: (value: string) => setValue("description", value),
        setEditTheory: (value: TheorySection) => setValue("theory", value),
        setEditPractice: (value: PracticeSection) => setValue("practice", value),
        setEditExam: (value: ExamSection) => setValue("exam", value),
    };
};
