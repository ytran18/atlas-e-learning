import { LearnExam, LearnPractice, LearnSidebar, LearnSteps, LearnTheory } from "../";

const DesktopLayout = () => {
    return (
        <div className="hidden lg:flex items-center gap-x-8 h-full w-full">
            <LearnSidebar />

            <LearnSteps
                slots={{
                    Theory: () => <LearnTheory />,
                    Practice: () => <LearnPractice />,
                    Exam: () => <LearnExam />,
                }}
            />
        </div>
    );
};

export default DesktopLayout;
