import { NextRequest, NextResponse } from "next/server";

import { GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";

import { r2Client } from "@/libs/cloudflare/r2.client";

// --- HÀM GET (ĐÃ TỐI ƯU HÓA) ---
export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
    const { path } = await context.params;
    const filePath = path.join("/");
    const range = request.headers.get("range");

    try {
        const command = new GetObjectCommand({
            Bucket: process.env.NEXT_PUBLIC_R2_BUCKET_NAME!,
            Key: filePath,
            ...(range && { Range: range }), // Gửi 'Range' đến R2 nếu có
        });

        const response = await r2Client.send(command);
        const body = response.Body; // Lấy stream

        if (!body) {
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

        // Trả về response dạng stream
        return new NextResponse(body as any, {
            status,
            headers,
        });
    } catch (error) {
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
