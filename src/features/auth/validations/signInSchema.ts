import { z } from "zod";

export const signInSchema = z.object({
    cccd: z
        .string()
        .min(1, "Vui lòng nhập CCCD hoặc Hộ chiếu")
        .regex(/^\d{12}$/, "CCCD phải là 12 số"),
    birthDate: z.union([z.date(), z.null()]).refine((date) => date !== null && date !== undefined, {
        message: "Vui lòng chọn ngày sinh",
    }),
});

export type SignInFormData = z.infer<typeof signInSchema>;
