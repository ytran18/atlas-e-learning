import { CameraPreview as SharedCameraPreview } from "@/features/shared";

interface CameraPreviewProps {
    videoRef: React.RefObject<HTMLVideoElement | null>;
    isCameraReady: boolean;
}

export const CameraPreview = ({ videoRef, isCameraReady }: CameraPreviewProps) => {
    return (
        <SharedCameraPreview
            videoRef={videoRef}
            isCameraReady={isCameraReady}
            courseType="hoc-nghe"
        />
    );
};
