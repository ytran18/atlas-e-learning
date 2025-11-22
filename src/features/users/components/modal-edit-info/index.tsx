import { Modal, ModalProps } from "@mantine/core";

import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";

import { EditInfoType } from "../user-right-section";
import ModalEditBirthday from "./modal-edit-birthday";
import ModalEditCompanyName from "./modal-edit-company-name";
import ModalEditIdCard from "./modal-edit-id-card";
import ModalEditJobTitle from "./modal-edit-job-title";
import ModalEditName from "./modal-edit-name";

type ModalEditInfoProps = ModalProps & {
    type: EditInfoType | null;
    user: Record<string, any>;
};

const ModalEditInfo = ({ opened, onClose, type, user, ...props }: ModalEditInfoProps) => {
    const { t } = useI18nTranslate();

    const renderContent = () => {
        switch (type) {
            case EditInfoType.FULL_NAME:
                return <ModalEditName user={user} onClose={onClose} />;
            case EditInfoType.BIRTH_DATE:
                return <ModalEditBirthday user={user} onClose={onClose} />;
            case EditInfoType.JOB_TITLE:
                return <ModalEditJobTitle user={user} onClose={onClose} />;
            case EditInfoType.COMPANY_NAME:
                return <ModalEditCompanyName user={user} onClose={onClose} />;
            case EditInfoType.CCCD:
                return <ModalEditIdCard user={user} onClose={onClose} />;
            default:
                return null;
        }
    };

    const renderTitle = () => {
        switch (type) {
            case EditInfoType.FULL_NAME:
                return t("chinh_sua_ho_va_ten");
            case EditInfoType.BIRTH_DATE:
                return t("chinh_sua_ngay_sinh");
            case EditInfoType.JOB_TITLE:
                return t("chinh_sua_chuc_vu");
            case EditInfoType.COMPANY_NAME:
                return t("chinh_sua_cong_ty");
            case EditInfoType.CCCD:
                return t("chinh_sua_can_cuoc_cong_dan_ho_chieu");
            default:
                return null;
        }
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            centered
            size="md"
            closeOnEscape={false}
            closeOnClickOutside={false}
            title={renderTitle()}
            {...props}
        >
            {renderContent()}
        </Modal>
    );
};

export default ModalEditInfo;
