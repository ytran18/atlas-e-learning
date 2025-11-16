"use client";

import { FunctionComponent, useEffect, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { Button, CloseButton, Input, Select } from "@mantine/core";
import { useDebouncedValue, useMediaQuery } from "@mantine/hooks";
import { IconPdf, IconSearch } from "@tabler/icons-react";
import generatePDF, { Margin, Options, Resolution } from "react-to-pdf";

import { useAdminUserContext } from "@/features/quan-tri/contexts/AdminUserContext";
import { navigationPaths } from "@/utils/navigationPaths";

type UserFilterProps = {
    ref?: React.RefObject<HTMLDivElement>;
};

const options: Options = {
    // default is `save`\
    filename: "page.pdf",
    // method: "open",
    // default is Resolution.MEDIUM = 3, which should be enough, higher values
    // increases the image quality but also the size of the PDF, so be careful
    // using values higher than 10 when having multiple pages generated, it
    // might cause the page to crash or hang.
    resolution: Resolution.MEDIUM,
    page: {
        // margin is in MM, default is Margin.NONE = 0
        margin: Margin.SMALL,
        // default is 'A4'
        format: "A4",
        // default is 'portrait'
        orientation: "portrait",
    },
    canvas: {
        // default is 'image/jpeg' for better size performance
        mimeType: "image/png",
        qualityRatio: 1,
    },
    // Customize any value passed to the jsPDF instance and html2canvas
    // function. You probably will not need this and things can break,
    // so use with caution.
    overrides: {
        // see https://artskydj.github.io/jsPDF/docs/jsPDF.html for more options
        pdf: {
            compress: true,
        },
        // see https://html2canvas.hertzen.com/configuration for more options
        canvas: {
            useCORS: true,
        },
    },
};

const UserFilter: FunctionComponent<UserFilterProps> = ({ ref }) => {
    const router = useRouter();

    const searchParams = useSearchParams();

    const courseId = searchParams.get("courseId");

    const { courseList } = useAdminUserContext();

    const isMobile = useMediaQuery("(max-width: 640px)");

    const [value, setValue] = useState<string>("");

    const [debouncedValue] = useDebouncedValue(value, 200);

    const handleSelectCourse = (value: string, option: any) => {
        if (!option?.type) return;

        router.push(
            `${navigationPaths.QUAN_TRI_USER}?type=${option?.type}&courseId=${value}&page=1&pageSize=10`
        );
    };

    const handleExportPDF = () => {
        console.log({ ref });

        generatePDF(ref as any, options);
    };

    const InputRightSection = () => {
        if (!value) return <IconSearch size={16} />;

        return (
            <CloseButton
                aria-label="Clear input"
                onClick={() => setValue("")}
                style={{ display: value ? undefined : "none" }}
            />
        );
    };

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());

        if (debouncedValue) {
            params.set("search", debouncedValue);
        } else {
            params.delete("search");
        }

        router.push(`?${params.toString()}`);
    }, [debouncedValue, router, searchParams]);

    return (
        <div className="w-full flex items-center gap-x-2">
            <Input
                placeholder="Tìm kiếm theo tên"
                value={value}
                onChange={(event) => setValue(event.currentTarget.value)}
                rightSectionPointerEvents="all"
                mt="md"
                className="mt-0! flex-1"
                rightSection={<InputRightSection />}
            />

            {!isMobile && (
                <Select
                    searchable
                    defaultValue={courseId}
                    placeholder="Chọn khóa học"
                    nothingFoundMessage="Chưa có khóa học nào!"
                    data={courseList.map((item) => ({
                        value: item.id,
                        label: item.title,
                        type: item.type,
                    }))}
                    onChange={(value, option: any) => handleSelectCourse(value as string, option)}
                />
            )}

            <Button onClick={handleExportPDF}>
                <div className="flex items-center gap-x-2">
                    <IconPdf />

                    <span>Xuất File</span>
                </div>
            </Button>
        </div>
    );
};

export default UserFilter;
