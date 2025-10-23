import { useCourseFormContext } from "@/features/quan-tri/contexts/CourseFormContext";

import ExamTab from "./ExamTab";
import PracticeTab from "./PracticeTab";
import TabsContent from "./TabsContent";
import TheoryTab from "./TheoryTab";

const AdminAtldDetailTabs = () => {
    const { error } = useCourseFormContext();

    return (
        <div className="flex flex-col h-full">
            {/* Error message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <TabsContent
                slots={{
                    Theory: () => <TheoryTab />,
                    Practice: () => <PracticeTab />,
                    Exam: () => <ExamTab />,
                }}
            />
        </div>
    );
};

export default AdminAtldDetailTabs;
