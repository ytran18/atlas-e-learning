import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { Button, Select, useCombobox } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";

import { useCourseList } from "@/api";
import { CourseType } from "@/types/api";
import { navigationPaths } from "@/utils/navigationPaths";

import ModalCreateNewCourse from "../ModalCreateNewCourse";

type MobileCourseSelectProps = {
    defaultCourseId: string;
    currentAdminPathname: CourseType;
    isAdminUser?: boolean;
};

const MobileCourseSelect = ({
    defaultCourseId,
    currentAdminPathname,
    isAdminUser,
}: MobileCourseSelectProps) => {
    const router = useRouter();

    const isMobile = useMediaQuery("(max-width: 640px)");

    const { data: courseList } = useCourseList(currentAdminPathname);

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const [value, setValue] = useState<string | null>(defaultCourseId);

    const [openedModalCreateNewCourse, setOpenedModalCreateNewCourse] = useState<boolean>(false);

    useEffect(() => {
        if (defaultCourseId) {
            setValue(defaultCourseId);

            return;
        }

        if (
            courseList &&
            currentAdminPathname !== ("user" as CourseType) &&
            currentAdminPathname !== ("docs" as CourseType)
        ) {
            router.push(`/quan-tri/${currentAdminPathname}/${courseList?.[0]?.id}`);
        }
    }, [courseList, defaultCourseId, router, isMobile, currentAdminPathname]);

    if (!courseList) return <div>Loading...</div>;

    const handleSelectCourse = (value: string | null, option: any) => {
        setValue(value);

        if (isAdminUser) {
            if (!option?.type) return;

            router.push(
                `${navigationPaths.QUAN_TRI_USER}?type=${option?.type}&courseId=${value}&page=1&pageSize=10`
            );

            return;
        }

        if (value) {
            router.push(`/quan-tri/${currentAdminPathname}/${value}`);
        }
    };

    return (
        <>
            <div className="flex items-center w-full gap-x-2">
                <div className="flex-1">
                    <Select
                        placeholder="Chọn khóa học"
                        data={courseList.map((item) => ({
                            value: item.id,
                            label: item.title,
                            type: item.type,
                        }))}
                        defaultValue={defaultCourseId}
                        searchable
                        nothingFoundMessage="Chưa có khóa học nào!"
                        value={value}
                        onChange={(value, option: any) =>
                            handleSelectCourse(value as string, option)
                        }
                    />
                </div>

                <Button size="sm" onClick={() => setOpenedModalCreateNewCourse(true)}>
                    <IconPlus />
                </Button>
            </div>

            <ModalCreateNewCourse
                type={currentAdminPathname}
                title="Thêm khóa học"
                opened={openedModalCreateNewCourse}
                onClose={() => setOpenedModalCreateNewCourse(false)}
            />
        </>
    );
};

export default MobileCourseSelect;
