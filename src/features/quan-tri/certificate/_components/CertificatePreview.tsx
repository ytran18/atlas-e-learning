"use client";

import { useEffect, useRef, useState } from "react";

import { Button, Text } from "@mantine/core";
import {
    IconCheck,
    IconDeviceFloppy,
    IconDownload,
    IconPrinter,
    IconRefresh,
} from "@tabler/icons-react";

import { saveCertificate } from "../services/certificate.service";
import { CertificateFormData } from "../types";

interface CertificatePreviewProps {
    formData: CertificateFormData;
    onReset: () => void;
    templatePath?: string;
}

const CertificatePreview = ({
    formData,
    onReset,
    templatePath = "/pdf/IMG_0004.pdf",
}: CertificatePreviewProps & { templatePath?: string }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [isLoading, setIsLoading] = useState(true);

    const [error, setError] = useState<string | null>(null);

    const [isSaved, setIsSaved] = useState(false);

    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const renderCertificate = async () => {
            if (!canvasRef.current) return;

            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            if (!ctx) {
                setError("Không thể tạo canvas context");
                return;
            }

            try {
                setIsLoading(true);
                setError(null);

                // Two-page certificate: dimensions for both pages side by side
                const pageWidth = 877; // Half of 1754
                const pageHeight = 1240;
                canvas.width = 1754; // Two pages side by side
                canvas.height = pageHeight;

                // Helper functions
                const drawGoldenBorder = (x: number, y: number, width: number, height: number) => {
                    // Outer golden border
                    const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
                    gradient.addColorStop(0, "#D4AF37");
                    gradient.addColorStop(0.5, "#F4E4A6");
                    gradient.addColorStop(1, "#D4AF37");

                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 12;
                    ctx.strokeRect(x + 20, y + 20, width - 40, height - 40);

                    // Inner decorative border pattern
                    ctx.strokeStyle = "#C19A3A";
                    ctx.lineWidth = 2;
                    ctx.strokeRect(x + 35, y + 35, width - 70, height - 70);

                    // Additional decorative lines
                    ctx.strokeStyle = "#E8C975";
                    ctx.lineWidth = 1;
                    ctx.strokeRect(x + 38, y + 38, width - 76, height - 76);
                };

                const drawWatermark = (x: number, y: number, width: number, height: number) => {
                    ctx.save();
                    ctx.globalAlpha = 0.05;
                    ctx.font = "bold 180px serif";
                    ctx.fillStyle = "#D4AF37";
                    ctx.textAlign = "center";
                    ctx.translate(x + width / 2, y + height / 2);
                    ctx.rotate(-Math.PI / 6);
                    ctx.fillText("CERTIFICATE", 0, 0);
                    ctx.restore();
                };

                // ===== LEFT PAGE (English) =====
                const leftX = 0;

                // Background
                ctx.fillStyle = "#FFFEF9";
                ctx.fillRect(leftX, 0, pageWidth, pageHeight);

                drawWatermark(leftX, 0, pageWidth, pageHeight);
                drawGoldenBorder(leftX, 0, pageWidth, pageHeight);

                // Header
                ctx.fillStyle = "#1a1a1a";
                ctx.font = "bold 18px 'Times New Roman', serif";
                ctx.textAlign = "center";
                ctx.fillText("SOCIALIST REPUBLIC OF VIETNAM", leftX + pageWidth / 2, 80);
                ctx.font = "16px 'Times New Roman', serif";
                ctx.fillText("Independence - Freedom - Happiness", leftX + pageWidth / 2, 105);

                // Decorative line
                ctx.strokeStyle = "#D4AF37";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(leftX + pageWidth / 2 - 80, 115);
                ctx.lineTo(leftX + pageWidth / 2 + 80, 115);
                ctx.stroke();

                // Organization info
                ctx.font = "bold 14px 'Times New Roman', serif";
                ctx.fillStyle = "#333";
                ctx.fillText("DIRECTOR", leftX + pageWidth / 2, 160);
                ctx.fillText("AGK TRADE AND SERVICES", leftX + pageWidth / 2, 180);
                ctx.fillText("DEVELOPMENT COMPANY LIMITED", leftX + pageWidth / 2, 200);

                // "has conferred"
                ctx.font = "16px 'Times New Roman', serif";
                ctx.fillText("has conferred", leftX + pageWidth / 2, 240);

                // CERTIFICATE title
                ctx.font = "bold 42px 'Times New Roman', serif";
                ctx.fillStyle = "#D32F2F";
                ctx.fillText("CERTIFICATE", leftX + pageWidth / 2, 290);

                // Student info
                ctx.font = "16px 'Times New Roman', serif";
                ctx.fillStyle = "#333";
                ctx.textAlign = "left";
                ctx.fillText("Upon: ", leftX + 100, 340);
                ctx.font = "bold 18px 'Times New Roman', serif";
                ctx.fillText(`Mr ${formData.studentName.toUpperCase()}`, leftX + 180, 340);

                ctx.font = "16px 'Times New Roman', serif";
                ctx.fillText(`Date of birth: ${formData.birthYear}`, leftX + 100, 370);

                ctx.fillText("Completed training program:", leftX + 100, 410);
                ctx.font = "bold 18px 'Times New Roman', serif";
                ctx.fillText("WELDING TECHNOLOGY", leftX + 100, 440);

                // Course details
                ctx.font = "16px 'Times New Roman', serif";
                ctx.fillText(
                    "Course duration: 15 days, From 20/10/2025 to 10/11/2025",
                    leftX + 100,
                    480
                );
                ctx.fillText("At: RICHELL U KWONG PLASTICS VIETNAM COMPANY", leftX + 100, 510);
                ctx.fillText("LIMITED", leftX + 100, 535);

                // Location and date
                ctx.font = "italic 16px 'Times New Roman', serif";
                ctx.textAlign = "center";
                ctx.fillText("Ho Chi Minh City, November 11th, 2025", leftX + pageWidth / 2, 600);

                // Photo placeholder
                ctx.strokeStyle = "#333";
                ctx.lineWidth = 2;
                ctx.strokeRect(leftX + 140, 650, 160, 200);
                ctx.fillStyle = "#f0f0f0";
                ctx.fillRect(leftX + 141, 651, 158, 198);
                ctx.fillStyle = "#666";
                ctx.font = "14px Arial";
                ctx.textAlign = "center";
                ctx.fillText("Photo", leftX + 220, 750);

                // Certificate number
                ctx.font = "14px 'Times New Roman', serif";
                ctx.textAlign = "left";
                ctx.fillStyle = "#333";
                ctx.fillText(`Reg no: ${formData.certificateId}`, leftX + 100, 1050);

                // ===== RIGHT PAGE (Vietnamese) =====
                const rightX = pageWidth;

                // Background
                ctx.fillStyle = "#FFFEF9";
                ctx.fillRect(rightX, 0, pageWidth, pageHeight);

                drawWatermark(rightX, 0, pageWidth, pageHeight);
                drawGoldenBorder(rightX, 0, pageWidth, pageHeight);

                // Header
                ctx.fillStyle = "#1a1a1a";
                ctx.font = "bold 16px 'Times New Roman', serif";
                ctx.textAlign = "center";
                ctx.fillText("CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", rightX + pageWidth / 2, 80);
                ctx.font = "14px 'Times New Roman', serif";
                ctx.fillText("Độc lập - Tự do - Hạnh phúc", rightX + pageWidth / 2, 105);

                // Decorative line
                ctx.strokeStyle = "#D4AF37";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(rightX + pageWidth / 2 - 80, 115);
                ctx.lineTo(rightX + pageWidth / 2 + 80, 115);
                ctx.stroke();

                // Organization info
                ctx.font = "bold 14px 'Times New Roman', serif";
                ctx.fillStyle = "#333";
                ctx.fillText("GIÁM ĐỐC", rightX + pageWidth / 2, 160);
                ctx.fillText("CÔNG TY TNHH PHÁT TRIỂN", rightX + pageWidth / 2, 180);
                ctx.fillText("THƯƠNG MẠI VÀ DỊCH VỤ AGK", rightX + pageWidth / 2, 200);

                // "cấp"
                ctx.font = "16px 'Times New Roman', serif";
                ctx.fillText("cấp", rightX + pageWidth / 2, 240);

                // CERTIFICATE title
                ctx.font = "bold 38px 'Times New Roman', serif";
                ctx.fillStyle = "#D32F2F";
                ctx.fillText("CHỨNG CHỈ ĐÀO TẠO", rightX + pageWidth / 2, 290);

                // Student info
                ctx.font = "16px 'Times New Roman', serif";
                ctx.fillStyle = "#333";
                ctx.textAlign = "left";
                ctx.fillText("Cho: ", rightX + 120, 340);
                ctx.font = "bold 18px 'Times New Roman', serif";
                ctx.fillText(formData.studentName.toUpperCase(), rightX + 180, 340);

                // Gender
                ctx.font = "16px 'Times New Roman', serif";
                ctx.textAlign = "right";
                ctx.fillText("Giới tính: Nam", rightX + pageWidth - 120, 340);

                ctx.textAlign = "left";
                ctx.fillText(`Năm Sinh: ${formData.birthYear}`, rightX + 120, 370);

                ctx.fillText("Đã hoàn thành chương trình đào tạo:", rightX + 120, 410);
                ctx.font = "bold 18px 'Times New Roman', serif";
                ctx.fillText("CÔNG NGHỆ HÀN", rightX + 120, 440);

                // Course details
                ctx.font = "16px 'Times New Roman', serif";
                ctx.fillText(
                    "Thời gian học: 15 ngày, Từ ngày 20/10/2025 đến ngày 10/11/2025",
                    rightX + 120,
                    480
                );
                ctx.fillText("Tại: CÔNG TY TRÁCH NHIỆM HỮU HẠN KỸ THUẬT TỰ", rightX + 120, 510);
                ctx.fillText("ĐỘNG VÀ THANG MÁY SƠN HÀ", rightX + 120, 540);

                // Location and date
                ctx.font = "italic 16px 'Times New Roman', serif";
                ctx.textAlign = "center";
                ctx.fillText(
                    "Tp. Hồ Chí Minh, Ngày 11 tháng 11 năm 2025",
                    rightX + pageWidth / 2,
                    600
                );

                // Stamp placeholder
                ctx.save();
                ctx.beginPath();
                ctx.arc(rightX + pageWidth / 2 + 80, 780, 100, 0, Math.PI * 2);
                ctx.strokeStyle = "#D32F2F";
                ctx.lineWidth = 8;
                ctx.stroke();

                // Stamp text
                ctx.font = "bold 11px 'Times New Roman', serif";
                ctx.fillStyle = "#D32F2F";
                ctx.textAlign = "center";

                // Draw circular text
                const stampText = "GIÁM ĐỐC CÔNG TY TNHH PHÁT TRIỂN THƯƠNG MẠI VÀ DỊCH VỤ AGK";
                const radius = 85;
                const angleStep = (Math.PI * 1.8) / stampText.length;

                for (let i = 0; i < stampText.length; i++) {
                    const angle = -Math.PI / 2 - Math.PI * 0.9 + angleStep * i;
                    ctx.save();
                    ctx.translate(
                        rightX + pageWidth / 2 + 80 + radius * Math.cos(angle),
                        780 + radius * Math.sin(angle)
                    );
                    ctx.rotate(angle + Math.PI / 2);
                    ctx.fillText(stampText[i], 0, 0);
                    ctx.restore();
                }

                ctx.restore();

                // Signature name
                ctx.font = "bold 16px 'Times New Roman', serif";
                ctx.fillStyle = "#333";
                ctx.fillText("BÙI VƯƠNG ANH", rightX + pageWidth / 2 + 80, 920);

                // Certificate numbers at bottom
                ctx.font = "14px 'Times New Roman', serif";
                ctx.textAlign = "left";
                ctx.fillText(
                    `Số hiệu: ${formData.certificateId.split("/")[0]}`,
                    rightX + 120,
                    1050
                );
                ctx.fillText(
                    `Số vào sổ cấp chứng chỉ: ${formData.certificateId}`,
                    rightX + 120,
                    1080
                );

                setIsLoading(false);
            } catch (err) {
                console.error("Certificate rendering error:", err);
                setError("Không thể tạo chứng chỉ");
                setIsLoading(false);
            }
        };

        renderCertificate();
    }, [formData, templatePath]);

    const handlePrint = () => {
        if (!canvasRef.current) return;

        // Create a new window for printing
        const printWindow = window.open("", "_blank");
        if (!printWindow) return;

        const imageUrl = canvasRef.current.toDataURL("image/png");

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>In Chứng Chỉ - ${formData.studentName}</title>
                    <style>
                        body {
                            margin: 0;
                            padding: 0;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        }
                        img {
                            max-width: 100%;
                            height: auto;
                        }
                        @media print {
                            body {
                                margin: 0;
                            }
                            img {
                                width: 100%;
                                page-break-after: avoid;
                            }
                        }
                    </style>
                </head>
                <body>
                    <img src="${imageUrl}" alt="Chứng chỉ ${formData.studentName}" onload="window.print(); window.onafterprint = () => window.close();" />
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);

            await saveCertificate({
                certificateId: formData.certificateId,
                studentName: formData.studentName,
                courseName: formData.courseName,
                birthYear: formData.birthYear,
                generatedFrom: "manual",
            });

            setIsSaved(true);
        } catch (error) {
            console.error("Error saving certificate:", error);
            setError("Không thể lưu chứng chỉ. Vui lòng thử lại.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDownload = () => {
        if (!canvasRef.current) return;

        const link = document.createElement("a");
        link.download = `chung-chi-${formData.studentName.toLowerCase().replace(/\s+/g, "-")}.png`;
        link.href = canvasRef.current.toDataURL("image/png");
        link.click();
    };

    return (
        <div className="space-y-4">
            {/* Preview Canvas */}
            <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                {isLoading && (
                    <div className="flex flex-col items-center justify-center h-96">
                        <div className="w-12 h-12 mb-3 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        <Text className="text-slate-600 font-medium">Đang tạo chứng chỉ...</Text>
                    </div>
                )}

                {error && (
                    <div className="flex flex-col items-center justify-center h-96">
                        <div className="w-16 h-16 mb-3 rounded-lg bg-red-100 flex items-center justify-center">
                            <IconDownload className="w-8 h-8 text-red-600" />
                        </div>

                        <Text className="text-red-600 font-medium">{error}</Text>
                    </div>
                )}

                <div className="flex justify-center">
                    <canvas
                        ref={canvasRef}
                        className={`max-w-full h-auto border border-slate-300 rounded ${isLoading || error ? "hidden" : ""}`}
                        style={{ maxHeight: "500px" }}
                    />
                </div>
            </div>

            {/* Action Buttons - Progressive Disclosure */}
            {!isSaved ? (
                // BEFORE SAVE - Centered with clear hierarchy
                <div className="max-w-md mx-auto gap-x-2 flex">
                    <Button
                        onClick={handleSave}
                        loading={isSaving}
                        className="w-full bg-blue-600 hover:bg-blue-700 h-12"
                        size="lg"
                        leftSection={<IconDeviceFloppy className="w-5 h-5" />}
                        disabled={isLoading || !!error}
                    >
                        Lưu Chứng Chỉ
                    </Button>

                    <Button
                        onClick={onReset}
                        variant="subtle"
                        size="lg"
                        className="w-full text-slate-600 hover:bg-slate-100 h-10"
                        leftSection={<IconRefresh className="w-4 h-4" />}
                    >
                        Tạo Chứng Chỉ Mới
                    </Button>
                </div>
            ) : (
                // AFTER SAVE - Success state with clear actions
                <div className="space-y-4">
                    {/* Success Banner */}
                    <div className="bg-linear-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center justify-center gap-3">
                            <div className="shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                                <IconCheck className="w-4 h-4 text-white" />
                            </div>
                            <p className="text-green-700 font-semibold">
                                Đã lưu chứng chỉ thành công!
                            </p>
                        </div>
                    </div>

                    {/* Primary Actions - Equal prominence */}
                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            onClick={handlePrint}
                            className="bg-blue-600 hover:bg-blue-700 h-12"
                            size="lg"
                            leftSection={<IconPrinter className="w-5 h-5" />}
                            disabled={isLoading || !!error}
                        >
                            In Chứng Chỉ
                        </Button>

                        <Button
                            onClick={handleDownload}
                            className="bg-orange-600 hover:bg-orange-700 h-12"
                            size="lg"
                            leftSection={<IconDownload className="w-5 h-5" />}
                            disabled={isLoading || !!error}
                        >
                            Tải Về
                        </Button>
                    </div>

                    {/* Secondary Action - Subtle */}
                    <div className="pt-2 border-t border-slate-200">
                        <Button
                            onClick={onReset}
                            variant="subtle"
                            size="md"
                            className="w-full text-slate-600 hover:bg-slate-100 h-10"
                            leftSection={<IconRefresh className="w-4 h-4" />}
                        >
                            Tạo Chứng Chỉ Mới
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CertificatePreview;
