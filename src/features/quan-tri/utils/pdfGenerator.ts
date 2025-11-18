import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { StudentStats } from "@/types/api";

const generatePDFHTML = (
    data: StudentStats[],
    courseName: string,
    currentPage: number,
    totalPages: number,
    totalDocs: number
): string => {
    const formatCheckbox = (checked: boolean) => {
        return checked
            ? '<span style="color: #1f2937; font-size: 16px; font-weight: 500;">✓</span>'
            : '<span style="color: #9ca3af; font-size: 16px;">—</span>';
    };

    const rows = data
        .map((student) => {
            const isTheoryCompleted =
                student.currentSection === "practice" ||
                student.currentSection === "exam" ||
                student.isCompleted;

            const isPracticeCompleted = student.currentSection === "exam" || student.isCompleted;

            return `
            <tr>
                <td style="padding: 14px 12px; border-bottom: 1px solid #f3f4f6; color: #111827;">${student.fullname || "-"}</td>
                <td style="padding: 14px 12px; border-bottom: 1px solid #f3f4f6; color: #111827;">${student.userIdCard || "-"}</td>
                <td style="padding: 14px 12px; border-bottom: 1px solid #f3f4f6; color: #111827;">${student.birthDate || "-"}</td>
                <td style="padding: 14px 12px; border-bottom: 1px solid #f3f4f6; text-align: center;">${formatCheckbox(isTheoryCompleted)}</td>
                <td style="padding: 14px 12px; border-bottom: 1px solid #f3f4f6; text-align: center;">${formatCheckbox(isPracticeCompleted)}</td>
                <td style="padding: 14px 12px; border-bottom: 1px solid #f3f4f6; text-align: center;">${formatCheckbox(student.isCompleted)}</td>
                <td style="padding: 14px 12px; border-bottom: 1px solid #f3f4f6; color: #111827;">${student.companyName || "-"}</td>
                <td style="padding: 14px 12px; border-bottom: 1px solid #f3f4f6; color: #111827;">${student.courseName || courseName}</td>
                <td style="padding: 14px 12px; border-bottom: 1px solid #f3f4f6; text-align: center;">
                    ${student.startImageUrl ? `<img src="${student.startImageUrl}" alt="Hình trước khi học" style="max-width: 75px; max-height: 55px; object-fit: cover; border: 1px solid #e5e7eb;" crossorigin="anonymous" />` : "<span style='color: #9ca3af;'>—</span>"}
                </td>
                <td style="padding: 14px 12px; border-bottom: 1px solid #f3f4f6; text-align: center;">
                    ${student.finishImageUrl ? `<img src="${student.finishImageUrl}" alt="Hình sau khi học" style="max-width: 75px; max-height: 55px; object-fit: cover; border: 1px solid #e5e7eb;" crossorigin="anonymous" />` : "<span style='color: #9ca3af;'>—</span>"}
                </td>
                <td style="padding: 14px 12px; border-bottom: 1px solid #f3f4f6; text-align: center;">${formatCheckbox(student.isCompleted)}</td>
            </tr>
        `;
        })
        .join("");

    return `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Báo cáo học viên - ${courseName}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            font-size: 11px;
            line-height: 1.6;
            color: #111827;
            background: #ffffff;
            padding: 30px 25px;
        }
        .header {
            margin-bottom: 35px;
            padding-bottom: 20px;
            border-bottom: 1px solid #e5e7eb;
        }
        .header h1 {
            font-size: 22px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 12px;
            letter-spacing: -0.3px;
        }
        .header .meta {
            font-size: 11px;
            color: #6b7280;
            display: flex;
            gap: 24px;
            flex-wrap: wrap;
        }
        .header .meta span {
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .header .meta strong {
            color: #374151;
            font-weight: 500;
        }
        .table-container {
            margin-top: 25px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            background: #ffffff;
        }
        thead {
            background: #f9fafb;
        }
        th {
            padding: 12px;
            text-align: left;
            font-weight: 500;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #374151;
            border-bottom: 2px solid #e5e7eb;
        }
        tbody tr {
            border-bottom: 1px solid #f3f4f6;
        }
        tbody tr:last-child {
            border-bottom: none;
        }
        td {
            padding: 14px 12px;
            border-bottom: 1px solid #f3f4f6;
            font-size: 11px;
            vertical-align: middle;
            color: #111827;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: right;
            font-size: 10px;
            color: #9ca3af;
            letter-spacing: 0.2px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Báo cáo học viên</h1>
        <div class="meta">
            <span><strong>Khóa học:</strong> ${courseName}</span>
            <span><strong>Tổng số học viên:</strong> ${totalDocs}</span>
            <span><strong>Trang:</strong> ${currentPage} / ${totalPages}</span>
            <span><strong>Ngày xuất:</strong> ${new Date().toLocaleDateString("vi-VN", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            })}</span>
        </div>
    </div>
    
    <div class="table-container">
        <table>
            <thead>
                <tr>
                    <th>Họ tên</th>
                    <th>ID Card</th>
                    <th>Ngày sinh</th>
                    <th style="text-align: center;">Lý thuyết</th>
                    <th style="text-align: center;">Thực hành</th>
                    <th style="text-align: center;">Bài kiểm tra</th>
                    <th>Công ty</th>
                    <th>Khóa học</th>
                    <th style="text-align: center;">Hình trước khi học</th>
                    <th style="text-align: center;">Hình sau khi học</th>
                    <th style="text-align: center;">Hoàn thành</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
        </table>
    </div>
    
    <div class="footer">
        <p>Được tạo bởi hệ thống quản trị ATLD - ${new Date().getFullYear()}</p>
    </div>
</body>
</html>
    `;
};

/**
 * Generate PDF from student stats data on client-side
 * @param data - Array of student statistics
 * @param courseName - Name of the course
 * @param courseId - Course ID for filename
 */
export async function generatePDFFromData(
    data: StudentStats[],
    courseName: string,
    courseId: string
): Promise<void> {
    if (data.length === 0) {
        throw new Error("No data to export");
    }

    const currentPage = 1;
    const totalPages = 1;
    const totalDocs = data.length;

    // Generate HTML
    const html = generatePDFHTML(data, courseName, currentPage, totalPages, totalDocs);

    // Create a temporary container to render HTML
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    container.style.width = "1920px"; // A4 landscape width in pixels at 96 DPI
    container.innerHTML = html;

    document.body.appendChild(container);

    try {
        // Wait for images to load
        const images = container.querySelectorAll("img");
        await Promise.all(
            Array.from(images).map((img) => {
                return new Promise<void>((resolve, reject) => {
                    if (img.complete) {
                        resolve();
                    } else {
                        img.onload = () => resolve();
                        img.onerror = () => resolve(); // Continue even if image fails
                    }
                });
            })
        );

        // Convert HTML to canvas
        const canvas = await html2canvas(container, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: "#ffffff",
            width: container.scrollWidth,
            height: container.scrollHeight,
        });

        // Create PDF in landscape A4 format
        const pdf = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a4",
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgScaledWidth = imgWidth * ratio;
        const imgScaledHeight = imgHeight * ratio;

        // Calculate margins (20mm top/bottom, 15mm left/right)
        const marginTop = 20;
        const marginLeft = 15;
        const marginRight = 15;
        const marginBottom = 20;

        // Calculate available width and height
        const availableWidth = pdfWidth - marginLeft - marginRight;
        const availableHeight = pdfHeight - marginTop - marginBottom;

        // Scale to fit available space
        const scaleX = availableWidth / imgWidth;
        const scaleY = availableHeight / imgHeight;
        const scale = Math.min(scaleX, scaleY);

        const finalWidth = imgWidth * scale;
        const finalHeight = imgHeight * scale;

        // Center the image
        const x = marginLeft + (availableWidth - finalWidth) / 2;
        const y = marginTop + (availableHeight - finalHeight) / 2;

        const imgData = canvas.toDataURL("image/png");

        // If content fits in one page, add it directly
        if (finalHeight <= availableHeight) {
            pdf.addImage(imgData, "PNG", x, y, finalWidth, finalHeight);
        } else {
            // If content is too tall, split into multiple pages
            const pageHeight = availableHeight;
            let heightLeft = finalHeight;
            let position = y;

            pdf.addImage(imgData, "PNG", x, position, finalWidth, finalHeight);
            heightLeft -= pageHeight;

            while (heightLeft > 0) {
                position = marginTop - (finalHeight - heightLeft);
                pdf.addPage();
                pdf.addImage(imgData, "PNG", x, position, finalWidth, finalHeight);
                heightLeft -= pageHeight;
            }
        }

        // Download PDF
        pdf.save(`bao-cao-hoc-vien-${courseId}-${Date.now()}.pdf`);
    } finally {
        // Clean up
        document.body.removeChild(container);
    }
}
