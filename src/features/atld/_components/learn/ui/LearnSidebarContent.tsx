import { Accordion } from "@mantine/core";

import SectionItem from "./SectionItem";

interface VideoContent {
    id: string;
    label: string;
    description: string;
    isCompleted: boolean;
    isAccessible: boolean;
    isActive: boolean;
    section: "theory" | "practice" | "exam";
    index: number;
}

interface SectionData {
    id: string;
    label: string;
    description: string;
    isAccessible: boolean;
    content: VideoContent[];
}

interface LearnSidebarContentProps {
    title: string;
    sections: SectionData[];
    currentSection?: string;
    onViewAgain: (section: string, index: number) => void;
    onViewExam: () => void;
}

const LearnSidebarContent = ({
    title,
    sections,
    currentSection,
    onViewAgain,
    onViewExam,
}: LearnSidebarContentProps) => {
    return (
        <div className="h-full">
            {/* Desktop: Show title, Mobile: Title is in header */}
            <div className="hidden lg:block text-xl font-bold text-[rgb(0,86,210)] p-4 border-b border-gray-200">
                {title}
            </div>

            <Accordion
                chevronPosition="right"
                variant="contained"
                defaultValue={currentSection || "theory"}
                classNames={{
                    root: "h-full",
                    content: "pb-0",
                    item: "border-b border-gray-100 last:border-b-0",
                }}
            >
                {sections.map((section) => (
                    <SectionItem
                        key={section.id}
                        {...section}
                        onViewAgain={onViewAgain}
                        onViewExam={onViewExam}
                    />
                ))}
            </Accordion>
        </div>
    );
};

export default LearnSidebarContent;
