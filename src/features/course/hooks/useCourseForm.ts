import { useState } from "react";

import { nanoid } from "nanoid";
import { useFieldArray, useForm } from "react-hook-form";

import { updateCourse } from "@/services/api.client";
import {
    CourseDetail,
    ExamQuestion,
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

    useFieldArray({
        control,
        name: "exam.questions",
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
    const handleAddVideo = async (data: { video: Video; section: "theory" | "practice" }) => {
        try {
            setIsLoading(true);
            setError(null);

            const newVideo: Video = {
                ...data.video,
                sortNo: watchedValues[data.section].videos.length + 1,
            };

            const currentVideos = watchedValues[data.section].videos;
            setValue(`${data.section}.videos`, [...currentVideos, newVideo], { shouldDirty: true });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Có lỗi xảy ra khi thêm video");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle update video
    const handleUpdateVideo = (
        videoId: string,
        data: {
            title: string;
            description: string;
            canSeek: boolean;
            shouldCompleteToPassed: boolean;
            url: string;
            thumbnailUrl: string;
        }
    ) => {
        // Update video in theory section
        const theoryVideos = [...watchedValues.theory.videos];
        const theoryVideoIndex = theoryVideos.findIndex((video) => video.id === videoId);

        if (theoryVideoIndex !== -1) {
            theoryVideos[theoryVideoIndex] = {
                ...theoryVideos[theoryVideoIndex],
                title: data.title,
                description: data.description,
                canSeek: data.canSeek,
                shouldCompleteToPassed: data.shouldCompleteToPassed,
                url: data.url,
                thumbnailUrl: data.thumbnailUrl,
            };
            setValue("theory.videos", theoryVideos, { shouldDirty: true });
            return;
        }

        // Update video in practice section
        const practiceVideos = [...watchedValues.practice.videos];
        const practiceVideoIndex = practiceVideos.findIndex((video) => video.id === videoId);

        if (practiceVideoIndex !== -1) {
            practiceVideos[practiceVideoIndex] = {
                ...practiceVideos[practiceVideoIndex],
                title: data.title,
                description: data.description,
                thumbnailUrl: data.thumbnailUrl,
                canSeek: data.canSeek,
                shouldCompleteToPassed: data.shouldCompleteToPassed,
                url: data.url,
            };
            setValue("practice.videos", practiceVideos, { shouldDirty: true });
        }
    };

    // Handle delete video
    const handleDeleteVideo = (videoId: string) => {
        // Delete video in theory section
        const theoryVideos = [...watchedValues.theory.videos];

        const theoryVideoIndex = theoryVideos.findIndex((video) => video.id === videoId);

        if (theoryVideoIndex !== -1) {
            theoryVideos.splice(theoryVideoIndex, 1);

            setValue("theory.videos", theoryVideos, { shouldDirty: true });

            return;
        }

        // Delete video in practice section
        const practiceVideos = [...watchedValues.practice.videos];

        const practiceVideoIndex = practiceVideos.findIndex((video) => video.id === videoId);

        if (practiceVideoIndex !== -1) {
            practiceVideos.splice(practiceVideoIndex, 1);

            setValue("practice.videos", practiceVideos, { shouldDirty: true });

            return;
        }
    };

    // Handle add exam question
    const handleAddExamQuestion = (data: {
        content: string;
        options: { id: string; content: string }[];
        correctAnswer: string;
    }) => {
        const newQuestion: ExamQuestion = {
            id: nanoid(),
            content: data.content,
            options: data.options,
            answer: data.correctAnswer,
        };

        const currentQuestions = watchedValues.exam.questions;

        setValue("exam.questions", [...currentQuestions, newQuestion], { shouldDirty: true });
    };

    // Handle delete exam question
    const handleDeleteExamQuestion = (questionId: string) => {
        const currentQuestions = watchedValues.exam.questions;

        const updatedQuestions = currentQuestions.filter((question) => question.id !== questionId);

        setValue("exam.questions", updatedQuestions, { shouldDirty: true });
    };

    // Handle update exam question
    const handleUpdateExamQuestion = (
        questionId: string,
        data: {
            content: string;
            options: { id: string; content: string }[];
            correctAnswer: string;
        }
    ) => {
        const currentQuestions = [...watchedValues.exam.questions];

        const questionIndex = currentQuestions.findIndex((question) => question.id === questionId);

        if (questionIndex !== -1) {
            currentQuestions[questionIndex] = {
                ...currentQuestions[questionIndex],
                content: data.content,
                options: data.options,
                answer: data.correctAnswer,
            };

            setValue("exam.questions", currentQuestions, { shouldDirty: true });
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
        handleUpdateVideo,
        handleDeleteVideo,
        handleAddExamQuestion,
        handleDeleteExamQuestion,
        handleUpdateExamQuestion,

        // Form methods
        setEditTitle: (value: string) => setValue("title", value),
        setEditDescription: (value: string) => setValue("description", value),
        setEditTheory: (value: TheorySection) => setValue("theory", value),
        setEditPractice: (value: PracticeSection) => setValue("practice", value),
        setEditExam: (value: ExamSection) => setValue("exam", value),
    };
};
