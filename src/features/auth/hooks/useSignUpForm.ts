"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { useSignUp } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { navigationPaths } from "@/utils/navigationPaths";

import { Role, authService } from "../services";
import { SignUpFormData, signUpSchema } from "../validations/signUpSchema";

// Raw form inputs: birthDate entered as string (dd/mm/yyyy) before zod preprocess
type SignUpFormInputs = {
    fullName: string;
    birthDate: unknown;
    isVietnamese: boolean;
    cccd: string;
    companyName?: string;
    jobTitle: string;
};

export const useSignUpForm = () => {
    const { isLoaded, signUp, setActive } = useSignUp();

    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const [error, setError] = useState("");

    const form = useForm<SignUpFormInputs, unknown, SignUpFormData>({
        resolver: zodResolver(signUpSchema),
        mode: "onChange",
        defaultValues: {
            fullName: "",
            birthDate: null,
            isVietnamese: true,
            cccd: "",
            companyName: "",
            jobTitle: "",
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
            // Format birthDate to YYYY-MM-DD using local date components to avoid
            // timezone shifts caused by toISOString() (which converts to UTC).
            const d = data.birthDate as Date;
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, "0");
            const dd = String(d.getDate()).padStart(2, "0");
            const birthDateString = `${yyyy}-${mm}-${dd}`;

            // Normalize CCCD/Passport: uppercase for passport, keep as is for CCCD
            const identifier = data.isVietnamese ? data.cccd : data.cccd.toUpperCase();

            // Use birthDate + identifier as password for better security
            const password = `${birthDateString}_${identifier}`;

            // Create user with identifier as username
            const result = await signUp.create({
                username: data.isVietnamese ? `CC${identifier}` : `PP${identifier}`, // Prefix with CC for CCCD, PP for Passport
                password: password, // Use birthDate + identifier as password
                unsafeMetadata: {
                    fullName: data.fullName,
                    birthDate: birthDateString,
                    cccd: identifier, // Store normalized identifier (CCCD or Passport)
                    companyName: data.companyName || "",
                    isVietnamese: data.isVietnamese,
                    jobTitle: data?.jobTitle ?? "",
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
                        cccd: identifier, // Store normalized identifier
                        companyName: data.companyName || "",
                        role: Role.USER,
                        jobTitle: data?.jobTitle ?? "",
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
                            cccd: identifier, // Store normalized identifier
                            companyName: data.companyName || "",
                            role: Role.USER,
                            jobTitle: data?.jobTitle ?? "",
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
                    setError(
                        data.isVietnamese
                            ? "CCCD này đã được đăng ký. Vui lòng đăng nhập."
                            : "Hộ chiếu này đã được đăng ký. Vui lòng đăng nhập."
                    );
                } else {
                    setError(errors[0]?.message || "Đăng ký thất bại. Vui lòng thử lại.");
                }
            } else {
                setError(
                    data.isVietnamese
                        ? "CCCD này đã được đăng ký. Vui lòng đăng nhập."
                        : "Hộ chiếu này đã được đăng ký. Vui lòng đăng nhập."
                );
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
