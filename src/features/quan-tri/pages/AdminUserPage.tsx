"use client";

import { useMemo, useRef } from "react";

import { useSearchParams } from "next/navigation";

import { Card } from "@mantine/core";
import algoliasearch from "algoliasearch/lite";
import { Empty } from "antd";
import { Configure } from "react-instantsearch-hooks-web";
import { InstantSearch } from "react-instantsearch-hooks-web";

import { useGetAllCourseLists } from "@/api/user/useGetAllCourseLists";

import UserFilter from "../components/AdminUser/UserFilter";
import UserTable from "../components/AdminUser/UserTable";
import { AdminUserProvider } from "../contexts/AdminUserContext";

const searchClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!
);

const AdminUserPage = () => {
    const indexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME!;

    const searchParams = useSearchParams();

    const courseId = searchParams.get("courseId");

    const { data: courseList } = useGetAllCourseLists();

    const tableRef = useRef<HTMLDivElement>(null);

    // Get hitsPerPage from URL params, default to 20, max 50
    const hitsPerPage = useMemo(() => {
        const param = searchParams.get("hitsPerPage");
        if (param) {
            const value = parseInt(param, 10);
            return Math.min(50, Math.max(10, value)); // Clamp between 10 and 50
        }
        return 20;
    }, [searchParams]);

    if (!courseList) return null;

    if (!courseId) {
        return (
            <InstantSearch searchClient={searchClient} indexName={indexName}>
                <Configure
                    filters={courseId ? `groupId:"${courseId}"` : ""}
                    attributesToRetrieve={[
                        "userFullname",
                        "cccd",
                        "objectID",
                        "groupId",
                        "userIdCard",
                        "currentSection",
                    ]}
                    attributesToHighlight={["userFullname"]}
                    hitsPerPage={hitsPerPage}
                />

                <AdminUserProvider
                    courseList={courseList}
                    tableData={[]}
                    totalDocs={0}
                    totalPages={0}
                >
                    <div className="flex-1 flex w-full">
                        <Card withBorder className="w-full h-full flex flex-col gap-y-4 flex-1">
                            <UserFilter />

                            <div className="flex justify-center w-full h-full min-h-[250px] text-lg text-gray-700 font-semibold">
                                <Empty description="Vui lòng chọn khóa học để xem dữ liệu" />
                            </div>
                        </Card>
                    </div>
                </AdminUserProvider>
            </InstantSearch>
        );
    }

    return (
        <InstantSearch searchClient={searchClient} indexName={indexName}>
            <Configure
                filters={`groupId:"${courseId}"`}
                attributesToRetrieve={[
                    "userFullname",
                    "cccd",
                    "objectID",
                    "groupId",
                    "userIdCard",
                    "currentSection",
                    "isCompleted",
                ]}
                attributesToHighlight={["userFullname"]}
                hitsPerPage={hitsPerPage}
            />

            <AdminUserProvider courseList={courseList} tableData={[]} totalDocs={0} totalPages={0}>
                <div className="flex-1 flex w-full">
                    <Card withBorder className="w-full h-full flex flex-col gap-y-4 flex-1">
                        <UserFilter />

                        <UserTable ref={tableRef} />
                    </Card>
                </div>
            </AdminUserProvider>
        </InstantSearch>
    );
};

export default AdminUserPage;
