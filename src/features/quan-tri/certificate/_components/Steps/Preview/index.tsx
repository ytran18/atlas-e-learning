import { Badge, Text } from "@mantine/core";

import { CertificateFormData } from "../../../types";
import CertificatePreview from "../../CertificatePreview";

interface PreviewProps {
    formData: CertificateFormData;
    onReset: () => void;
}

const Preview = ({ formData, onReset }: PreviewProps) => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-lg shadow-orange-100/50">
                {/* Step Header */}
                <div className="px-6 py-4 border-b-2 bg-linear-to-r from-orange-50 to-amber-50 border-orange-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-orange-600/30">
                            <span>3</span>
                        </div>

                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-slate-900 mb-1">
                                Xem Trước & Tải Xuống
                            </h2>

                            <Text className="text-sm text-slate-600">
                                Kiểm tra và tải xuống chứng chỉ PDF
                            </Text>
                        </div>

                        <Badge
                            size="lg"
                            className="bg-orange-600 text-white font-semibold shadow-lg shadow-orange-600/30"
                        >
                            Bước cuối
                        </Badge>
                    </div>
                </div>

                {/* Step Content */}
                <div className="p-6">
                    <CertificatePreview formData={formData} onReset={onReset} />
                </div>
            </div>
        </div>
    );
};

export default Preview;
