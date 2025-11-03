"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { useSignIn } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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

            // Use birthDate + CCCD as password for better security
            const password = `${birthDateString}_${data.cccd}`;

            // Sign in with CCCD as username and birthDate+CCCD as password
            const result = await signIn.create({
                identifier: `CC${data.cccd}`,
                password: password,
            });

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });

                router.push(navigationPaths.ATLD);
            }
        } catch (err: unknown) {
            console.error("Sign in error:", err);
            setError("CCCD hoặc ngày sinh không đúng. Vui lòng thử lại hoặc đăng ký mới.");
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
