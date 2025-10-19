import { useCallback, useEffect, useRef } from "react";

import { SectionType } from "@/types/api";

export interface SyncProgressProps {
    currentSection: SectionType;
    currentVideoIndex: number;
    currentTime: number;
    isPlaying: boolean;
    onUpdateProgress: (data: {
        section: SectionType;
        videoIndex: number;
        currentTime: number;
        isCompleted?: boolean;
    }) => void;
}

export const useSyncProgress = ({
    currentSection,
    currentVideoIndex,
    currentTime,
    isPlaying,
    onUpdateProgress,
}: SyncProgressProps) => {
    const localStorageIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const apiIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const lastApiSyncTimeRef = useRef<number>(0);

    // Lưu trữ các giá trị hiện tại trong ref để tránh re-render
    const currentSectionRef = useRef(currentSection);
    const currentVideoIndexRef = useRef(currentVideoIndex);
    const currentTimeRef = useRef(currentTime);
    const onUpdateProgressRef = useRef(onUpdateProgress);

    // Cập nhật refs khi props thay đổi
    currentSectionRef.current = currentSection;
    currentVideoIndexRef.current = currentVideoIndex;
    currentTimeRef.current = currentTime;
    onUpdateProgressRef.current = onUpdateProgress;

    // Lưu vào localStorage mỗi 10 giây
    const saveToLocalStorage = () => {
        localStorage.setItem("currentSection", currentSectionRef.current);
        localStorage.setItem("currentVideoIndex", currentVideoIndexRef.current?.toString() || "0");
        localStorage.setItem("currentTime", currentTimeRef.current?.toString() || "0");
        localStorage.setItem("lastSyncTime", Date.now().toString());
    };

    // Gọi API update progress
    const callUpdateProgressApi = () => {
        const now = Date.now();
        onUpdateProgressRef.current({
            section: currentSectionRef.current,
            videoIndex: currentVideoIndexRef.current,
            currentTime: currentTimeRef.current,
        });
        lastApiSyncTimeRef.current = now;
    };

    // Start timers khi video đang chạy
    const startSyncTimer = useCallback(() => {
        // Clear existing timers
        if (localStorageIntervalRef.current) {
            clearInterval(localStorageIntervalRef.current);
        }
        if (apiIntervalRef.current) {
            clearInterval(apiIntervalRef.current);
        }

        // Timer cho localStorage - mỗi 10 giây
        localStorageIntervalRef.current = setInterval(() => {
            saveToLocalStorage();
        }, 10000);

        // Timer cho API - mỗi 3 phút
        apiIntervalRef.current = setInterval(() => {
            const now = Date.now();
            // Chỉ gọi API nếu đã qua ít nhất 3 phút từ lần gọi cuối
            if (now - lastApiSyncTimeRef.current >= 180000) {
                callUpdateProgressApi();
            }
        }, 180000);
    }, []);

    // Dừng timers khi video pause và sync progress hiện tại
    const stopSyncTimer = useCallback(() => {
        // Clear timers
        if (localStorageIntervalRef.current) {
            clearInterval(localStorageIntervalRef.current);
            localStorageIntervalRef.current = null;
        }
        if (apiIntervalRef.current) {
            clearInterval(apiIntervalRef.current);
            apiIntervalRef.current = null;
        }

        // Lưu vào localStorage khi pause
        saveToLocalStorage();

        // Gọi API update progress khi pause
        callUpdateProgressApi();
    }, []);

    // Handle khi video kết thúc
    const handleVideoEnded = () => {
        // Dừng timers
        if (localStorageIntervalRef.current) {
            clearInterval(localStorageIntervalRef.current);
            localStorageIntervalRef.current = null;
        }
        if (apiIntervalRef.current) {
            clearInterval(apiIntervalRef.current);
            apiIntervalRef.current = null;
        }

        // Lưu vào localStorage với currentTime = 0
        localStorage.setItem("currentSection", currentSectionRef.current);
        localStorage.setItem("currentVideoIndex", currentVideoIndexRef.current?.toString() || "0");
        localStorage.setItem("currentTime", "0");
        localStorage.setItem("lastSyncTime", Date.now().toString());

        // Gọi API để mark video đã hoàn thành
        onUpdateProgressRef.current({
            section: currentSectionRef.current,
            videoIndex: currentVideoIndexRef.current,
            currentTime: 0,
            isCompleted: true,
        });
    };

    // Effect để start/stop timer dựa trên isPlaying
    useEffect(() => {
        if (isPlaying) {
            startSyncTimer();
        } else {
            stopSyncTimer();
        }

        return () => {
            stopSyncTimer();
        };
    }, [isPlaying, startSyncTimer, stopSyncTimer]);

    // Cleanup khi component unmount
    useEffect(() => {
        return () => {
            if (localStorageIntervalRef.current) {
                clearInterval(localStorageIntervalRef.current);
            }
            if (apiIntervalRef.current) {
                clearInterval(apiIntervalRef.current);
            }
        };
    }, []);

    return {
        handleVideoEnded,
        startSyncTimer,
        stopSyncTimer,
    };
};
