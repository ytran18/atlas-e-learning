"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Select } from "@mantine/core";
import { useInstantSearch } from "react-instantsearch-hooks-web";
import { Pagination } from "react-instantsearch-hooks-web";

type CustomPaginationProps = {
    onHitsPerPageChange?: (hitsPerPage: number) => void;
};

const CustomPagination = ({ onHitsPerPageChange }: CustomPaginationProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { results } = useInstantSearch();

    // Get current hitsPerPage from URL or use default from results
    const currentHitsPerPage = results?.hitsPerPage || 20;
    const currentPage = results?.page || 0; // Algolia uses 0-indexed pages
    const totalPages = results?.nbPages || 0;
    const totalHits = results?.nbHits || 0;

    // Options for hitsPerPage selector (max 50)
    const hitsPerPageOptions = [
        { value: "10", label: "10" },
        { value: "20", label: "20" },
        { value: "30", label: "30" },
        { value: "40", label: "40" },
        { value: "50", label: "50" },
    ];

    const handleHitsPerPageChange = (value: string | null) => {
        if (!value) return;

        const newHitsPerPage = parseInt(value, 10);
        if (onHitsPerPageChange) {
            onHitsPerPageChange(newHitsPerPage);
        }

        // Update URL params
        const params = new URLSearchParams(searchParams.toString());
        params.set("hitsPerPage", value);
        params.set("page", "1"); // Reset to first page when changing hitsPerPage
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Hiển thị:</span>
                <Select
                    value={currentHitsPerPage.toString()}
                    onChange={handleHitsPerPageChange}
                    data={hitsPerPageOptions}
                    w={80}
                    size="sm"
                />
                <span className="text-sm text-gray-600">bản ghi/trang</span>
            </div>

            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                    Trang {currentPage + 1} / {totalPages} ({totalHits} bản ghi)
                </span>
                <Pagination />
            </div>
        </div>
    );
};

export default CustomPagination;
