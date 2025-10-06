import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

// Create axios instance with default config
export const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "/",
    timeout: 300000, // 5 minutes for large file uploads
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor
axiosClient.interceptors.request.use(
    (config) => {
        // You can add auth tokens here if needed
        // const token = getAuthToken();
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`;
        // }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError) => {
        // Handle common errors
        if (error.response) {
            // Server responded with error status
            const status = error.response.status;

            switch (status) {
                case 401:
                    // Unauthorized - redirect to login
                    console.error("Unauthorized access");
                    break;
                case 403:
                    // Forbidden
                    console.error("Access forbidden");
                    break;
                case 404:
                    // Not found
                    console.error("Resource not found");
                    break;
                case 500:
                    // Server error
                    console.error("Internal server error");
                    break;
                default:
                    console.error(`Error ${status}:`, error.response.data);
            }
        } else if (error.request) {
            // Request was made but no response received
            console.error("No response from server");
        } else {
            // Something else happened
            console.error("Request error:", error.message);
        }

        return Promise.reject(error);
    }
);

// Helper function for file upload with progress
export const uploadFile = async (
    url: string,
    formData: FormData,
    onUploadProgress?: (progressEvent: { loaded: number; total: number; progress: number }) => void,
    config?: AxiosRequestConfig
) => {
    return axiosClient.post(url, formData, {
        ...config,
        headers: {
            "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
            if (onUploadProgress) {
                const total = progressEvent.total || 0;
                const loaded = progressEvent.loaded || 0;
                const progress = total > 0 ? (loaded / total) * 100 : 0;

                console.log("Upload progress:", {
                    loaded,
                    total,
                    progress: `${Math.round(progress)}%`,
                });

                onUploadProgress({
                    loaded,
                    total,
                    progress,
                });
            }
        },
    });
};

export default axiosClient;
