import { ReactNode, useState } from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import { Button } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";

import { HOC_NGHE_SLUG, navigationPaths } from "@/utils/navigationPaths";

interface CourseHeroSectionProps {
    title: string;
    description: string;
    badge?: string;
    isJoined: boolean;
    isLoadingJoiabled: boolean;
    children?: ReactNode;
}

export const CourseHeroSection = ({
    title,
    description,
    badge = "Học Nghe",
    isJoined,
    isLoadingJoiabled,
    children,
}: CourseHeroSectionProps) => {
    const { hocNgheId } = useParams();

    const [isNavigating, setIsNavigating] = useState<boolean>(false);

    const getLink = () => {
        if (isJoined) {
            return navigationPaths.HOC_NGHE_LEARN.replace(
                `[${HOC_NGHE_SLUG}]`,
                hocNgheId as string
            );
        }

        return navigationPaths.HOC_NGHE_VERIFY.replace(`[${HOC_NGHE_SLUG}]`, hocNgheId as string);
    };

    return (
        <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 border-b border-gray-200">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl py-6 sm:py-8">
                {/* Back Button */}
                <div className="mb-6">
                    <Link href={navigationPaths.HOC_NGHE}>
                        <Button
                            variant="subtle"
                            leftSection={<IconArrowLeft size={18} />}
                            size="sm"
                            className="text-gray-700 hover:bg-white/80"
                        >
                            Quay lại
                        </Button>
                    </Link>
                </div>

                {/* Course Header */}
                <div className="max-w-4xl">
                    {/* Badge */}
                    <div className="mb-4">
                        <span className="inline-block px-3 py-1.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                            {badge}
                        </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-semibold mb-4 text-gray-900 tracking-tight leading-tight">
                        {title}
                    </h1>
                    <p className="text-sm text-gray-700 mb-6 leading-relaxed font-normal max-w-3xl">
                        {description}
                    </p>

                    {/* Course Stats - passed as children */}
                    {children}

                    {/* CTA Button */}
                    <Link href={getLink()} onClick={() => setIsNavigating(true)}>
                        <Button
                            size="sm"
                            className="bg-gray-900 hover:bg-gray-800"
                            radius="md"
                            loading={isLoadingJoiabled || isNavigating}
                            loaderProps={{ type: "dots" }}
                        >
                            {isJoined ? "Tiếp tục học" : "Bắt đầu học ngay"}
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};
