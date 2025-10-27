// /pages/api/video/[...path].ts (hoặc app/api/video/[[...path]]/route.ts)
import { NextRequest, NextResponse } from "next/server";

import { GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";

import { r2Client } from "@/libs/cloudflare/r2.client";

// --- HÀM GET (QUAN TRỌNG NHẤT) ---
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const resolvedParams = await params;
        const path = resolvedParams.path;
        const filePath = path.join("/");
        const range = request.headers.get("range");

        // Lấy file từ R2
        const command = new GetObjectCommand({
            Bucket: process.env.NEXT_PUBLIC_R2_BUCKET_NAME!,
            Key: filePath,
            ...(range && { Range: range }),
        });
        const response = await r2Client.send(command);
        const body = response.Body;

        if (!body) {
            return new NextResponse("File not found", { status: 404 });
        }

        // Lấy TOÀN BỘ metadata quan trọng từ R2
        const contentRange = response.ContentRange;
        const contentLength = response.ContentLength;
        const contentType = response.ContentType || "application/octet-stream";
        const etag = response.ETag;
        const lastModified = response.LastModified;

        // --- Xử lý riêng cho .m3u8 (File này NHỎ, không cần stream) ---
        if (filePath.endsWith(".m3u8")) {
            if (!body) {
                return new NextResponse("File not found", { status: 404 });
            }

            const bodyBytes = await body.transformToByteArray();

            // (Nếu cần thay thế URL thì làm ở đây, nhưng chúng ta đã
            // xác nhận là URL tương đối nên không cần)

            return new NextResponse(new Uint8Array(bodyBytes), {
                status: 200,
                headers: {
                    "Content-Type": "application/vnd.apple.mpegurl",
                    "Content-Length": bodyBytes.length.toString(),
                    "Cache-Control": "no-cache, no-store, must-revalidate",
                },
            });
        }

        // --- Xử lý file .ts (Stream) ---

        // Build headers
        const headers: Record<string, string> = {
            "Content-Type": contentType,
            "Accept-Ranges": "bytes",
            "Content-Length": contentLength?.toString() || "0",
            "Cache-Control": "public, max-age=3600",

            // *** BỔ SUNG QUAN TRỌNG ***
            // Safari có thể cần ETag và Last-Modified để xử lý Range
            ...(etag && { ETag: etag }),
            ...(lastModified && { "Last-Modified": lastModified.toUTCString() }),
        };

        // Thêm Content-Range nếu là 206
        if (range && contentRange) {
            headers["Content-Range"] = contentRange;
        }

        // Stream body trực tiếp
        return new NextResponse(body as any, {
            status: range ? 206 : 200, // Trả về 206 nếu Safari yêu cầu Range
            headers,
        });
    } catch (error) {
        console.error("Error proxying video file:", error);
        if (error instanceof Error && error.name === "NoSuchKey") {
            return new NextResponse("File not found", { status: 404 });
        }
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

// --- HÀM HEAD (HIỆU NĂNG CAO) ---
export async function HEAD(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const resolvedParams = await params;
        const path = resolvedParams.path;
        const filePath = path.join("/");

        // Chỉ lấy metadata, không lấy body
        const command = new HeadObjectCommand({
            Bucket: process.env.NEXT_PUBLIC_R2_BUCKET_NAME!,
            Key: filePath,
        });
        const response = await r2Client.send(command);

        let contentType: string;
        if (filePath.endsWith(".m3u8")) {
            contentType = "application/vnd.apple.mpegurl";
        } else if (filePath.endsWith(".ts")) {
            contentType = "video/mp2t";
        } else {
            contentType = response.ContentType || "application/octet-stream";
        }

        const cacheControl = filePath.endsWith(".m3u8")
            ? "no-cache, no-store, must-revalidate"
            : "public, max-age=3600";

        return new NextResponse(null, {
            status: 200,
            headers: {
                "Content-Type": contentType,
                "Content-Length": response.ContentLength?.toString() || "0",
                "Accept-Ranges": "bytes",
                "Cache-Control": cacheControl,
                "Last-Modified": response.LastModified?.toUTCString() || "",
                ETag: response.ETag || "",
            },
        });
    } catch (error) {
        console.error("Error in HEAD request:", error);
        return new NextResponse("Not Found", { status: 404 });
    }
}

// --- HÀM OPTIONS (CHO CORS NẾU CẦN) ---
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            "Access-Control-Allow-Origin": "*", // Thay bằng domain của bạn
            "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
            "Access-Control-Allow-Headers": "Range, Content-Range, If-Range",
            "Access-Control-Max-Age": "86400",
        },
    });
}
