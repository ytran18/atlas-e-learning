/**
 * Storage Service
 *
 * Service for handling file uploads to Cloudflare R2
 */
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { nanoid } from "nanoid";

const getR2Endpoint = () => {
    const accountId = process.env.NEXT_PUBLIC_R2_ACCOUNT_ID!;
    return `https://${accountId}.r2.cloudflarestorage.com`;
};

// Initialize S3 Client for Cloudflare R2
const s3Client = new S3Client({
    region: "auto",
    endpoint: getR2Endpoint(),
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_R2_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.NEXT_PUBLIC_R2_SECRET_ACCESS_KEY || "",
    },
});

const BUCKET_NAME = process.env.NEXT_PUBLIC_R2_BUCKET_NAME || "";
const PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "";

/**
 * Upload file to Cloudflare R2
 *
 * @param file - File buffer to upload
 * @param userId - User ID for organizing files
 * @param groupId - Group ID for organizing files
 * @param type - Type of capture (start, learning, finish)
 * @returns Public URL of uploaded file
 */
async function uploadLearningCapture(
    file: Buffer,
    userId: string,
    groupId: string,
    type: "start" | "learning" | "finish"
): Promise<string> {
    const timestamp = Date.now();

    const uniqueId = nanoid(8);

    const fileName = `${type}_${timestamp}_${uniqueId}.jpg`;

    const key = `users/${userId}/learning/${groupId}/${fileName}`;

    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: file,
        ContentType: "image/jpeg",
    });

    await s3Client.send(command);

    // Return public URL
    const publicUrl = `${PUBLIC_URL}/${key}`;

    return publicUrl;
}

/**
 * Upload file from FormData
 *
 * @param formData - FormData containing file
 * @param userId - User ID
 * @param groupId - Group ID
 * @param type - Capture type
 * @returns Public URL
 */
export async function uploadFromFormData(
    formData: FormData,
    userId: string,
    groupId: string,
    type: "start" | "learning" | "finish"
): Promise<string> {
    const file = formData.get("file") as File;

    if (!file) {
        throw new Error("VALIDATION: No file provided");
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();

    const buffer = Buffer.from(arrayBuffer);

    return uploadLearningCapture(buffer, userId, groupId, type);
}
