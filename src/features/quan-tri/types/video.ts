export interface ProgressData {
    taskId: string;
    status: "pending" | "processing" | "completed" | "failed";
    progress: number;
    message: string;
    startTime: string;
    endTime?: string;
    error?: string;
    metadata?: {
        fileName: string;
        fileSize: number;
        duration?: number;
        currentTime?: number;
        speed?: string;
    };
}

export interface FinalResult {
    taskId: string;
    processingTime: number;
    m3u8Playlist: string;
    r2UploadResult: {
        url: string;
        key: string;
        size: number;
        contentType: string;
    };
    segments: Array<{
        url: string;
        key: string;
        size: number;
    }>;
}

export interface UploadResult {
    success: boolean;
    data?: {
        fileKey: string;
        publicUrl?: string;
        r2UploadResult?: {
            url: string;
            key: string;
            size: number;
            contentType: string;
        };
        taskId?: string;
    };
    error?: string;
}
