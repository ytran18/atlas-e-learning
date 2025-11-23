import { Checkbox, Table } from "@mantine/core";
import dayjs from "dayjs";

import { useGetUserCourseCompleted } from "@/api/user/useGetUserCourseCompleted";
import Loader from "@/components/Loader";
import { UserCourseCompleted as UserCourseCompletedType } from "@/types/api";

import { tableUserInfoHeader } from "../../utils/table-user-info-header";

type UserCourseCompletedProps = {
    userIdCard: string;
};

const UserCourseCompleted = ({ userIdCard }: UserCourseCompletedProps) => {
    const { data, isLoading } = useGetUserCourseCompleted(userIdCard as string);

    const rows = data?.map((element: UserCourseCompletedType) => {
        const isCompleted = Boolean(element.isCompleted);

        const isTheoryCompleted = Boolean(
            element.currentSection === "practice" ||
                element.currentSection === "exam" ||
                isCompleted
        );

        const isPracticeCompleted = Boolean(element.currentSection === "exam" || isCompleted);

        return (
            <Table.Tr key={element?.id}>
                <Table.Td>{element?.courseName ?? ""}</Table.Td>

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
        );
    });

    return (
        <div className="w-full h-full">
            <Table highlightOnHover withTableBorder withColumnBorders stickyHeader>
                <Table.Thead>
                    <Table.Tr>
                        {tableUserInfoHeader.map((header) => (
                            <Table.Th key={header.key}>{header.label}</Table.Th>
                        ))}
                    </Table.Tr>
                </Table.Thead>

                {isLoading ? <Loader /> : <Table.Tbody>{rows}</Table.Tbody>}
            </Table>
        </div>
    );
};

export default UserCourseCompleted;
