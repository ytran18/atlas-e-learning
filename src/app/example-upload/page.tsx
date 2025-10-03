"use client";

import { VideoUploader } from "@/features/videoUpload";

export default function ExampleUploadPage() {
    const handleUploadSuccess = (fileKey: string, publicUrl?: string) => {
        console.log("Upload thành công!");
        console.log("File Key:", fileKey);
        console.log("Public URL:", publicUrl);

        // TODO: Lưu fileKey và publicUrl vào database hoặc state management
    };

    const handleUploadError = (error: string) => {
        console.error("Upload thất bại:", error);
        alert(`Upload failed: ${error}`);
    };

    return (
        <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
            <h1>Video Upload Example</h1>

            <div style={{ marginTop: "2rem" }}>
                <h2>Auto Upload (default)</h2>
                <p>Video sẽ tự động upload ngay khi chọn file</p>
                <VideoUploader
                    onUploadSuccess={handleUploadSuccess}
                    onUploadError={handleUploadError}
                />
            </div>

            <div style={{ marginTop: "3rem" }}>
                <h2>Manual Upload</h2>
                <p>Chọn file trước, sau đó bấm nút Upload</p>
                <VideoUploader
                    onUploadSuccess={handleUploadSuccess}
                    onUploadError={handleUploadError}
                    autoUpload={false}
                />
            </div>

            <div style={{ marginTop: "3rem" }}>
                <h2>Custom Settings</h2>
                <p>Upload với giới hạn 100MB, chỉ accept mp4</p>
                <VideoUploader
                    onUploadSuccess={handleUploadSuccess}
                    onUploadError={handleUploadError}
                    maxSize={100}
                    accept="video/mp4"
                    contentType="lesson-video"
                />
            </div>
        </div>
    );
}
