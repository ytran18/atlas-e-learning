"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { useSignUp } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { navigationPaths } from "@/utils/navigationPaths";

import { Role, authService } from "../services";
import { SignUpFormData, signUpSchema } from "../validations/signUpSchema";

export const useSignUpForm = () => {
    const { isLoaded, signUp, setActive } = useSignUp();

    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const [error, setError] = useState("");

    const form = useForm<SignUpFormData>({
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

            // Handle different status cases
            if (result.status === "complete") {
                // Sign up completed successfully
                await setActive({ session: result.createdSessionId });

                // Create user in Firestore
                try {
                    await authService.createUser({
                        userId: result.createdUserId!,
                        fullName: data.fullName,
                        birthDate: birthDateString,
                        cccd: data.cccd,
                        companyName: data.companyName || "",
                        role: Role.USER,
                    });
                } catch (firestoreError) {
                    console.error("Error creating user in Firestore:", firestoreError);
                }

                router.push(navigationPaths.LANDING_PAGE);
            } else if (result.status === "missing_requirements") {
                setError("Thiếu thông tin bắt buộc. Vui lòng thử lại.");
            } else {
                if (result.createdSessionId) {
                    await setActive({ session: result.createdSessionId });

                    // Create user in Firestore
                    try {
                        await authService.createUser({
                            userId: result.createdUserId!,
                            fullName: data.fullName,
                            birthDate: birthDateString,
                            cccd: data.cccd,
                            companyName: data.companyName || "",
                            role: Role.USER,
                        });
                    } catch (firestoreError) {
                        console.error("Error creating user in Firestore:", firestoreError);
                    }

                    router.push(navigationPaths.LANDING_PAGE);
                } else {
                    setError("Đăng ký không hoàn tất. Vui lòng thử lại hoặc liên hệ hỗ trợ.");
                }
            }
        } catch (err: unknown) {
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

    return {
        form,
        isLoading,
        error,
        onSubmit: form.handleSubmit(onSubmit),
    };
};
