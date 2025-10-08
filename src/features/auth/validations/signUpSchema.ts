import { z } from "zod";

export const signUpSchema = z.object({
    fullName: z
        .string()
        .min(1, "Vui lòng nhập họ và tên")
        .min(3, "Họ và tên phải có ít nhất 3 ký tự")
        .regex(/^[\p{L}\s]+$/u, "Họ và tên chỉ được chứa chữ cái"),
    birthDate: z.union([z.date(), z.null()]).refine((date) => date !== null && date !== undefined, {
        message: "Vui lòng chọn ngày sinh",
    }),
    cccd: z
        .string()
        .min(1, "Vui lòng nhập CCCD hoặc Hộ chiếu")
        .regex(/^\d{12}$/, "CCCD phải là 12 số"),
    companyName: z.string().optional(),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
