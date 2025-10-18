"use client";

import { DatePickerInput } from "@mantine/dates";
import { IconCalendar } from "@tabler/icons-react";
import "dayjs/locale/vi";
import { Control, Controller, FieldValues } from "react-hook-form";

interface SignInFormDatePickerProps<T extends FieldValues = FieldValues> {
    label: string;
    name: string;
    placeholder?: string;
    required?: boolean;
    control: Control<T>;
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
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={name} className="text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            <Controller
                name={name as never}
                control={control}
                render={({ field }) => {
                    // Ensure value is Date or null, not string
                    let dateValue: Date | null = null;
                    if (field.value) {
                        // Check if it's already a Date object
                        if (
                            typeof field.value === "object" &&
                            field.value !== null &&
                            "getTime" in field.value
                        ) {
                            dateValue = field.value as Date;
                        } else {
                            // Convert string to Date
                            dateValue = new Date(field.value as string);
                        }
                    }

                    return (
                        <DatePickerInput
                            id={name}
                            placeholder={placeholder || "Chọn ngày sinh"}
                            value={dateValue}
                            onChange={(val) => {
                                // val can be string, Date, or null depending on Mantine version
                                if (val === null) {
                                    field.onChange(null);
                                } else if (typeof val === "string") {
                                    // Convert ISO string to Date object
                                    field.onChange(new Date(val));
                                } else {
                                    // Already a Date object
                                    field.onChange(val);
                                }
                            }}
                            onBlur={field.onBlur}
                            clearable
                            leftSection={<IconCalendar size={18} stroke={1.5} />}
                            className="w-full"
                            styles={{
                                input: {
                                    padding: "10px 16px",
                                    paddingLeft: "40px",
                                    borderRadius: "8px",
                                    border: "1px solid #dee2e6",
                                    fontSize: "14px",
                                },
                            }}
                            maxDate={new Date()}
                            minDate={new Date(1900, 0, 1)}
                            defaultLevel="year"
                            yearsListFormat="YYYY"
                            locale="vi"
                            valueFormat="DD/MM/YYYY"
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
