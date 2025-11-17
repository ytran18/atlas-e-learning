"use client";

import { FunctionComponent, useEffect, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { Button, CloseButton, Input, Select } from "@mantine/core";
import { useDebouncedValue, useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconPdf, IconSearch } from "@tabler/icons-react";

import { useAdminUserContext } from "@/features/quan-tri/contexts/AdminUserContext";
import { navigationPaths } from "@/utils/navigationPaths";

const UserFilter: FunctionComponent = () => {
    const router = useRouter();

    const searchParams = useSearchParams();

    const courseId = searchParams.get("courseId");

    const type = searchParams.get("type");

    const search = searchParams.get("search");

    const { courseList } = useAdminUserContext();

    const isMobile = useMediaQuery("(max-width: 640px)");

    const [value, setValue] = useState<string>("");

    const [debouncedValue] = useDebouncedValue(value, 200);

    const [isExporting, setIsExporting] = useState(false);

    const handleSelectCourse = (value: string, option: any) => {
        if (!option?.type) return;

        router.push(
            `${navigationPaths.QUAN_TRI_USER}?type=${option?.type}&courseId=${value}&page=1&pageSize=10`
        );
    };

    const handleExportPDF = async () => {
        if (!type || !courseId) {
            notifications.show({
                title: "Lỗi",
                message: "Vui lòng chọn khóa học trước khi xuất file",
                color: "red",
            });
            return;
        }

        setIsExporting(true);

        try {
            const params = new URLSearchParams({
                type,
                courseId,
            });

            if (search) {
                params.set("search", search);
            }

            const response = await fetch(`/api/v1/admin/export-pdf?${params.toString()}`, {
                method: "POST",
            });

            if (!response.ok) {
                throw new Error("Failed to export PDF");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `bao-cao-hoc-vien-${courseId}-${Date.now()}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            notifications.show({
                title: "Thành công",
                message: "Xuất file PDF thành công",
                color: "green",
            });
        } catch (error) {
            console.error("Error exporting PDF:", error);
            notifications.show({
                title: "Lỗi",
                message: "Không thể xuất file PDF. Vui lòng thử lại.",
                color: "red",
            });
        } finally {
            setIsExporting(false);
        }
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

            <Button onClick={handleExportPDF} loading={isExporting} disabled={isExporting}>
                <div className="flex items-center gap-x-2">
                    <IconPdf />

                    <span>Xuất File</span>
                </div>
            </Button>
        </div>
    );
};

export default UserFilter;
