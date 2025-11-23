"use client";

import { Input } from "@mantine/core";
import { IconCalendar } from "@tabler/icons-react";
import "dayjs/locale/vi";
import { Control, Controller, FieldValues } from "react-hook-form";

interface SignInFormDatePickerProps<T extends FieldValues = FieldValues> {
    label: string;
    name: string;
    placeholder?: string;
    required?: boolean;
    control: Control<T, any>;
    error?: string;
}

function SignInFormDatePicker<T extends FieldValues = FieldValues>({
    label,
    name,
    placeholder,
    required = false,
    control,
    error,
}: SignInFormDatePickerProps<T>) {
    // Auto-format numeric input to DD/MM/YYYY as user types
    const formatToDDMMYYYY = (value: string) => {
        const digits = value.replace(/\D/g, "").slice(0, 8); // max 8 digits
        const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean);
        return parts.join("/");
    };

    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={name} className="text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            <Controller
                name={name as never}
                control={control}
                render={({ field }) => {
                    // Derive display value: prefer string, else format Date to dd/mm/yyyy
                    let stringValue = "";
                    const v = field.value as unknown;
                    if (typeof v === "string") {
                        stringValue = v;
                    } else if (v && typeof v === "object" && "getTime" in (v as Date)) {
                        const d = v as Date;
                        const dd = String(d.getDate()).padStart(2, "0");
                        const mm = String(d.getMonth() + 1).padStart(2, "0");
                        const yyyy = d.getFullYear();
                        stringValue = `${dd}/${mm}/${yyyy}`;
                    }

                    return (
                        <Input
                            id={name}
                            placeholder={placeholder || "Nhập ngày sinh (dd/mm/yyyy)"}
                            value={stringValue}
                            onChange={(e) => {
                                const formatted = formatToDDMMYYYY(e.currentTarget.value);
                                field.onChange(formatted);
                            }}
                            onBlur={field.onBlur}
                            inputMode="numeric"
                            leftSection={<IconCalendar size={18} stroke={1.5} />}
                            className="w-full"
                            styles={{
                                input: {
                                    padding: "10px 16px",
                                    paddingLeft: "40px",
                                    borderRadius: "8px",
                                    border: "1px solid #dee2e6",
                                    fontSize: "16px",
                                },
                            }}
                            maxLength={10}
                            pattern="\d{2}/\d{2}/\d{4}"
                            error={!!error}
                        />
                    );
                }}
            />
            {error && <span className="text-sm text-red-500">{error}</span>}
        </div>
    );
}

export default SignInFormDatePicker;
