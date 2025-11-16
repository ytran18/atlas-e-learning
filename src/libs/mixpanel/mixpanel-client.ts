import mixpanel from "mixpanel-browser";

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

// Queue for pending identify calls
let pendingIdentifyQueue: string[] = [];
let isMixpanelInitialized = false;
let isMixpanelLoading = false;

const isMixpanelReady = () => {
    return (
        isMixpanelInitialized &&
        typeof mixpanel !== "undefined" &&
        (mixpanel as any).config &&
        typeof mixpanel.track === "function" &&
        typeof mixpanel.identify === "function"
    );
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
    }
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
            }
        }
    } catch (error) {
        console.warn("Mixpanel identify failed:", error);
    }
};

export const isMixpanelLoadedSuccess = () => {
    return isMixpanelReady();
};

export const initMixpanel = () => {
    if (!MIXPANEL_TOKEN) {
        console.warn("Mixpanel token is missing!");
        return;
    }

    // Check if already initialized
    if (isMixpanelInitialized || localStorage.getItem("mixpanelLoaded")) {
        if (localStorage.getItem("mixpanelLoaded")) {
            isMixpanelInitialized = true;
            processPendingIdentifies();
        }
        return;
    }

    // Prevent multiple initialization attempts
    if (isMixpanelLoading) {
        return;
    }

    isMixpanelLoading = true;

    try {
        mixpanel.init(MIXPANEL_TOKEN, {
            autocapture: true,
            ignore_dnt: true,
            persistence: "localStorage",
            loaded: (mixpanelInstance) => {
                console.log("mixpanel loaded successfully", mixpanelInstance);
                localStorage.setItem("mixpanelLoaded", "true");
                isMixpanelInitialized = true;
                isMixpanelLoading = false;

                // Process any pending identify calls
                processPendingIdentifies();
            },
        });
    } catch (error) {
        console.error("Failed to initialize Mixpanel:", error);
        isMixpanelLoading = false;
    }
};
