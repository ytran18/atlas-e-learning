import { Badge, Text } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";

import { QRCodeData } from "../../../types";
import StudentSelector from "../../StudentSelector";

interface UploadSearchVerifyProps {
    qrData: QRCodeData | null;
    handleQRScanned: (qrData: QRCodeData) => void;
    setError: (error: string) => void;
    activeMode: "upload" | "search" | "verify";
    setActiveMode: (mode: "upload" | "search" | "verify") => void;
    onReset: () => void;
}

const UploadSearchVerify = ({
    qrData,
    handleQRScanned,
    setError,
    activeMode,
    setActiveMode,
    onReset,
}: UploadSearchVerifyProps) => {
    return (
        <div className="mb-6 group">
            <div
                className={`bg-white rounded-2xl border-2 transition-all duration-300 ${
                    !qrData
                        ? "border-blue-200 shadow-lg shadow-blue-100/50"
                        : "border-slate-200 shadow-sm"
                }`}
            >
                {/* Step Header */}
                <div
                    className={`px-6 py-4 rounded-t-2xl border-b-2 transition-colors ${
                        !qrData
                            ? "bg-linear-to-r from-blue-50 to-indigo-50 border-blue-100"
                            : "bg-slate-50 border-slate-200"
                    }`}
                >
                    <div className="flex items-center gap-4">
                        <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-all ${
                                !qrData
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                                    : "bg-green-100 text-green-700 border-2 border-green-300"
                            }`}
                        >
                            {qrData ? <IconCheck className="w-6 h-6" /> : <span>1</span>}
                        </div>

                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-slate-900 mb-1">Chọn Học Viên</h2>

                            <Text className="text-sm text-slate-600">
                                Upload cccd hoặc tìm kiếm trong hệ thống
                            </Text>
                        </div>

                        {qrData && (
                            <Badge
                                size="lg"
                                className="bg-green-100 text-green-700 border-2 border-green-300 font-semibold"
                            >
                                Hoàn thành
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Step Content */}
                <div className="p-6">
                    <StudentSelector
                        onQRScanned={handleQRScanned}
                        onError={setError}
                        activeMode={activeMode}
                        setActiveMode={setActiveMode}
                        onReset={onReset}
                    />
                </div>
            </div>
        </div>
    );
};

export default UploadSearchVerify;
