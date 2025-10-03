"use client";

interface CapturedImagePreviewProps {
    imageSrc: string;
    onRemove?: () => void;
    publicUrl?: string;
}

export const CapturedImagePreview = ({
    imageSrc,
    onRemove,
    publicUrl,
}: CapturedImagePreviewProps) => {
    return (
        <div className="captured-image-preview w-full max-w-2xl mx-auto mt-4">
            <div className="relative rounded-lg overflow-hidden bg-black">
                <img src={publicUrl || imageSrc} alt="Captured" className="w-full h-auto" />
                {onRemove && (
                    <button
                        onClick={onRemove}
                        className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                        type="button"
                    >
                        Remove
                    </button>
                )}
            </div>
            {publicUrl && (
                <div className="mt-2 p-2 bg-green-100 text-green-800 rounded text-sm">
                    <p className="font-semibold">Upload Successful!</p>
                    <p className="text-xs break-all">{publicUrl}</p>
                </div>
            )}
        </div>
    );
};
