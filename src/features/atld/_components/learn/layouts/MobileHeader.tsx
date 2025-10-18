import { Button } from "@mantine/core";

import { MenuIcon } from "../icons";

interface MobileHeaderProps {
    title: string;
    onToggleSidebar: () => void;
}

const MobileHeader = ({ title, onToggleSidebar }: MobileHeaderProps) => {
    return (
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 gap-x-2">
            <div className="flex-1 min-w-0">
                <h1 className="text-lg font-semibold text-gray-900 truncate">{title}</h1>
            </div>

            <Button onClick={onToggleSidebar} size="compact-xs" variant="light">
                <MenuIcon />
            </Button>
        </div>
    );
};

export default MobileHeader;
