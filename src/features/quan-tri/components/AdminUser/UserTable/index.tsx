import { forwardRef, useState } from "react";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";

import { Checkbox, Modal, Table, Tooltip } from "@mantine/core";
import { Empty } from "antd";
import dayjs from "dayjs";
import { useInstantSearch } from "react-instantsearch-hooks-web";

import { useCourseDetail, useGetUserDetail } from "@/api";
import Loader from "@/components/Loader";
import { tableHeader } from "@/features/quan-tri/constants/userTable";
import { CourseType } from "@/types/api";

const ModalUserDetail = dynamic(() => import("./ModalUserDetail"), {
    ssr: false,
});

const CustomPagination = dynamic(() => import("./CustomPagination"), {
    ssr: false,
});

type UserTableProps = {
    className?: string;
};

const UserTable = forwardRef<HTMLDivElement, UserTableProps>(({ className }, ref) => {
    const searchParams = useSearchParams();

    const type = searchParams.get("type");

    const courseId = searchParams.get("courseId");

    const { results, refresh } = useInstantSearch();

    // Check if Algolia is still loading (results might be null initially)
    const isLoading = !results;

    // get course detail
    const { data: courseDetail } = useCourseDetail(type as CourseType, courseId as string);

    const [openedModalUserDetail, setOpenedModalUserDetail] = useState<boolean>(false);

    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    // Fetch user detail when a row is clicked
    const { data: userDetail, isLoading: isLoadingUserDetail } = useGetUserDetail(
        type as CourseType,
        courseId as string,
        selectedUserId as string,
        {
            enabled: !!selectedUserId && !!courseId && !!type,
        }
    );

    const handleDeleteSuccess = () => {
        // Clear selected user to prevent showing deleted data
        setSelectedUserId(null);
        // Refresh Algolia results
        refresh();
    };

    const isTableDataEmpty = results?.hits?.length === 0;

    if (isTableDataEmpty) return <Empty description="Không có dữ liệu" />;

    const rows = results?.hits?.map((element: any) => {
        const isCompleted = Boolean(element.isCompleted);

        const isTheoryCompleted = Boolean(
            element.currentSection === "practice" ||
                element.currentSection === "exam" ||
                isCompleted
        );

        const isPracticeCompleted = Boolean(element.currentSection === "exam" || isCompleted);

        const handleRowClick = () => {
            // Get userId from objectID or element data
            const userId = element?.objectID || element?.userId;
            const groupId = element?.groupId || courseId;

            if (userId && groupId) {
                setSelectedUserId(userId);
                setOpenedModalUserDetail(true);
            }
        };

        return (
            <Tooltip key={element?.objectID} label="Nhấn vào để xem chi tiết" withArrow>
                <Table.Tr onClick={handleRowClick}>
                    <Table.Td>{element?.userFullname ?? ""}</Table.Td>

                    <Table.Td>{element?.userIdCard ?? element?.cccd ?? ""}</Table.Td>

                    <Table.Td>{element?.userBirthDate ?? ""}</Table.Td>

                    <Table.Td>{element?.userCompanyName ?? ""}</Table.Td>

                    <Table.Td>
                        {element?.lastUpdatedAt
                            ? dayjs(Number(element.lastUpdatedAt)).format("DD-MM-YYYY HH:mm")
                            : ""}
                    </Table.Td>

                    <Table.Td>
                        <Checkbox readOnly checked={isTheoryCompleted} />
                    </Table.Td>

                    <Table.Td>
                        <Checkbox readOnly checked={isPracticeCompleted} />
                    </Table.Td>

                    <Table.Td>
                        <Checkbox readOnly checked={isCompleted} />
                    </Table.Td>

                    <Table.Td>
                        <Checkbox readOnly checked={isCompleted} />
                    </Table.Td>
                </Table.Tr>
            </Tooltip>
        );
    });

    return (
        <div className={`flex flex-col gap-y-2 flex-1 ${className}`} ref={ref}>
            <div className="flex-1 max-h-[calc(100vh-268px)] md:max-h-[calc(100vh-306px)] lg:max-h-[calc(100vh-380px)] overflow-y-auto">
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

            <div className="w-full">
                <CustomPagination />
            </div>

            {isLoadingUserDetail ? (
                <Modal
                    opened={openedModalUserDetail}
                    onClose={() => {
                        setOpenedModalUserDetail(false);
                        setSelectedUserId(null);
                    }}
                    title="Đang tải..."
                    closeOnEscape={false}
                    centered
                    size="lg"
                >
                    <div className="flex items-center justify-center min-h-[200px]">
                        <Loader />
                    </div>
                </Modal>
            ) : (
                <ModalUserDetail
                    opened={openedModalUserDetail}
                    onClose={() => {
                        setOpenedModalUserDetail(false);
                        setSelectedUserId(null);
                    }}
                    user={userDetail || null}
                    courseDetail={courseDetail}
                    onDeleteSuccess={handleDeleteSuccess}
                />
            )}
        </div>
    );
});

UserTable.displayName = "UserTable";

export default UserTable;
