import { mockCourses } from "@/mock/courses";
import { LessionType } from "@/types/course";

import { AtldPreviewContainer } from "../_widgets/AtldPreviewContainer";

const course = mockCourses[0];

const AtldPreview = () => {
    const theoryLessons = course.lessons
        .filter((lesson) => lesson.type === LessionType.THEORY)
        .map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            duration: "10 phút",
        }));

    const practiceLessons = course.lessons
        .filter((lesson) => lesson.type === LessionType.PRACTICE)
        .map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            duration: "10 phút",
        }));

    return (
        <AtldPreviewContainer
            course={course}
            theoryLessons={theoryLessons}
            practiceLessons={practiceLessons}
        />
    );
};

export default AtldPreview;
