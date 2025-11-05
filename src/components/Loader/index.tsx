"use client";

import { Text } from "@mantine/core";
import { IconLoader } from "@tabler/icons-react";

type LoaderProps = {
    className?: string;
};

const Loader = ({ className }: LoaderProps) => {
    return (
        <div className={`flex flex-col gap-y-2 ${className ? className : ""}`}>
            <div className={`relative flex justify-center`}>
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>

                <IconLoader className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-600 animate-spin" />
            </div>

            <Text fw={400} size="sm">
                Đang tải...
            </Text>
        </div>
    );
};

export default Loader;
