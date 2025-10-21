import Link from "next/link";
import { useParams } from "next/navigation";

import { Accordion, Button } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";

import { ATLD_SLUG, navigationPaths } from "@/utils/navigationPaths";

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
    const { atldId } = useParams();

    return (
        <div className="h-full flex flex-col gap-y-4">
            {/* Desktop: Show title, Mobile: Title is in header */}
            <div className="flex items-center gap-x-2">
                <Link
                    href={navigationPaths.ATLD_PREVIEW.replace(`[${ATLD_SLUG}]`, atldId as string)}
                >
                    <Button leftSection={<IconChevronLeft className="w-6 h-6 min-h-6 min-w-6" />}>
                        Quay về
                    </Button>
                </Link>
            </div>
            <div className="w-full border border-gray-200 rounded-md flex items-center gap-x-2">
                <div className="hidden lg:block text-xl font-bold text-[rgb(0,86,210)] p-4">
                    {title}
                </div>
            </div>

            <Accordion
                chevronPosition="right"
                variant="contained"
                value={currentSection}
                defaultValue={currentSection || "theory"}
                classNames={{
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
