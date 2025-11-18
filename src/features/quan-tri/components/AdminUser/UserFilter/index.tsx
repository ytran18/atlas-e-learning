"use client";

import { FunctionComponent, useEffect, useMemo, useRef, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { Button, Select } from "@mantine/core";
import { DatePickerInput, DatesRangeValue } from "@mantine/dates";
import { useDebouncedValue, useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconPdf } from "@tabler/icons-react";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { SearchBox, useInstantSearch } from "react-instantsearch-hooks-web";

import { useAdminUserContext } from "@/features/quan-tri/contexts/AdminUserContext";
import { generatePDFFromData } from "@/features/quan-tri/utils/pdfGenerator";
import { getStudentStatsByUserIds } from "@/services/api.client";
import { CourseType } from "@/types/api";
import { navigationPaths } from "@/utils/navigationPaths";

import "./style.css";

const UserFilter: FunctionComponent = () => {
    const router = useRouter();

    const searchParams = useSearchParams();

    const courseId = searchParams.get("courseId");

    const type = searchParams.get("type");

    const search = searchParams.get("search");

    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");

    const { courseList } = useAdminUserContext();

    const { results } = useInstantSearch();

    const isMobile = useMediaQuery("(max-width: 640px)");

    const [value, setValue] = useState<string>(search || "");

    const [debouncedValue] = useDebouncedValue(value, 500);

    const [isExporting, setIsExporting] = useState(false);

    const [dateRange, setDateRange] = useState<DatesRangeValue>([
        startDateParam ? new Date(parseInt(startDateParam, 10)) : null,
        endDateParam ? new Date(parseInt(endDateParam, 10)) : null,
    ]);

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Sync value with search param from URL (e.g., when navigating back)
    useEffect(() => {
        setValue(search || "");
    }, [search]);

    // Sync date range with URL params
    useEffect(() => {
        setDateRange([
            startDateParam ? new Date(parseInt(startDateParam, 10)) : null,
            endDateParam ? new Date(parseInt(endDateParam, 10)) : null,
        ] as DatesRangeValue);
    }, [startDateParam, endDateParam]);

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
            // Fetch student stats data (lightweight API call)
            const data = await getStudentStatsByUserIds(type as CourseType, courseId, objectIDs);

            if (data.length === 0) {
                throw new Error("No data to export");
            }

            // Get course name from first student or use default
            const courseName = data[0]?.courseName || "Khóa học";

            // Generate PDF on client-side
            await generatePDFFromData(data, courseName, courseId);

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

    // Handle date range change
    const handleDateRangeChange = (value: DatesRangeValue) => {
        setDateRange(value);

        const params = new URLSearchParams(searchParams.toString());

        const startDate = value[0];
        const endDate = value[1];

        if (startDate && endDate) {
            // Convert to Date if string
            const startDateObj = typeof startDate === "string" ? new Date(startDate) : startDate;
            const endDateObj = typeof endDate === "string" ? new Date(endDate) : endDate;

            // Convert to milliseconds (Algolia uses milliseconds for numeric filters)
            const startTimestamp = startDateObj.getTime();
            // Set end date to end of day
            const endOfDay = dayjs(endDateObj).endOf("day").toDate();
            const endTimestampEndOfDay = endOfDay.getTime();

            params.set("startDate", startTimestamp.toString());
            params.set("endDate", endTimestampEndOfDay.toString());
        } else {
            params.delete("startDate");
            params.delete("endDate");
        }

        router.push(`?${params.toString()}`);
    };

    return (
        <div className="w-full flex flex-col sm:flex-row items-center gap-y-2 sm:gap-x-2 flex-wrap">
            <SearchBox
                className="user-filter-search-box"
                placeholder="Tìm kiếm theo tên..."
                queryHook={queryHook}
            />

            {!isMobile && (
                <Select
                    searchable
                    defaultValue={courseId}
                    w={"200px"}
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

            <DatePickerInput
                type="range"
                placeholder="Từ ngày - Đến ngày"
                value={dateRange}
                onChange={handleDateRangeChange}
                clearable
                w={isMobile ? "100%" : "220px"}
                locale="vi"
                valueFormat="DD/MM/YYYY"
                popoverProps={{
                    position: "bottom",
                }}
            />

            <Button onClick={handleExportPDF} loading={isExporting} disabled={isExporting}>
                <div className="flex items-center gap-x-2">
                    <IconPdf />
                </div>
            </Button>
        </div>
    );
};

export default UserFilter;
