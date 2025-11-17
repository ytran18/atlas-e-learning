/**
 * POST /api/v1/admin/export-pdf
 *
 * Export student statistics as PDF (admin only)
 * Query params: type, courseId, search (optional)
 * Returns: PDF file
 */
import { NextRequest } from "next/server";

import puppeteer from "puppeteer";

import { getGroupStats } from "@/services/firestore.service";
import { CourseType, StudentStats } from "@/types/api";
import { getQueryParams, handleApiError, requireAuth } from "@/utils/api.utils";

const generatePDFHTML = (data: StudentStats[], courseName: string): string => {
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
                    ${student.startImageUrl ? `<img src="${student.startImageUrl}" alt="Hình trước khi học" style="max-width: 75px; max-height: 55px; object-fit: cover; border: 1px solid #e5e7eb;" />` : "<span style='color: #9ca3af;'>—</span>"}
                </td>
                <td style="padding: 14px 12px; border-bottom: 1px solid #f3f4f6; text-align: center;">
                    ${student.finishImageUrl ? `<img src="${student.finishImageUrl}" alt="Hình sau khi học" style="max-width: 75px; max-height: 55px; object-fit: cover; border: 1px solid #e5e7eb;" />` : "<span style='color: #9ca3af;'>—</span>"}
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
        @media print {
            body {
                padding: 20px 15px;
            }
            .header {
                page-break-after: avoid;
            }
            tbody tr {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Báo cáo học viên</h1>
        <div class="meta">
            <span><strong>Khóa học:</strong> ${courseName}</span>
            <span><strong>Tổng số học viên:</strong> ${data.length}</span>
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

export async function POST(request: NextRequest) {
    let browser;
    try {
        // Authenticate admin user
        await requireAuth();

        // Get query parameters
        const queryParams = getQueryParams(request);
        const type = queryParams.type as CourseType;
        const courseId = queryParams.courseId;
        const search = queryParams.search;

        // Validate required params
        if (!type || !courseId) {
            throw new Error("VALIDATION: type and courseId are required");
        }

        // Fetch all student stats (no pagination for PDF export)
        // We'll fetch in batches to get all data
        let allData: StudentStats[] = [];
        let cursor: string | undefined;
        let hasMore = true;
        const batchSize = 100;

        while (hasMore) {
            const stats = await getGroupStats(courseId, batchSize, cursor, search, false);
            allData = [...allData, ...stats.data];
            cursor = stats.nextCursor;
            hasMore = stats.hasMore;
        }

        if (allData.length === 0) {
            throw new Error("VALIDATION: No data to export");
        }

        // Get course name from first student or use default
        const courseName = allData[0]?.courseName || "Khóa học";

        // Generate HTML
        const html = generatePDFHTML(allData, courseName);

        // Launch Puppeteer
        browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle0" });

        // Generate PDF
        const pdf = await page.pdf({
            format: "A4",
            landscape: true,
            margin: {
                top: "20mm",
                right: "15mm",
                bottom: "20mm",
                left: "15mm",
            },
            printBackground: true,
        });

        await browser.close();

        // Return PDF as response
        return new Response(Buffer.from(pdf), {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="bao-cao-hoc-vien-${courseId}-${Date.now()}.pdf"`,
            },
        });
    } catch (error) {
        if (browser) {
            await browser.close();
        }
        return handleApiError(error);
    }
}
