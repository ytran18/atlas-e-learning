"use client";

import { Card } from "@mantine/core";
import {
    IconAward,
    IconBook,
    IconFileCheck,
    IconShield,
    IconUsers,
    IconVideo,
} from "@tabler/icons-react";

import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";

const FeaturesSection = () => {
    const { t } = useI18nTranslate();

    return (
        <section className="py-20 bg-linear-to-b from-(--primary)/10 to-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-(--mantine-color-dark-9)">
                        {t("tai_sao_chon_chung_toi")}
                    </h2>
                    <p className="text-(--mantine-color-dark-5) max-w-2xl mx-auto">
                        {t("he_thong_dao_tao_toan_dien_voi_phuong_phap_hoc_tap")}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <div className="h-12 w-12 rounded-lg bg-(--mantine-primary-color-1) flex items-center justify-center mb-4">
                            <IconVideo className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-(--mantine-color-dark-9)">
                            {t("video_hoc_tap")}
                        </h3>
                        <p className="text-(--mantine-color-dark-5)">
                            {t("hoc_qua_video_ly_thuyet_va_thuc_hanh_chi_tiet_de_h")}
                        </p>
                    </Card>

                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <div className="h-12 w-12 rounded-lg bg-(--mantine-primary-color-1) flex items-center justify-center mb-4">
                            <IconFileCheck className="h-6 w-6 text-accent" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-(--mantine-color-dark-9)">
                            {t("kiem_tra_danh_gia")}
                        </h3>
                        <p className="text-(--mantine-color-dark-5)">
                            {t("bai_kiem_tra_sau_moi_khoa_hoc_de_danh_gia_kien_thu")}
                        </p>
                    </Card>

                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <div className="h-12 w-12 rounded-lg bg-(--mantine-primary-color-1) flex items-center justify-center mb-4">
                            <IconAward className="h-6 w-6 text-success" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-(--mantine-color-dark-9)">
                            {t("chung_chi")}
                        </h3>
                        <p className="text-(--mantine-color-dark-5)">
                            {t("nhan_chung_chi_sau_khi_hoan_thanh_khoa_hoc_thanh_c")}
                        </p>
                    </Card>

                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <div className="h-12 w-12 rounded-lg bg-(--mantine-primary-color-1) flex items-center justify-center mb-4">
                            <IconShield className="h-6 w-6 text-warning" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-(--mantine-color-dark-9)">
                            {t("6_nhom_atld")}
                        </h3>
                        <p className="text-(--mantine-color-dark-5)">
                            {t("dao_tao_day_du_6_nhom_an_toan_lao_dong_theo_quy_di")}
                        </p>
                    </Card>

                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <div className="h-12 w-12 rounded-lg bg-(--mantine-primary-color-1) flex items-center justify-center mb-4">
                            <IconBook className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-(--mantine-color-dark-9)">
                            {t("hoc_nghe_1")}
                        </h3>
                        <p className="text-(--mantine-color-dark-5)">
                            {t("cac_khoa_hoc_nghe_nghiep_chuyen_sau_va_thuc_te")}
                        </p>
                    </Card>

                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <div className="h-12 w-12 rounded-lg bg-(--mantine-primary-color-1) flex items-center justify-center mb-4">
                            <IconUsers className="h-6 w-6 text-accent" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-(--mantine-color-dark-9)">
                            {t("quan_ly_de_dang")}
                        </h3>
                        <p className="text-(--mantine-color-dark-5)">
                            {t("he_thong_quan_tri_tien_loi_cho_doanh_nghiep")}
                        </p>
                    </Card>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
