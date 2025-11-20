import { QueryClient } from "@tanstack/react-query";

const queryClientConfig = {
    defaultOptions: {
        queries: {
            // Thời gian cache data (5 phút)
            staleTime: 1000 * 60 * 5,
            // Retry khi request fail (3 lần)
            retry: 3,
            // Delay giữa các lần retry (exponential backoff)
            retryDelay: (attemptIndex: number) =>
                Math.min(1000 * 2 ** attemptIndex, 30000),
            // Tự động refetch khi window focus
            refetchOnWindowFocus: false,
            // Tự động refetch khi reconnect
            refetchOnReconnect: true,
            // Tự động refetch khi mount
            refetchOnMount: true,
        },
        mutations: {
            // Retry khi mutation fail (1 lần)
            retry: 1,
            // Delay giữa các lần retry
            retryDelay: 1000,
        },
    },
};

export const createQueryClient = () => {
    return new QueryClient(queryClientConfig);
};

