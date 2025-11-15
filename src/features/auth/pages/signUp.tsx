"use client";

import { useEffect, useRef } from "react";

import { Checkbox } from "@mantine/core";
import { Controller } from "react-hook-form";

import SignUpFormDatePicker from "../_components/SignUpFormDatePicker";
import SignUpFormField from "../_components/SignUpFormField";
import SignUpFormLayout from "../_components/SignUpFormLayout";
import { useSignUpForm } from "../hooks/useSignUpForm";

const SignUpPage = () => {
    const {
        form: {
            register,
            control,
            watch,
            setValue,
            formState: { errors },
        },
        isLoading,
        error,
        onSubmit,
    } = useSignUpForm();

    const isVietnamese = watch("isVietnamese");
    const prevIsVietnameseRef = useRef(isVietnamese);

    // Clear CCCD/Passport field when switching between Vietnamese and Foreigner
    useEffect(() => {
        if (prevIsVietnameseRef.current !== isVietnamese) {
            setValue("cccd", "");
            prevIsVietnameseRef.current = isVietnamese;
        }
    }, [isVietnamese, setValue]);

    return (
        <SignUpFormLayout
            title="Đăng ký tài khoản"
            subtitle="Tạo tài khoản để bắt đầu học tập"
            onSubmit={onSubmit}
            submitButtonText="Đăng ký"
            footerText="Đã có tài khoản?"
            footerLinkText="Đăng nhập ngay"
            footerLinkHref="/sign-in"
            isLoading={isLoading}
            error={error}
        >
            <SignUpFormField
                label="Họ và tên"
                name="fullName"
                placeholder="Nhập họ và tên"
                required
                register={register}
                error={errors.fullName?.message}
            />

            <SignUpFormDatePicker
                label="Ngày sinh"
                name="birthDate"
                placeholder="Chọn ngày sinh của bạn"
                required
                control={control}
                error={errors.birthDate?.message}
            />

            <Controller
                name="isVietnamese"
                control={control}
                defaultValue={true}
                render={({ field }) => (
                    <Checkbox
                        label="Tôi là công dân Việt Nam"
                        checked={field.value}
                        onChange={(event) => field.onChange(event.currentTarget.checked)}
                    />
                )}
            />

            <SignUpFormField
                label={isVietnamese ? "CCCD" : "Hộ chiếu"}
                name="cccd"
                type="text"
                placeholder={isVietnamese ? "Nhập số CCCD" : "Nhập số hộ chiếu"}
                required
                register={register}
                error={errors.cccd?.message}
            />

            <SignUpFormField
                label="Tên công ty"
                name="companyName"
                placeholder="Nhập tên công ty (không bắt buộc)"
                register={register}
                error={errors.companyName?.message}
            />

            <SignUpFormField
                label="Chức danh công việc"
                name="jobTitle"
                placeholder="Nhập chức danh công việc"
                register={register}
                required
                error={errors.jobTitle?.message}
            />

            {/* CAPTCHA element for bot protection */}
            <div id="clerk-captcha" />
        </SignUpFormLayout>
    );
};

export default SignUpPage;
