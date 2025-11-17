"use client";

import { useEffect, useRef } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { Card } from "@mantine/core";
import { Empty } from "antd";

import { useStudentStats } from "@/api";
import { useGetAllCourseLists } from "@/api/user/useGetAllCourseLists";
import Loader from "@/components/Loader";
import { CourseType } from "@/types/api";

import UserFilter from "../components/AdminUser/UserFilter";
import UserTable from "../components/AdminUser/UserTable";
import { AdminUserProvider } from "../contexts/AdminUserContext";
import { useCursorPagination } from "../hooks/useCursorPagination";

const AdminUserPage = () => {
    const searchParams = useSearchParams();

    const router = useRouter();

    const courseId = searchParams.get("courseId");

    const type = searchParams.get("type");

    const page = searchParams.get("page");

    const pageSize = searchParams.get("pageSize");

    const search = searchParams.get("search");

    const { getCursor, saveCursor } = useCursorPagination();

    const { data: courseList } = useGetAllCourseLists();

    const tableRef = useRef<HTMLDivElement>(null);

    // Cursor của trang trước
    const cursor = getCursor(Number(page) || 1);

    const {
        data: stats,
        isLoading,
        isFetching,
    } = useStudentStats(
        type as CourseType,
        courseId as string,
        Number(pageSize) ?? 10,
        cursor,
        search as string
    );

    // Sau khi fetch xong → lưu lại nextCursor cho page hiện tại
    useEffect(() => {
        if (stats?.nextCursor) {
            saveCursor(Number(page) || 1, stats.nextCursor);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stats?.nextCursor, page]);

    // save total pages to search params
    useEffect(() => {
        if (stats?.totalPages) {
            const params = new URLSearchParams(searchParams.toString());

            params.set("totalPages", stats.totalPages.toString());

            router.push(`?${params.toString()}`);
        }
    }, [stats?.totalPages, searchParams, router]);

    // Only show full page loader on initial load, not during pagination
    if (isLoading || isFetching) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    if (!courseList) return null;

    if (!stats) {
        return (
            <AdminUserProvider courseList={courseList} tableData={[]} totalDocs={0} totalPages={0}>
                <div className="flex-1 flex w-full">
                    <Card withBorder className="w-full h-full flex flex-col gap-y-4 flex-1">
                        <UserFilter />

                        <div className="flex justify-center w-full h-full min-h-[250px] text-lg text-gray-700 font-semibold">
                            <Empty description="Vui lòng chọn khóa học để xem dữ liệu" />
                        </div>
                    </Card>
                </div>
            </AdminUserProvider>
        );
    }

    return (
        <AdminUserProvider
            courseList={courseList}
            tableData={stats.data}
            totalDocs={stats.totalDocs}
            totalPages={stats.totalPages}
        >
            <div className="flex-1 flex w-full">
                <Card withBorder className="w-full h-full flex flex-col gap-y-4 flex-1">
                    <UserFilter />

                    <UserTable ref={tableRef} isLoading={isLoading} />
                </Card>
            </div>
        </AdminUserProvider>
    );
};

export default AdminUserPage;
