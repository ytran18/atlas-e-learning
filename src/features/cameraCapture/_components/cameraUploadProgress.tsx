"use client";

interface CameraUploadProgressProps {
    progress: number;
    status: "idle" | "uploading" | "success" | "error";
    error?: string;
}

export const CameraUploadProgress = ({ progress, status, error }: CameraUploadProgressProps) => {
    if (status === "idle") return null;

    return (
        <div className="upload-progress mt-4 w-full max-w-2xl mx-auto">
            {status === "uploading" && (
                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Uploading image...</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            )}

            {status === "success" && (
                <div className="p-3 bg-green-100 text-green-800 rounded">
                    <p className="font-semibold">✓ Upload Complete!</p>
                </div>
            )}

            {status === "error" && (
                <div className="p-3 bg-red-100 text-red-800 rounded">
                    <p className="font-semibold">✗ Upload Failed</p>
                    {error && <p className="text-sm mt-1">{error}</p>}
                </div>
            )}
        </div>
    );
};
