"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { useSignIn } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { trackAuthError, trackUserSignedIn } from "@/libs/mixpanel";
import { navigationPaths } from "@/utils/navigationPaths";

import { SignInFormData, signInSchema } from "../validations/signInSchema";

// Raw form inputs: birthDate is entered as string in dd/mm/yyyy
type SignInFormInputs = {
    cccd: string;
    birthDate: unknown;
};

export const useSignInForm = () => {
    const { isLoaded, signIn, setActive } = useSignIn();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const form = useForm<SignInFormInputs, unknown, SignInFormData>({
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
            setError("Vui lòng chọn ngày sinh");
            return;
        }

        setIsLoading(true);

        try {
            // Format birthDate to YYYY/MM/DD using local date components to avoid
            // timezone shifts caused by toISOString() (which converts to UTC).
            const d = data.birthDate as Date;
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, "0");
            const dd = String(d.getDate()).padStart(2, "0");
            const birthDateString = `${yyyy}-${mm}-${dd}`;

            // Normalize identifier: uppercase for passport, keep as is for CCCD
            const identifier = /^\d{12}$/u.test(data.cccd) ? data.cccd : data.cccd.toUpperCase();
            const password = `${birthDateString}_${identifier}`;

            // Determine if it's CCCD (12 digits) or Passport (6-9 alphanumeric)
            const isCCCD = /^\d{12}$/u.test(data.cccd);
            const usernamePrefix = isCCCD ? "CC" : "PP";

            // Try signing in with the appropriate prefix first
            let result;

            try {
                result = await signIn.create({
                    identifier: `${usernamePrefix}${identifier}`,
                    password: password,
                });

                if (result.status === "complete") {
                    await setActive({ session: result.createdSessionId });

                    // Track successful sign-in
                    trackUserSignedIn({
                        user_id: result.id || "",
                        signin_method: isCCCD ? "cccd" : "passport",
                    });

                    router.push(navigationPaths.ATLD);
                    return;
                }
            } catch {
                // Will try alternative prefix below
            }

            // If failed, try with the alternative prefix (for backward compatibility)
            try {
                const altPrefix = isCCCD ? "PP" : "CC";
                result = await signIn.create({
                    identifier: `${altPrefix}${identifier}`,
                    password: password,
                });

                if (result.status === "complete") {
                    await setActive({ session: result.createdSessionId });

                    // Track successful sign-in (alternative prefix worked)
                    trackUserSignedIn({
                        user_id: result.id || "",
                        signin_method: !isCCCD ? "cccd" : "passport",
                    });

                    router.push(navigationPaths.ATLD);
                    return;
                }
            } catch {
                // Ignore alternative attempt error, use original error
            }

            // If both attempts failed, show error
            const errorMessage =
                "CCCD/Hộ chiếu hoặc ngày sinh không đúng. Vui lòng thử lại hoặc đăng ký mới.";
            setError(errorMessage);

            // Track sign-in error
            trackAuthError({
                error_type: "signin_failed",
                error_message: errorMessage,
                user_input: identifier,
            });
        } catch (err: unknown) {
            console.error("Sign in error:", err);
            const errorMessage =
                "CCCD/Hộ chiếu hoặc ngày sinh không đúng. Vui lòng thử lại hoặc đăng ký mới.";
            setError(errorMessage);

            // Track sign-in error
            trackAuthError({
                error_type: "signin_failed",
                error_message: errorMessage,
                user_input: data.cccd,
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
