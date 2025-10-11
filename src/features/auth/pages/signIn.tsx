"use client";

import { navigationPaths } from "@/utils/navigationPaths";

import SignInFormDatePicker from "../_components/SignInFormDatePicker";
import SignInFormField from "../_components/SignInFormField";
import SignInFormLayout from "../_components/SignInFormLayout";
import { useSignInForm } from "../hooks/useSignInForm";

const SignInPage = () => {
    const {
        form: {
            register,
            control,
            formState: { errors },
        },
        isLoading,
        error,
        onSubmit,
    } = useSignInForm();

    return (
        <SignInFormLayout
            title="Đăng nhập"
            subtitle="Nhập thông tin để truy cập khóa học"
            onSubmit={onSubmit}
            submitButtonText="Đăng nhập"
            footerText="Chưa có tài khoản?"
            footerLinkText="Đăng ký ngay"
            footerLinkHref={navigationPaths.SIGN_UP}
            isLoading={isLoading}
            error={error}
        >
            <SignInFormField
                label="CCCD hoặc Hộ chiếu"
                name="cccd"
                type="text"
                placeholder="Nhập 12 số CCCD"
                required
                register={register}
                error={errors.cccd?.message}
            />

            <SignInFormDatePicker
                label="Ngày sinh"
                name="birthDate"
                placeholder="Chọn ngày sinh của bạn"
                required
                control={control}
                error={errors.birthDate?.message}
            />

            {/* CAPTCHA element for bot protection */}
            <div id="clerk-captcha" />
        </SignInFormLayout>
    );
};

export default SignInPage;
