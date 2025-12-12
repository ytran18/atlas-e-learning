"use client";

import { useState } from "react";

import { useSearchParams } from "next/navigation";

import { useClerk } from "@clerk/nextjs";
import { IconLayoutGrid, IconList } from "@tabler/icons-react";
import algoliasearch from "algoliasearch/lite";
import { Configure, InstantSearch } from "react-instantsearch-hooks-web";

import { useGetUserProgress } from "@/api/user/useGetUserProgress";
import CourseLoading from "@/features/course/components/list/course-loading";
import CourseListHeroSection from "@/features/course/components/list/hero-section";
import CourseListSection from "@/features/course/components/list/list-section";
import DocumentsFile from "@/features/docs/components/documents-file";
import DocumentsTabs from "@/features/docs/components/documents-tabs";
import DocumentsVideo from "@/features/docs/components/documents-video";
import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";

enum TabView {
    COURSES = "courses",
    DOCUMENTS = "documents",
}

const searchClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!
);

const AtldListPage = () => {
    const { user } = useClerk();

    const { t } = useI18nTranslate();

    const searchParams = useSearchParams();

    const [activeTab, setActiveTab] = useState<TabView>(TabView.COURSES);

    const currentTab = searchParams.get("tab") ?? "file";

    const indexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME_DOCUMENTS!;

    const { data: userProgress, isLoading: isLoadingUserProgress } = useGetUserProgress(
        user?.id || "",
        "atld"
    );

    if (!userProgress || isLoadingUserProgress) {
        return <CourseLoading />;
    }

    const hasAnyCourses =
        userProgress?.inProgress?.length > 0 ||
        userProgress?.notStarted?.length > 0 ||
        userProgress?.incomplete?.length > 0 ||
        userProgress?.completed?.length > 0;

    const totalCourses =
        userProgress?.inProgress?.length +
        userProgress?.notStarted?.length +
        userProgress?.incomplete?.length +
        userProgress?.completed?.length;

    return (
        <div className="h-[calc(100vh-70px)] bg-white">
            <CourseListHeroSection totalCourses={totalCourses} type="atld" />

            <main className="max-w-7xl mx-auto px-4 pb-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
                <div className="bg-white rounded-3xl shadow-xl border border-slate-200/60 p-6 md:p-8 min-h-[600px]">
                    <div className="flex justify-center mb-8">
                        <div className="bg-slate-100/80 p-1.5 rounded-xl inline-flex gap-1">
                            <button
                                onClick={() => setActiveTab(TabView.COURSES)}
                                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer
                            ${activeTab === TabView.COURSES ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                            >
                                <IconLayoutGrid size={18} />
                                {t("khoa_hoc")}
                            </button>
                            <button
                                onClick={() => setActiveTab(TabView.DOCUMENTS)}
                                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer
                            ${activeTab === TabView.DOCUMENTS ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                            >
                                <IconList size={18} />
                                {t("tai_lieu")}
                            </button>
                        </div>
                    </div>

                    {activeTab === TabView.COURSES ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {hasAnyCourses && (
                                <div className="mb-10 text-center">
                                    <h2 className="text-3xl font-semibold text-gray-900 mb-3 tracking-tight">
                                        {t("kham_pha_cac_khoa_hoc")}
                                    </h2>
                                    <p className="text-lg text-gray-600 font-normal">
                                        {t("chon_nhom_phu_hop_voi_cong_viec_cua_ban")}
                                    </p>
                                </div>
                            )}

                            <CourseListSection categorizedCourses={userProgress} />
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <InstantSearch searchClient={searchClient} indexName={indexName}>
                                <Configure
                                    filters={`type:"${currentTab}" AND category:"atld"`}
                                    facets={["type", "category"]}
                                    attributesToRetrieve={[
                                        "title",
                                        "type",
                                        "createdAt",
                                        "description",
                                        "id",
                                        "sortNo",
                                        "url",
                                        "category",
                                    ]}
                                    hitsPerPage={10}
                                />
                                <DocumentsTabs
                                    slots={{
                                        File: () => <DocumentsFile />,
                                        Video: () => <DocumentsVideo />,
                                    }}
                                />
                            </InstantSearch>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AtldListPage;
