"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { useSignUp } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import SignUpFormDatePicker from "../_components/SignUpFormDatePicker";
import SignUpFormField from "../_components/SignUpFormField";
import SignUpFormLayout from "../_components/SignUpFormLayout";

// Zod validation schema
const signUpSchema = z.object({
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

type SignUpFormData = z.infer<typeof signUpSchema>;

const SignUpForm = () => {
    const { isLoaded, signUp, setActive } = useSignUp();

    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
        mode: "onChange",
        defaultValues: {
            fullName: "",
            birthDate: null,
            cccd: "",
            companyName: "",
        },
    });

    const onSubmit = async (data: SignUpFormData) => {
        setError("");

        if (!isLoaded) {
            return;
        }

        // If validation passed, birthDate is guaranteed to be a Date
        if (!data.birthDate) {
            setError("Vui lòng chọn ngày sinh");
            return;
        }

        setIsLoading(true);

        try {
            // Format birthDate to YYYY-MM-DD
            const birthDateString = data.birthDate.toISOString().split("T")[0];

            // Use birthDate + CCCD as password for better security
            const password = `${birthDateString}_${data.cccd}`;

            // Create user with CCCD as username
            const result = await signUp.create({
                username: `CC${data.cccd}`, // Prefix with CC to avoid numeric username issue
                password: password, // Use birthDate + CCCD as password
                unsafeMetadata: {
                    fullName: data.fullName,
                    birthDate: birthDateString,
                    cccd: data.cccd,
                    companyName: data.companyName || "",
                },
            });

            console.log("Sign up result:", result);

            // Handle different status cases
            if (result.status === "complete") {
                // Sign up completed successfully
                await setActive({ session: result.createdSessionId });
                router.push("/home");
            } else if (result.status === "missing_requirements") {
                // Missing required fields - shouldn't happen with our validation
                setError("Thiếu thông tin bắt buộc. Vui lòng thử lại.");
            } else {
                // Other statuses (needs_verification, etc.)
                // Since we're using username-only auth, we should complete without verification
                console.warn("Unexpected sign up status:", result.status);

                // Try to set session anyway if we have one
                if (result.createdSessionId) {
                    await setActive({ session: result.createdSessionId });
                    router.push("/home");
                } else {
                    setError("Đăng ký không hoàn tất. Vui lòng thử lại hoặc liên hệ hỗ trợ.");
                }
            }
        } catch (err: unknown) {
            console.error("Sign up error:", err);
            if (err && typeof err === "object" && "errors" in err) {
                const errors = err.errors as Array<{ message: string; code?: string }>;

                if (errors?.[0]?.code === "form_identifier_exists") {
                    setError("CCCD này đã được đăng ký. Vui lòng đăng nhập.");
                } else {
                    setError(errors[0]?.message || "Đăng ký thất bại. Vui lòng thử lại.");
                }
            } else {
                setError("CCCD này đã được đăng ký. Vui lòng đăng nhập.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SignUpFormLayout
            title="Đăng ký tài khoản"
            subtitle="Tạo tài khoản để bắt đầu học tập"
            onSubmit={handleSubmit(onSubmit)}
            submitButtonText="Đăng ký"
            footerText="Đã có tài khoản?"
            footerLinkText="Đăng nhập ngay"
            footerLinkHref="/sign-in"
            isLoading={isLoading}
            error={error}
        >
            <SignUpFormField
                label="Họ và tên"
                name="fullName"
                placeholder="Nhập họ và tên"
                required
                register={register}
                error={errors.fullName?.message}
            />

            <SignUpFormDatePicker
                label="Ngày sinh"
                name="birthDate"
                placeholder="Chọn ngày sinh của bạn"
                required
                control={control}
                error={errors.birthDate?.message}
            />

            <SignUpFormField
                label="CCCD hoặc Hộ chiếu"
                name="cccd"
                type="text"
                placeholder="Nhập 12 số CCCD"
                required
                register={register}
                error={errors.cccd?.message}
            />

            <SignUpFormField
                label="Tên công ty"
                name="companyName"
                placeholder="Nhập tên công ty (không bắt buộc)"
                register={register}
                error={errors.companyName?.message}
            />

            {/* CAPTCHA element for bot protection */}
            <div id="clerk-captcha" />
        </SignUpFormLayout>
    );
};

export default SignUpForm;
