import { NextRequest, NextResponse } from "next/server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid } from "nanoid";

import { R2_CONFIG, handleR2Error, r2Client } from "@/libs/cloudflare/r2.client";

export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const { fileName, fileType, fileSize, contentType = "video" } = await request.json();

        // Validate required fields
        if (!fileName || !fileType || !fileSize) {
            return NextResponse.json(
                { error: "Missing required fields: fileName, fileType, fileSize" },
                { status: 400 }
            );
        }

        // Validate file type
        if (!R2_CONFIG.allowedMimeTypes.includes(fileType)) {
            return NextResponse.json(
                {
                    error: "Invalid file type",
                    allowedTypes: R2_CONFIG.allowedMimeTypes,
                },
                { status: 400 }
            );
        }

        // Validate file size
        if (fileSize > R2_CONFIG.maxFileSize) {
            return NextResponse.json(
                {
                    error: `File too large. Maximum size is ${R2_CONFIG.maxFileSize / (1024 * 1024)}MB`,
                },
                { status: 400 }
            );
        }

        // Generate unique file key with organized folder structure
        const timestamp = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
        const fileId = nanoid(10);
        const fileExtension = fileName.split(".").pop();
        const fileKey = `${contentType}/${timestamp}/${fileId}.${fileExtension}`;

        // Create presigned URL for PUT operation
        const command = new PutObjectCommand({
            Bucket: R2_CONFIG.bucketName,
            Key: fileKey,
            ContentType: fileType,
            ContentLength: fileSize,
            Metadata: {
                originalFileName: fileName,
                contentType,
                uploadedAt: new Date().toISOString(),
            },
        });

        const presignedUrl = await getSignedUrl(r2Client, command, {
            expiresIn: R2_CONFIG.presignedUrlExpiry,
        });

        // Generate public URL if configured
        const publicUrl = R2_CONFIG.publicUrl ? `${R2_CONFIG.publicUrl}/${fileKey}` : undefined;

        return NextResponse.json({
            success: true,
            presignedUrl,
            fileKey,
            publicUrl,
            expiresAt: Date.now() + R2_CONFIG.presignedUrlExpiry * 1000,
        });
    } catch (error) {
        console.error("Failed to generate presigned URL:", error);

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
