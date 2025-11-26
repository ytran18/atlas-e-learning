"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { useSignUp } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";
import { trackAuthError, trackUserSignedUp } from "@/libs/mixpanel";
import { navigationPaths } from "@/utils/navigationPaths";

import { Role, authService } from "../services";
import { SignUpFormData, getSignUpSchema } from "../validations/signUpSchema";

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

    const { t } = useI18nTranslate();

    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const [error, setError] = useState("");

    const form = useForm<SignUpFormInputs, unknown, SignUpFormData>({
        resolver: zodResolver(getSignUpSchema(t)),
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
            setError(t("vui_long_chon_ngay_sinh"));

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

                // Track successful sign-up
                trackUserSignedUp({
                    user_id: result.createdUserId!,
                    full_name: data.fullName,
                    is_vietnamese: data.isVietnamese,
                    has_company: !!data.companyName,
                    signup_method: data.isVietnamese ? "cccd" : "passport",
                });

                router.push(navigationPaths.LANDING_PAGE);
            } else if (result.status === "missing_requirements") {
                setError(t("thieu_thong_tin_bat_buoc_vui_long_thu_lai"));
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
                    setError(t("dang_ky_khong_hoan_tat_vui_long_thu_lai_hoac_lien_"));
                }
            }
        } catch (err: unknown) {
            let errorMessage = "";
            // let errorCode = "";

            if (err && typeof err === "object" && "errors" in err) {
                const errors = err.errors as Array<{ message: string; code?: string }>;

                if (errors?.[0]?.code === "form_identifier_exists") {
                    errorMessage = data.isVietnamese
                        ? t("cccd_nay_da_duoc_dang_ky_vui_long_dang_nhap")
                        : t("ho_chieu_nay_da_duoc_dang_ky_vui_long_dang_nhap");
                    // errorCode = "form_identifier_exists";
                } else {
                    errorMessage = errors[0]?.message || t("dang_ky_that_bai_vui_long_thu_lai");
                    // errorCode = errors[0]?.code || "unknown";
                }
            } else {
                errorMessage = data.isVietnamese
                    ? t("cccd_nay_da_duoc_dang_ky_vui_long_dang_nhap")
                    : t("ho_chieu_nay_da_duoc_dang_ky_vui_long_dang_nhap");
                // errorCode = "unknown";
            }

            setError(errorMessage);

            // Track sign-up error
            trackAuthError({
                error_type: "signup_failed",
                error_message: errorMessage,
                user_input: data.cccd ? `${data.cccd.substring(0, 3)}***` : undefined,
            });
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
