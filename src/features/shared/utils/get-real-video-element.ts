export const getRealVideoEl = (videoRef: React.RefObject<unknown>): HTMLVideoElement | null => {
    // ReactPlayer ref
    const container = videoRef.current as unknown as HTMLElement | null;
    if (!container) return null;

    // 1️⃣ Thử tìm video trực tiếp (ReactPlayer fallback)
    const directVideo = container.querySelector("video");
    if (directVideo) return directVideo;

    // 2️⃣ Nếu có media-controller bao quanh
    const mediaController =
        container.closest("media-controller") || document.querySelector("media-controller");

    if (mediaController) {
        // Tìm thẻ hls-video bên trong controller
        const hlsEl = mediaController.querySelector("hls-video");
        if (hlsEl && (hlsEl as any).shadowRoot) {
            const shadowVideo = (hlsEl as any).shadowRoot.querySelector("video");
            if (shadowVideo) return shadowVideo;
        }

        // Nếu không có hls-video, thử tìm video trực tiếp trong controller
        const fallbackVideo = mediaController.querySelector("video");
        if (fallbackVideo) return fallbackVideo;
    }

    // 3️⃣ Cuối cùng, thử tìm video ở toàn document (debug fallback)
    const globalVideo = document.querySelector("video");
    if (globalVideo) return globalVideo;

    console.warn("Không tìm thấy thẻ <video> thực trong ReactPlayer!");
    return null;
};
