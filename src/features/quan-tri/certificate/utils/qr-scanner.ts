import { Html5Qrcode } from "html5-qrcode";

import { QRCodeData } from "../types";

/**
 * Scans QR code from an uploaded image file using html5-qrcode library
 * @param file - Image file containing QR code
 * @returns Promise resolving to QR code data string
 */
/**
 * Preprocesses image to improve QR code detection
 */
const preprocessImage = async (file: File): Promise<File[]> => {
    return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();

            img.onload = () => {
                const processedFiles: File[] = [];

                // Try different preprocessing strategies
                const strategies = [
                    { scale: 1, enhance: false }, // Original
                    { scale: 2, enhance: true }, // 2x scaled with enhancement
                    { scale: 1.5, enhance: true }, // 1.5x scaled with enhancement
                    { scale: 1, enhance: true }, // Original size with enhancement
                ];

                strategies.forEach((strategy, index) => {
                    const canvas = document.createElement("canvas");

                    const ctx = canvas.getContext("2d");

                    if (!ctx) return;

                    // Scale canvas
                    canvas.width = img.width * strategy.scale;

                    canvas.height = img.height * strategy.scale;

                    // Draw scaled image
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    if (strategy.enhance) {
                        // Get image data for enhancement
                        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

                        const data = imageData.data;

                        // Convert to grayscale and increase contrast
                        for (let i = 0; i < data.length; i += 4) {
                            const gray =
                                0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];

                            // Increase contrast (threshold at 128)
                            const enhanced = gray > 128 ? 255 : 0;

                            data[i] = enhanced;

                            data[i + 1] = enhanced;

                            data[i + 2] = enhanced;
                        }

                        ctx.putImageData(imageData, 0, 0);
                    }

                    // Convert canvas to blob then to file
                    canvas.toBlob((blob) => {
                        if (blob) {
                            const processedFile = new File([blob], `processed_${index}.png`, {
                                type: "image/png",
                            });
                            processedFiles.push(processedFile);
                        }

                        // Return all processed files once done
                        if (processedFiles.length === strategies.length) {
                            resolve(processedFiles);
                        }
                    }, "image/png");
                });
            };

            img.src = e.target?.result as string;
        };

        reader.readAsDataURL(file);
    });
};

/**
 * Scans QR code from an uploaded image file using html5-qrcode library
 * @param file - Image file containing QR code
 * @returns Promise resolving to QR code data string
 */
export const scanQRFromImage = async (file: File): Promise<string> => {
    let html5QrCode: Html5Qrcode | null = null;

    try {
        // Preprocess image with multiple strategies
        const processedFiles = await preprocessImage(file);

        // Try scanning each preprocessed version
        for (let i = 0; i < processedFiles.length; i++) {
            try {
                console.log(`Trying scan attempt ${i + 1}/${processedFiles.length}...`);

                if (!html5QrCode) {
                    html5QrCode = new Html5Qrcode("temp-qr-reader");
                }

                const decodedText = await html5QrCode.scanFile(processedFiles[i], false);

                if (decodedText && decodedText.trim()) {
                    console.log("QR code detected successfully!");

                    return decodedText.trim();
                }
            } catch (scanError) {
                console.warn(`Scan attempt ${i + 1} failed:`, scanError);
                // Continue to next attempt
            }
        }

        // If all attempts fail
        throw new Error(
            "Không tìm thấy mã QR sau nhiều lần thử. Vui lòng chụp ảnh zoom vào QR code hoặc đảm bảo QR code rõ ràng."
        );
    } catch (error) {
        console.error("QR Scan error:", error);

        const errorMessage = error instanceof Error ? error.message : "Lỗi không xác định";

        throw new Error(
            `Không thể quét mã QR: ${errorMessage}. Thử chụp lại ảnh zoom vào QR code.`
        );
    } finally {
        // Always clear the scanner
        if (html5QrCode) {
            try {
                await html5QrCode.clear();
            } catch (clearError) {
                console.warn("Failed to clear scanner:", clearError);
            }
        }
    }
};

/**
 * Parses raw QR code data into structured format
 * Format: "051xxxxx|212xxxxx|{name}|{birth_date}|{gender}|{country}|{date of issue}"
 * @param rawData - Raw QR code string
 * @returns Parsed QR code data object
 */
export const parseQRData = (rawData: string): QRCodeData => {
    const parts = rawData.split("|");

    if (parts.length < 7) {
        throw new Error("Định dạng mã QR không hợp lệ");
    }

    return {
        id1: parts[0].trim(),
        id2: parts[1].trim(),
        name: parts[2].trim(),
        birthDate: parts[3].trim(),
        gender: parts[4].trim(),
        country: parts[5].trim(),
        dateOfIssue: parts[6].trim(),
    };
};

/**
 * Extracts birth year from birth date string
 * @param birthDate - Birth date string (format may vary)
 * @returns Birth year as string
 */
export const extractBirthYear = (birthDate: string): string => {
    // Try to extract year from common date formats
    const yearMatch = birthDate.match(/(\d{4})/);

    return yearMatch ? yearMatch[1] : birthDate;
};
