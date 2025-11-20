import { useState } from "react";

import {
    IconBriefcase,
    IconBuilding,
    IconCalendar,
    IconEPassport,
    IconUser,
} from "@tabler/icons-react";

import ModalEditInfo from "../modal-edit-info";
import InfoCard from "./info-card";

type UserRightSectionProps = {
    user: Record<string, any>;
};

export enum EditInfoType {
    FULL_NAME = "fullName",
    BIRTH_DATE = "birthDate",
    JOB_TITLE = "jobTitle",
    COMPANY_NAME = "companyName",
    CCCD = "cccd",
}

const UserRightSection = ({ user }: UserRightSectionProps) => {
    const [openedModalEditInfo, setOpenedModalEditInfo] = useState<boolean>(false);

    const [editInfoType, setEditInfoType] = useState<EditInfoType | null>(null);

    const handleOpenModalEditInfo = (type: EditInfoType) => {
        setEditInfoType(type);

        setOpenedModalEditInfo(true);
    };

    const handleCloseModalEditInfo = () => {
        setOpenedModalEditInfo(false);
    };

    return (
        <div className="w-full h-full flex flex-col gap-y-4">
            <InfoCard
                title="Căn cước công dân / Hộ chiếu"
                value={user?.cccd}
                icon={<IconEPassport className="size-5" />}
                type={EditInfoType.CCCD}
                onEdit={() => handleOpenModalEditInfo(EditInfoType.CCCD)}
            />

            <InfoCard
                title="Họ và tên"
                icon={<IconUser className="size-5" />}
                type={EditInfoType.FULL_NAME}
                value={user?.fullName}
                onEdit={() => handleOpenModalEditInfo(EditInfoType.FULL_NAME)}
            />

            <InfoCard
                title="Ngày sinh"
                icon={<IconCalendar className="size-5" />}
                type={EditInfoType.BIRTH_DATE}
                value={user?.birthDate}
                onEdit={() => handleOpenModalEditInfo(EditInfoType.BIRTH_DATE)}
            />

            <InfoCard
                title="Chức vụ"
                icon={<IconBriefcase className="size-5" />}
                type={EditInfoType.JOB_TITLE}
                value={user?.jobTitle ?? "Không có"}
                onEdit={() => handleOpenModalEditInfo(EditInfoType.JOB_TITLE)}
            />

            <InfoCard
                title="Công ty"
                icon={<IconBuilding className="size-5" />}
                type={EditInfoType.COMPANY_NAME}
                value={user?.companyName ?? "Không có"}
                onEdit={() => handleOpenModalEditInfo(EditInfoType.COMPANY_NAME)}
            />

            <ModalEditInfo
                type={editInfoType}
                user={user}
                opened={openedModalEditInfo}
                onClose={handleCloseModalEditInfo}
            />
        </div>
    );
};

export default UserRightSection;
