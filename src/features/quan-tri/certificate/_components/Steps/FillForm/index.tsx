import { Badge, Text } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";

import { CertificateFormData, QRCodeData } from "../../../types";
import { extractBirthYear } from "../../../utils/qr-scanner";
import CertificateForm from "../../CertificateForm";

interface FillFormProps {
    qrData: QRCodeData;
    formData: CertificateFormData | null;
    handleFormSubmit: (data: CertificateFormData) => void;
}

const FillForm = ({ qrData, formData, handleFormSubmit }: FillFormProps) => {
    return (
        <div className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div
                className={`bg-white rounded-2xl border-2 transition-all duration-300 ${
                    !formData
                        ? "border-green-200 shadow-lg shadow-green-100/50"
                        : "border-slate-200 shadow-sm"
                }`}
            >
                {/* Step Header */}
                <div
                    className={`px-6 py-4 border-b-2 transition-colors ${
                        !formData
                            ? "bg-linear-to-r from-green-50 to-emerald-50 border-green-100"
                            : "bg-slate-50 border-slate-200"
                    }`}
                >
                    <div className="flex items-center gap-4">
                        <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-all ${
                                !formData
                                    ? "bg-green-600 text-white shadow-lg shadow-green-600/30"
                                    : "bg-orange-100 text-orange-700 border-2 border-orange-300"
                            }`}
                        >
                            {formData ? <IconCheck className="w-6 h-6" /> : <span>2</span>}
                        </div>

                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-slate-900 mb-1">
                                Điền Thông Tin Chứng Chỉ
                            </h2>

                            <Text className="text-sm text-slate-600">
                                Nhập thông tin khóa học và mã chứng chỉ
                            </Text>
                        </div>

                        {formData && (
                            <Badge
                                size="lg"
                                className="bg-orange-100 text-orange-700 border-2 border-orange-300 font-semibold"
                            >
                                Hoàn thành
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Step Content */}
                <div className="p-6">
                    <CertificateForm
                        initialData={{
                            studentName: qrData.name,
                            courseName:
                                (qrData as QRCodeData & { courseName?: string }).courseName || "",
                            birthYear: extractBirthYear(qrData.birthDate),
                            certificateId: formData?.certificateId || `CERT-${Date.now()}`,
                        }}
                        onSubmit={handleFormSubmit}
                    />
                </div>
            </div>
        </div>
    );
};

export default FillForm;
