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
        <div className="border-r border-gray-300 h-full min-w-1/4">
            <div className="text-xl font-bold text-[rgb(0,86,210)] p-4">{title}</div>

            <Accordion
                chevronPosition="right"
                variant="contained"
                defaultValue={currentSection || "theory"}
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
