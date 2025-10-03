interface VideoPreviewProps {
    file: File | null;
    publicUrl?: string;
    onRemove?: () => void;
}

export const VideoPreview = ({ file, publicUrl, onRemove }: VideoPreviewProps) => {
    if (!file && !publicUrl) return null;

    const videoSrc = publicUrl || (file ? URL.createObjectURL(file) : "");

    return (
        <div className="video-preview">
            <video src={videoSrc} controls style={{ maxWidth: "100%", maxHeight: "400px" }} />

            {onRemove && (
                <button onClick={onRemove} type="button" className="remove-button">
                    Remove Video
                </button>
            )}

            {file && (
                <div className="video-info">
                    <p>File: {file.name}</p>
                    <p>Size: {(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    <p>Type: {file.type}</p>
                </div>
            )}
        </div>
    );
};
