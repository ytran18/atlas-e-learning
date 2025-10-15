"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { Button } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";

import { ATLD_SLUG, navigationPaths } from "@/utils/navigationPaths";

const LearnHeader = () => {
    const { atldId } = useParams();

    return (
        <div className="mb-6 flex items-center justify-between">
            <Link href={navigationPaths.ATLD_PREVIEW.replace(`[${ATLD_SLUG}]`, atldId as string)}>
                <Button variant="filled">
                    <IconArrowLeft className="mr-2 h-4 w-4" />
                    Quay lại
                </Button>
            </Link>
        </div>
    );
};

export default LearnHeader;
