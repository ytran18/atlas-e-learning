interface VideoUploadProgressProps {
    progress: number;
    status: "idle" | "uploading" | "success" | "error";
    error?: string;
    fileName?: string;
}

export const VideoUploadProgress = ({
    progress,
    status,
    error,
    fileName,
}: VideoUploadProgressProps) => {
    if (status === "idle") return null;

    return (
        <div className="video-upload-progress">
            {fileName && <p className="file-name">{fileName}</p>}

            <div className="progress-bar-container">
                <div
                    className="progress-bar"
                    style={{
                        width: `${progress}%`,
                        backgroundColor:
                            status === "error"
                                ? "#ef4444"
                                : status === "success"
                                  ? "#10b981"
                                  : "#3b82f6",
                    }}
                />
            </div>

            <div className="status-text">
                {status === "uploading" && <span>Uploading... {progress}%</span>}
                {status === "success" && <span className="text-success">Upload completed!</span>}
                {status === "error" && <span className="text-error">Error: {error}</span>}
            </div>
        </div>
    );
};
