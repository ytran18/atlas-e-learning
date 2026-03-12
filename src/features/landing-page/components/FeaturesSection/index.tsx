"use client";

import {
    IconAward,
    IconFileCheck,
    IconShieldCheck,
    IconUsersGroup,
    IconVideo,
} from "@tabler/icons-react";

import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";

const FeaturesSection = () => {
    const { t } = useI18nTranslate();

    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
            <div className="container max-w-6xl mx-auto px-4 relative z-10">
                <div className="text-center mb-16 md:mb-20">
                    <h2 className="font-heading text-4xl md:text-5xl font-extrabold mb-4 text-slate-900 tracking-tight text-balance">
                        {t("tai_sao_chon_chung_toi")}
                    </h2>
                    <p className="font-body text-base md:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed text-pretty">
                        {t("he_thong_dao_tao_toan_dien_voi_phuong_phap_hoc_tap")}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[auto]">
                    {/* Item 1 - Video Học Tập (Spans 2 columns) */}
                    <div className="md:col-span-2 relative bg-white rounded-3xl border border-slate-200/60 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden p-8 md:p-10 flex flex-col justify-start min-h-[260px]">
                        <div className="absolute inset-0 bg-linear-to-br from-blue-50 to-transparent pointer-events-none" />

                        {/* Decorative large icon in background */}
                        <div className="absolute right-[-2%] top-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
                            <IconVideo size={280} stroke={2} className="text-slate-900" />
                        </div>

                        <div className="relative z-10">
                            <div className="h-14 w-14 rounded-2xl bg-white shadow-xs border border-blue-100 flex items-center justify-center mb-6 text-blue-600">
                                <IconVideo className="h-7 w-7" stroke={1.5} />
                            </div>
                            <h3 className="font-heading text-2xl font-bold mb-3 text-slate-800">
                                {t("video_hoc_tap")}
                            </h3>
                            <p className="font-body text-slate-500 leading-relaxed max-w-md">
                                {t("hoc_qua_video_ly_thuyet_va_thuc_hanh_chi_tiet_de_h")}
                            </p>
                        </div>
                    </div>

                    {/* Item 2 - Kiểm tra đánh giá */}
                    <div className="md:col-span-1 relative bg-white rounded-3xl border border-slate-200/60 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden p-8 flex flex-col justify-start min-h-[260px]">
                        <div className="absolute inset-0 bg-linear-to-br from-orange-50 to-transparent pointer-events-none" />

                        <div className="relative z-10">
                            <div className="h-14 w-14 rounded-2xl bg-white shadow-xs border border-orange-100 flex items-center justify-center mb-6 text-orange-500">
                                <IconFileCheck className="h-7 w-7" stroke={1.5} />
                            </div>
                            <h3 className="font-heading text-xl font-bold mb-3 text-slate-800">
                                {t("kiem_tra_danh_gia")}
                            </h3>
                            <p className="font-body text-slate-500 leading-relaxed">
                                {t("bai_kiem_tra_sau_moi_khoa_hoc_de_danh_gia_kien_thu")}
                            </p>
                        </div>
                    </div>

                    {/* Item 3 - Chứng chỉ */}
                    <div className="md:col-span-1 relative bg-white rounded-3xl border border-slate-200/60 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden p-8 flex flex-col justify-start min-h-[260px]">
                        <div className="absolute inset-0 bg-linear-to-br from-emerald-50 to-transparent pointer-events-none" />

                        <div className="relative z-10">
                            <div className="h-14 w-14 rounded-2xl bg-white shadow-xs border border-emerald-100 flex items-center justify-center mb-6 text-emerald-600">
                                <IconAward className="h-7 w-7" stroke={1.5} />
                            </div>
                            <h3 className="font-heading text-xl font-bold mb-3 text-slate-800">
                                {t("chung_chi")}
                            </h3>
                            <p className="font-body text-slate-500 leading-relaxed">
                                {t("nhan_chung_chi_sau_khi_hoan_thanh_khoa_hoc_thanh_c")}
                            </p>
                        </div>
                    </div>

                    {/* Item 4 - 6 Nhóm ATLĐ */}
                    <div className="md:col-span-1 relative bg-white rounded-3xl border border-slate-200/60 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden p-8 flex flex-col justify-start min-h-[260px]">
                        <div className="absolute inset-0 bg-linear-to-br from-violet-50 to-transparent pointer-events-none" />

                        <div className="relative z-10">
                            <div className="h-14 w-14 rounded-2xl bg-white shadow-xs border border-violet-100 flex items-center justify-center mb-6 text-violet-600">
                                <IconShieldCheck className="h-7 w-7" stroke={1.5} />
                            </div>
                            <h3 className="font-heading text-xl font-bold mb-3 text-slate-800">
                                {t("6_nhom_atld")}
                            </h3>
                            <p className="font-body text-slate-500 leading-relaxed">
                                {t("dao_tao_day_du_6_nhom_an_toan_lao_dong_theo_quy_di")}
                            </p>
                        </div>
                    </div>

                    {/* Item 5 - Quản lý dễ dàng */}
                    <div className="md:col-span-1 relative bg-white rounded-3xl border border-slate-200/60 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden p-8 flex flex-col justify-start min-h-[260px]">
                        <div className="absolute inset-0 bg-linear-to-br from-pink-50 to-transparent pointer-events-none" />

                        <div className="relative z-10">
                            <div className="h-14 w-14 rounded-2xl bg-white shadow-xs border border-pink-100 flex items-center justify-center mb-6 text-pink-500">
                                <IconUsersGroup className="h-7 w-7" stroke={1.5} />
                            </div>
                            <h3 className="font-heading text-xl font-bold mb-3 text-slate-800">
                                {t("quan_ly_de_dang")}
                            </h3>
                            <p className="font-body text-slate-500 leading-relaxed">
                                {t("he_thong_quan_tri_tien_loi_cho_doanh_nghiep")}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
