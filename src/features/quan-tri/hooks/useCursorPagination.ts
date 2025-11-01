import { useEffect, useState } from "react";

export function useCursorPagination(groupId?: string) {
    const storageKey = groupId ? `pageCursors:${groupId}` : "pageCursors";
    const [pageCursors, setPageCursors] = useState<{ [page: number]: string | undefined }>({});

    useEffect(() => {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            try {
                setPageCursors(JSON.parse(saved));
            } catch {
                console.warn("Failed to parse saved page cursors");
            }
        }
    }, [storageKey]);

    const getCursor = (page: number) => pageCursors[page - 1];

    const saveCursor = (page: number, cursor?: string) => {
        setPageCursors((prev) => {
            const updated = { ...prev, [page]: cursor };
            localStorage.setItem(storageKey, JSON.stringify(updated));
            return updated;
        });
    };

    return { getCursor, saveCursor };
}
