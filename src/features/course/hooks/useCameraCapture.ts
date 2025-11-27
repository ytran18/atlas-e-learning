import { useEffect, useRef, useState } from "react";

import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";

export const useCameraCapture = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { t } = useI18nTranslate();

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

            setError(t("khong_the_truy_cap_camera_vui_long_cho_phep_truy_c"));
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

        // Chỉ cần width khoảng 640px (SD) là đủ để verify/log, không cần HD 1280px
        const MAX_WIDTH = 640;

        const scale = MAX_WIDTH / video.videoWidth;

        const targetWidth = MAX_WIDTH;

        const targetHeight = video.videoHeight * scale;

        // Set kích thước canvas nhỏ lại theo tỷ lệ
        canvas.width = targetWidth;

        canvas.height = targetHeight;

        // Vẽ ảnh đã resize lên canvas
        ctx.drawImage(video, 0, 0, targetWidth, targetHeight);

        // Giảm từ 0.8 xuống 0.6 (mắt thường khó phân biệt nhưng dung lượng giảm mạnh)
        const photoDataUrl = canvas.toDataURL("image/jpeg", 0.6);

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
