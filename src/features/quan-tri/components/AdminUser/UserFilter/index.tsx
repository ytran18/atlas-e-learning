"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Button, CloseButton, Input, Select } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconPdf, IconSearch } from "@tabler/icons-react";

import { useAdminUserContext } from "@/features/quan-tri/contexts/AdminUserContext";
import { navigationPaths } from "@/utils/navigationPaths";

const UserFilter = () => {
    const router = useRouter();

    const { courseList } = useAdminUserContext();

    const isMobile = useMediaQuery("(max-width: 640px)");

    const [value, setValue] = useState<string>("");

    const handleSelectCourse = (value: string, option: any) => {
        if (!option?.type) return;

        router.push(
            `${navigationPaths.QUAN_TRI_USER}?type=${option?.type}&courseId=${value}&page=1&pageSize=10`
        );
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

    return (
        <div className="w-full flex items-center gap-x-2">
            <Input
                placeholder="Tìm kiếm theo tên"
                value={value}
                onChange={(event) => setValue(event.currentTarget.value)}
                rightSectionPointerEvents="all"
                mt="md"
                className="!mt-0 flex-1"
                rightSection={<InputRightSection />}
            />

            {!isMobile && (
                <Select
                    searchable
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

            <Button>
                <div className="flex items-center gap-x-2">
                    <IconPdf />

                    <span>Xuất File</span>
                </div>
            </Button>
        </div>
    );
};

export default UserFilter;
