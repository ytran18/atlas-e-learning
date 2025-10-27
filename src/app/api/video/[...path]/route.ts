import { NextRequest, NextResponse } from "next/server";

import { GetObjectCommand } from "@aws-sdk/client-s3";

import { r2Client } from "@/libs/cloudflare/r2.client";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const { path } = await params;
        const filePath = path.join("/");

        // Extract Range header from request
        const range = request.headers.get("range");

        // Prepare R2 request command
        const command = new GetObjectCommand({
            Bucket: process.env.NEXT_PUBLIC_R2_BUCKET_NAME!,
            Key: filePath,
            // Pass through Range header to R2
            ...(range && { Range: range }),
        });

        const response = await r2Client.send(command);
        const body = await response.Body?.transformToByteArray();

        if (!body) {
            return new NextResponse("File not found", { status: 404 });
        }

        // Get range info from R2 response
        const contentRange = response.ContentRange;
        const acceptRanges = response.AcceptRanges;

        // Determine content type based on file extension
        let contentType: string;
        if (filePath.endsWith(".m3u8")) {
            contentType = "application/vnd.apple.mpegurl";
        } else if (filePath.endsWith(".ts")) {
            contentType = "video/mp2t";
        } else {
            contentType = response.ContentType || "application/octet-stream";
        }

        // Handle .m3u8 files - modify content to use proxy URLs
        if (filePath.endsWith(".m3u8")) {
            const content = new TextDecoder().decode(body);

            // Replace R2 URLs with proxy URLs in the playlist
            const baseUrl = `${request.nextUrl.origin}/api/video`;
            const modifiedContent = content.replace(
                new RegExp(process.env.NEXT_PUBLIC_R2_PUBLIC_URL!, "g"),
                baseUrl
            );

            // Convert back to bytes
            const modifiedBytes = new TextEncoder().encode(modifiedContent);

            return new NextResponse(modifiedBytes, {
                status: range ? 206 : 200, // 206 for partial content, 200 for full content
                headers: {
                    "Content-Type": contentType,
                    "Content-Length": modifiedBytes.length.toString(),
                    "Accept-Ranges": "bytes",
                    "Cache-Control": "no-cache, no-store, must-revalidate", // Ngăn Cloudflare cache
                    // Include range info if it's a partial content request
                    ...(range &&
                        contentRange && {
                            "Content-Range": contentRange,
                        }),
                },
            });
        }

        // Handle .ts files and other content - pass through with proper range handling
        const headers: Record<string, string> = {
            "Content-Type": contentType,
            "Content-Length": body.length.toString(),
            "Accept-Ranges": acceptRanges || "bytes",
            "Cache-Control": "public, max-age=3600",
        };

        // Add range-specific headers for partial content
        if (range && contentRange) {
            headers["Content-Range"] = contentRange;
        }

        return new NextResponse(new Uint8Array(body), {
            status: range ? 206 : 200, // 206 for partial content, 200 for full content
            headers,
        });
    } catch (error) {
        console.error("Error proxying video file:", error);

        // Handle specific R2 errors
        if (error instanceof Error && error.name === "NoSuchKey") {
            return new NextResponse("File not found", { status: 404 });
        }

        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

// Handle OPTIONS requests for CORS preflight
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

// Handle HEAD requests (used by browsers to check file availability)
export async function HEAD(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const { path } = await params;
        const filePath = path.join("/");

        // Get object metadata from R2
        const command = new GetObjectCommand({
            Bucket: process.env.NEXT_PUBLIC_R2_BUCKET_NAME!,
            Key: filePath,
        });

        const response = await r2Client.send(command);

        // Determine content type
        let contentType: string;
        if (filePath.endsWith(".m3u8")) {
            contentType = "application/vnd.apple.mpegurl";
        } else if (filePath.endsWith(".ts")) {
            contentType = "video/mp2t";
        } else {
            contentType = response.ContentType || "application/octet-stream";
        }

        return new NextResponse(null, {
            status: 200,
            headers: {
                "Content-Type": contentType,
                "Content-Length": response.ContentLength?.toString() || "0",
                "Accept-Ranges": "bytes",
                "Cache-Control": "public, max-age=3600",
                "Last-Modified": response.LastModified?.toUTCString() || "",
                ETag: response.ETag || "",
            },
        });
    } catch (error) {
        console.error("Error in HEAD request:", error);
        return new NextResponse("Not Found", { status: 404 });
    }
}
