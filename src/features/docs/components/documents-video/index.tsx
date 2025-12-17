import { useMemo, useRef } from "react";

import { Empty } from "antd";
import { SearchBox, useInstantSearch } from "react-instantsearch-hooks-web";

import Loader from "@/components/Loader";
import CustomPagination from "@/features/quan-tri/components/AdminUser/UserTable/CustomPagination";
import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";
import { trackDocumentSearched } from "@/libs/mixpanel/tracking";
import { DocumentResponse } from "@/types/documents";

import DocumentItem from "../document-item";

const DocumentsVideo = () => {
    const { t } = useI18nTranslate();

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const { results } = useInstantSearch();

    const data = results?.hits as DocumentResponse[];

    const isTableDataEmpty = results?.hits?.length === 0;

    const isShowPagination = results?.nbPages > 1;

    const queryHook = useMemo(() => {
        return (query: string, search: (value: string) => void) => {
            // Clear timeout cũ nếu có
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            // Nếu query rỗng, search ngay lập tức
            if (!query.trim()) {
                search("");
                return;
            }

            // Debounce search với 300ms
            timeoutRef.current = setTimeout(() => {
                trackDocumentSearched({ query, type: "video" });
                search(query);
            }, 300);
        };
    }, []);

    if (!results) {
        return (
            <div className="w-full">
                <Loader className="flex items-center w-full justify-center py-8" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-y-4">
            <SearchBox
                className="user-filter-search-box"
                placeholder={t("tim_kiem")}
                queryHook={queryHook}
            />

            {isTableDataEmpty && <Empty description={t("khong_co_du_lieu")} />}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.map((file) => {
                    return <DocumentItem doc={file} key={file.id} />;
                })}
            </div>

            {isShowPagination && (
                <div className="w-full">
                    <CustomPagination />
                </div>
            )}
        </div>
    );
};

export default DocumentsVideo;
