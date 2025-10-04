import { NextRequest, NextResponse } from "next/server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { nanoid } from "nanoid";

import { R2_CONFIG, handleR2Error, r2Client } from "@/libs/cloudflare/r2.client";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        const file = formData.get("file") as File;

        const contentType = (formData.get("contentType") as string) || "video";

        if (!file) {
            return NextResponse.json(
                { success: false, error: "No file provided" },
                { status: 400 }
            );
        }

        // Validate file type
        if (!R2_CONFIG.allowedMimeTypes.includes(file.type)) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid file type",
                    allowedTypes: R2_CONFIG.allowedMimeTypes,
                },
                { status: 400 }
            );
        }

        // Validate file size
        if (file.size > R2_CONFIG.maxFileSize) {
            return NextResponse.json(
                {
                    success: false,
                    error: `File too large. Maximum size is ${R2_CONFIG.maxFileSize / (1024 * 1024)}MB`,
                },
                { status: 400 }
            );
        }

        // Generate unique file key
        const timestamp = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

        const fileId = nanoid(10);

        const fileExtension = file.name.split(".").pop();

        const fileKey = `${contentType}/${timestamp}/${fileId}.${fileExtension}`;

        // Convert File to Buffer
        const arrayBuffer = await file.arrayBuffer();

        const buffer = Buffer.from(arrayBuffer);

        // For files larger than 5MB, use multipart upload
        if (file.size > 5 * 1024 * 1024) {
            const upload = new Upload({
                client: r2Client,
                params: {
                    Bucket: R2_CONFIG.bucketName,
                    Key: fileKey,
                    Body: buffer,
                    ContentType: file.type,
                    Metadata: {
                        originalFileName: file.name,
                        contentType,
                        uploadedAt: new Date().toISOString(),
                    },
                },
                queueSize: 4, // concurrent uploads
                partSize: 5 * 1024 * 1024, // 5MB chunks
            });

            await upload.done();
        } else {
            // For smaller files, use simple PUT
            const command = new PutObjectCommand({
                Bucket: R2_CONFIG.bucketName,
                Key: fileKey,
                Body: buffer,
                ContentType: file.type,
                Metadata: {
                    originalFileName: file.name,
                    contentType,
                    uploadedAt: new Date().toISOString(),
                },
            });

            await r2Client.send(command);
        }

        // Generate public URL
        const publicUrl = R2_CONFIG.publicUrl ? `${R2_CONFIG.publicUrl}/${fileKey}` : undefined;

        return NextResponse.json({
            success: true,
            fileKey,
            publicUrl,
        });
    } catch (error) {
        console.error("Failed to upload file:", error);

        const errorMessage = handleR2Error(error);

        return NextResponse.json(
            {
                success: false,
                error: errorMessage,
            },
            { status: 500 }
        );
    }
}

// Set max body size for video uploads (default is 4MB)
export const config = {
    api: {
        bodyParser: false,
    },
};
