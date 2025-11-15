import { z } from "zod";

const parseDDMMYYYYToDate = (value: string): Date | null => {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const m = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!m) return null;
    const day = Number(m[1]);
    const month = Number(m[2]);
    const year = Number(m[3]);
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
        return null;
    }
    const min = new Date(1900, 0, 1);
    const max = new Date();
    if (date < min || date > max) return null;
    return date;
};

export const signUpSchema = z
    .object({
        fullName: z
            .string()
            .min(1, "Vui lòng nhập họ và tên")
            .min(3, "Họ và tên phải có ít nhất 3 ký tự")
            .regex(/^[\p{L}\s]+$/u, "Họ và tên chỉ được chứa chữ cái"),
        birthDate: z
            .preprocess(
                (val) => {
                    if (val instanceof Date) return val;
                    if (typeof val === "string") {
                        const parsed = parseDDMMYYYYToDate(val);
                        return parsed ?? null;
                    }
                    return null;
                },
                z.union([z.date(), z.null()])
            )
            .refine((date) => date !== null, {
                message: "Vui lòng nhập ngày sinh (định dạng dd/mm/yyyy)",
            }),
        isVietnamese: z.boolean(),
        cccd: z.string().min(1, "Vui lòng nhập CCCD hoặc Hộ chiếu"),
        companyName: z.string().optional(),
        jobTitle: z.string(),
    })
    .superRefine((data, ctx) => {
        if (data.isVietnamese) {
            // CCCD validation: 12 digits
            if (!/^\d{12}$/u.test(data.cccd)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "CCCD phải là 12 số",
                    path: ["cccd"],
                });
            }
        } else {
            // Passport validation: alphanumeric, 6-9 characters
            if (!/^[A-Z0-9]{6,9}$/u.test(data.cccd.toUpperCase())) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Số hộ chiếu phải từ 6-9 ký tự chữ và số",
                    path: ["cccd"],
                });
            }
        }
    });

export type SignUpFormData = z.infer<typeof signUpSchema>;
