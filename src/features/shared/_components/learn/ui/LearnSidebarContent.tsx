"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

import { Accordion, Button } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";

import { ATLD_SLUG, HOC_NGHE_SLUG, navigationPaths } from "@/utils/navigationPaths";

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
    isVisible: boolean;
}

interface LearnSidebarContentProps {
    title: string;
    sections: SectionData[];
    currentSection?: string;
    onViewAgain: (section: string, index: number) => void;
    onViewExam: () => void;
    courseType?: "atld" | "hoc-nghe";
}

const LearnSidebarContent = ({
    title,
    sections,
    currentSection,
    onViewAgain,
    onViewExam,
}: LearnSidebarContentProps) => {
    const { atldId, hocNgheId } = useParams();

    const searchParams = useSearchParams();

    const sectionDB = searchParams.get("section");

    const videoIndexDB = searchParams.get("video");

    const backPath = atldId
        ? navigationPaths.ATLD_PREVIEW.replace(`[${ATLD_SLUG}]`, atldId as string)
        : hocNgheId
          ? navigationPaths.HOC_NGHE_PREVIEW.replace(`[${HOC_NGHE_SLUG}]`, hocNgheId as string)
          : "";

    const handleReturnToCurrent = () => {
        onViewAgain(sectionDB || "theory", Number(videoIndexDB) || 0);
    };

    return (
        <div className="h-full flex flex-col gap-y-4">
            {/* Desktop: Show title, Mobile: Title is in header */}
            <div className="flex items-center gap-x-2">
                <Link href={backPath}>
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

            <div className="w-full">
                <Button
                    fullWidth
                    variant="filled"
                    color="blue"
                    size="sm"
                    onClick={handleReturnToCurrent}
                    className="mb-2"
                >
                    Đến phần hiện tại
                </Button>
            </div>

            <Accordion
                chevronPosition="right"
                variant="contained"
                defaultValue={currentSection || "theory"}
                classNames={{
                    content: "pb-0",
                    item: "border-b border-gray-100 last:border-b-0",
                }}
            >
                {sections.map((section) => {
                    if (section.isVisible) {
                        return (
                            <SectionItem
                                key={section.id}
                                {...section}
                                onViewAgain={onViewAgain}
                                onViewExam={onViewExam}
                            />
                        );
                    }

                    return null;
                })}
            </Accordion>
        </div>
    );
};

export default LearnSidebarContent;
