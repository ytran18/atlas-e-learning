"use client";

import { FunctionComponent, PropsWithChildren, createContext, useContext } from "react";

import { CourseListItem, StudentStats } from "@/types/api";

type AdminUserProviderProps = PropsWithChildren<{
    courseList: CourseListItem[];
    tableData: StudentStats[];
    totalDocs: number;
    totalPages: number;
}>;

const AdminUserContext = createContext<AdminUserProviderProps | null>(null);

export const AdminUserProvider: FunctionComponent<AdminUserProviderProps> = ({
    children,
    ...props
}) => {
    return <AdminUserContext.Provider value={props}>{children}</AdminUserContext.Provider>;
};

export const useAdminUserContext = () => {
    const context = useContext(AdminUserContext);

    if (!context) throw new Error("useAdminUserContext must be used within AdminUserProvider");

    return context;
};
