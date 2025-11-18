"use client";

import { FunctionComponent, useEffect, useMemo, useRef, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { Button, Select } from "@mantine/core";
import { useDebouncedValue, useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconPdf } from "@tabler/icons-react";
import { SearchBox, useInstantSearch } from "react-instantsearch-hooks-web";

import { useAdminUserContext } from "@/features/quan-tri/contexts/AdminUserContext";
import { navigationPaths } from "@/utils/navigationPaths";

import "./style.css";

const UserFilter: FunctionComponent = () => {
    const router = useRouter();

    const searchParams = useSearchParams();

    const courseId = searchParams.get("courseId");

    const type = searchParams.get("type");

    const search = searchParams.get("search");

    const { courseList } = useAdminUserContext();

    const { results } = useInstantSearch();

    const isMobile = useMediaQuery("(max-width: 640px)");

    const [value, setValue] = useState<string>(search || "");

    const [debouncedValue] = useDebouncedValue(value, 500);

    const [isExporting, setIsExporting] = useState(false);

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Sync value with search param from URL (e.g., when navigating back)
    useEffect(() => {
        setValue(search || "");
    }, [search]);

    const handleSelectCourse = (value: string, option: any) => {
        if (!option?.type) return;

        router.push(`${navigationPaths.QUAN_TRI_USER}?type=${option?.type}&courseId=${value}`);
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

        // Get objectIDs from Algolia results
        const objectIDs = results?.hits?.map((hit: any) => hit.objectID).filter(Boolean) || [];

        if (objectIDs.length === 0) {
            notifications.show({
                title: "Lỗi",
                message: "Không có dữ liệu để xuất file",
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

            const response = await fetch(`/api/v1/admin/export-pdf?${params.toString()}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    objectIDs,
                }),
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

    // Tạo queryHook với debounce 300ms
    const queryHook = useMemo(() => {
        return (query: string, search: (value: string) => void) => {
            // Clear timeout cũ nếu có
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            // Nếu query rỗng, search ngay lập tức
            if (!query.trim()) {
                search("");
                return;
            }

            // Debounce search với 300ms
            timeoutRef.current = setTimeout(() => {
                search(query);
            }, 300);
        };
    }, []);

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
            <SearchBox
                className="user-filter-search-box"
                placeholder="Tìm kiếm theo tên..."
                queryHook={queryHook}
            />

            {!isMobile && (
                <Select
                    searchable
                    defaultValue={courseId}
                    w={"400px"}
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
                </div>
            </Button>
        </div>
    );
};

export default UserFilter;
