"use client";

import { useEffect, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextInput } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { CertificateFormData } from "../types";

const certificateFormSchema = z.object({
    studentName: z.string().min(1, "Tên sinh viên là bắt buộc"),
    courseName: z.string().min(1, "Tên khóa học là bắt buộc"),
    birthYear: z.string().min(4, "Năm sinh phải có ít nhất 4 ký tự"),
    certificateId: z.string().min(1),
});

interface CertificateFormProps {
    initialData?: Partial<CertificateFormData>;
    onSubmit: (data: CertificateFormData) => void;
    onSuccess?: () => void;
    isLoading?: boolean;
}

const CertificateForm = ({
    initialData,
    onSubmit,
    onSuccess,
    isLoading = false,
}: CertificateFormProps) => {
    const hasInitialized = useRef(false);

    const [showSuccess, setShowSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<CertificateFormData>({
        resolver: zodResolver(certificateFormSchema),
        defaultValues: {
            studentName: "",
            courseName: "",
            birthYear: "",
            certificateId: `CERT-${Date.now()}`,
        },
    });

    // Only reset form on initial mount, NOT on subsequent initialData changes
    useEffect(() => {
        if (initialData && !hasInitialized.current) {
            reset({
                studentName: initialData.studentName || "",
                courseName: initialData.courseName || "",
                birthYear: initialData.birthYear || "",
                certificateId: initialData.certificateId || `CERT-${Date.now()}`,
            });
            hasInitialized.current = true;
        }
    }, [initialData, reset]);

    const handleFormSubmit = (data: CertificateFormData) => {
        onSubmit(data);

        // Show success feedback
        setShowSuccess(true);

        setTimeout(() => setShowSuccess(false), 2000);

        onSuccess?.();
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="space-y-4">
                {/* Student Name */}
                <TextInput
                    label="Họ và Tên"
                    placeholder="Nhập họ và tên sinh viên"
                    {...register("studentName")}
                    error={errors.studentName?.message}
                    className="w-full"
                    classNames={{
                        label: "text-sm font-medium text-slate-900 mb-2",
                        input: "border-slate-300 focus:border-sky-700",
                    }}
                    required
                />

                {/* Course Name */}
                <TextInput
                    label="Tên Khóa Học"
                    placeholder="Nhập tên khóa học"
                    {...register("courseName")}
                    error={errors.courseName?.message}
                    className="w-full"
                    classNames={{
                        label: "text-sm font-medium text-slate-900 mb-2",
                        input: "border-slate-300 focus:border-sky-700",
                    }}
                    required
                />

                {/* Birth Year */}
                <TextInput
                    label="Năm Sinh"
                    placeholder="Nhập năm sinh"
                    {...register("birthYear")}
                    error={errors.birthYear?.message}
                    className="w-full"
                    classNames={{
                        label: "text-sm font-medium text-slate-900 mb-2",
                        input: "border-slate-300 focus:border-sky-700",
                    }}
                    required
                />

                {/* Certificate ID (read-only) */}
                <TextInput
                    label="Mã Chứng Chỉ"
                    placeholder="Mã tự động"
                    {...register("certificateId")}
                    className="w-full"
                    classNames={{
                        label: "text-sm font-medium text-slate-900 mb-2",
                        input: "border-slate-300 bg-slate-50",
                    }}
                    readOnly
                    disabled
                />
            </div>

            {/* Submit Button */}
            <Button
                type="submit"
                className={`w-full transition-all duration-300 ${
                    showSuccess ? "bg-green-600 hover:bg-green-700" : "bg-sky-700 hover:bg-sky-800"
                }`}
                size="md"
                loading={isLoading}
                leftSection={
                    showSuccess ? (
                        <IconCheck className="w-5 h-5 animate-in zoom-in duration-300" />
                    ) : null
                }
            >
                {showSuccess ? "Đã Cập Nhật!" : "Cập Nhật Thông Tin"}
            </Button>
        </form>
    );
};

export default CertificateForm;
