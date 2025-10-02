import mixpanel from 'mixpanel-browser'

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

const isMixpanelReady = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return typeof mixpanel !== 'undefined' && (mixpanel as any).config && typeof mixpanel.track === 'function';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const dispatchTrackingEvent = (eventName: string, payload: any) => {
    // Send to Mixpanel
    try {
        if (isMixpanelReady()) {
            console.log('dispatching event', eventName, payload);
            
            mixpanel.track(
                eventName,
                {
                    ...payload,
                },
            )
        } else {
            console.warn('Mixpanel not ready yet for event:', eventName);
        }
    } catch (error) {
        console.warn('Mixpanel tracking failed:', error);
    }
}

export const identifyMixpanel = (unique_id: string) => {
    try {
        if (isMixpanelReady()) {
            mixpanel.identify(unique_id)
        } else {
            console.warn('Mixpanel not ready yet for identify:', unique_id);
        }
    } catch (error) {
        console.warn('Mixpanel identify failed:', error);
    }
}

export const isMixpanelLoadedSuccess = () => {
    return isMixpanelReady();
}

export const initMixpanel = () => {
    if (!MIXPANEL_TOKEN) {
        console.warn('Mixpanel token is missing!');
        return;
    }

    // Check if already initialized
    if (localStorage.getItem('mixpanelLoaded')) {
        console.log('Mixpanel already initialized');
        return;
    }

    try {
        mixpanel.init(MIXPANEL_TOKEN, { 
            autocapture: true, 
            ignore_dnt: true,
            persistence: 'localStorage',
            loaded: (mixpanel) => {
                console.log('mixpanel loaded successfully', mixpanel);
                localStorage.setItem('mixpanelLoaded', 'true');
            }
        });
    } catch (error) {
        console.error('Failed to initialize Mixpanel:', error);
    }
}