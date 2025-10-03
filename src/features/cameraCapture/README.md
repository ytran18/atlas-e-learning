# Camera Capture Feature

This feature provides a complete camera capture and R2 upload solution using react-webcam.

## Architecture

Following the project's component architecture pattern:

- **\_components**: Presentation components (dumb, UI-focused)
- **\_widgets**: Composition components (smart, with business logic)

## Components

### Presentation Components (\_components)

#### CameraView

Displays the live webcam feed.

```tsx
<CameraView webcamRef={webcamRef} mirrored={true} />
```

#### CapturedImagePreview

Shows the captured image with optional remove button.

```tsx
<CapturedImagePreview imageSrc={capturedImage} onRemove={handleRemove} publicUrl={uploadedUrl} />
```

#### CameraCaptureButton

Button to trigger image capture.

```tsx
<CameraCaptureButton onCapture={handleCapture} disabled={isUploading}>
    Capture Photo
</CameraCaptureButton>
```

#### CameraUploadProgress

Shows upload progress, success, or error states.

```tsx
<CameraUploadProgress
    progress={uploadProgress.progress}
    status={uploadProgress.status}
    error={uploadProgress.error}
/>
```

### Composition Components (\_widgets)

#### CameraCapture

Main widget that orchestrates the camera capture and upload flow.

```tsx
<CameraCapture
    onUploadSuccess={(fileKey, publicUrl) => console.log("Success:", { fileKey, publicUrl })}
    onUploadError={(error) => console.error("Error:", error)}
    autoUpload={true}
    mirrored={true}
/>
```

**Props:**

- `onUploadSuccess?: (fileKey: string, publicUrl?: string) => void` - Callback when upload succeeds
- `onUploadError?: (error: string) => void` - Callback when upload fails
- `autoUpload?: boolean` - Auto upload after capture (default: true)
- `mirrored?: boolean` - Mirror the camera view (default: true)

## Hook

### useCameraCapture

Manages camera capture state and upload logic.

```tsx
const {
    capturedImage, // Base64 image data
    uploadProgress, // Upload progress state
    captureImage, // Capture image from camera
    uploadImage, // Upload captured image to R2
    clearCapture, // Clear captured image
    resetUpload, // Reset upload state
} = useCameraCapture();
```

**Returns:**

- `capturedImage: string | null` - Base64 encoded captured image
- `uploadProgress: CaptureProgress` - Upload progress information
- `captureImage: (imageSrc: string) => void` - Capture image function
- `uploadImage: () => Promise<CaptureResult>` - Upload image to R2
- `clearCapture: () => void` - Clear captured image
- `resetUpload: () => void` - Reset upload state

## Usage Example

### Basic Usage

```tsx
import { CameraCapture } from "@/features/cameraCapture";

export default function MyPage() {
    return (
        <CameraCapture
            onUploadSuccess={(fileKey, publicUrl) => {
                console.log("Uploaded:", { fileKey, publicUrl });
            }}
            autoUpload={true}
        />
    );
}
```

### Advanced Usage with Manual Upload

```tsx
import { CameraCapture } from "@/features/cameraCapture";

export default function MyPage() {
    const [result, setResult] = useState(null);

    return (
        <>
            <CameraCapture
                onUploadSuccess={(fileKey, publicUrl) => {
                    setResult({ fileKey, publicUrl });
                }}
                onUploadError={(error) => {
                    console.error("Upload failed:", error);
                }}
                autoUpload={false} // Manual upload
                mirrored={true}
            />
            {result && <div>Uploaded to: {result.publicUrl}</div>}
        </>
    );
}
```

## Test Route

A test page is available at `/camera-capture` to test the functionality.

## Image Upload Flow

1. User clicks "Capture Photo" button
2. Image is captured from webcam as base64 JPEG
3. Base64 is converted to Blob, then to File
4. File is uploaded to R2 via `/api/upload/direct` endpoint
5. Progress is tracked using XMLHttpRequest
6. On success, public URL is returned
7. Uploaded image is stored in R2 bucket under `image/YYYY-MM-DD/uniqueId.jpg`

## Requirements

- User must grant camera permissions
- Image is captured as JPEG format (1280x720)
- Upload uses the existing `/api/upload/direct` endpoint
- Images are validated against allowed MIME types in R2 config
- Maximum file size follows R2_CONFIG settings
