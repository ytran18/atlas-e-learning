"use client";

import { SegmentedControl } from "@mantine/core";
import { IconCertificate, IconCloudUpload, IconSearch } from "@tabler/icons-react";

import { QRCodeData } from "../types";
import IdCardUploader from "./IdCardUploader";
import StudentSearch from "./StudentSearch";
import VerifyCertificate from "./VerifyCertificate";

interface StudentSelectorProps {
    onQRScanned: (data: QRCodeData) => void;
    onError: (error: string) => void;
    activeMode: "upload" | "search" | "verify";
    setActiveMode: (mode: "upload" | "search" | "verify") => void;
    onReset: () => void;
}

const StudentSelector = ({
    onQRScanned,
    onError,
    activeMode,
    setActiveMode,
    onReset,
}: StudentSelectorProps) => {
    const handleModeChange = (value: string) => {
        onReset(); // Clear all state when switching tabs

        setActiveMode(value as "upload" | "search" | "verify");

        onError("");
    };

    return (
        <div className="space-y-5">
            {/* Mode Selector */}
            <SegmentedControl
                value={activeMode}
                onChange={handleModeChange}
                data={[
                    {
                        value: "upload",
                        label: (
                            <div className="flex items-center gap-2 px-2">
                                <IconCloudUpload className="w-4 h-4" />
                                <span>Upload Thẻ</span>
                            </div>
                        ),
                    },
                    {
                        value: "search",
                        label: (
                            <div className="flex items-center gap-2 px-2">
                                <IconSearch className="w-4 h-4" />
                                <span>Tìm Học Viên</span>
                            </div>
                        ),
                    },
                    {
                        value: "verify",
                        label: (
                            <div className="flex items-center gap-2 px-2">
                                <IconCertificate className="w-4 h-4" />
                                <span>Xác Thực</span>
                            </div>
                        ),
                    },
                ]}
                fullWidth
                size="md"
                classNames={{
                    root: "bg-slate-100",
                    indicator: "bg-white shadow-sm",
                    label: "text-sm font-semibold",
                }}
            />

            {/* Content based on active mode */}
            {activeMode === "upload" ? (
                <IdCardUploader onQRScanned={onQRScanned} onError={onError} />
            ) : activeMode === "search" ? (
                <StudentSearch onStudentSelected={onQRScanned} onError={onError} />
            ) : (
                <VerifyCertificate onError={onError} />
            )}
        </div>
    );
};

export default StudentSelector;
