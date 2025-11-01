import { useState } from "react";

import { Checkbox, Image, Pagination, Table } from "@mantine/core";

import { tableHeader } from "@/features/quan-tri/constants/userTable";
import { useAdminUserContext } from "@/features/quan-tri/contexts/AdminUserContext";

const UserTable = () => {
    const { tableData, totalPages } = useAdminUserContext();

    const [currentPage, setCurrentPage] = useState<number>(1);

    if (!tableData) return <div>No data</div>;

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
        <div className="flex flex-col gap-y-2 flex-1">
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

            <div className="w-full flex justify-end">
                <Pagination total={totalPages} value={currentPage} onChange={setCurrentPage} />
            </div>
        </div>
    );
};

export default UserTable;
