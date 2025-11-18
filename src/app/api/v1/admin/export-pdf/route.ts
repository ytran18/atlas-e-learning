/**
 * POST /api/v1/admin/export-pdf
 *
 * Export student statistics as PDF (admin only)
 * Query params: type, courseId, search (optional), page (optional), pageSize (optional)
 * Returns: PDF file for the specified page
 */
import { NextRequest } from "next/server";

import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

import { getGroupStats } from "@/services/firestore.service";
import { CourseType, StudentStats } from "@/types/api";
import { getQueryParams, handleApiError, requireAuth } from "@/utils/api.utils";

// Set max duration to 5 minutes (300 seconds) for Vercel Hobby plan
// Note: Hobby plan max is 300s. For 10 minutes, upgrade to Pro plan (max 900s)
export const maxDuration = 300;

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
        const pageNumber = parseInt(queryParams.page || "1", 10);
        const pageSize = parseInt(queryParams.pageSize || "50", 10);

        // Validate required params
        if (!type || !courseId) {
            throw new Error("VALIDATION: type and courseId are required");
        }

        // Fetch only the current page data
        // For page 1, we can fetch directly. For other pages, we need to navigate there.
        // To optimize, we'll use a larger pageSize for PDF export to get more data per page
        const pdfPageSize = Math.max(pageSize, 50); // Use at least 50 items per page for PDF
        const targetPage = Math.max(1, pageNumber);
        let cursor: string | undefined;
        let currentPage = 1;

        // Only navigate if we're not on page 1
        if (targetPage > 1) {
            // For pages > 1, we need to navigate there by fetching previous pages
            // This is acceptable since we're only exporting one page at a time
            while (currentPage < targetPage) {
                const tempStats = await getGroupStats(courseId, pdfPageSize, cursor, search, false);
                if (!tempStats.hasMore || !tempStats.nextCursor) {
                    throw new Error(`VALIDATION: Page ${targetPage} does not exist`);
                }
                cursor = tempStats.nextCursor;
                currentPage++;
            }
        }

        // Fetch the target page data with count for first page only
        const includeCount = targetPage === 1;
        const stats = await getGroupStats(courseId, pdfPageSize, cursor, search, includeCount);

        if (stats.data.length === 0) {
            throw new Error("VALIDATION: No data to export");
        }

        // Get course name from first student or use default
        const courseName = stats.data[0]?.courseName || "Khóa học";

        // Calculate total pages if we have totalDocs
        const totalPages =
            stats.totalPages || Math.ceil((stats.totalDocs || stats.data.length) / pageSize);
        const totalDocs = stats.totalDocs || stats.data.length;

        // Generate HTML for current page only
        const html = generatePDFHTML(stats.data, courseName, targetPage, totalPages, totalDocs);

        // Detect serverless environment (Vercel sets VERCEL env variable)
        const isServerless = !!process.env.VERCEL;

        // Launch Puppeteer with appropriate configuration
        if (isServerless) {
            // Use bundled Chromium for serverless environments
            browser = await puppeteer.launch({
                args: chromium.args,
                defaultViewport: { width: 1920, height: 1080 },
                executablePath: await chromium.executablePath(),
                headless: true,
            });
        } else {
            // Use system Chrome/Chromium for local development
            browser = await puppeteer.launch({
                args: ["--no-sandbox", "--disable-setuid-sandbox"],
                defaultViewport: { width: 1920, height: 1080 },
                channel: "chrome", // Use system Chrome
                headless: true,
            });
        }

        const page = await browser.newPage();

        // Set timeout to 5 minutes (300,000ms) for page operations
        // Note: Limited by Vercel Hobby plan maxDuration of 300s
        page.setDefaultNavigationTimeout(300000);
        page.setDefaultTimeout(300000);

        await page.setContent(html, { waitUntil: "networkidle0", timeout: 300000 });

        // Generate PDF with timeout
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
            timeout: 300000,
        });

        await browser.close();

        // Return PDF as response
        return new Response(Buffer.from(pdf), {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="bao-cao-hoc-vien-${courseId}-trang-${targetPage}-${Date.now()}.pdf"`,
            },
        });
    } catch (error) {
        if (browser) {
            await browser.close();
        }
        return handleApiError(error);
    }
}
