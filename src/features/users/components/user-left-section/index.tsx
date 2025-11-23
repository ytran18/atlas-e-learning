import { Avatar, Card, Text } from "@mantine/core";

import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";

type UserLeftSectionProps = {
    user: Record<string, any>;
};

const UserLeftSection = ({ user }: UserLeftSectionProps) => {
    const { t } = useI18nTranslate();

    return (
        <div className="w-full h-full">
            <Card withBorder radius="md" shadow="sm" className="w-full">
                <div className="flex flex-col w-full gap-y-9">
                    <Text fw={500} size="sm">
                        {t("thong_tin_ca_nhan")}
                    </Text>

                    <div className="w-full flex items-center justify-center flex-col gap-y-4">
                        <Avatar name={user?.fullName} size="80px" color="blue" />

                        <Text fw={500} size="sm">
                            {user?.fullName}
                        </Text>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default UserLeftSection;
