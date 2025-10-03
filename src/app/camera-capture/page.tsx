"use client";

import { useState } from "react";

import { CameraCapture } from "@/features/cameraCapture";

export default function CameraCapturePage() {
    const [uploadResult, setUploadResult] = useState<{
        fileKey?: string;
        publicUrl?: string;
        error?: string;
    } | null>(null);

    const handleUploadSuccess = (fileKey: string, publicUrl?: string) => {
        setUploadResult({ fileKey, publicUrl });
        console.log("Upload successful:", { fileKey, publicUrl });
    };

    const handleUploadError = (error: string) => {
        setUploadResult({ error });
        console.error("Upload error:", error);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Camera Capture Test</h1>
                    <p className="text-gray-600">
                        Test the camera capture and R2 upload functionality
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <CameraCapture
                        onUploadSuccess={handleUploadSuccess}
                        onUploadError={handleUploadError}
                        autoUpload={true}
                        mirrored={true}
                    />
                </div>

                {uploadResult && (
                    <div className="mt-6 bg-white rounded-lg shadow p-4">
                        <h2 className="text-lg font-semibold mb-2">Upload Result:</h2>
                        {uploadResult.error ? (
                            <div className="text-red-600">
                                <p className="font-semibold">Error:</p>
                                <p className="text-sm">{uploadResult.error}</p>
                            </div>
                        ) : (
                            <div className="text-green-600 space-y-2">
                                <div>
                                    <p className="font-semibold">Success!</p>
                                </div>
                                <div className="text-sm text-gray-700">
                                    <p>
                                        <span className="font-medium">File Key:</span>{" "}
                                        {uploadResult.fileKey}
                                    </p>
                                    {uploadResult.publicUrl && (
                                        <p className="break-all">
                                            <span className="font-medium">Public URL:</span>{" "}
                                            <a
                                                href={uploadResult.publicUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 hover:underline"
                                            >
                                                {uploadResult.publicUrl}
                                            </a>
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-6 bg-blue-50 rounded-lg p-4 text-sm text-gray-700">
                    <h3 className="font-semibold mb-2">How to use:</h3>
                    <ol className="list-decimal list-inside space-y-1">
                        <li>Allow camera permissions when prompted</li>
                        <li>Click &quot;Capture Photo&quot; to take a picture</li>
                        <li>The image will automatically upload to R2</li>
                        <li>Use &quot;Retake Photo&quot; to capture again</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
