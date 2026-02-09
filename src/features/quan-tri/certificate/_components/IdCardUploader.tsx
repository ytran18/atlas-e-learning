"use client";

import { useState } from "react";

import Image from "next/image";

import { Group, Text } from "@mantine/core";
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";

import { QRCodeData } from "../types";
import { parseQRData, scanQRFromImage } from "../utils/qr-scanner";

interface IdCardUploaderProps {
    onQRScanned: (data: QRCodeData) => void;
    onError: (error: string) => void;
}

const IdCardUploader = ({ onQRScanned, onError }: IdCardUploaderProps) => {
    const [isScanning, setIsScanning] = useState(false);

    const [uploadedFile, setUploadedFile] = useState<File | null>(null);

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleDrop = async (files: FileWithPath[]) => {
        const file = files[0];

        if (!file) return;

        setUploadedFile(file);

        setIsScanning(true);

        onError("");

        const objectUrl = URL.createObjectURL(file);

        setPreviewUrl(objectUrl);

        try {
            const qrData = await scanQRFromImage(file);

            const parsedData = parseQRData(qrData);

            onQRScanned(parsedData);
        } catch (error) {
            const errorMsg =
                error instanceof Error ? error.message : "Không thể quét mã QR. Vui lòng thử lại.";

            onError(errorMsg);
        } finally {
            setIsScanning(false);
        }
    };

    const handleReset = () => {
        setUploadedFile(null);

        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }

        setPreviewUrl(null);

        setIsScanning(false);

        onError("");
    };

    return (
        <div className="space-y-4">
            {!uploadedFile ? (
                <Dropzone
                    onDrop={handleDrop}
                    accept={IMAGE_MIME_TYPE}
                    maxSize={5 * 1024 * 1024}
                    maxFiles={1}
                    className="border-2 border-dashed border-slate-300 hover:border-blue-500 transition-colors cursor-pointer rounded-lg bg-slate-50"
                    disabled={isScanning}
                >
                    <Group justify="center" gap="xl" className="min-h-[200px] pointer-events-none">
                        <Dropzone.Accept>
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-3 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <IconUpload className="w-8 h-8 text-blue-600" stroke={2} />
                                </div>

                                <Text className="text-base font-semibold text-blue-700">
                                    Thả ảnh vào đây
                                </Text>
                            </div>
                        </Dropzone.Accept>

                        <Dropzone.Reject>
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-3 rounded-lg bg-red-100 flex items-center justify-center">
                                    <IconX className="w-8 h-8 text-red-600" stroke={2} />
                                </div>

                                <Text className="text-base font-semibold text-red-700">
                                    File không hợp lệ
                                </Text>
                            </div>
                        </Dropzone.Reject>

                        <Dropzone.Idle>
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-slate-200 flex items-center justify-center">
                                    <IconPhoto className="w-8 h-8 text-slate-500" stroke={1.5} />
                                </div>

                                <Text className="text-base font-semibold text-slate-900 mb-2">
                                    Kéo thả hoặc nhấn để chọn ảnh
                                </Text>

                                <Text className="text-sm text-slate-600 mb-3">
                                    Chấp nhận ảnh PNG, JPG, JPEG
                                </Text>

                                <div className="inline-flex items-center gap-2 text-xs text-slate-500 bg-white px-3 py-1.5 rounded-md border border-slate-200">
                                    <IconUpload className="w-3 h-3" />

                                    <span>Tối đa 5MB</span>
                                </div>
                            </div>
                        </Dropzone.Idle>
                    </Group>
                </Dropzone>
            ) : (
                <div className="space-y-3">
                    {/* Preview Image */}
                    {previewUrl && (
                        <div className="relative rounded-lg overflow-hidden border border-slate-200 h-64 bg-slate-50">
                            <Image
                                src={previewUrl}
                                alt="ID Card Preview"
                                fill
                                className="object-contain"
                            />

                            {isScanning && (
                                <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center z-10">
                                    <div className="bg-white rounded-lg px-6 py-4 shadow-lg text-center">
                                        <div className="w-10 h-10 mx-auto mb-3 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />

                                        <Text className="text-sm font-semibold text-slate-900 mb-1">
                                            Đang quét QR code
                                        </Text>

                                        <Text className="text-xs text-slate-600">
                                            Preprocessing image...
                                        </Text>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* File Info */}
                    <div className="flex items-center justify-between bg-slate-50 rounded-lg px-4 py-3 border border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <IconPhoto className="w-5 h-5 text-blue-600" />
                            </div>

                            <div>
                                <Text className="text-sm font-semibold text-slate-900">
                                    {uploadedFile.name}
                                </Text>

                                <Text className="text-xs text-slate-600">
                                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                                </Text>
                            </div>
                        </div>

                        <button
                            onClick={handleReset}
                            className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 font-semibold cursor-pointer transition-colors rounded-lg"
                            type="button"
                            tabIndex={0}
                            aria-label="Chọn file khác"
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    handleReset();
                                }
                            }}
                        >
                            Chọn File Khác
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IdCardUploader;
