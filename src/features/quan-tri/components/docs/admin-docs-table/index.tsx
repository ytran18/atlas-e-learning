import { useState } from "react";

import { Button, Table, Tooltip } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { Empty } from "antd";
import dayjs from "dayjs";

import { useDeleteDoc } from "@/api/docs/useDeleteDoc";
import { documentKeys } from "@/api/docs/useGetDocsList";
import { docsTable } from "@/features/quan-tri/constants/docsTable";
import { DocumentResponse, DocumentType } from "@/types/documents";

type AdminDocsTableProps = {
    docsLists: DocumentResponse[];
    onEdit: (doc: DocumentResponse) => void;
    type: DocumentType;
};

const AdminDocsTable = ({ docsLists, onEdit, type }: AdminDocsTableProps) => {
    const queryClient = useQueryClient();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const { mutate: deleteDoc, isPending: isDeleting } = useDeleteDoc();

    const typeName = type === "file" ? "tài liệu" : "video";

    const handleDelete = (id: string) => {
        modals.openConfirmModal({
            title: `Bạn có chắc chắn muốn xóa ${typeName} này không?`,
            centered: true,
            labels: {
                confirm: "Xóa",
                cancel: "Hủy",
            },
            confirmProps: { color: "red" },
            onCancel: () => {},
            onConfirm: () => {
                setDeletingId(id);
                deleteDoc(id, {
                    onSuccess: async () => {
                        await queryClient.invalidateQueries({
                            queryKey: documentKeys.list(type),
                        });

                        notifications.show({
                            title: "Thành công",
                            message: `Xóa ${typeName} thành công`,
                            color: "green",
                        });
                        setDeletingId(null);
                    },
                    onError: () => {
                        notifications.show({
                            title: "Thất bại",
                            message: `Xóa ${typeName} thất bại`,
                            color: "red",
                        });
                        setDeletingId(null);
                    },
                });
            },
        });
    };

    if (!docsLists || docsLists?.length === 0) {
        return <Empty description={`Không có ${typeName} nào.`} />;
    }

    return (
        <div className="w-full h-full">
            <Table highlightOnHover withTableBorder withColumnBorders stickyHeader>
                <Table.Thead>
                    <Table.Tr>
                        {docsTable.map((header) => (
                            <Table.Th
                                key={header.key}
                                visibleFrom={header.visileInMobile ? undefined : "sm"}
                                className="w-full min-w-[200px]"
                            >
                                {header.label === "Tên tài liệu" && type === "video"
                                    ? "Tên video"
                                    : header.label}
                            </Table.Th>
                        ))}
                    </Table.Tr>
                </Table.Thead>

                <Table.Tbody>
                    {docsLists.map((doc) => {
                        return (
                            <Table.Tr key={doc.id}>
                                <Table.Td>{doc?.title ?? ""}</Table.Td>

                                <Table.Td visibleFrom="sm">
                                    {dayjs(Number(doc.createdAt)).format("DD-MM-YYYY HH:mm")}
                                </Table.Td>

                                <Table.Td>
                                    {doc.category === "atld" ? "An Toàn Lao Động" : "Học Nghề"}
                                </Table.Td>

                                <Table.Td className="flex items-center justify-center gap-x-2">
                                    <Tooltip label={`Xóa ${typeName}`} withArrow>
                                        <Button
                                            color="red"
                                            onClick={() => handleDelete(doc.id)}
                                            loading={isDeleting && deletingId === doc.id}
                                            disabled={isDeleting && deletingId !== doc.id}
                                        >
                                            <IconTrash />
                                        </Button>
                                    </Tooltip>

                                    <Tooltip label={`Chỉnh sửa ${typeName}`} withArrow>
                                        <Button onClick={() => onEdit(doc)} disabled={isDeleting}>
                                            <IconEdit />
                                        </Button>
                                    </Tooltip>
                                </Table.Td>
                            </Table.Tr>
                        );
                    })}
                </Table.Tbody>
            </Table>
        </div>
    );
};

export default AdminDocsTable;
