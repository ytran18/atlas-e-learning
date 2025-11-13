import React from "react";

import { Button } from "@mantine/core";

interface LearnNextButtonProps {
    show: boolean;
    disabled: boolean;
    loading: boolean;
    text: string;
    onClick: () => void;
}

const LearnNextButton = React.memo(function LearnNextButton({
    show,
    disabled,
    loading,
    text,
    onClick,
}: LearnNextButtonProps) {
    if (!show) return null;
    return (
        <div className="w-full flex justify-end shrink-0 p-2 sm:p-0">
            <Button
                disabled={disabled}
                loading={loading}
                size="md"
                className="px-6 lg:px-8 py-3 w-full sm:w-auto"
                onClick={onClick}
            >
                {text}
            </Button>
        </div>
    );
});

export default LearnNextButton;
