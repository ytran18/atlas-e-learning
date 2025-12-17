"use client";

import { FunctionComponent, useEffect, useMemo, useRef, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { Button, Select, Tooltip } from "@mantine/core";
import { DatePickerInput, DatesRangeValue } from "@mantine/dates";
import { useDebouncedValue, useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconFileExcel } from "@tabler/icons-react";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { SearchBox, useInstantSearch } from "react-instantsearch-hooks-web";

import { useAdminUserContext } from "@/features/quan-tri/contexts/AdminUserContext";
import { formatXLSXData } from "@/features/quan-tri/utils/format-xlsx-data";
import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";
import { trackStudentSearched } from "@/libs/mixpanel/tracking";
import { exportToXLSX } from "@/libs/xlsx/export-to-xlsx";
import { getStudentStatsByUserIds } from "@/services/api.client";
import { CourseType } from "@/types/api";
import { navigationPaths } from "@/utils/navigationPaths";

import "./style.css";

const UserFilter: FunctionComponent = () => {
    const { t } = useI18nTranslate();
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
                title: t("loi"),
                message: t("vui_long_chon_khoa_hoc_truoc_khi_xuat_file"),
                color: "red",
            });
            return;
        }

        // Get objectIDs from Algolia results
        const objectIDs = results?.hits?.map((hit: any) => hit.objectID).filter(Boolean) || [];

        if (objectIDs.length === 0) {
            notifications.show({
                title: t("loi"),
                message: t("khong_co_du_lieu_de_xuat_file"),
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

            const formattedData = data.map((item) => formatXLSXData(item));

            // Get course name from first student or use default
            const courseName = data[0]?.courseName || t("khoa_hoc");

            await exportToXLSX(formattedData, courseName);

            notifications.show({
                title: t("thanh_cong"),
                message: t("xuat_file_xlsx_thanh_cong"),
                color: "green",
            });
        } catch (error) {
            console.error("Error exporting XLSX:", error);
            notifications.show({
                title: t("loi"),
                message: t("khong_the_xuat_file_xlsx_vui_long_thu_lai"),
                color: "red",
            });
        } finally {
            setIsExporting(false);
        }
    };

    // Tạo queryHook với debounce 800ms
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

            // Không search nếu < 2 ký tự
            if (query.trim().length < 2) {
                return;
            }

            // Debounce search với 800ms
            timeoutRef.current = setTimeout(() => {
                // Tracking search event
                trackStudentSearched({ query });
                search(query);
            }, 800);
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
                placeholder={t("tim_kiem_theo_ten")}
                queryHook={queryHook}
            />

            {!isMobile && (
                <Select
                    searchable
                    defaultValue={courseId}
                    w={"200px"}
                    placeholder={t("chon_khoa_hoc")}
                    nothingFoundMessage={t("chua_co_khoa_hoc_nao")}
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
                placeholder={t("tu_ngay_den_ngay")}
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

            <Tooltip label={t("xuat_file_xlsx")} withArrow>
                <Button onClick={handleExportPDF} loading={isExporting} disabled={isExporting}>
                    <div className="flex items-center gap-x-2">
                        <IconFileExcel className="size-5" />
                    </div>
                </Button>
            </Tooltip>
        </div>
    );
};

export default UserFilter;
