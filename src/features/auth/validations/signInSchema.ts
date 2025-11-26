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

export const getSignInSchema = (t: (key: string) => string) =>
    z
        .object({
            cccd: z.string().min(1, t("vui_long_nhap_cccd_hoac_ho_chieu")),
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
                    message: t("vui_long_nhap_ngay_sinh_dinh_dang_ddmmyyyy"),
                }),
        })
        .superRefine((data, ctx) => {
            const cccdUpper = data.cccd.toUpperCase().trim();
            const isCCCD = /^\d{12}$/u.test(data.cccd);
            const isPassport = /^[A-Z0-9]{6,9}$/u.test(cccdUpper);

            if (!isCCCD && !isPassport) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: t("cccd_phai_la_12_so_hoac_ho_chieu_phai_tu_69_ky_tu_"),
                    path: ["cccd"],
                });
            }
        });

export type SignInFormData = z.infer<ReturnType<typeof getSignInSchema>>;
