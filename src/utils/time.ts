export const secondsToMinutes = (seconds: number) => {
    return `${Math.floor(seconds / 60)} : ${seconds % 60}`;
};

export const secondsToHours = (seconds: number) => {
    return `${Math.floor(seconds / 3600)} giờ : ${Math.floor((seconds % 3600) / 60)} phút`;
};
