"use client";

import { useState } from "react";

import { Button, Text, TextInput } from "@mantine/core";
import { IconCheck, IconSearch, IconX } from "@tabler/icons-react";

interface CertificateData {
    certificateId: string;
    studentName: string;
    courseName: string;
    birthYear: string;
    issuedAt: string;
}

interface VerifyCertificateProps {
    onError: (error: string) => void;
}

const VerifyCertificate = ({ onError }: VerifyCertificateProps) => {
    const [certificateId, setCertificateId] = useState("");

    const [loading, setLoading] = useState(false);

    const [result, setResult] = useState<CertificateData | null>(null);

    const [verifyError, setVerifyError] = useState<string>("");

    const handleVerify = async () => {
        if (!certificateId.trim()) {
            setVerifyError("Vui lòng nhập mã chứng chỉ");

            return;
        }

        setLoading(true);

        setVerifyError("");

        setResult(null);

        onError(""); // Clear parent error

        try {
            const response = await fetch(`/api/certificate/verify?id=${certificateId.trim()}`);

            const data = await response.json();

            if (!response.ok) {
                setVerifyError(data.error || "Không tìm thấy chứng chỉ");

                return;
            }

            setResult(data.certificate);
            // eslint-disable-next-line
        } catch (err) {
            setVerifyError("Có lỗi xảy ra. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleVerify();
        }
    };

    return (
        <div className="space-y-4">
            {/* Input Field */}
            <div className="flex gap-3">
                <TextInput
                    placeholder="Nhập mã chứng chỉ (VD: CERT-20260209-A7F2E491)"
                    value={certificateId}
                    onChange={(e) => setCertificateId(e.target.value)}
                    onKeyPress={handleKeyPress}
                    size="md"
                    className="flex-1"
                    styles={{
                        input: {
                            fontFamily: "monospace",
                            fontSize: "14px",
                        },
                    }}
                />

                <Button
                    onClick={handleVerify}
                    loading={loading}
                    size="md"
                    className="bg-blue-600 hover:bg-blue-700"
                    leftSection={<IconSearch className="w-4 h-4" />}
                >
                    Xác thực
                </Button>
            </div>

            {/* Error State */}
            {verifyError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                            <IconX className="w-5 h-5 text-red-600" />
                        </div>

                        <div>
                            <Text className="font-semibold text-red-900 mb-1">
                                Chứng chỉ không hợp lệ
                            </Text>

                            <Text className="text-sm text-red-700">{verifyError}</Text>
                        </div>
                    </div>
                </div>
            )}

            {/* Success State */}
            {result && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                    <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                            <IconCheck className="w-6 h-6 text-green-600" />
                        </div>

                        <div>
                            <Text className="text-lg font-bold text-green-900 mb-1">
                                Chứng chỉ hợp lệ
                            </Text>

                            <Text className="text-sm text-green-700">
                                Chứng chỉ này đã được cấp bởi hệ thống
                            </Text>
                        </div>
                    </div>

                    {/* Certificate Details */}
                    <div className="bg-white rounded-lg border border-green-200 p-4 space-y-3">
                        <div>
                            <Text className="text-xs font-semibold text-slate-500 mb-1">
                                Mã chứng chỉ
                            </Text>

                            <Text className="text-sm font-mono font-bold text-slate-900">
                                {result.certificateId}
                            </Text>
                        </div>

                        <div>
                            <Text className="text-xs font-semibold text-slate-500 mb-1">
                                Họ và tên
                            </Text>

                            <Text className="text-sm font-bold text-slate-900">
                                {result.studentName}
                            </Text>
                        </div>

                        <div>
                            <Text className="text-xs font-semibold text-slate-500 mb-1">
                                Khóa học
                            </Text>

                            <Text className="text-sm text-slate-900">{result.courseName}</Text>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Text className="text-xs font-semibold text-slate-500 mb-1">
                                    Năm sinh
                                </Text>

                                <Text className="text-sm text-slate-900">{result.birthYear}</Text>
                            </div>

                            <div>
                                <Text className="text-xs font-semibold text-slate-500 mb-1">
                                    Ngày cấp
                                </Text>

                                <Text className="text-sm text-slate-900">
                                    {new Date(result.issuedAt).toLocaleDateString("vi-VN")}
                                </Text>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VerifyCertificate;
