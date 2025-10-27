import { NextRequest, NextResponse } from "next/server";

import { GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";

import { r2Client } from "@/libs/cloudflare/r2.client";

// --- HÀM GET (ĐÃ TỐI ƯU HÓA) ---
export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
    const { path } = await context.params;
    const filePath = path.join("/");
    const range = request.headers.get("range");

    // --- LOG #1: YÊU CẦU MỚI ---
    console.log(`\n✅ [PROXY - ${filePath}] === YÊU CẦU MỚI ===`);
    console.log(`[PROXY - ${filePath}] Yêu cầu từ Safari: ${request.method}`);
    console.log(`[PROXY - ${filePath}] Header 'Range' từ Safari: ${range || "Không có"}`);

    try {
        // --- LOG #2: GỌI R2 ---
        console.log(`[PROXY - ${filePath}] Đang gọi R2 với Key: ${filePath}`);
        const command = new GetObjectCommand({
            Bucket: process.env.NEXT_PUBLIC_R2_BUCKET_NAME!,
            Key: filePath,
            ...(range && { Range: range }), // Gửi 'Range' đến R2 nếu có
        });

        const response = await r2Client.send(command);
        const body = response.Body; // Lấy stream

        // --- LOG #3: PHẢN HỒI TỪ R2 ---
        console.log(
            `[PROXY - ${filePath}] ✅ R2 Phản hồi THÀNH CÔNG (Status ${response.$metadata.httpStatusCode})`
        );
        console.log(`[PROXY - ${filePath}] R2 Content-Range: ${response.ContentRange || "N/A"}`);
        console.log(`[PROXY - ${filePath}] R2 Content-Length: ${response.ContentLength}`);
        console.log(`[PROXY - ${filePath}] R2 ETag: ${response.ETag}`);

        if (!body) {
            console.error(`[PROXY - ${filePath}] ❌ LỖI: R2 trả về body rỗng!`);
            return new NextResponse("File not found", { status: 404 });
        }

        // Lấy metadata từ R2
        const contentRange = response.ContentRange;
        const contentLength = response.ContentLength;
        const etag = response.ETag;
        const lastModified = response.LastModified;

        // --- Logic xác định header ---
        let contentType: string;
        let cacheControl: string;

        if (filePath.endsWith(".m3u8")) {
            contentType = "application/vnd.apple.mpegurl";
            cacheControl = "no-cache, no-store, must-revalidate";
        } else if (filePath.endsWith(".ts")) {
            contentType = "video/mp2t";
            cacheControl = "public, max-age=3600";
        } else {
            contentType = response.ContentType || "application/octet-stream";
            cacheControl = "public, max-age=3600";
        }

        // --- Build headers để trả về cho Safari ---
        const headers: Record<string, string> = {
            "Content-Type": contentType,
            "Cache-Control": cacheControl,
            "Accept-Ranges": "bytes",
            "Content-Length": contentLength?.toString() || "0",
            ...(etag && { ETag: etag }),
            ...(lastModified && { "Last-Modified": lastModified.toUTCString() }),
        };

        if (range && contentRange) {
            headers["Content-Range"] = contentRange;
        }

        const status = range ? 206 : 200;

        // --- LOG #4: TRẢ VỀ CHO SAFARI ---
        console.log(`[PROXY - ${filePath}] ✅ Chuẩn bị trả về cho Safari`);
        console.log(
            `[PROXY - ${filePath}] Status trả về: ${status} ${status === 206 ? "(Partial Content)" : "(OK)"}`
        );
        console.log(`[PROXY - ${filePath}] Headers trả về: ${JSON.stringify(headers, null, 2)}`);

        // Trả về response dạng stream
        return new NextResponse(body as any, {
            status,
            headers,
        });
    } catch (error) {
        // --- LOG #5: XỬ LÝ LỖI ---
        console.error(`\n❌❌❌ [PROXY - ${filePath}] === LỖI NGHIÊM TRỌNG ===`);
        if (error instanceof Error) {
            console.error(`[PROXY - ${filePath}] Tên lỗi: ${error.name}`);
            console.error(`[PROXY - ${filePath}] Thông điệp lỗi: ${error.message}`);
            // Ghi đầy đủ stack trace để debug
            console.error(`[PROXY - ${filePath}] Stack Trace: ${error.stack}`);
        } else {
            console.error(`[PROXY - ${filePath}] Lỗi không xác định:`, error);
        }

        if (error instanceof Error && error.name === "NoSuchKey") {
            return new NextResponse("File not found", { status: 404 });
        }
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

// --- HÀM HEAD (Rất quan trọng cho HLS) ---
export async function HEAD(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
    try {
        const { path } = await context.params;
        const filePath = path.join("/");

        // Chỉ lấy metadata, không lấy body
        const command = new HeadObjectCommand({
            Bucket: process.env.NEXT_PUBLIC_R2_BUCKET_NAME!,
            Key: filePath,
        });
        const response = await r2Client.send(command);

        let contentType: string;
        let cacheControl: string;

        if (filePath.endsWith(".m3u8")) {
            contentType = "application/vnd.apple.mpegurl";
            cacheControl = "no-cache, no-store, must-revalidate";
        } else if (filePath.endsWith(".ts")) {
            contentType = "video/mp2t";
            cacheControl = "public, max-age=3600";
        } else {
            contentType = response.ContentType || "application/octet-stream";
            cacheControl = "public, max-age=3600";
        }

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

// --- HÀM OPTIONS (Giữ nguyên) ---
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
            "Access-Control-Allow-Headers": "Range, Content-Range, If-Range",
            "Access-Control-Max-Age": "86400",
        },
    });
}
