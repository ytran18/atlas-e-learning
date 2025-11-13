import { useEffect, useState } from "react";

import { useAtldAdminDetailContext } from "@/features/quan-tri/contexts/AdminDetailContext";
import { useCourseFormContext } from "@/features/quan-tri/contexts/CourseFormContext";

import ExamTab from "./ExamTab";
import PracticeTab from "./PracticeTab";
import TabsContent from "./TabsContent";
import TheoryTab from "./TheoryTab";

const AdminAtldDetailTabs = () => {
    const { error } = useCourseFormContext();

    const { isEditMode } = useAtldAdminDetailContext();

    const [tabHeight, setTabHeight] = useState<number>(0);

    useEffect(() => {
        const itemHeader = document.getElementById("admin-atld-detail-header");

        if (!itemHeader) return;

        const updateHeight = () => {
            const boundingHeight = itemHeader.getBoundingClientRect().height;

            setTabHeight(boundingHeight + 16);
        };

        // Đo ngay lập tức
        updateHeight();

        // Theo dõi thay đổi kích thước
        const resizeObserver = new ResizeObserver(() => {
            updateHeight();
        });

        resizeObserver.observe(itemHeader);

        return () => {
            resizeObserver.disconnect();
        };
    }, [isEditMode]);

    return (
        <div className="flex flex-col" style={{ height: `calc(100% - ${tabHeight}px)` }}>
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
