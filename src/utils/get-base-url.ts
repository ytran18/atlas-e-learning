export const getBaseUrl = () => {
    let origin;
    if (typeof window !== "undefined") {
        origin = window.location.origin;
    }
    return origin;
};
