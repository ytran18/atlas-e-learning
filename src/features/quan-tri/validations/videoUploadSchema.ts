import { z } from "zod";

export const videoUploadSchema = z
    .object({
        title: z
            .string()
            .min(1, "Tiêu đề video là bắt buộc")
            .min(3, "Tiêu đề video phải có ít nhất 3 ký tự")
            .max(100, "Tiêu đề video không được vượt quá 100 ký tự"),
        description: z
            .string()
            .min(1, "Mô tả video là bắt buộc")
            .min(10, "Mô tả video phải có ít nhất 10 ký tự")
            .max(500, "Mô tả video không được vượt quá 500 ký tự"),
        file: z.any().optional(),
        canSeek: z.boolean().default(true),
        shouldCompleteToPassed: z.boolean().default(true),
        url: z.string().url("URL video không hợp lệ").optional(),
        length: z.number().optional(),
        sortNo: z.number().optional(),
    })
    .refine(
        (data) => {
            // hợp lệ nếu có file (File hoặc string path), hoặc có URL
            const hasFile =
                data.file instanceof File
                    ? data.file.size > 0
                    : typeof data.file === "string" && data.file.trim().length > 0;
            const hasUrl = typeof data.url === "string" && data.url.trim().length > 0;
            return hasFile || hasUrl;
        },
        {
            message: "Vui lòng chọn file video hoặc nhập link video",
            path: ["file"], // hiển thị lỗi ở dòng file
        }
    );

export type VideoUploadFormData = {
    title: string;
    description: string;
    file: File | string;
    canSeek: boolean;
    shouldCompleteToPassed: boolean;
    url?: string;
    length?: number;
    sortNo?: number;
};
