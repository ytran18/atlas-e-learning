import { forwardRef, useState } from "react";

import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";

import { Checkbox, Image, Pagination, Table } from "@mantine/core";
import { Empty } from "antd";

import { useCourseDetail } from "@/api";
import Loader from "@/components/Loader";
import { tableHeader } from "@/features/quan-tri/constants/userTable";
import { useAdminUserContext } from "@/features/quan-tri/contexts/AdminUserContext";
import { CourseType, StudentStats } from "@/types/api";

const ModalUserDetail = dynamic(() => import("./ModalUserDetail"), {
    ssr: false,
});

type UserTableProps = {
    className?: string;
    isLoading?: boolean;
};

const UserTable = forwardRef<HTMLDivElement, UserTableProps>(({ className, isLoading }, ref) => {
    const router = useRouter();

    const searchParams = useSearchParams();

    const page = searchParams.get("page");

    const type = searchParams.get("type");

    const courseId = searchParams.get("courseId");

    // get course detail
    const { data: courseDetail } = useCourseDetail(type as CourseType, courseId as string);

    const [openedModalUserDetail, setOpenedModalUserDetail] = useState<boolean>(false);

    const [userDetail, setUserDetail] = useState<StudentStats | null>(null);

    const { tableData, totalPages, totalDocs } = useAdminUserContext();

    const currentPage = Number(page) || 1;

    const isShowPagination = totalDocs > 10;

    if (!tableData || !courseDetail) return <Empty description="Không có dữ liệu" />;

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());

        params.set("page", String(newPage));

        router.push(`?${params.toString()}`);
    };

    const rows = tableData?.map((element) => {
        const isCompleted = element.isCompleted;

        const isTheoryCompleted =
            element.currentSection === "practice" || element.currentSection === "exam";

        const isPracticeCompleted = element.currentSection === "exam";

        const handleRowClick = () => {
            setUserDetail(element);

            setOpenedModalUserDetail(true);
        };

        return (
            <Table.Tr key={element.userId} onClick={handleRowClick}>
                <Table.Td>{element.fullname}</Table.Td>

                <Table.Td>{element.birthDate}</Table.Td>

                <Table.Td>
                    <Checkbox readOnly checked={isTheoryCompleted} />
                </Table.Td>

                <Table.Td>
                    <Checkbox readOnly checked={isPracticeCompleted} />
                </Table.Td>

                <Table.Td>
                    <Checkbox readOnly checked={isCompleted} />
                </Table.Td>

                <Table.Td>{element.companyName}</Table.Td>

                <Table.Td>{element.courseName}</Table.Td>

                <Table.Td>
                    <Image
                        src={element.startImageUrl}
                        alt={element.fullname}
                        className="max-w-[100px] max-h-[50px] object-cover"
                    />
                </Table.Td>

                <Table.Td>
                    <Image
                        src={element.finishImageUrl}
                        alt={element.fullname}
                        className="max-w-[100px] max-h-[50px] object-cover"
                    />
                </Table.Td>

                <Table.Td>
                    <Checkbox readOnly checked={isCompleted} />
                </Table.Td>
            </Table.Tr>
        );
    });

    return (
        <div className={`flex flex-col gap-y-2 flex-1 ${className}`} ref={ref}>
            <div className="flex-1 max-h-[calc(100vh-270px)] sm:max-h-[calc(100vh-470px)] overflow-y-auto">
                <Table highlightOnHover withTableBorder withColumnBorders stickyHeader>
                    <Table.Thead>
                        <Table.Tr>
                            {tableHeader.map((header) => (
                                <Table.Th key={header.key}>{header.label}</Table.Th>
                            ))}
                        </Table.Tr>
                    </Table.Thead>

                    {isLoading ? (
                        <div>
                            <Loader />
                        </div>
                    ) : (
                        <Table.Tbody>{rows}</Table.Tbody>
                    )}
                </Table>
            </div>

            {isShowPagination && (
                <div className="w-full flex justify-end">
                    <Pagination
                        total={totalPages}
                        value={currentPage}
                        onChange={handlePageChange}
                    />
                </div>
            )}

            <ModalUserDetail
                opened={openedModalUserDetail}
                onClose={() => setOpenedModalUserDetail(false)}
                user={userDetail}
                courseDetail={courseDetail}
            />
        </div>
    );
});

UserTable.displayName = "UserTable";

export default UserTable;
