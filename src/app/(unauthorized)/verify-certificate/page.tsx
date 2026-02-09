"use client";

import { useState } from "react";

import { Button, Container, Text, TextInput } from "@mantine/core";
import { IconCertificate, IconCheck, IconSearch, IconX } from "@tabler/icons-react";

interface CertificateData {
    certificateId: string;
    studentName: string;
    courseName: string;
    birthYear: string;
    issuedAt: string;
}

const VerifyCertificatePage = () => {
    const [certificateId, setCertificateId] = useState("");

    const [loading, setLoading] = useState(false);

    const [result, setResult] = useState<CertificateData | null>(null);

    const [error, setError] = useState<string>("");

    const handleVerify = async () => {
        if (!certificateId.trim()) {
            setError("Vui lòng nhập mã chứng chỉ");

            return;
        }

        setLoading(true);

        setError("");

        setResult(null);

        try {
            const response = await fetch(`/api/certificate/verify?id=${certificateId.trim()}`);

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Không tìm thấy chứng chỉ");
                return;
            }

            setResult(data.certificate);
            // eslint-disable-next-line
        } catch (err) {
            setError("Có lỗi xảy ra. Vui lòng thử lại.");
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
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-slate-50 py-12">
            <Container size="md">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-3 mb-4 px-6 py-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
                        <IconCertificate className="w-6 h-6 text-blue-600" />

                        <span className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                            Xác Thực Chứng Chỉ
                        </span>
                    </div>

                    <h1 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">
                        Kiểm Tra Chứng Chỉ
                    </h1>

                    <Text className="text-lg text-slate-600">
                        Nhập mã chứng chỉ để xác thực tính hợp lệ
                    </Text>
                </div>

                {/* Input Card */}
                <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg p-8 mb-6">
                    <div className="flex gap-3">
                        <TextInput
                            placeholder="Nhập mã chứng chỉ (VD: CERT-20260209-A7F2E491)"
                            value={certificateId}
                            onChange={(e) => setCertificateId(e.target.value)}
                            onKeyPress={handleKeyPress}
                            size="lg"
                            className="flex-1"
                            styles={{
                                input: {
                                    fontSize: "16px",
                                    fontFamily: "monospace",
                                },
                            }}
                        />

                        <Button
                            onClick={handleVerify}
                            loading={loading}
                            size="lg"
                            className="bg-blue-600 hover:bg-blue-700"
                            leftSection={<IconSearch className="w-5 h-5" />}
                        >
                            Xác thực
                        </Button>
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                <IconX className="w-6 h-6 text-red-600" />
                            </div>

                            <div>
                                <Text className="text-lg font-bold text-red-900 mb-1">
                                    Chứng chỉ không hợp lệ
                                </Text>

                                <Text className="text-red-700">{error}</Text>
                            </div>
                        </div>
                    </div>
                )}

                {/* Success State */}
                {result && (
                    <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                <IconCheck className="w-8 h-8 text-green-600" />
                            </div>

                            <div>
                                <Text className="text-2xl font-bold text-green-900 mb-1">
                                    Chứng chỉ hợp lệ
                                </Text>

                                <Text className="text-green-700">
                                    Chứng chỉ này đã được cấp bởi hệ thống
                                </Text>
                            </div>
                        </div>

                        {/* Certificate Details */}
                        <div className="bg-white rounded-xl border border-green-200 p-6 space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <Text className="text-sm font-semibold text-slate-500 mb-1">
                                        Mã chứng chỉ
                                    </Text>

                                    <Text className="text-lg font-mono font-bold text-slate-900">
                                        {result.certificateId}
                                    </Text>
                                </div>

                                <div>
                                    <Text className="text-sm font-semibold text-slate-500 mb-1">
                                        Họ và tên
                                    </Text>

                                    <Text className="text-lg font-bold text-slate-900">
                                        {result.studentName}
                                    </Text>
                                </div>

                                <div>
                                    <Text className="text-sm font-semibold text-slate-500 mb-1">
                                        Khóa học
                                    </Text>

                                    <Text className="text-lg text-slate-900">
                                        {result.courseName}
                                    </Text>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Text className="text-sm font-semibold text-slate-500 mb-1">
                                            Năm sinh
                                        </Text>

                                        <Text className="text-lg text-slate-900">
                                            {result.birthYear}
                                        </Text>
                                    </div>

                                    <div>
                                        <Text className="text-sm font-semibold text-slate-500 mb-1">
                                            Ngày cấp
                                        </Text>

                                        <Text className="text-lg text-slate-900">
                                            {new Date(result.issuedAt).toLocaleDateString("vi-VN")}
                                        </Text>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Container>
        </div>
    );
};

export default VerifyCertificatePage;
