# Axios Setup & Usage Guide

## 📦 Installation

Axios has been installed and configured for the project.

```bash
npm install axios
```

## 🔧 Configuration

### Axios Client (`src/libs/axios/axiosClient.ts`)

A pre-configured axios instance with interceptors:

```typescript
import { axiosClient, uploadFile } from "@/libs/axios";

// Default configuration:
// - baseURL: "/" (or NEXT_PUBLIC_API_BASE_URL from env)
// - timeout: 300000ms (5 minutes for large uploads)
// - Auto error handling in response interceptor
```

### Features

✅ **Request Interceptor**: Add auth tokens, modify headers
✅ **Response Interceptor**: Handle common errors (401, 403, 404, 500)
✅ **File Upload Helper**: Progress tracking support
✅ **TypeScript Support**: Full type safety

## 📝 Usage Examples

### Basic GET Request

```typescript
import { axiosClient } from "@/libs/axios";

const fetchData = async () => {
    const response = await axiosClient.get("/api/data");
    return response.data;
};
```

### POST Request

```typescript
import { axiosClient } from "@/libs/axios";

const createItem = async (data: Item) => {
    const response = await axiosClient.post("/api/items", data);
    return response.data;
};
```

### File Upload with Progress

```typescript
import { uploadFile } from "@/libs/axios";

const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await uploadFile("/api/upload", formData, (progressEvent) => {
        const percent = (progressEvent.loaded / progressEvent.total) * 100;
        console.log(`Upload: ${percent}%`);
    });

    return response.data;
};
```

### In React Hook (Current Implementation)

```typescript
// src/hooks/useVideoUpload.tsx
import { uploadFile } from "@/libs/axios/axiosClient";

const uploadVideo = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await uploadFile("/api/upload/video", formData, (progressEvent) => {
        const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        setUploadProgress({ progress: percent, status: "uploading" });
    });

    return response.data;
};
```

## 🔐 Adding Authentication

To add JWT token or authentication:

```typescript
// src/libs/axios/axiosClient.ts

// In request interceptor:
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
```

## 🎯 Error Handling

### Global Error Handling (Already Configured)

Axios interceptor handles:

- **401**: Unauthorized (can redirect to login)
- **403**: Forbidden access
- **404**: Resource not found
- **500**: Server error

### Custom Error Handling

```typescript
try {
    const response = await axiosClient.get("/api/data");
    return response.data;
} catch (error) {
    if (axios.isAxiosError(error)) {
        if (error.response) {
            // Server responded with error
            console.error("Error:", error.response.data);
        } else if (error.request) {
            // No response received
            console.error("No response from server");
        }
    }
}
```

## ⚙️ Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000  # Optional, defaults to "/"
```

## 🔄 Request/Response Flow

```
Client Request
     ↓
Request Interceptor (add token, headers)
     ↓
Axios sends request
     ↓
Response Interceptor (handle errors)
     ↓
Return data to component
```

## 📊 Upload Progress Tracking

The `uploadFile` helper function provides real-time progress:

```typescript
await uploadFile(url, formData, (progress) => {
    console.log(`${progress.loaded} of ${progress.total} bytes`);
    console.log(`${(progress.loaded / progress.total) * 100}%`);
});
```

## 🛠️ Customization

### Add Custom Headers

```typescript
const response = await axiosClient.post("/api/data", data, {
    headers: {
        "Custom-Header": "value",
    },
});
```

### Set Timeout for Specific Request

```typescript
const response = await axiosClient.get("/api/data", {
    timeout: 5000, // 5 seconds
});
```

### Cancel Request

```typescript
const controller = new AbortController();

const response = await axiosClient.get("/api/data", {
    signal: controller.signal,
});

// Cancel request
controller.abort();
```

## 📚 API Reference

### `axiosClient`

Main axios instance with interceptors.

```typescript
axiosClient.get(url, config?)
axiosClient.post(url, data?, config?)
axiosClient.put(url, data?, config?)
axiosClient.patch(url, data?, config?)
axiosClient.delete(url, config?)
```

### `uploadFile(url, formData, onProgress?, config?)`

Helper for file uploads with progress tracking.

**Parameters:**

- `url`: API endpoint
- `formData`: FormData with file
- `onProgress`: Callback for progress updates
- `config`: Optional axios config

**Returns:** Promise<AxiosResponse>

## 🐛 Common Issues

### CORS Errors

If you get CORS errors, ensure your API allows the origin:

- Check API CORS configuration
- Verify `Access-Control-Allow-Origin` headers

### Timeout Errors

For large files:

- Increase timeout in config
- Check server max request size
- Consider chunked uploads

### Progress Not Working

Ensure:

- Using `uploadFile` helper
- Callback function is provided
- Server sends proper Content-Length header

## 📖 Related Files

- `src/libs/axios/axiosClient.ts` - Axios configuration
- `src/libs/axios/index.ts` - Exports
- `src/hooks/useVideoUpload.tsx` - Example usage in hook
