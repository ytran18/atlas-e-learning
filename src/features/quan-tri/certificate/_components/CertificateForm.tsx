"use client";

import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextInput } from "@mantine/core";
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
    isLoading?: boolean;
}

const CertificateForm = ({ initialData, onSubmit, isLoading = false }: CertificateFormProps) => {
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

    // Update form when initial data changes
    useEffect(() => {
        if (initialData) {
            reset({
                studentName: initialData.studentName || "",
                courseName: initialData.courseName || "",
                birthYear: initialData.birthYear || "",
                certificateId: initialData.certificateId || `CERT-${Date.now()}`,
            });
        }
    }, [initialData, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                className="w-full bg-sky-700 hover:bg-sky-800"
                size="md"
                loading={isLoading}
            >
                Tạo Chứng Chỉ
            </Button>
        </form>
    );
};

export default CertificateForm;
