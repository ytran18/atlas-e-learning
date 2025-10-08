import axios from "axios";

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: "/api",
    timeout: 30000, // 30 seconds
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // You can add auth token here if needed
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
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle common errors
        if (error.response) {
            // Server responded with error status
            console.error("Response error:", error.response.data);
        } else if (error.request) {
            // Request was made but no response received
            console.error("No response received:", error.request);
        } else {
            // Something else happened
            console.error("Error:", error.message);
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;

