import { useCallback, useEffect, useRef, useState } from "react";

import { useAuth } from "@clerk/nextjs";
import { Socket, io } from "socket.io-client";

import { FinalResult, ProgressData } from "../types/video";

interface UseVideoProgressReturn {
    progress: ProgressData | null;
    result: FinalResult | null;
    socket: Socket | null;
    isConnected: boolean;
    error: string | null;
}

export const useVideoProgress = (
    taskId: string | null,
    onComplete?: (result: FinalResult) => void
): UseVideoProgressReturn => {
    const { userId, getToken } = useAuth();

    const [progress, setProgress] = useState<ProgressData | null>(null);

    const [result, setResult] = useState<FinalResult | null>(null);

    const [socket, setSocket] = useState<Socket | null>(null);

    const [isConnected, setIsConnected] = useState(false);

    const [error, setError] = useState<string | null>(null);

    // Use ref to track completion state (doesn't cause re-renders)
    const isCompletedRef = useRef(false);
    const fetchFinalResultCalledRef = useRef(false);

    const fetchFinalResult = useCallback(
        async (taskId: string) => {
            // Prevent multiple calls if already called
            if (fetchFinalResultCalledRef.current) {
                console.log("fetchFinalResult already called, skipping...");
                return;
            }

            console.log("fetchFinalResult");
            fetchFinalResultCalledRef.current = true;

            try {
                const token = await getToken();

                if (!token) {
                    throw new Error("No authentication token available");
                }

                const response = await fetch(
                    `https://api.antoanlaodongso.com/api/video/result/${taskId}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (data.success) {
                    setResult(data.data);

                    // Call onComplete callback if provided
                    onComplete?.(data.data);
                } else {
                    console.error("Failed to fetch final result:", data.error);
                }
            } catch (error) {
                console.error("Failed to fetch final result:", error);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [getToken]
    );

    // Polling fallback when WebSocket is not available
    const startPollingFallback = useCallback(
        async (taskId: string) => {
            const pollInterval = setInterval(async () => {
                try {
                    const token = await getToken();

                    if (!token) {
                        return;
                    }

                    const response = await fetch(
                        `https://api.antoanlaodongso.com/api/video/progress/${taskId}`,
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    const data = await response.json();

                    if (data.success) {
                        const progressData = data.data;

                        setProgress(progressData);

                        // Stop polling if task is completed or failed
                        if (
                            progressData.status === "completed" ||
                            progressData.status === "failed"
                        ) {
                            clearInterval(pollInterval);

                            if (
                                progressData.status === "completed" &&
                                progressData.progress === 100 &&
                                !fetchFinalResultCalledRef.current
                            ) {
                                console.log("Polling final result...");
                                fetchFinalResult(taskId);
                            } else if (progressData.status === "failed") {
                                setError(progressData.error || "Task failed");
                            }
                        }
                    } else {
                        console.log("⚠️ API response not successful:", data);
                    }
                } catch (error) {
                    console.error("❌ Polling error:", error);
                }
            }, 2000); // Poll every 2 seconds

            // Store interval ID for cleanup
            return pollInterval;
        },
        [getToken, fetchFinalResult]
    );

    useEffect(() => {
        if (!taskId || !userId) return;

        // Reset refs for new task
        fetchFinalResultCalledRef.current = false;
        isCompletedRef.current = false;
        setProgress(null);
        setResult(null);
        setError(null);

        let pollInterval: NodeJS.Timeout | null = null;

        // Create WebSocket connection with proper protocol and fallback
        const newSocket = io("wss://api.antoanlaodongso.com", {
            path: "/socket.io",
            transports: ["websocket", "polling"], // Fallback to polling if websocket fails
            timeout: 10000, // 10 second timeout
            forceNew: true, // Force new connection
        });

        // Connection events
        newSocket.on("connect", () => {
            setIsConnected(true);
            setError(null);
        });

        newSocket.on("disconnect", () => {
            setIsConnected(false);
        });

        newSocket.on("connect_error", async (err) => {
            console.error("WebSocket connection error (expected - server not implemented):", err);
            setError(`WebSocket server not implemented yet. Using polling fallback instead.`);
            setIsConnected(false);

            // Fallback: Start polling for progress if WebSocket fails
            pollInterval = await startPollingFallback(taskId);
        });

        // Authentication
        newSocket.emit("authenticate", { userId });

        newSocket.on("authenticated", (data) => {
            if (data.success) {
                // Subscribe to task progress
                newSocket.emit("subscribe_task", { taskId, userId });
            }
        });

        // Progress tracking events
        newSocket.on("task_progress", (progressData: ProgressData) => {
            setProgress(progressData);

            // Auto-fetch result when completed (only if not already called)
            if (
                progressData.status === "completed" &&
                progressData.progress === 100 &&
                !fetchFinalResultCalledRef.current
            ) {
                console.log("fetchFinalResult after task_progress");
                fetchFinalResult(taskId);
            }
        });

        newSocket.on("task_failed", (progressData: ProgressData) => {
            setProgress(progressData);

            setError(progressData.error || "Task failed");
        });

        setSocket(newSocket);

        // Cleanup function
        return () => {
            if (newSocket) {
                newSocket.emit("unsubscribe_task", { taskId });
                newSocket.disconnect();
            }
            if (pollInterval) {
                clearInterval(pollInterval);
            }
        };
    }, [taskId, userId, fetchFinalResult, startPollingFallback]);

    return { progress, result, socket, isConnected, error };
};
