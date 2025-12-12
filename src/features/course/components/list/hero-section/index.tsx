import { IconBook, IconCertificate, IconShield } from "@tabler/icons-react";

import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";

interface CourseListHeroSectionProps {
    type: "atld" | "hoc-nghe";
    totalCourses?: number;
}

const CourseListHeroSection = ({ type, totalCourses }: CourseListHeroSectionProps) => {
    const { t } = useI18nTranslate();

    return (
        <div className="relative pb-20 pt-16 bg-slate-900">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="flex-1 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6 backdrop-blur-sm">
                            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                            {t("online_training_portal")}
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
                            {type === "atld" ? t("an_toan_lao_dong") : t("hoc_nghe")} <br />
                        </h1>

                        <p className="text-lg text-slate-300 max-w-2xl mb-8 leading-relaxed mx-auto md:mx-0">
                            {t("national_standard_training_system")}
                        </p>
                    </div>

                    <div className="w-full max-w-md">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition-colors">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                                    <IconBook size={24} />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg">
                                        {t("tong_so_nhom_dao_tao", {
                                            totalCourses,
                                        })}
                                    </h3>
                                    <p className="text-slate-400 text-sm">
                                        {t("standard_training_program")}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition-colors">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                    <IconCertificate size={24} />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg">
                                        {t("chung_chi")}
                                    </h3>
                                    <p className="text-slate-400 text-sm">
                                        {t("nationally_recognized")}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition-colors">
                                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                                    <IconShield size={24} />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg">
                                        {t("legislation")}
                                    </h3>
                                    <p className="text-slate-400 text-sm">
                                        {t("latest_decree_update")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseListHeroSection;
