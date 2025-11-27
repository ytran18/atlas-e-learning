import Link from "next/link";

import { useClerk } from "@clerk/nextjs";
import { Button, Text } from "@mantine/core";
import dayjs from "dayjs";
import { Trans } from "react-i18next";

import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";
import { navigationPaths } from "@/utils/navigationPaths";

type CompletedContentProps = {
    completedTime: number;
};

const CompletedContent = ({ completedTime }: CompletedContentProps) => {
    const { t } = useI18nTranslate();

    const { user } = useClerk();

    const userName = user?.unsafeMetadata?.fullName ?? "";

    const time = dayjs(Number(completedTime)).format("HH:mm DD-MM-YYYY");

    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">
                <Trans
                    i18nKey="chuc_mung_ban_da_hoan_thanh_khoa_hoc"
                    values={{
                        name: userName,
                    }}
                    components={{
                        1: (
                            <span className="bg-linear-to-r from-blue-400 to-indigo-600 inline-block text-transparent bg-clip-text" />
                        ),
                    }}
                />
            </h2>
            <p className="text-gray-600 mb-4 whitespace-pre-line">
                <Trans
                    i18nKey="ban_da_hoan_thanh_tat_ca_cac_phan_cua_khoa_hoc_nay"
                    values={{
                        time,
                    }}
                    components={{
                        1: <Text fw={500} variant="gradient" />,
                    }}
                />
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md">
                <p className="text-sm text-green-800">
                    {t("cam_on_ban_da_hoan_thanh_khoa_hoc_va_cho_duoc_cap_")}
                </p>
            </div>

            <Link href={navigationPaths.ATLD}>
                <Button className="mt-4">{t("quay_ve_trang_chu")}</Button>
            </Link>
        </div>
    );
};

export default CompletedContent;
