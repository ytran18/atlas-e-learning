import { RefObject } from "react";

import { IconLoader } from "@tabler/icons-react";

interface CameraPreviewProps {
    videoRef: RefObject<HTMLVideoElement | null>;
    isCameraReady: boolean;
}

export const CameraPreview = ({ videoRef, isCameraReady }: CameraPreviewProps) => {
    return (
        <>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
            />
            {/* Face Guide Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Oval Face Guide */}
                <div className="relative">
                    <svg className="w-36 h-44 sm:w-40 sm:h-48 animate-pulse" viewBox="0 0 160 200">
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop
                                    offset="0%"
                                    style={{
                                        stopColor: "#3b82f6",
                                        stopOpacity: 0.8,
                                    }}
                                />
                                <stop
                                    offset="100%"
                                    style={{
                                        stopColor: "#8b5cf6",
                                        stopOpacity: 0.8,
                                    }}
                                />
                            </linearGradient>
                        </defs>
                        <ellipse
                            cx="80"
                            cy="100"
                            rx="65"
                            ry="85"
                            fill="none"
                            stroke="url(#gradient)"
                            strokeWidth="3"
                            strokeDasharray="6 6"
                        />
                    </svg>
                    {!isCameraReady && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white/90 rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-2.5 shadow-lg max-w-[200px]">
                                <div className="flex flex-col sm:flex-row items-center gap-2">
                                    <IconLoader className="w-5 h-5 animate-spin text-blue-500" />
                                    <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">
                                        Đang khởi động camera...
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/* Corner Indicators */}
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 w-6 h-6 sm:w-8 sm:h-8 border-l-3 border-t-3 sm:border-l-4 sm:border-t-4 border-blue-400 rounded-tl-lg"></div>
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-6 h-6 sm:w-8 sm:h-8 border-r-3 border-t-3 sm:border-r-4 sm:border-t-4 border-blue-400 rounded-tr-lg"></div>
            <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 w-6 h-6 sm:w-8 sm:h-8 border-l-3 border-b-3 sm:border-l-4 sm:border-b-4 border-blue-400 rounded-bl-lg"></div>
            <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-6 h-6 sm:w-8 sm:h-8 border-r-3 border-b-3 sm:border-r-4 sm:border-b-4 border-blue-400 rounded-br-lg"></div>
        </>
    );
};
