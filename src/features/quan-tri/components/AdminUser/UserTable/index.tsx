import { forwardRef } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { Checkbox, Image, Pagination, Table } from "@mantine/core";

import { tableHeader } from "@/features/quan-tri/constants/userTable";
import { useAdminUserContext } from "@/features/quan-tri/contexts/AdminUserContext";

type UserTableProps = {
    className?: string;
};

const UserTable = forwardRef<HTMLDivElement, UserTableProps>(({ className }, ref) => {
    const router = useRouter();

    const searchParams = useSearchParams();

    const { tableData, totalPages, totalDocs } = useAdminUserContext();

    const page = searchParams.get("page");

    const currentPage = Number(page) || 1;

    const isShowPagination = totalDocs > 10;

    if (!tableData) return <div>No data</div>;

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

        return (
            <Table.Tr key={element.userId}>
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
                        className="max-w-[100px] max-h-[100px]"
                    />
                </Table.Td>

                <Table.Td>
                    <Image
                        src={element.finishImageUrl}
                        alt={element.fullname}
                        className="max-w-[100px] max-h-[100px]"
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

                    <Table.Tbody>{rows}</Table.Tbody>
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
        </div>
    );
});

UserTable.displayName = "UserTable";

export default UserTable;
