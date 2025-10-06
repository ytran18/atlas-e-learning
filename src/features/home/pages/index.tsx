"use client";

import { useState } from "react";

import { VideoUploader } from "@/features/videoUpload";

const HomaePage = () => {
    const [uploadResults, setUploadResults] = useState<
        Array<{ fileKey: string; publicUrl?: string; uploadId?: string }>
    >([]);

    const handleUploadSuccess = (fileKey: string, publicUrl?: string, uploadId?: string) => {
        console.log("Upload success:", { fileKey, publicUrl, uploadId });
        setUploadResults((prev) => [...prev, { fileKey, publicUrl, uploadId }]);
    };

    const handleUploadError = (error: string) => {
        console.error("Upload error:", error);
        alert(`Upload failed: ${error}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                        🎬 Progressive Video Upload Demo
                    </h1>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Description Section */}
                <div className="mb-8 bg-white rounded-lg shadow-sm p-6 border">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        📋 Luồng Upload Video (Progressive Streaming)
                    </h2>
                    <ol className="space-y-2 text-sm text-gray-700 mb-4">
                        <li className="flex items-start">
                            <span className="font-bold text-blue-600 mr-2">1.</span>
                            <span>
                                Người dùng upload file video (<code>.mp4</code>, <code>.webm</code>,
                                etc.)
                            </span>
                        </li>
                        <li className="flex items-start">
                            <span className="font-bold text-blue-600 mr-2">2.</span>
                            <span>
                                Next.js API (<code>/api/upload/video</code>) nhận file
                            </span>
                        </li>
                        <li className="flex items-start">
                            <span className="font-bold text-blue-600 mr-2">3.</span>
                            <span>Upload video gốc lên Cloudflare R2</span>
                        </li>
                        <li className="flex items-start">
                            <span className="font-bold text-blue-600 mr-2">4.</span>
                            <span>Trả về public URL của video</span>
                        </li>
                        <li className="flex items-start">
                            <span className="font-bold text-blue-600 mr-2">5.</span>
                            <span>
                                Client phát video với <strong>Progressive Loading</strong> (HTTP
                                Range Requests)
                            </span>
                        </li>
                    </ol>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-blue-800 mb-2">
                            ✨ Progressive Streaming Benefits:
                        </h3>
                        <ul className="text-xs text-blue-700 space-y-1">
                            <li>✅ Video bắt đầu phát ngay, không cần download hết</li>
                            <li>✅ Load từng phần nhỏ theo nhu cầu (Range Requests)</li>
                            <li>✅ Tiết kiệm bandwidth - chỉ tải phần đang xem</li>
                            <li>✅ Hoàn toàn miễn phí - không cần HLS conversion</li>
                            <li>✅ Tương thích mọi browser hiện đại</li>
                        </ul>
                    </div>
                </div>

                {/* Upload Section */}
                <div className="bg-white rounded-lg shadow-sm p-6 border mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">📤 Upload Video</h2>
                    <VideoUploader
                        onUploadSuccess={handleUploadSuccess}
                        onUploadError={handleUploadError}
                        contentType="demo-videos"
                        maxSize={500}
                        accept="video/mp4,video/webm,video/ogg"
                        autoUpload={true}
                    />
                </div>

                {/* Upload History */}
                {uploadResults.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm p-6 border">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            📚 Upload History
                        </h2>
                        <div className="space-y-3">
                            {uploadResults.map((result, index) => (
                                <div
                                    key={result.uploadId || index}
                                    className="bg-gray-50 rounded-lg p-4 border"
                                >
                                    <p className="text-sm text-gray-600 mb-1">
                                        <span className="font-semibold">Upload ID:</span>{" "}
                                        {result.uploadId}
                                    </p>
                                    <p className="text-sm text-gray-600 mb-1">
                                        <span className="font-semibold">File Key:</span>{" "}
                                        {result.fileKey}
                                    </p>
                                    {result.publicUrl && (
                                        <p className="text-xs text-gray-500 break-all">
                                            <span className="font-semibold">URL:</span>{" "}
                                            <a
                                                href={result.publicUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                {result.publicUrl}
                                            </a>
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default HomaePage;
