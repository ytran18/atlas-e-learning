"use client";

import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";
import { navigationPaths } from "@/utils/navigationPaths";

import SignInFormDatePicker from "../_components/SignInFormDatePicker";
import SignInFormField from "../_components/SignInFormField";
import SignInFormLayout from "../_components/SignInFormLayout";
import { useSignInForm } from "../hooks/useSignInForm";

const SignInPage = () => {
    const { t } = useI18nTranslate();

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
            title={t("dang_nhap")}
            subtitle={t("nhap_thong_tin_de_truy_cap_khoa_hoc")}
            onSubmit={onSubmit}
            submitButtonText={t("dang_nhap")}
            footerText={t("chua_co_tai_khoan")}
            footerLinkText={t("dang_ky_ngay")}
            footerLinkHref={navigationPaths.SIGN_UP}
            isLoading={isLoading}
            error={error}
        >
            <SignInFormField
                label={t("cccd_hoac_ho_chieu")}
                name="cccd"
                type="text"
                placeholder={t("nhap_cccd_hoac_ho_chieu")}
                required
                register={register}
                error={errors.cccd?.message}
            />

            <SignInFormDatePicker
                label={t("ngay_sinh")}
                name="birthDate"
                placeholder={t("nhap_ngay_sinh_ddmmyyyy")}
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
