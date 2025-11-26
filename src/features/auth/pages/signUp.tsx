"use client";

import { useEffect, useRef } from "react";

import { Checkbox } from "@mantine/core";
import { Controller } from "react-hook-form";

import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";

import SignUpFormDatePicker from "../_components/SignUpFormDatePicker";
import SignUpFormField from "../_components/SignUpFormField";
import SignUpFormLayout from "../_components/SignUpFormLayout";
import { useSignUpForm } from "../hooks/useSignUpForm";

const SignUpPage = () => {
    const { t } = useI18nTranslate();

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
            title={t("dang_ky_tai_khoan")}
            subtitle={t("tao_tai_khoan_de_bat_dau_hoc_tap")}
            onSubmit={onSubmit}
            submitButtonText={t("dang_ky")}
            footerText={t("da_co_tai_khoan")}
            footerLinkText={t("dang_nhap_ngay")}
            footerLinkHref="/sign-in"
            isLoading={isLoading}
            error={error}
        >
            <SignUpFormField
                label={t("ho_va_ten")}
                name="fullName"
                placeholder={t("nhap_ho_va_ten")}
                required
                register={register}
                error={errors.fullName?.message}
            />

            <SignUpFormDatePicker
                label={t("ngay_sinh")}
                name="birthDate"
                placeholder={t("chon_ngay_sinh_cua_ban")}
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
                        label={t("toi_la_cong_dan_viet_nam")}
                        checked={field.value}
                        onChange={(event) => field.onChange(event.currentTarget.checked)}
                    />
                )}
            />

            <SignUpFormField
                label={isVietnamese ? "CCCD" : t("ho_chieu")}
                name="cccd"
                type="text"
                placeholder={isVietnamese ? t("nhap_so_cccd") : t("nhap_so_ho_chieu")}
                required
                register={register}
                error={errors.cccd?.message}
            />

            <SignUpFormField
                label={t("ten_cong_ty")}
                name="companyName"
                placeholder={t("nhap_ten_cong_ty_khong_bat_buoc")}
                register={register}
                error={errors.companyName?.message}
            />

            <SignUpFormField
                label={t("chuc_danh_cong_viec")}
                name="jobTitle"
                placeholder={t("nhap_chuc_danh_cong_viec")}
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
