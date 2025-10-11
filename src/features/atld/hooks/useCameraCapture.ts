import { useEffect, useRef, useState } from "react";

export const useCameraCapture = () => {
    const videoRef = useRef<HTMLVideoElement>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [stream, setStream] = useState<MediaStream | null>(null);

    const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

    const [isCameraReady, setIsCameraReady] = useState(false);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        startCamera();

        return () => {
            stopCamera();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const startCamera = async () => {
        try {
            setIsCameraReady(false);

            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user", width: 1280, height: 720 },
                audio: false,
            });

            setStream(mediaStream);

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;

                videoRef.current.onloadedmetadata = () => {
                    setIsCameraReady(true);
                };
            }
            setError(null);
        } catch (err) {
            console.error("Error accessing camera:", err);

            setError(
                "Không thể truy cập camera. Vui lòng cho phép truy cập camera trong trình duyệt."
            );
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());

            setStream(null);
        }
    };

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;

        const canvas = canvasRef.current;

        canvas.width = video.videoWidth;

        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");

        if (!ctx) return;

        ctx.drawImage(video, 0, 0);

        const photoDataUrl = canvas.toDataURL("image/jpeg", 0.8);

        setCapturedPhoto(photoDataUrl);

        stopCamera();
    };

    const retakePhoto = () => {
        setCapturedPhoto(null);

        setIsCameraReady(false);

        startCamera();
    };

    const resetError = () => {
        setError(null);
    };

    return {
        videoRef,
        canvasRef,
        stream,
        capturedPhoto,
        isCameraReady,
        error,
        capturePhoto,
        retakePhoto,
        resetError,
    };
};
