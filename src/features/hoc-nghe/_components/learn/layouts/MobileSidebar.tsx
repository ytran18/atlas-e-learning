import { LearnSidebar } from "../";
import { CloseIcon } from "../icons";

interface MobileSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const MobileSidebar = ({ isOpen, onClose }: MobileSidebarProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black/20" onClick={onClose} />

            <div className="fixed top-0 left-0 h-full w-90 max-w-[90vw] bg-white shadow-xl overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Nội dung khóa học</h2>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <CloseIcon />
                    </button>
                </div>

                <div className="p-4">
                    <LearnSidebar />
                </div>
            </div>
        </div>
    );
};

export default MobileSidebar;
