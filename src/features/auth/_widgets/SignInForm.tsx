"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { useSignIn } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import SignInFormDatePicker from "../_components/SignInFormDatePicker";
import SignInFormField from "../_components/SignInFormField";
import SignInFormLayout from "../_components/SignInFormLayout";

// Zod validation schema
const signInSchema = z.object({
    cccd: z
        .string()
        .min(1, "Vui lòng nhập CCCD hoặc Hộ chiếu")
        .regex(/^\d{12}$/, "CCCD phải là 12 số"),
    birthDate: z.union([z.date(), z.null()]).refine((date) => date !== null && date !== undefined, {
        message: "Vui lòng chọn ngày sinh",
    }),
});

type SignInFormData = z.infer<typeof signInSchema>;

const SignInForm = () => {
    const { isLoaded, signIn, setActive } = useSignIn();

    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema),
        mode: "onChange",
        defaultValues: {
            cccd: "",
            birthDate: null,
        },
    });

    const onSubmit = async (data: SignInFormData) => {
        setError("");

        if (!isLoaded) {
            return;
        }

        // If validation passed, birthDate is guaranteed to be a Date
        if (!data.birthDate) {
            console.log({ data });
            setError("Vui lòng chọn ngày sinh");
            return;
        }

        setIsLoading(true);

        try {
            // Format birthDate to YYYY/MM/DD
            const birthDateString = data.birthDate.toISOString().split("T")[0];

            // Use birthDate + CCCD as password for better security
            const password = `${birthDateString}_${data.cccd}`;

            // Sign in with CCCD as username and birthDate+CCCD as password
            const result = await signIn.create({
                identifier: `CC${data.cccd}`,
                password: password,
            });

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });
                router.push("/home");
            }
        } catch (err: unknown) {
            console.error("Sign in error:", err);
            setError("CCCD hoặc ngày sinh không đúng. Vui lòng thử lại hoặc đăng ký mới.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SignInFormLayout
            title="Đăng nhập"
            subtitle="Nhập thông tin để truy cập khóa học"
            onSubmit={handleSubmit(onSubmit)}
            submitButtonText="Đăng nhập"
            footerText="Chưa có tài khoản?"
            footerLinkText="Đăng ký ngay"
            footerLinkHref="/sign-up"
            isLoading={isLoading}
            error={error}
        >
            <SignInFormField
                label="CCCD hoặc Hộ chiếu"
                name="cccd"
                type="text"
                placeholder="Nhập 12 số CCCD"
                required
                register={register}
                error={errors.cccd?.message}
            />

            <SignInFormDatePicker
                label="Ngày sinh"
                name="birthDate"
                placeholder="Chọn ngày sinh của bạn"
                required
                control={control}
                error={errors.birthDate?.message}
            />

            {/* CAPTCHA element for bot protection */}
            <div id="clerk-captcha" />
        </SignInFormLayout>
    );
};

export default SignInForm;
