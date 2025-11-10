export const canvasToBlob = (canvas: HTMLCanvasElement, type = "image/png") =>
    new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type));
