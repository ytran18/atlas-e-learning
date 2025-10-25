import { z } from "zod";

export const videoUploadSchema = z.object({
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
    file: z
        .instanceof(File, { message: "Vui lòng chọn file video" })
        .refine((file) => file.size > 0, "File video không được để trống")
        .refine((file) => file.type.startsWith("video/"), "File phải là định dạng video")
        .refine(
            (file) => file.size <= 1000 * 1024 * 1024, // 1GB
            "Kích thước file không được vượt quá 1GB"
        ),
    canSeek: z.boolean().default(true),
    shouldCompleteToPassed: z.boolean().default(true),
    // These will be set after upload
    url: z.string().optional(),
    length: z.number().optional(),
    sortNo: z.number().optional(),
});

export type VideoUploadFormData = {
    title: string;
    description: string;
    file: File;
    canSeek: boolean;
    shouldCompleteToPassed: boolean;
    url?: string;
    length?: number;
    sortNo?: number;
};
