"use client";

import SignUpFormDatePicker from "../_components/SignUpFormDatePicker";
import SignUpFormField from "../_components/SignUpFormField";
import SignUpFormLayout from "../_components/SignUpFormLayout";
import { useSignUpForm } from "../hooks/useSignUpForm";

const SignUpPage = () => {
    const {
        form: {
            register,
            control,
            formState: { errors },
        },
        isLoading,
        error,
        onSubmit,
    } = useSignUpForm();

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

            <SignUpFormField
                label="CCCD hoặc Hộ chiếu"
                name="cccd"
                type="text"
                placeholder="Nhập 12 số CCCD"
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

            {/* CAPTCHA element for bot protection */}
            <div id="clerk-captcha" />
        </SignUpFormLayout>
    );
};

export default SignUpPage;
