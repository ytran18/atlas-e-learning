"use client";

import Webcam from "react-webcam";

interface CameraViewProps {
    webcamRef: React.RefObject<Webcam | null>;
    mirrored?: boolean;
}

export const CameraView = ({ webcamRef, mirrored = true }: CameraViewProps) => {
    return (
        <div className="camera-view relative w-full max-w-2xl mx-auto rounded-lg overflow-hidden bg-black">
            <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                    width: 1280,
                    height: 720,
                    facingMode: "user",
                }}
                mirrored={mirrored}
                className="w-full h-auto"
            />
        </div>
    );
};
