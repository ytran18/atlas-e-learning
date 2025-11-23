"use client";

import { Input } from "@mantine/core";
import { FieldValues, UseFormRegister } from "react-hook-form";

interface SignInFormFieldProps<T extends FieldValues = FieldValues> {
    label: string;
    name: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    register: UseFormRegister<T>;
    error?: string;
}

function SignInFormField<T extends FieldValues = FieldValues>({
    label,
    name,
    type = "text",
    placeholder,
    required = false,
    register,
    error,
}: SignInFormFieldProps<T>) {
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={name} className="text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            <Input
                id={name}
                type={type}
                placeholder={placeholder}
                {...register(name as never)}
                error={!!error}
                styles={{
                    input: {
                        fontSize: "16px",
                    },
                }}
            />

            {error && <span className="text-sm text-red-500">{error}</span>}
        </div>
    );
}

export default SignInFormField;
