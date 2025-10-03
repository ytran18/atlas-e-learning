import { HeadBucketCommand, S3Client } from "@aws-sdk/client-s3";

const getR2Endpoint = () => {
    const accountId = process.env.NEXT_PUBLIC_R2_ACCOUNT_ID!;
    return `https://${accountId}.r2.cloudflarestorage.com`;
};

export const r2Client = new S3Client({
    region: "auto",
    endpoint: getR2Endpoint(),
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_PUBLIC_R2_SECRET_ACCESS_KEY!,
    },
    forcePathStyle: true,
});

export const R2_CONFIG = {
    bucketName: process.env.NEXT_PUBLIC_R2_BUCKET_NAME!,
    publicUrl: process.env.NEXT_PUBLIC_R2_PUBLIC_URL,
    maxFileSize: 500 * 1024 * 1024, // 500MB for videos
    allowedMimeTypes: [
        "image/jpeg",
        "image/png",
        "image/webp",
        "video/mp4",
        "video/webm",
        "video/ogg",
        "video/quicktime",
        "video/avi",
        "video/mov",
        "video/wmv",
        "video/flv",
        "video/mkv",
        "video/m4v",
    ],
    presignedUrlExpiry: 3600, // 1 hour for large video uploads
};

// test r2 connection
export async function testR2Connection(): Promise<boolean> {
    try {
        await r2Client.send(
            new HeadBucketCommand({
                Bucket: R2_CONFIG.bucketName,
            })
        );
        return true;
    } catch (error) {
        console.error("R2 connection test failed:", error);
        return false;
    }
}

// Convert R2 SDK errors into user-friendly messages
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function handleR2Error(error: any): string {
    if (error.name === "NoSuchBucket") return "Bucket does not exist.";
    if (error.name === "InvalidAccessKeyId") return "Invalid access key.";
    if (error.name === "SignatureDoesNotMatch") return "Authentication failed.";
    if (error.name === "AccessDenied") return "Access denied. Check your token permissions.";
    return `R2 operation failed: ${error.message || "Unknown error"}`;
}
