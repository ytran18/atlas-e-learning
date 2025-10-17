import { MenuIcon } from "../icons";

interface MobileHeaderProps {
    title: string;
    onToggleSidebar: () => void;
}

const MobileHeader = ({ title, onToggleSidebar }: MobileHeaderProps) => {
    return (
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
            <div className="flex-1 min-w-0">
                <h1 className="text-lg font-semibold text-gray-900 truncate">{title}</h1>
            </div>
            <button
                onClick={onToggleSidebar}
                className="ml-4 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Toggle course content"
            >
                <MenuIcon />
            </button>
        </div>
    );
};

export default MobileHeader;
