import { useState } from "react";

import dynamic from "next/dynamic";

import { Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

import { useGetDocsList } from "@/api/docs/useGetDocsList";
import Loader from "@/components/Loader";
import { DocumentResponse } from "@/types/documents";

import AdminDocsTable from "../admin-docs-table";

const ModalCreateFileDoc = dynamic(() => import("../modal-create-file-doc"), {
    ssr: false,
});

const AdminDocsVideo = () => {
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [selectedDoc, setSelectedDoc] = useState<DocumentResponse | undefined>(undefined);

    const { data: fileLists, isLoading } = useGetDocsList("video");

    const handleCloseModal = () => {
        setIsOpenModal(false);
        setIsEditMode(false);
        setSelectedDoc(undefined);
    };

    const handleEdit = (doc: DocumentResponse) => {
        setSelectedDoc(doc);
        setIsEditMode(true);
        setIsOpenModal(true);
    };

    if (!fileLists || isLoading)
        return (
            <div className="w-full">
                <Loader className="flex items-center w-full justify-center py-8" />
            </div>
        );

    return (
        <>
            <div className="w-full h-full flex flex-col gap-y-4">
                <div className="w-full flex justify-end">
                    <Button leftSection={<IconPlus />} onClick={() => setIsOpenModal(true)}>
                        Thêm video
                    </Button>
                </div>

                <div className="h-[calc(100%-52px)] w-full overflow-y-auto">
                    <AdminDocsTable docsLists={fileLists} onEdit={handleEdit} type="video" />
                </div>
            </div>

            <ModalCreateFileDoc
                opened={isOpenModal}
                onClose={handleCloseModal}
                isEditMode={isEditMode}
                fileData={selectedDoc}
                type="video"
            />
        </>
    );
};

export default AdminDocsVideo;
