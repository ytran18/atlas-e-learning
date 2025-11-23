import mixpanel from "mixpanel-browser";

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

// Queue for pending identify calls
let pendingIdentifyQueue: string[] = [];
let isMixpanelInitialized = false;
let isMixpanelLoading = false;
let pollingInterval: NodeJS.Timeout | null = null;

// Check if Mixpanel is technically ready (has config and functions)
const isMixpanelTechnicallyReady = () => {
    return (
        typeof mixpanel !== "undefined" &&
        (mixpanel as any).config &&
        typeof mixpanel.track === "function" &&
        typeof mixpanel.identify === "function"
    );
};

// Check if Mixpanel is ready and initialized
const isMixpanelReady = () => {
    return isMixpanelInitialized && isMixpanelTechnicallyReady();
};

// Process pending identify calls
const processPendingIdentifies = () => {
    if (isMixpanelReady() && pendingIdentifyQueue.length > 0) {
        const userIds = [...pendingIdentifyQueue];
        pendingIdentifyQueue = [];

        userIds.forEach((userId) => {
            try {
                mixpanel.identify(userId);
                if (process.env.NODE_ENV === "development") {
                    console.log("[Mixpanel] Identified user from queue:", userId);
                }
            } catch (error) {
                console.warn("[Mixpanel] Failed to identify user from queue:", error);
            }
        });

        // Stop polling if queue is empty and Mixpanel is ready
        if (pendingIdentifyQueue.length === 0 && pollingInterval) {
            clearInterval(pollingInterval);
            pollingInterval = null;
        }
    }
};

// Start polling to check if Mixpanel becomes ready
const startPolling = () => {
    if (pollingInterval) {
        return; // Already polling
    }

    if (process.env.NODE_ENV === "development") {
        console.log("[Mixpanel] Starting polling for ready state");
    }

    pollingInterval = setInterval(() => {
        if (isMixpanelTechnicallyReady() && !isMixpanelInitialized) {
            if (process.env.NODE_ENV === "development") {
                console.log("[Mixpanel] Detected ready state via polling");
            }
            isMixpanelInitialized = true;
            localStorage.setItem("mixpanelLoaded", "true");
            processPendingIdentifies();
        } else if (isMixpanelReady() && pendingIdentifyQueue.length > 0) {
            processPendingIdentifies();
        } else if (isMixpanelInitialized && pendingIdentifyQueue.length === 0) {
            // Stop polling if everything is done
            if (pollingInterval) {
                clearInterval(pollingInterval);
                pollingInterval = null;
            }
        }
    }, 500); // Check every 500ms

    // Stop polling after 10 seconds max
    setTimeout(() => {
        if (pollingInterval) {
            clearInterval(pollingInterval);
            pollingInterval = null;
        }
    }, 10000);
};

export const dispatchTrackingEvent = (eventName: string, payload: any) => {
    // Send to Mixpanel
    try {
        if (isMixpanelReady()) {
            console.log("dispatching event", eventName, payload);

            mixpanel.track(eventName, {
                ...payload,
            });
        } else {
            console.warn("Mixpanel not ready yet for event:", eventName);
        }
    } catch (error) {
        console.warn("Mixpanel tracking failed:", error);
    }
};

export const identifyMixpanel = (unique_id: string) => {
    try {
        if (isMixpanelReady()) {
            mixpanel.identify(unique_id);
            if (process.env.NODE_ENV === "development") {
                console.log("[Mixpanel] User identified:", unique_id);
            }
        } else {
            // Queue the identify call for later
            if (!pendingIdentifyQueue.includes(unique_id)) {
                pendingIdentifyQueue.push(unique_id);
                if (process.env.NODE_ENV === "development") {
                    console.log("[Mixpanel] Queued identify call for:", unique_id);
                }
                // Start polling if not already started
                startPolling();
            }
        }
    } catch (error) {
        console.warn("Mixpanel identify failed:", error);
    }
};

export const initMixpanel = () => {
    if (!MIXPANEL_TOKEN) {
        console.warn("Mixpanel token is missing!");
        return;
    }

    // Check if already initialized in localStorage
    const wasLoadedBefore = localStorage.getItem("mixpanelLoaded");
    if (wasLoadedBefore) {
        // If Mixpanel was loaded before, check if it's actually ready now
        // Sometimes the flag is set but Mixpanel might not be ready yet
        if (isMixpanelTechnicallyReady()) {
            isMixpanelInitialized = true;
            if (process.env.NODE_ENV === "development") {
                console.log("[Mixpanel] Already initialized, processing pending identifies");
            }
            processPendingIdentifies();
            return;
        } else {
            // Flag exists but Mixpanel not ready - clear it and reinit
            if (process.env.NODE_ENV === "development") {
                console.log("[Mixpanel] Flag exists but not ready, reinitializing");
            }
            localStorage.removeItem("mixpanelLoaded");
        }
    }

    // If already initialized in this session, just process pending
    if (isMixpanelInitialized) {
        processPendingIdentifies();
        return;
    }

    // Prevent multiple initialization attempts
    if (isMixpanelLoading) {
        if (process.env.NODE_ENV === "development") {
            console.log("[Mixpanel] Already loading, skipping");
        }
        return;
    }

    isMixpanelLoading = true;

    if (process.env.NODE_ENV === "development") {
        console.log("[Mixpanel] Initializing...");
    }

    try {
        mixpanel.init(MIXPANEL_TOKEN, {
            autocapture: true,
            ignore_dnt: true,
            persistence: "localStorage",
            loaded: (mixpanelInstance) => {
                console.log("[Mixpanel] Loaded successfully", mixpanelInstance);
                localStorage.setItem("mixpanelLoaded", "true");
                isMixpanelInitialized = true;
                isMixpanelLoading = false;

                // Process any pending identify calls
                if (process.env.NODE_ENV === "development") {
                    console.log(
                        "[Mixpanel] Processing pending identifies:",
                        pendingIdentifyQueue.length
                    );
                }
                processPendingIdentifies();
            },
        });

        // Start polling to check if Mixpanel becomes ready
        // This handles cases where the loaded callback might not fire immediately
        startPolling();
    } catch (error) {
        console.error("[Mixpanel] Failed to initialize:", error);
        isMixpanelLoading = false;
    }
};
